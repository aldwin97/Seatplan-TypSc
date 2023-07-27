//Kenneth Christian B. Gutierrez
package com.seatPlan.project.service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.seatPlan.project.dao.DashBoardDao;
import com.seatPlan.project.model.CommentModel;
import com.seatPlan.project.model.ProjectModel;
import com.seatPlan.project.model.UserModel;



@Service
public class DashBoardService {
    private DashBoardDao dashBoardDao;

    public DashBoardService(@Autowired(required=true)DashBoardDao dashBoardDao) {
        this.dashBoardDao = dashBoardDao;
    }

    public int countUser(){
        return dashBoardDao.countUser();
    }

    public int countSeatAvailable(){
        return  dashBoardDao.countSeatAvailable();
    }


    public int countOccupied(){
        return dashBoardDao.countOccupied();
    }

    public int countUnderMaintenance(){
        return dashBoardDao.countUnderMaintenance();
    }

    public List<Map<String, Object>> countUsersPerProject(){
        List<ProjectModel> projectCounts = dashBoardDao.countUsersPerProject();
        List<Map<String, Object>> filteredProjectCount = projectCounts.stream()
        .map(projectCount ->{
            Map<String, Object> projectCountMap = new HashMap<>();
             projectCountMap.put("project_id",projectCount.getProject_id());
             projectCountMap.put("project_name",projectCount.getProject_name());
             projectCountMap.put("seatCount",projectCount.getSeatCount());
            return projectCountMap;

        }).collect(Collectors.toList());

        return filteredProjectCount;
    }


    public List<Map<String, Object>> getAllComment() {
       List<CommentModel> comments =dashBoardDao.getAllComment();
        List<Map<String, Object>> filteredComments = comments.stream()
        .map(comment ->{
            Map<String, Object> commentMap = new HashMap<>();
            commentMap.put("comment_id",comment.getComment_id());
            commentMap.put("seat_id",comment.getSeat_id());
            commentMap.put("full_name", String.join(" ", comment.getFirst_name(), comment.getLast_name()));
            commentMap.put("comment", comment.getComment());
            commentMap.put("created_time", comment.getCreated_time());
            commentMap.put("user_picture", comment.getUser_picture());
            return commentMap;

        }).collect(Collectors.toList());

        return filteredComments;
    }

    public int countAssignedEmpIntern() {
        return dashBoardDao.countAssignedEmpIntern();
    }

    public int countAssignedEmpTrainee() {
        return dashBoardDao.countAssignedEmpTrainee();
    }
    public int countAssignedEmpRegular() {
        return dashBoardDao.countAssignedEmpRegular();
    }
    public int countAssignedEmpContractual() {
        return dashBoardDao.countAssignedEmpContractual();
    }


    public int countUnassignedEmpIntern() {
        return dashBoardDao.countUnassignedEmpIntern();
    }
    
    public int countUnassignedEmpTrainee() {
        return dashBoardDao.countUnassignedEmpTrainee();
    }
    public int countUnassignedEmpRegular() {
        return dashBoardDao.countUnassignedEmpRegular();
    }
    public int countUnassignedEmpContractual() {
        return dashBoardDao.countUnassignedEmpContractual();
    }

     public List<Map<String, Object>>  showUserById(Long user_id){
        List<UserModel> userInfos = dashBoardDao. showUserById(user_id);
        List<Map<String, Object>> filteredUserInfo = userInfos.stream()
        .map(userInfo ->{
            Map<String, Object> userInfoMap = new HashMap<>();
            userInfoMap.put("user_id",userInfo.getUser_id());
            userInfoMap.put("last_name", userInfo.getFirst_name());
            userInfoMap.put("first_name",userInfo.getLast_name());
            userInfoMap.put("email",userInfo.getEmail());
            userInfoMap.put("username",userInfo.getUsername());
            userInfoMap.put("mobile_num", userInfo.getMobile_num());
            userInfoMap.put("position_name", userInfo.getPosition_name());
            return userInfoMap;

        }).collect(Collectors.toList());

        return filteredUserInfo;
    }





}
