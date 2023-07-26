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

    public int countTrainee(){
        return dashBoardDao.countTrainee();
    }

    public int countRegular(){
        return dashBoardDao.countRegular();
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
            return commentMap;

        }).collect(Collectors.toList());

        return filteredComments;
    }


}
