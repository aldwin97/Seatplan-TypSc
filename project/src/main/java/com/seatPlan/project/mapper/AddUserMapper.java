package com.seatPlan.project.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.seatPlan.project.model.PositionModel;
import com.seatPlan.project.model.ProjectModel;
import com.seatPlan.project.model.UserModel;
import com.seatPlan.project.model.UserTypeModel;
@Mapper
public interface AddUserMapper {


    @Select("SELECT * FROM table_position WHERE is_deleted = 0")
    List<PositionModel> getAllPosition();


    @Select("SELECT * FROM table_project WHERE is_deleted = 0")
    List<ProjectModel> getAllProject();


     @Select("SELECT * FROM table_usertype WHERE is_deleted = 0")
    List<UserTypeModel> getAllUserTypeModels();

    
    @Select("SELECT * FROM table_user WHERE is_deleted = 0")
    List<UserModel> getAllUser();

     @Update("UPDATE user_table SET is_deleted = 1 WHERE user_id = #{userId}")
    void deleteUserById(@Param("userId") Long userId);

}
