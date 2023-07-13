//Kenneth Christian B. Gutierrez
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


    @Select("SELECT * FROM table_user WHERE username = #{username} AND is_deleted = 0")
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

    @Select("SELECT * FROM table_user WHERE user_id = #{user_id} AND is_deleted = 0")
    UserModel getUserById(Long user_id);

    @Select("SELECT * FROM table_user WHERE email = #{email} AND is_deleted = 0")
    Object getUserByEmail(String email);



    @Select("SELECT u.*, p.position_name, s.staffstatus_name, pr.project_name, ut.usertype_name " +
        "FROM table_user u " +
        "LEFT JOIN table_position p ON u.position_id = p.position_id " +
        "LEFT JOIN table_staffstatus s ON u.staffstatus_id = s.staffstatus_id " +
        "LEFT JOIN table_project pr ON u.project_id = pr.project_id " +
        "LEFT JOIN table_usertype ut ON u.usertype_id = ut.usertype_id " +
        "WHERE u.user_id = #{user_id}")
    List<UserModel> showUserById(Long user_id);
    
    


    


}
