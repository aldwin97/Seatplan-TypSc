//Kenneth Christian B. Gutierrez
package com.seatPlan.project.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.seatPlan.project.mapper.ProjectMapper;
import com.seatPlan.project.model.ColorModel;
import com.seatPlan.project.model.ProjectModel;


@Service
public class ProjectService {

     public ProjectMapper projectMapper;

    public ProjectService(@Autowired ProjectMapper projectMapper) {
        this.projectMapper = projectMapper;
    }


    
    public void insertProject(ProjectModel projectModel) {
        projectMapper.insertProject(projectModel);
    }

     public List<ProjectModel> getAllProjects() {
        return projectMapper.getAllProjects();
    }

    // count the all row in the user table
    public int countProject() {
        return projectMapper.countProject();
    }



    public void deleteProjectById(Long project_id) {
        projectMapper.deleteProjectById(project_id);

    }


     public List<ColorModel> getAllColors() {
        return projectMapper.getAllColors();
    }
}
