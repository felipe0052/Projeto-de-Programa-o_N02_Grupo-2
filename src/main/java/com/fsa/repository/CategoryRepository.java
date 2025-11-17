package com.fsa.repository;

import com.fsa.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    boolean existsByNomeIgnoreCase(String nome);
}

