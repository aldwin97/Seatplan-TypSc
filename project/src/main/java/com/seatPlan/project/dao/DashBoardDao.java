//Kenneth Christian B. Gutierrez
package com.seatPlan.project.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.seatPlan.project.model.CommentModel;
import com.seatPlan.project.model.ProjectModel;
import com.seatPlan.project.model.UserModel;

@Mapper
public interface DashBoardDao {
    int countUser();
    int countSeatAvailable();

    int countOccupied();
    int countUnderMaintenance();
    List<ProjectModel> countUsersPerProject();

     List<CommentModel> getAllComment();
    int countAssignedEmpIntern();
    int countAssignedEmpTrainee();
    int countAssignedEmpRegular();
    int countAssignedEmpContractual();

    int countUnassignedEmpIntern();
    int countUnassignedEmpTrainee();
    int countUnassignedEmpRegular();
    int countUnassignedEmpContractual();

    List<UserModel> showUserById(Long user_id);
          



    
}
