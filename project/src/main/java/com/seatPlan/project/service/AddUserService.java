package com.seatPlan.project.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.seatPlan.project.mapper.AddUserMapper;
import com.seatPlan.project.model.PositionModel;
import com.seatPlan.project.model.ProjectModel;
import com.seatPlan.project.model.StuffStatusModel;
import com.seatPlan.project.model.UserModel;
import com.seatPlan.project.model.UserTypeModel;



@Service
public class AddUserService {
    private AddUserMapper addUserMapper;
    public AddUserService(@Autowired AddUserMapper addUserMapper){
        this.addUserMapper = addUserMapper;
    }

    public List<Map<String, Object>> getAllPosition() {
        List<PositionModel> positions = addUserMapper.getAllPosition();
        List<Map<String, Object>> filteredPositions = positions.stream()
    .map(position -> {
        Map<String, Object> positionMap = new HashMap<>();
        positionMap.put("position_id", position.getPosition_id());
        positionMap.put("position_name", position.getPosition_name());
        return positionMap;
    }).collect(Collectors.toList());
    
        return filteredPositions;
    }


    public List<Map<String, Object>> getAllProject(){
        List<ProjectModel> projects = addUserMapper.getAllProject();
        List<Map<String, Object>> filteredProjects = projects.stream()
        .map(project ->{
            Map<String, Object> projectMap = new HashMap<>();
            projectMap.put("project_id",project.getProject_id());
            projectMap.put("project_name",project.getProject_name());
            return projectMap;

        }).collect(Collectors.toList());

        return filteredProjects;
    }



    public List<Map<String, Object>> getAllUserType(){
        List<UserTypeModel> userTypes = addUserMapper.getAllUserTypeModels();
        List<Map<String, Object>> filteredUserType = userTypes.stream()
        .map(userType ->{
            Map<String, Object> userTypeMap = new HashMap<>();
            userTypeMap.put("usertype_id",userType.getUsertype_id());
            userTypeMap.put("usertype_name",userType.getUsertype_name());
            return userTypeMap;

        }).collect(Collectors.toList());

        return filteredUserType;
    }

    public List<Map<String, Object>> getAllUser(){
        List<UserModel> users = addUserMapper.getAllUser();
        List<Map<String, Object>> filteredUserType = users.stream()
        .map(user ->{
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("first_name",user.getFirst_name());
            userMap.put("last_name", user.getLast_name());
            return userMap;

        }).collect(Collectors.toList());

        return filteredUserType;
    }


     public List<Map<String, Object>> getAllStuffStatus(){
        List<StuffStatusModel> stuffs = addUserMapper.getAllStuffStatusModels();
        List<Map<String, Object>> filteredStuffStatus = stuffs.stream()
        .map(stuff ->{
            Map<String, Object> stuffMap = new HashMap<>();
            stuffMap.put("stuffstatus_id",stuff.getStuffstatus_id());
            stuffMap.put("staffstatus_name", stuff.getStuffstatus_name());
            return stuffMap;

        }).collect(Collectors.toList());

        return filteredStuffStatus;
    }

     public void deleteUserById(Long user_id) {
        addUserMapper.deleteUserById(user_id);
        
    }

    public void insertUser(UserModel userModel) {
        addUserMapper.insertUser(userModel);
    }

    public void updateUser(UserModel userModel) {
        addUserMapper.updateUser(userModel);
    }
    

    
}
