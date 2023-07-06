package com.seatPlan.project.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.seatPlan.project.mapper.ProjectMapper;
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
}
