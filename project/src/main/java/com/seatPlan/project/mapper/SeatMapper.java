package com.seatPlan.project.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import com.seatPlan.project.model.CommentModel;
import com.seatPlan.project.model.SeatModel;

@Mapper
public interface SeatMapper {

   


    @Select("SELECT ts.*, COALESCE(tu.first_name, 'No') AS first_name, " +
    "COALESCE(tu.last_name, 'User') AS last_name, ta.area_name, " +
    "COALESCE(tu.project_id, 0) AS project_id, COALESCE(tp.project_name, 'No Project') AS project_name, " +
    "COALESCE(tss.seat_status, 'No Seat Status') AS seat_status " +
    "FROM table_seat ts " +
    "LEFT JOIN table_user tu ON ts.user_id = tu.user_id " +
    "LEFT JOIN table_area ta ON ts.area_id = ta.area_id " +
    "LEFT JOIN table_project tp ON tu.project_id = tp.project_id " +
    "LEFT JOIN table_seatstatus tss ON ts.seatstatus_id = tss.seatstatus_id")
    List<SeatModel> getAllSeatModels();


    @Insert("INSERT INTO table_comment (user_id, seat_id, comment, created_time, created_by) " +
    "VALUES (#{user_id}, #{seat_id}, #{comment}, #{created_time}, #{created_by})")
    @Options(useGeneratedKeys = true, keyProperty = "comment_id")
    void insertComment(CommentModel comment);


   
    @Select("SELECT c.*, u.first_name, u.last_name " +
    "FROM table_comment c " +
    "JOIN table_user u ON c.user_id = u.user_id " +
    "WHERE c.user_id = #{user_id} OR recipient_id = #{user_id} " +
    "ORDER BY c.created_time DESC")
    List<CommentModel> getCommentByUserId(Long user_id);



    @Select("SELECT c.*, u.first_name, u.last_name " +
    "FROM table_comment c " +
    "JOIN table_user u ON c.user_id = u.user_id " +
    "ORDER BY c.created_time DESC")
    List<CommentModel> getAllComment();


   

}
