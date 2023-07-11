package com.seatPlan.project.mapper;

import java.util.List;


import org.apache.ibatis.annotations.Mapper;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.seatPlan.project.model.UserModel;

@Mapper
public interface UserMapper {


    // output all the data in table 
    @Select("SELECT * FROM table_user WHERE is_deleted = 0 ")
    List<UserModel> getAllUsers();


    @Select("SELECT user_id, username, password, usertype_id FROM table_user WHERE username = #{username} AND is_deleted = 0")
    UserModel getUserByUsername(String username);


    // add user
 

    // count the row of the table
    @Select("SELECT COUNT(*) FROM table_user WHERE is_deleted = 0")
    int countUsers();

    // Delete a user by username
    @Update("UPDATE table_user SET is_deleted = 1 WHERE username = #{username}")
    void deleteUserByUsername(@Param("username") String username);


    @Select("SELECT * FROM table_user WHERE username = #{username}")
    UserModel findByUsername(String username);



    @Update({
        "<script>",
        "UPDATE table_user",
        "<set>",
        "<if test='first_name != null'>first_name = #{first_name},</if>",
        "<if test='last_name != null'>last_name = #{last_name},</if>",
        "<if test='email != null'>email = #{email},</if>",
        "<if test='mobile_num != null'>mobile_num = #{mobile_num},</if>",
        "<if test='password != null'>password = #{password},</if>",
        "<if test='updated_by != null'>updated_by = #{updated_by},</if>",
        "</set>",
        "WHERE user_id = #{user_id}",
        "</script>"
    })
    void updateUser(UserModel userModel);
    


    


}
