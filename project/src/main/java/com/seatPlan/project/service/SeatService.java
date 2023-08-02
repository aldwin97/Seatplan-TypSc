//Kenneth Christian B. Gutierrez
package com.seatPlan.project.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.seatPlan.project.dao.SeatDao;
import com.seatPlan.project.model.CommentInputModel;
import com.seatPlan.project.model.CommentModel;
import com.seatPlan.project.model.SeatModel;
import com.seatPlan.project.model.UserModel;

@Service
@Transactional
public class SeatService {

    private final SeatDao seatDao;

   
    public SeatService(@Autowired(required=true)SeatDao seatDao) {
        this.seatDao = seatDao;
    }

    public List<Map<String, Object>> getAllSeat() {
        List<SeatModel> seats = seatDao.getAllSeatModels();
        List<Map<String, Object>> filteredSeat = seats.stream()


            .map(seat -> {
                Map<String, Object> seatMap = new HashMap<>();
                seatMap.put("seat_id", seat.getSeat_id());
                seatMap.put("full_name", String.join(" ", seat.getFirst_name(), seat.getLast_name()));
                seatMap.put("area_name", seat.getArea_name());
                seatMap.put("project_name", seat.getProject_name()); 
                seatMap.put("seat_status", seat.getSeat_status());
                seatMap.put("position_x",seat.getPosition_x());
                seatMap.put("position_y",seat.getPosition_y());
                seatMap.put("color_code", seat.getColor_code());
                seatMap.put("user_id",seat.getUser_id());
                seatMap.put("position_name", seat.getPosition_name());
                return seatMap;
            })
            .collect(Collectors.toList());
    
        return filteredSeat;
    }
    
    public void saveComment(CommentInputModel comment) {
    seatDao.insertComment(comment);
    }

    public List<Map<String, Object>> getCommentByChatId(Long user_id, Long seat_id, Long recipient_id) {
        List<CommentModel> comments =seatDao.getCommentByChatId(user_id, seat_id, recipient_id);
        List<Map<String, Object>> filteredComment = comments.stream()
            .map(comment -> {
                Map<String, Object> commentMap = new HashMap<>();
                 commentMap.put("user_id",comment.getUser_id());
                commentMap.put("comment_id", comment.getComment_id());
                commentMap.put("seat_id",comment.getSeat_id());
                commentMap.put("full_name", String.join(" ", comment.getFirst_name(), comment.getLast_name()));
                commentMap.put("comment", comment.getComment());
                commentMap.put("created_time", comment.getCreated_time());
                return commentMap;
            }).collect(Collectors.toList());
    
        return filteredComment;
    }

     public List<Map<String, Object>> getCommentByUserId(Long user_id, Long seat_id) {
        List<CommentModel> comments =seatDao.getCommentByUserId(user_id, seat_id);
        List<Map<String, Object>> filteredComment = comments.stream()
            .map(comment -> {
                Map<String, Object> commentMap = new HashMap<>();
                 commentMap.put("user_id",comment.getUser_id());
                commentMap.put("comment_id", comment.getComment_id());
                commentMap.put("seat_id",comment.getSeat_id());
                commentMap.put("full_name", String.join(" ", comment.getFirst_name(), comment.getLast_name()));
                commentMap.put("comment", comment.getComment());
                commentMap.put("created_time", comment.getCreated_time());
                return commentMap;
            }).collect(Collectors.toList());
    
        return filteredComment;
    }



    public List<Map<String, Object>> getAllComment() {
       List<CommentModel> comments =seatDao.getAllComment();
        List<Map<String, Object>> filteredComments = comments.stream()
        .map(comment ->{
            Map<String, Object> commentMap = new HashMap<>();
            commentMap.put("user_id",comment.getUser_id());
            commentMap.put("comment_id",comment.getComment_id());
            commentMap.put("seat_id",comment.getSeat_id());
            commentMap.put("full_name", String.join(" ", comment.getFirst_name(), comment.getLast_name()));
            commentMap.put("comment", comment.getComment());
            commentMap.put("created_time", comment.getCreated_time());
            return commentMap;

        }).collect(Collectors.toList());

        return filteredComments;
    }

    public void swapSeat(SeatModel seat) {
    seatDao.swapSeat(seat);
    }

    public void updateSeat(SeatModel seat) {
    seatDao.updateSeat(seat);
    }

    public SeatModel getSeatById(Long seat_id) {
        return seatDao.getSeatById(seat_id);
    }

      public List<Map<String, Object>> getAllUser() {
        List<UserModel> users = seatDao.getAllUser();
        List<Map<String, Object>> filteredUserType = users.stream()
                .map(user -> {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("user_id", user.getUser_id());
                    userMap.put("first_name", user.getFirst_name());
                    userMap.put("last_name", user.getLast_name());
                    return userMap;
                }).collect(Collectors.toList());
        return filteredUserType;
    }

    public void swapUserIds(Long seatId1, Long seatId2, Long updated_by) {
        seatDao.swapUserIds(seatId1, seatId2, updated_by);
    }


    
    public boolean isUserAlreadyAssigned(Long user_id) {
        return seatDao.isUserAlreadyAssigned(user_id);
    }


  

}