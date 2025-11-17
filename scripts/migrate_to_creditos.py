import os
import re
import sys
import mysql.connector

def parse_jdbc(url):
    m = re.match(r"jdbc:mysql://([^:/?#]+)(?::(\d+))?/([^?]+)", url)
    if not m:
        raise ValueError("SPRING_DATASOURCE_URL inválida")
    host, port, db = m.group(1), m.group(2) or "3306", m.group(3)
    return host, int(port), db

def main():
    url = os.environ.get("SPRING_DATASOURCE_URL")
    user = os.environ.get("SPRING_DATASOURCE_USERNAME")
    password = os.environ.get("SPRING_DATASOURCE_PASSWORD")
    if not url or not user:
        print("Variáveis de ambiente SPRING_DATASOURCE_* não configuradas")
        sys.exit(1)
    host, port, db = parse_jdbc(url)
    cnx = mysql.connector.connect(host=host, port=port, user=user, password=password, database=db)
    try:
        cnx.start_transaction()
        cur = cnx.cursor()
        cur.execute("SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=%s AND TABLE_NAME='courses' AND COLUMN_NAME='creditos'", (db,))
        has_creditos = cur.fetchone()[0] > 0
        cur.execute("SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=%s AND TABLE_NAME='courses' AND COLUMN_NAME='valor'", (db,))
        has_valor = cur.fetchone()[0] > 0
        if has_creditos:
            print("Coluna 'creditos' já existe")
        elif has_valor:
            cur.execute("SELECT COUNT(*) FROM courses WHERE valor <> FLOOR(valor)")
            fractional = cur.fetchone()[0]
            if fractional > 0:
                print("Há valores decimais em 'valor'; migração interrompida")
                cnx.rollback()
                sys.exit(2)
            cur.execute("ALTER TABLE courses CHANGE COLUMN valor creditos INT NOT NULL")
            print("Coluna 'valor' renomeada para 'creditos' (INT)")
        else:
            print("Tabela 'courses' não possui colunas 'valor' ou 'creditos'")
        cur.execute("SELECT COUNT(*) FROM courses WHERE creditos IS NULL OR creditos < 1")
        invalid = cur.fetchone()[0]
        if invalid > 0:
            print("Existem registros com 'creditos' inválidos")
            cnx.rollback()
            sys.exit(3)
        cnx.commit()
        print("Migração concluída com sucesso")
    finally:
        cnx.close()
    try:
        os.remove(__file__)
        print("Script de migração removido")
    except Exception:
        pass

if __name__ == "__main__":
    main()