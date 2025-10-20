package com.example.app.service;

import com.example.app.domain.Category;
import com.example.app.domain.Course;
import com.example.app.domain.User;
import com.example.app.repository.CategoryRepository;
import com.example.app.repository.CourseRepository;
import com.example.app.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class CourseService {
    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public CourseService(CourseRepository courseRepository,
                         CategoryRepository categoryRepository,
                         UserRepository userRepository) {
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public List<Course> listAll() {
        return courseRepository.findAll();
    }

    public Optional<Course> getById(Long id) {
        return courseRepository.findById(id);
    }

    @Transactional
    public Course create(Course course, Long responsibleInstructorId, Integer mainCategoryId,
                         Set<Long> additionalInstructorIds, Set<Integer> additionalCategoryIds,
                         Set<Long> prerequisiteIds) {

        // validar instrutor responsável: cadastrado e com cargo INSTRUTOR
        if (responsibleInstructorId != null) {
            User instructor = userRepository.findById(responsibleInstructorId)
                    .orElseThrow(() -> new IllegalArgumentException("Instrutor responsável não encontrado"));
            int hasRole = userRepository.countInstructorRole(responsibleInstructorId);
            if (hasRole == 0) {
                throw new IllegalArgumentException("Instrutor precisa do cargo INSTRUTOR");
            }
            course.setResponsibleInstructor(instructor);
        } else {
            course.setResponsibleInstructor(null);
        }

        // categoria principal
        if (mainCategoryId != null) {
            Category cat = categoryRepository.findById(mainCategoryId)
                    .orElseThrow(() -> new IllegalArgumentException("Categoria principal não encontrada"));
            course.setMainCategory(cat);
        } else {
            course.setMainCategory(null);
        }

        // adicionais (instructors, categories)
        course.setInstructors(resolveInstructors(additionalInstructorIds));
        course.setCategories(resolveCategories(additionalCategoryIds));

        // pré-requisitos
        course.setPrerequisites(resolvePrerequisites(prerequisiteIds));

        return courseRepository.save(course);
    }

    @Transactional
    public Course update(Long id, Course updated, Long responsibleInstructorId, Integer mainCategoryId,
                         Set<Long> additionalInstructorIds, Set<Integer> additionalCategoryIds,
                         Set<Long> prerequisiteIds) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Curso não encontrado"));

        course.setNome(updated.getNome());
        course.setDescricao(updated.getDescricao());
        course.setLimiteAlunos(updated.getLimiteAlunos());
        course.setValor(updated.getValor());
        course.setHorario(updated.getHorario());
        course.setStatus(updated.getStatus());

        // reaplicar vínculos e validações
        return create(course, responsibleInstructorId, mainCategoryId,
                additionalInstructorIds, additionalCategoryIds, prerequisiteIds);
    }

    @Transactional
    public void delete(Long id) {
        courseRepository.deleteById(id);
    }

    private Set<User> resolveInstructors(Set<Long> ids) {
        if (ids == null || ids.isEmpty()) return new HashSet<>();
        Set<User> result = new HashSet<>();
        for (Long id : ids) {
            userRepository.findById(id).ifPresent(result::add);
        }
        return result;
    }

    private Set<Category> resolveCategories(Set<Integer> ids) {
        if (ids == null || ids.isEmpty()) return new HashSet<>();
        Set<Category> result = new HashSet<>();
        for (Integer id : ids) {
            categoryRepository.findById(id).ifPresent(result::add);
        }
        return result;
    }

    private Set<Course> resolvePrerequisites(Set<Long> ids) {
        if (ids == null || ids.isEmpty()) return new HashSet<>();
        Set<Course> result = new HashSet<>();
        for (Long id : ids) {
            courseRepository.findById(id).ifPresent(result::add);
        }
        return result;
    }
}