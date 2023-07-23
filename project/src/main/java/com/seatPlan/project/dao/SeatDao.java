//Kenneth Christian B. Gutierrez
package com.seatPlan.project.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.seatPlan.project.model.CommentInputModel;
import com.seatPlan.project.model.SeatModel;
import com.seatPlan.project.model.UserModel;
import com.seatPlan.project.model.CommentModel;

@Mapper
public interface SeatDao {

    List<SeatModel> getAllSeatModels();

    void insertComment(CommentInputModel comment);
    
    List<CommentModel> getCommentByUserId(Long user_id);

    List<CommentModel> getAllComment();

    void swapSeat(SeatModel seat);

     void updateSeat(SeatModel seat);

    SeatModel getSeatById(Long seat_id);    

    List<UserModel> getAllUser();



     void swapUserIds(@Param("seatId1") Long seatId1, @Param("seatId2") Long seatId2, @Param("userId1") Long userId1, @Param("userId2") Long userId2, @Param ("updated_by" )Long updated_by);

}