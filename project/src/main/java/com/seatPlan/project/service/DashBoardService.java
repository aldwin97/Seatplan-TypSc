//Kenneth Christian B. Gutierrez
package com.seatPlan.project.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.seatPlan.project.dao.DashBoardDao;


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

}
