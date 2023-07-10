package com.seatPlan.project.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.seatPlan.project.mapper.EditProfileMapper;
import com.seatPlan.project.model.ProjectModel;

@Service
public class EditProfileService {
    private EditProfileMapper editProfileMapper;



    // public EditProfileService (@Autowired EditProfileMapper editProfileMapper){
    //      this.editProfileMapper = editProfileMapper;
    // }

    // public List<Map<String, Object>> getAllAvailableSeat(){
    //     List<ProjectModel> availables = editProfileMapper.getAllAvailableSeat();
    //     List<Map<String, Object>> filteredProjects = availables.stream()
    //     .map(available ->{
    //         Map<String, Object> availableMap = new HashMap<>();
    //         projectMap.put("project_id",project.getProject_id());
    //         projectMap.put("project_name",project.getProject_name());
    //         return projectMap;

    //     }).collect(Collectors.toList());

    //     return filteredProjects;
    // }

}
