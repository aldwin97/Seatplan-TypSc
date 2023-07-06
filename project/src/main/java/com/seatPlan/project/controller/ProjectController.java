package com.seatPlan.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seatPlan.project.model.ProjectModel;
import com.seatPlan.project.service.ProjectService;




@RestController
@RequestMapping("/api/project")
public class ProjectController {
    
      private final ProjectService projectService;

    public ProjectController(@Autowired ProjectService projectService) {
        this.projectService = projectService;

    }
      @PostMapping("/add")
    public ResponseEntity<String> createProject(@RequestBody ProjectModel projectModel) {
        try {
            projectService.insertProject(projectModel);
            return ResponseEntity.ok("Project created successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create project");
        }
    }

     @GetMapping("/all")
    public List<ProjectModel> getAllProjects() {
        return projectService.getAllProjects();
    }

     @GetMapping("/count")
    public int countProject() {
        return projectService.countProject();
    }

    


}
