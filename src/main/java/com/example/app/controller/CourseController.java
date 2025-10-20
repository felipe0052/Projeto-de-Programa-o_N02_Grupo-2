package com.example.app.controller;

import com.example.app.domain.Category;
import com.example.app.domain.Course;
import com.example.app.domain.CourseStatus;
import com.example.app.domain.User;
import com.example.app.repository.CategoryRepository;
import com.example.app.repository.CourseRepository;
import com.example.app.repository.UserRepository;
import com.example.app.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Controller
@RequestMapping("/courses")
public class CourseController {
    private final CourseService courseService;
    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public CourseController(CourseService courseService,
                            CourseRepository courseRepository,
                            CategoryRepository categoryRepository,
                            UserRepository userRepository) {
        this.courseService = courseService;
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public String list(Model model) {
        model.addAttribute("courses", courseService.listAll());
        return "courses/list";
    }

    @GetMapping("/new")
    public String form(Model model) {
        model.addAttribute("course", new Course());
        model.addAttribute("categories", categoryRepository.findAll());
        model.addAttribute("instructors", userRepository.findAll());
        model.addAttribute("allCourses", courseRepository.findAll());
        model.addAttribute("statuses", CourseStatus.values());
        return "courses/form";
    }

    @PostMapping
    public String create(@Valid @ModelAttribute("course") Course course,
                         BindingResult bindingResult,
                         @RequestParam(value = "responsibleInstructorId", required = false) Long responsibleInstructorId,
                         @RequestParam(value = "mainCategoryId", required = false) Integer mainCategoryId,
                         @RequestParam(value = "additionalInstructorIds", required = false) List<Long> additionalInstructorIds,
                         @RequestParam(value = "additionalCategoryIds", required = false) List<Integer> additionalCategoryIds,
                         @RequestParam(value = "prerequisiteIds", required = false) List<Long> prerequisiteIds,
                         Model model) {
        if (bindingResult.hasErrors()) {
            return reloadForm(model, course);
        }
        try {
            Set<Long> instructorSet = additionalInstructorIds == null ? Collections.emptySet() : new HashSet<>(additionalInstructorIds);
            Set<Integer> categorySet = additionalCategoryIds == null ? Collections.emptySet() : new HashSet<>(additionalCategoryIds);
            Set<Long> prereqSet = prerequisiteIds == null ? Collections.emptySet() : new HashSet<>(prerequisiteIds);

            courseService.create(course, responsibleInstructorId, mainCategoryId, instructorSet, categorySet, prereqSet);
            return "redirect:/courses";
        } catch (IllegalArgumentException ex) {
            bindingResult.reject("error.course", ex.getMessage());
            return reloadForm(model, course);
        }
    }

    @GetMapping("/{id}/edit")
    public String edit(@PathVariable Long id, Model model) {
        Course course = courseService.getById(id).orElseThrow(() -> new IllegalArgumentException("Curso não encontrado"));
        model.addAttribute("course", course);
        model.addAttribute("categories", categoryRepository.findAll());
        model.addAttribute("instructors", userRepository.findAll());
        model.addAttribute("allCourses", courseRepository.findAll());
        model.addAttribute("statuses", CourseStatus.values());
        return "courses/form";
    }

    @PostMapping("/{id}")
    public String update(@PathVariable Long id,
                         @Valid @ModelAttribute("course") Course course,
                         BindingResult bindingResult,
                         @RequestParam(value = "responsibleInstructorId", required = false) Long responsibleInstructorId,
                         @RequestParam(value = "mainCategoryId", required = false) Integer mainCategoryId,
                         @RequestParam(value = "additionalInstructorIds", required = false) List<Long> additionalInstructorIds,
                         @RequestParam(value = "additionalCategoryIds", required = false) List<Integer> additionalCategoryIds,
                         @RequestParam(value = "prerequisiteIds", required = false) List<Long> prerequisiteIds,
                         Model model) {
        if (bindingResult.hasErrors()) {
            return reloadForm(model, course);
        }
        try {
            Set<Long> instructorSet = additionalInstructorIds == null ? Collections.emptySet() : new HashSet<>(additionalInstructorIds);
            Set<Integer> categorySet = additionalCategoryIds == null ? Collections.emptySet() : new HashSet<>(additionalCategoryIds);
            Set<Long> prereqSet = prerequisiteIds == null ? Collections.emptySet() : new HashSet<>(prerequisiteIds);

            courseService.update(id, course, responsibleInstructorId, mainCategoryId, instructorSet, categorySet, prereqSet);
            return "redirect:/courses";
        } catch (IllegalArgumentException ex) {
            bindingResult.reject("error.course", ex.getMessage());
            return reloadForm(model, course);
        }
    }

    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Long id) {
        courseService.delete(id);
        return "redirect:/courses";
    }

    private String reloadForm(Model model, Course course) {
        model.addAttribute("categories", categoryRepository.findAll());
        model.addAttribute("instructors", userRepository.findAll());
        model.addAttribute("allCourses", courseRepository.findAll());
        model.addAttribute("statuses", CourseStatus.values());
        model.addAttribute("course", course);
        return "courses/form";
    }
}