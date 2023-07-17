//Kenneth Christian B. Gutierrez
package com.seatPlan.project.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.seatPlan.project.mapper.AdminMapper;
import com.seatPlan.project.model.CommentModel;
import com.seatPlan.project.model.PositionModel;
import com.seatPlan.project.model.ProjectModel;
import com.seatPlan.project.model.StaffStatusModel;
import com.seatPlan.project.model.UserModel;
import com.seatPlan.project.model.UserTypeModel;



@Service
public class AdminService {
    private AdminMapper adminMapper;
    public AdminService(@Autowired AdminMapper adminMapper){
        this.adminMapper = adminMapper;
    }

    public List<Map<String, Object>> getAllPosition() {
        List<PositionModel> positions = adminMapper.getAllPosition();
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
        List<ProjectModel> projects = adminMapper.getAllProject();
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
        List<UserTypeModel> userTypes = adminMapper.getAllUserTypeModels();
        List<Map<String, Object>> filteredUserType = userTypes.stream()
        .map(userType ->{
            Map<String, Object> userTypeMap = new HashMap<>();
            userTypeMap.put("usertype_id",userType.getUsertype_id());
            userTypeMap.put("usertype_name",userType.getUsertype_name());
            return userTypeMap;

        }).collect(Collectors.toList());

        return filteredUserType;
    }

    public List<Map<String, Object>> getAllUser() {
        List<UserModel> users = adminMapper.getAllUser();
        List<Map<String, Object>> filteredUserType = users.stream()
                .map(user -> {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("user_id", user.getUser_id());
                    userMap.put("first_name", user.getFirst_name());
                    userMap.put("last_name", user.getLast_name());
                    userMap.put("email", user.getEmail());
                    userMap.put("mobile_num", user.getMobile_num());
                    userMap.put("username", user.getUsername());
                    userMap.put("password", user.getPassword());
                    userMap.put("position_name", user.getPosition_name());
                    userMap.put("usertype_name",user.getUsertype_name());
                    userMap.put("project_name",user.getProject_name());
                    userMap.put("staffstatus_name", user.getStaffstatus_name());
                    userMap.put("created_time",user.getCreated_time());
                    userMap.put("updated_time",user.getUpdated_time());
                    return userMap;
                }).collect(Collectors.toList());
        return filteredUserType;
    }

     public List<Map<String, Object>> getAllStaffStatus(){
        List<StaffStatusModel> staffs = adminMapper.getAllStaffStatusModels();
        List<Map<String, Object>> filteredStaffStatus = staffs.stream()
        .map(staff ->{
            Map<String, Object> staffMap = new HashMap<>();
            staffMap.put("staffstatus_id",staff.getStaffstatus_id());
            staffMap.put("staffstatus_name", staff.getStaffstatus_name());
            return staffMap;

        }).collect(Collectors.toList());

        return filteredStaffStatus;
    }

     public void deleteUserById(Long user_id) {
         adminMapper.deleteUserById(user_id);
        
    }

    public boolean isUsernameExists(String username) {
        return adminMapper.getUserByUsername(username) != null;
    }

     public boolean isUserEmailExists(String email) {
        return adminMapper.getUserByEmail(email) != null;
    }

    public void insertUser(UserModel userModel) {
        adminMapper.insertUser(userModel);
    }

    public void updateUser(UserModel userModel) {
        adminMapper.updateUser(userModel);
    }

    public UserModel getUserById(Long user_id) {
        return adminMapper.getUserById(user_id);
    }

    public void saveComment(CommentModel comment) {
        adminMapper.insertComment(comment);
    }
    
    
    

    
}
