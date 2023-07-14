//Kenneth Christian B. Gutierrez
package com.seatPlan.project.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

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



    @Update("<script>" +
            "UPDATE table_seat" +
            "<set>" +
            "<if test='user_id != null'>user_id = #{user_id},</if>" +
            "<if test='seatstatus_id != null'>seatstatus_id = #{seatstatus_id},</if>" +
            "<if test='area_id != null'>area_id = #{area_id},</if>" +
            "<if test='updated_by != null'>updated_by = #{updated_by},</if>" +
            "</set>" +
            "WHERE seat_id = #{seat_id}" +
            "</script>")
    void updateSeat(SeatModel seat);





    @Select("SELECT * FROM table_seat WHERE seat_id = #{seat_id} AND is_deleted = 0")
    SeatModel getSeatById(Long seat_id);

   

}
