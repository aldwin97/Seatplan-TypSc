//Kenneth Christian B. Gutierrez
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
import com.seatPlan.project.model.ColorModel;
import com.seatPlan.project.model.ProjectInputModel;
import com.seatPlan.project.model.ProjectModel;
import com.seatPlan.project.service.ProjectService;





@RestController
@RequestMapping("/project")
public class ProjectController {
    
      private final ProjectService projectService;

    public ProjectController(@Autowired ProjectService projectService) {
        this.projectService = projectService;

    }

    //Add project in the database
    @PostMapping("/insertNewProject")
    public ResponseEntity<String> createProject(@RequestBody ProjectInputModel projectInputModel) {
        try {
            projectService.insertProject(projectInputModel);
            return ResponseEntity.ok("Project created successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create project");
        }
    }


    //Show all the project in the database
    @GetMapping("/show")
    public List<ProjectModel> getAllProjects() {
        return projectService.getAllProjects();
    }

    //Count all the projects in the database
    @GetMapping("/count")
    public int countProject() {
        return projectService.countProject();
    }


    //Delete project by project_id
    @PostMapping("/delete/{project_id}")
    public ResponseEntity<String> deleteProjectById(@PathVariable Long project_id) {
          try {
              projectService.deleteProjectById(project_id);
           return ResponseEntity.ok("Project deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete project");
        }    
    }


    //Show all the color in the database
    @GetMapping("/allColor")
    public ResponseEntity<List<ColorModel>> getAllColors() {
        List<ColorModel> colors = projectService.getAllColors();
        return ResponseEntity.ok(colors);
    }




}
