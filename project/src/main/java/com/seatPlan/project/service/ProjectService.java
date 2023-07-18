//Kenneth Christian B. Gutierrez
package com.seatPlan.project.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.seatPlan.project.dao.ProjectDao;
import com.seatPlan.project.model.ColorModel;
import com.seatPlan.project.model.ProjectModel;


@Service
public class ProjectService {

     public ProjectDao projectDao;

    public ProjectService(@Autowired(required=true) ProjectDao projectDao) {
        this.projectDao = projectDao;
    }

    public void insertProject(ProjectModel projectModel) {
        projectDao.insertProject(projectModel);
    }

     public List<ProjectModel> getAllProjects() {
        return projectDao.getAllProjects();
    }

    // count the all row in the user table
    public int countProject() {
        return projectDao.countProject();
    }

    public void deleteProjectById(Long project_id) {
        projectDao.deleteProjectById(project_id);

    }

     public List<ColorModel> getAllColors() {
        return projectDao.getAllColors();
    }
}
