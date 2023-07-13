//Kenneth Christian B. Gutierrez
package com.seatPlan.project.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.seatPlan.project.mapper.DashBoardMapper;


@Service
public class DashBoardService {
    private DashBoardMapper dashBoardMapper;

    public DashBoardService(@Autowired DashBoardMapper dashBoardMapper) {
        this.dashBoardMapper = dashBoardMapper;
    }

    public int countUser(){
        return dashBoardMapper.countUser();
    }

    public int countSeatAvailable(){
        return  dashBoardMapper.countSeatAvailable();
    }

    public int countTrainee(){
        return dashBoardMapper.countTrainee();
    }

    public int countRegular(){
        return dashBoardMapper.countRegular();
    }

    public int countOccupied(){
        return dashBoardMapper.countOccupied();
    }

    public int countUnderMaintenance(){
        return dashBoardMapper.countUnderMaintenance();
    }

}
