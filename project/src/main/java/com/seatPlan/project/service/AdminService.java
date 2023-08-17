//Kenneth Christian B. Gutierrez
package com.seatPlan.project.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.seatPlan.project.dao.AdminDao;
import com.seatPlan.project.model.CommentModel;
import com.seatPlan.project.model.PositionModel;
import com.seatPlan.project.model.ProjectModel;
import com.seatPlan.project.model.StaffStatusModel;
import com.seatPlan.project.model.UserModel;
import com.seatPlan.project.model.UserTypeModel;
import com.seatPlan.project.model.UserInputModel;



@Service
@Transactional
public class AdminService {

    private AdminDao adminDao;

    public AdminService(@Autowired(required=true) AdminDao adminDao){
        this.adminDao = adminDao;
    }

    public List<Map<String, Object>> getAllPosition() {
        List<PositionModel> positions = adminDao.getAllPosition();
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
        List<ProjectModel> projects = adminDao.getAllProject();
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
        List<UserTypeModel> userTypes = adminDao.getAllUserTypeModels();
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
        List<UserModel> users = adminDao.getAllUser();

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
                    return userMap;
                }).collect(Collectors.toList());
        return filteredUserType;
    }

     public List<Map<String, Object>> getAllStaffStatus(){
        List<StaffStatusModel> staffs = adminDao.getAllStaffStatusModels();
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
         adminDao.deleteUserById(user_id);
        
    }

    public boolean isUsernameExists(String username) {
        return adminDao.getUserByUsername(username) != null;
    }

     public boolean isUserEmailExists(String email) {
        return adminDao.getUserByEmail(email) != null;
    }


    
    public void insertUser(UserInputModel userInputModel) {
        adminDao.insertUser(userInputModel);
    }

    public void updateUser(UserModel userModel) {
        adminDao.updateUser(userModel);
    }

    public UserModel getUserById(Long user_id) {
        return adminDao.getUserById(user_id);
    }

    public void saveComment(CommentModel comment) {
        adminDao.insertComment(comment);
    }
    
    public List<Map<String, Object>> getCommentBySeatId(Long seat_id) {
        List<CommentModel> comments =adminDao.getCommentBySeatId(seat_id);
        List<Map<String, Object>> filteredComment = comments.stream()
            .map(comment -> {
                Map<String, Object> commentMap = new HashMap<>();
                commentMap.put("recipient_id",comment.getRecipient_id());
                commentMap.put("recipient",comment.getRecipient_fname() + " " + comment.getRecipient_lname());
                commentMap.put("user_id",comment.getUser_id());
                commentMap.put("comment_id", comment.getComment_id());
                commentMap.put("seat_id",comment.getSeat_id());
                commentMap.put("full_name", String.join(" ", comment.getFirst_name(), comment.getLast_name()));
                commentMap.put("comment", comment.getComment());
                commentMap.put("created_time", comment.getCreated_time());
                return commentMap;
            }).collect(Collectors.toList());
    
        return filteredComment;
    }

    public void insertMultipleProject(long generatedUserId, List<Long> project_id) {
          adminDao.insertMultipleProject(generatedUserId, project_id);
    }

    public void deleteExistingProject(Long user_id) {
        adminDao.deleteExistingProject(user_id);
    }

    public void deleteCommentById(Long comment_id) {
         adminDao.deleteCommentById(comment_id);
    }

    public void handleClearComments(Long seat_id) {
        adminDao.handleClearComments(seat_id);
    }


    
    
    

    
}
