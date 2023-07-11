package com.seatPlan.project.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.seatPlan.project.model.PositionModel;
import com.seatPlan.project.model.ProjectModel;
import com.seatPlan.project.model.StaffStatusModel;
import com.seatPlan.project.model.UserModel;
import com.seatPlan.project.model.UserTypeModel;
@Mapper
public interface AdminMapper {


    @Select("SELECT * FROM table_position WHERE is_deleted = 0")
    List<PositionModel> getAllPosition();


    @Select("SELECT * FROM table_project WHERE is_deleted = 0")
    List<ProjectModel> getAllProject();


     @Select("SELECT * FROM table_usertype WHERE is_deleted = 0")
    List<UserTypeModel> getAllUserTypeModels();

    @Select("SELECT * FROM table_staffstatus")
    List<StaffStatusModel> getAllStaffStatusModels();

    

    @Select("SELECT u.*, p.position_name, t.usertype_name, pr.project_name, s.staffstatus_name " +
    "FROM table_user u " +
    "JOIN table_position p ON u.position_id = p.position_id " +
    "JOIN table_usertype t ON u.usertype_id = t.usertype_id " +
    "JOIN table_project pr ON u.project_id = pr.project_id " +
    "JOIN table_staffstatus s ON u.staffstatus_id = s.staffstatus_id " +
    "WHERE u.is_deleted = 0")
    List<UserModel> getAllUser();


     @Update("UPDATE table_user SET is_deleted = 1 WHERE user_id = #{user_id}")
    void deleteUserById(@Param("user_id") Long user_id);


     @Insert("INSERT INTO table_user ( first_name, last_name, email, mobile_num, username, password, staffstatus_id, project_id, usertype_id, position_id, is_deleted, created_time, created_by) " +
            "VALUES (#{first_name}, #{last_name}, #{email}, #{mobile_num}, #{username}, #{password}, #{staffstatus_id}, #{project_id}, #{usertype_id}, #{position_id}, #{is_deleted}, #{created_time}, #{created_by})")
    @Options(useGeneratedKeys = true, keyProperty = "user_id")
    void insertUser(UserModel userModel);


    @Select("SELECT * FROM table_user WHERE user_id = #{user_id} AND is_deleted = 0")
    UserModel getUserById(Long user_id);
    

    @Update({
        "<script>",
        "UPDATE table_user",
        "<set>",
        "<if test='first_name != null'>first_name = #{first_name},</if>",
        "<if test='last_name != null'>last_name = #{last_name},</if>",
        "<if test='email != null'>email = #{email},</if>",
        "<if test='mobile_num != null'>mobile_num = #{mobile_num},</if>",
        "<if test='project_id != null'>project_id = #{project_id},</if>",
        "<if test='password != null'>password = #{password},</if>",
        "<if test='staffstatus_id != null'>staffstatus_id = #{staffstatus_id},</if>",
        "<if test='usertype_id != null'>usertype_id = #{usertype_id},</if>",
        "<if test='position_id != null'>position_id = #{position_id},</if>",
        "</set>",
        "WHERE user_id = #{user_id}",
        "</script>"
    })
    void updateUser(UserModel userModel);



    @Select("SELECT * FROM table_user WHERE username = #{user_id} AND is_deleted = 0")
    UserModel getUserByUsername(String username);
    
    
}
