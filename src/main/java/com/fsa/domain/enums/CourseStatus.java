package com.fsa.domain.enums;

public enum CourseStatus {
    RASCUNHO("rascunho"),
    ATIVO("ativo"),
    ENCERRADO("encerrado");

    private final String db;
    CourseStatus(String db) { this.db = db; }
    public String getDb() { return db; }

    public static CourseStatus fromDb(String value) {
        for (CourseStatus s : values()) if (s.db.equalsIgnoreCase(value)) return s;
        throw new IllegalArgumentException("Status de curso inválido: " + value);
    }
}

