//Kenneth Christian B. Gutierrez
package com.seatPlan.project.service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.seatPlan.project.dao.DashBoardDao;
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


}
