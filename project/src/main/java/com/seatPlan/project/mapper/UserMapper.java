package com.seatPlan.project.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.seatPlan.project.model.UserModel;

@Mapper
public interface UserMapper {


    // output all the data in table 
    @Select("SELECT * FROM table_user WHERE is_deleted = 0 ")
    List<UserModel> getAllUsers();


    // // user authetication
    // @Select("SELECT username, password FROM table_user WHERE username = #{username} AND is_deleted = 0")
    // UserModel getUserByUsername(String username);

    // user authentication
    // @Select("SELECT username, password, usertype_id FROM table_user WHERE username = #{username} AND is_deleted = 0")
    // UserModel getUserByUsername(String username);

    @Select("SELECT user_id, username, password, usertype_id FROM table_user WHERE username = #{username} AND is_deleted = 0")
    UserModel getUserByUsername(String username);


    // add user
   @Insert("INSERT INTO table_user ( first_name, last_name, email, mobile_num, username, password, usertype_id, position_id, user_picture,  created_time, created_by) "
            + "VALUES #{first_name}, #{last_name}, #{email}, #{mobile_num}, #{username}, #{password}, #{usertype_id}, #{position_id}, #{user_picture}, #{created_time}, #{created_by})")
    @Options(useGeneratedKeys = true, keyProperty = "user_id")
    void insertUser(UserModel userModel);

    // count the row of the table
    @Select("SELECT COUNT(*) FROM table_user WHERE is_deleted = 0")
    int countUsers();

    // Delete a user by username
    @Update("UPDATE table_user SET is_deleted = 1 WHERE username = #{username}")
    void deleteUserByUsername(@Param("username") String username);
    


}
