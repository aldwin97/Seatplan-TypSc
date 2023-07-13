package com.seatPlan.project.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.seatPlan.project.mapper.SeatMapper;
import com.seatPlan.project.model.CommentModel;
import com.seatPlan.project.model.SeatModel;

@Service
public class SeatService {
    private final SeatMapper seatMapper;

   
    public SeatService(@Autowired SeatMapper seatMapper) {
        this.seatMapper = seatMapper;
    }


    public List<Map<String, Object>> getAllSeat() {
        List<SeatModel> seats = seatMapper.getAllSeatModels();
        List<Map<String, Object>> filteredSeat = seats.stream()
            .map(seat -> {
                Map<String, Object> seatMap = new HashMap<>();
                seatMap.put("seat_id", seat.getSeat_id());
                seatMap.put("seatNumber", seat.getSeat_num());
                seatMap.put("full_name", String.join(" ", seat.getFirst_name(), seat.getLast_name()));
                seatMap.put("area_name", seat.getArea_name());
                seatMap.put("project_name", seat.getProject_name()); 
                seatMap.put("seat_status", seat.getSeat_status());
                return seatMap;
            })
            .collect(Collectors.toList());
    
        return filteredSeat;
    }
    

    public void saveComment(CommentModel comment) {
        seatMapper.insertComment(comment);
    }

    public List<Map<String, Object>> getCommentByUserId(Long user_id) {
        List<CommentModel> comments = seatMapper.getCommentByUserId(user_id);
        List<Map<String, Object>> filteredComment = comments.stream()
            .map(comment -> {
                Map<String, Object> commentMap = new HashMap<>();
                commentMap.put("seat_id",comment.getSeat_id());
                commentMap.put("full_name", String.join(" ", comment.getFirst_name(), comment.getLast_name()));
                commentMap.put("comment", comment.getComment());
                commentMap.put("created_time", comment.getCreated_time());
                return commentMap;
            }).collect(Collectors.toList());
    
        return filteredComment;
    }


    public List<Map<String, Object>> getAllComment() {
       List<CommentModel> comments = seatMapper.getAllComment();
        List<Map<String, Object>> filteredComments = comments.stream()
        .map(comment ->{
            Map<String, Object> commentMap = new HashMap<>();
            commentMap.put("seat_id",comment.getSeat_id());
            commentMap.put("full_name", String.join(" ", comment.getFirst_name(), comment.getLast_name()));
            commentMap.put("comment", comment.getComment());
            commentMap.put("created_time", comment.getCreated_time());
            return commentMap;

        }).collect(Collectors.toList());

        return filteredComments;
    }
    




}
