//Kenneth Christian B. Gutierrez
package com.seatPlan.project.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;


import com.seatPlan.project.model.CommentInputModel;
import com.seatPlan.project.model.SeatModel;
import com.seatPlan.project.model.UserModel;
import com.seatPlan.project.model.CommentModel;

@Mapper
public interface SeatDao {

    List<SeatModel> getAllSeatModels();

    void insertComment(CommentInputModel comment);
    
    List<CommentModel> getCommentByChatId(Long user_id,Long seat_id, Long recipient_id);

    List<CommentModel> getCommentByUserId(Long user_id,Long seat_id);

    List<CommentModel> getAllComment();

    void swapSeat(SeatModel seat);

     void updateSeat(SeatModel seat);

    SeatModel getSeatById(Long seat_id);    

    List<UserModel> getAllUser();

    void swapUserIds(Long seatId1, Long seatId2, Long updated_by);

    
    boolean isUserAlreadyAssigned(Long user_id);

}