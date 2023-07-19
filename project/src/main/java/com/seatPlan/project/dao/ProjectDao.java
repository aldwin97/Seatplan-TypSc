//Kenneth Christian B. Gutierrez
package com.seatPlan.project.dao;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import com.seatPlan.project.model.ColorModel;
import com.seatPlan.project.model.ProjectModel;
import com.seatPlan.project.model.ProjectInputModel;

@Mapper
public interface ProjectDao {
    

    void insertProject(ProjectInputModel projectInputModel);


    List<ProjectModel> getAllProjects();

    int countProject();



    void deleteProjectById(Long project_id);


    List<ColorModel> getAllColors();


}
