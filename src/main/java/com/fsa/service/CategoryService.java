package com.fsa.service;

import com.fsa.domain.Category;
import com.fsa.dto.category.CategoryRequest;
import com.fsa.dto.category.CategoryResponse;
import com.fsa.repository.CategoryRepository;
import com.fsa.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CourseRepository courseRepository;

    public CategoryService(CategoryRepository categoryRepository, CourseRepository courseRepository) {
        this.categoryRepository = categoryRepository;
        this.courseRepository = courseRepository;
    }

    @Transactional
    public CategoryResponse create(CategoryRequest req) {
        if (categoryRepository.existsByNomeIgnoreCase(req.getNome())) {
            throw new IllegalArgumentException("Categoria já existe");
        }
        Category c = Category.builder().nome(req.getNome()).descricao(req.getDescricao()).build();
        c = categoryRepository.save(c);
        return new CategoryResponse(c.getId(), c.getNome(), c.getDescricao());
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> list() {
        return categoryRepository.findAll().stream()
                .map(c -> new CategoryResponse(c.getId(), c.getNome(), c.getDescricao()))
                .toList();
    }

    @Transactional
    public CategoryResponse update(Integer id, CategoryRequest req) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
        c.setNome(req.getNome());
        c.setDescricao(req.getDescricao());
        c = categoryRepository.save(c);
        return new CategoryResponse(c.getId(), c.getNome(), c.getDescricao());
    }

    @Transactional
    public void delete(Integer id) {
        if (!categoryRepository.existsById(id)) {
            return;
        }
        if (courseRepository.existsByCategory_Id(id)) {
            throw new IllegalStateException("Não pode deletar categoria com cursos vinculados");
        }
        categoryRepository.deleteById(id);
    }
}

