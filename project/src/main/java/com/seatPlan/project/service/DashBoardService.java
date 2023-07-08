package com.seatPlan.project.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.seatPlan.project.mapper.DashBoardMapper;
import com.seatPlan.project.model.UserModel;


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


    public List<UserModel> getInfo(){
        return dashBoardMapper.getInfo();
    }

}
