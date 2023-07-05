package com.seatPlan.project.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import com.seatPlan.project.model.ProjectModel;

@Mapper
public interface ProjectMapper {
    
     @Insert("INSERT INTO tbl_projects (projectName) " +
            "VALUES (#{projectName})")
    @Options(useGeneratedKeys = true, keyProperty = "projectId")
    void insertProject(ProjectModel projectModel);


    @Select("SELECT * FROM tbl_projects")
    List<ProjectModel> getAllProjects();
}
