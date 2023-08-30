//Kenneth Christian B. Gutierrez
package com.seatPlan.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.seatPlan.project.model.ColorModel;
import com.seatPlan.project.model.ProjectInputModel;
import com.seatPlan.project.model.ProjectModel;
import com.seatPlan.project.service.ProjectService;



@RestController
@RequestMapping("/project")
//@PreAuthorize("hasRole('Admin','Editor')")
public class ProjectController {
    
    @Autowired
    private ProjectService projectService;

   

    @PostMapping("/insertNewProject")
    public ResponseEntity<String> createProject(@RequestBody ProjectInputModel projectInputModel) {
        try {

            if (projectService.isProjectNameExists(projectInputModel.getProject_name())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Project name already exists");
            }
            
            projectService.insertProject(projectInputModel);
            return ResponseEntity.ok("Project created successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create project");
        }
    }

    @GetMapping("/showAllProject")
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


    @GetMapping("/allColor")
    public ResponseEntity<List<ColorModel>> getAllColors() {
        List<ColorModel> colors = projectService.getAllColors();
        return ResponseEntity.ok(colors);
    }
}
