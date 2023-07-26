//Kenneth Christian B. Gutierrez
package com.seatPlan.project.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.seatPlan.project.model.CommentModel;
import com.seatPlan.project.model.ProjectModel;

@Mapper
public interface DashBoardDao {
    int countUser();
    int countSeatAvailable();
    int countTrainee();
    int countRegular();
    int countOccupied();
    int countUnderMaintenance();
    List<ProjectModel> countUsersPerProject();

     List<CommentModel> getAllComment();




    
}
