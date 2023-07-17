//Kenneth Christian B. Gutierrez
package com.seatPlan.project.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;


import com.seatPlan.project.model.CommentModel;
import com.seatPlan.project.model.SeatModel;

@Mapper
public interface SeatMapper {

    List<SeatModel> getAllSeatModels();

    void insertComment(CommentModel comment);
    
    List<CommentModel> getCommentByUserId(Long user_id);

    List<CommentModel> getAllComment();

    void updateSeat(SeatModel seat);

    SeatModel getSeatById(Long seat_id);

}
