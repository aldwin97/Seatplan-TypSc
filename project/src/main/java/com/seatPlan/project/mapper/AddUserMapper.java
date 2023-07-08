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
import com.seatPlan.project.model.StuffStatusModel;
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

    @Select("SELECT * FROM table_stuffstatus")
    List<StuffStatusModel> getAllStuffStatusModels();

    

    @Select("SELECT u.*, p.position_name, t.usertype_name, pr.project_name, s.stuffstatus_name " +
    "FROM table_user u " +
    "JOIN table_position p ON u.position_id = p.position_id " +
    "JOIN table_usertype t ON u.usertype_id = t.usertype_id " +
    "JOIN table_project pr ON u.project_id = pr.project_id " +
    "JOIN table_stuffstatus s ON u.stuffstatus_id = s.stuffstatus_id " +
    "WHERE u.is_deleted = 0")
    List<UserModel> getAllUser();






     @Update("UPDATE user_table SET is_deleted = 1 WHERE user_id = #{userId}")
    void deleteUserById(@Param("userId") Long userId);


     @Insert("INSERT INTO table_user ( first_name, last_name, email, mobile_num, username, password, stuffstatus_id, project_id, usertype_id, position_id, is_deleted, created_time, created_by) " +
            "VALUES (#{first_name}, #{last_name}, #{email}, #{mobile_num}, #{username}, #{password}, #{stuffstatus_id}, #{project_id}, #{usertype_id}, #{position_id}, #{is_deleted}, #{created_time}, #{created_by})")
    @Options(useGeneratedKeys = true, keyProperty = "user_id")
    void insertUser(UserModel userModel);


    @Update({
        "<script>",
        "UPDATE user_table",
        "<set>",
        "<if test='user.first_name != null'>first_name = #{user.first_name},</if>",
        "<if test='user.last_name != null'>last_name = #{user.last_name},</if>",
        "<if test='user.email != null'>email = #{user.email},</if>",
        "<if test='user.mobile_num != null'>mobile_num = #{user.mobile_num},</if>",
        "<if test='user.username != null'>username = #{user.username},</if>",
        "<if test='user.password != null'>password = #{user.password},</if>",
        "<if test='user.stuffstatus_id != null'>stuffstatus_id = #{user.stuffstatus_id},</if>",
        "<if test='user.usertype_id != null'>usertype_id = #{user.usertype_id},</if>",
        "<if test='user.position_id != null'>position_id = #{user.position_id},</if>",
        "<if test='user.updated_by != null'>updated_by = #{user.updated_by},</if>",
        "</set>",
        "WHERE user_id = #{user.user_id}",
        "</script>"
    })
    void updateUser(@Param("user") UserModel userModel);
    
}
