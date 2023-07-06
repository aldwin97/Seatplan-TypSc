package com.seatPlan.project.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import com.seatPlan.project.model.ProjectModel;

@Mapper
public interface ProjectMapper {
    
   @Insert("INSERT INTO table_project (project_name, color_id, is_deleted, created_time, updated_time) " +
            "VALUES (#{project_name}, #{color_id}, #{is_deleted}, #{created_time},#{updated_time})")
    @Options(useGeneratedKeys = true, keyProperty = "project_id")
    void insertProject(ProjectModel projectModel);


    @Select("SELECT * FROM table_project WHERE is_deleted = 0")
    List<ProjectModel> getAllProjects();


     // count the row of the table
    @Select("SELECT COUNT(*) FROM table_project")
    int countProject();
}
