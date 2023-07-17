//Kenneth Christian B. Gutierrez
package com.seatPlan.project.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DashBoardMapper {
    int countUser();
    int countSeatAvailable();
    int countTrainee();
    int countRegular();
    int countOccupied();
    int countUnderMaintenance();
    
}
