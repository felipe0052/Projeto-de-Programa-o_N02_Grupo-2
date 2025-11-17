package com.fsa.dto.category;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryResponse {
    private Integer id;
    private String nome;
    private String descricao;
}

