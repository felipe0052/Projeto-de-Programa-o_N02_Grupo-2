package com.example.app.service;

import com.example.app.domain.Category;
import com.example.app.domain.Course;
import com.example.app.domain.User;
import com.example.app.repository.CategoryRepository;
import com.example.app.repository.CourseRepository;
import com.example.app.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock
    CourseRepository courseRepository;

    @Mock
    UserRepository userRepository;

    @Mock
    CategoryRepository categoryRepository;

    @InjectMocks
    CourseService courseService;

    @Test
    void create_with_valid_instructor_category_prereqs_ok() {
        Course course = new Course();
        course.setNome("Java Básico");
        course.setLimiteAlunos(10);
        course.setValor(new BigDecimal("100.00"));

        User instr = new User();
        instr.setId(1L);
        instr.setNome("Ana Instrutora");

        Category cat = new Category();
        cat.setId(10);
        cat.setNome("Programação");

        Course prereq = new Course();
        prereq.setId(99L);
        prereq.setNome("Lógica");

        when(userRepository.findById(1L)).thenReturn(Optional.of(instr));
        when(userRepository.countInstructorRole(1L)).thenReturn(1);
        when(categoryRepository.findById(10)).thenReturn(Optional.of(cat));
        when(courseRepository.findById(99L)).thenReturn(Optional.of(prereq));
        when(courseRepository.save(any(Course.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Course saved = courseService.create(course, 1L, 10, Set.of(1L), Set.of(10), Set.of(99L));

        assertNotNull(saved.getResponsibleInstructor());
        assertEquals(1, saved.getInstructors().size());
        assertEquals(1, saved.getCategories().size());
        assertEquals(1, saved.getPrerequisites().size());
    }

    @Test
    void create_with_instructor_without_role_throws() {
        Course course = new Course();
        course.setNome("Java Básico");

        when(userRepository.findById(2L)).thenReturn(Optional.of(new User()));
        when(userRepository.countInstructorRole(2L)).thenReturn(0);

        assertThrows(IllegalArgumentException.class, () ->
                courseService.create(course, 2L, null, Collections.emptySet(), Collections.emptySet(), Collections.emptySet())
        );
    }
}