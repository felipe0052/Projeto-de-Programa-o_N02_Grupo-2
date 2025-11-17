package com.fsa.domain.enums;

public enum EnrollmentStatus {
    ATIVO("ativo"),
    CONCLUIDO("concluido"),
    CANCELADO("cancelado"),
    DESISTENTE("desistente"),
    ESPERA("espera");

    private final String db;
    EnrollmentStatus(String db) { this.db = db; }
    public String getDb() { return db; }

    public static EnrollmentStatus fromDb(String value) {
        for (EnrollmentStatus s : values()) if (s.db.equalsIgnoreCase(value)) return s;
        throw new IllegalArgumentException("Status de matrícula inválido: " + value);
    }
}

