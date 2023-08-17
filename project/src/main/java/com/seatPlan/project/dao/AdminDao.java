//Kenneth Christian B. Gutierrez
package com.seatPlan.project.dao;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.seatPlan.project.model.CommentModel;
import com.seatPlan.project.model.PositionModel;
import com.seatPlan.project.model.ProjectModel;
import com.seatPlan.project.model.StaffStatusModel;
import com.seatPlan.project.model.UserInputModel;
import com.seatPlan.project.model.UserModel;
import com.seatPlan.project.model.UserTypeModel;



@Mapper
public interface AdminDao {


    List<PositionModel> getAllPosition();

    List<ProjectModel> getAllProject();

    List<UserTypeModel> getAllUserTypeModels();

    List<StaffStatusModel> getAllStaffStatusModels();


    List<UserModel> getAllUser();

    void deleteUserById(@Param("user_id") Long user_id);

    void insertUser(UserInputModel userInsertModel);

    UserModel getUserById(Long user_id);
    
    void updateUser(UserModel userModel);

    UserInputModel getUserByUsername(String username);

    UserInputModel getUserByEmail(String email);

    void insertComment(CommentModel comment);

    List<CommentModel> getCommentBySeatId(Long seat_id);

    void insertMultipleProject(long generatedUserId, List<Long> project_id);

    void deleteExistingProject(Long user_id);

    void deleteCommentById(Long comment_id);

    void handleClearComments(Long seat_id);
}
