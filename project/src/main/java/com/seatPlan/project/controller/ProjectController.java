package com.seatPlan.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seatPlan.project.model.ProjectModel;
import com.seatPlan.project.model.UserModel;
import com.seatPlan.project.service.ProjectService;

import jakarta.servlet.http.HttpSession;




@RestController
@RequestMapping("/project")
public class ProjectController {
    
      private final ProjectService projectService;

    public ProjectController(@Autowired ProjectService projectService) {
        this.projectService = projectService;

    }
      @PostMapping("/add")
    public ResponseEntity<String> createProject(HttpSession session,@RequestBody ProjectModel projectModel) {
        UserModel user = (UserModel) session.getAttribute("userSession");
        Long creatorId = user.getUser_id();

        projectModel.setCreated_by(creatorId);

        try {
            projectService.insertProject(projectModel);
            return ResponseEntity.ok("Project created successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create project");
        }
    }

     @GetMapping("/show")
    public List<ProjectModel> getAllProjects() {
        return projectService.getAllProjects();
    }

     @GetMapping("/count")
    public int countProject() {
        return projectService.countProject();
    }

    @PostMapping("/delete/{project_id}")
    public ResponseEntity<String> deleteProjectById(@PathVariable Long project_id) {
          try {
              projectService.deleteProjectById(project_id);
           return ResponseEntity.ok("Project deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete project");
        }    
    }
}
