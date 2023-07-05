package com.seatPlan.project.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.seatPlan.project.model.UserModel;

@Mapper
public interface UserMapper {


    // output all the data in table 
    @Select("SELECT * FROM tbl_users")
    List<UserModel> getAllUsers();


    // user authetication
    @Select("SELECT username, password FROM tbl_users WHERE username = #{username}")
    UserModel getUserByUsername(String username);

    // add user
    @Insert("INSERT INTO tbl_users (project_id, seat_id, fname, lname, email, mobile, address, username, password, user_type_id, position_id, user_profile, is_deleted, created_time, created_by, updated_time, updated_by) " +
            "VALUES (#{projectId}, #{seatId}, #{fname}, #{lname}, #{email}, #{mobile}, #{address}, #{username}, #{password}, #{userTypeId}, #{positionId}, #{userProfile}, #{isDeleted}, #{createdTime}, #{createdBy}, #{updatedTime}, #{updatedBy})")
    @Options(useGeneratedKeys = true, keyProperty = "userId")
    void insertUser(UserModel userModel);


    // count the row of the table
    @Select("SELECT COUNT(*) FROM tbl_users")
    int countUsers();

    // Delete a user by username
    @Delete("DELETE FROM tbl_users WHERE username = #{username}")
    void deleteUserByUsername(@Param("username") String username);


    


}
