//Kenneth Christian B. Gutierrez
package com.seatPlan.project.dao;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DashBoardDao {
    int countUser();
    int countSeatAvailable();
    int countTrainee();
    int countRegular();
    int countOccupied();
    int countUnderMaintenance();
    
}
