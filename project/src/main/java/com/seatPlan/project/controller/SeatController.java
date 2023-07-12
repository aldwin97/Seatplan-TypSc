package com.seatPlan.project.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seatPlan.project.model.CommentModel;
import com.seatPlan.project.model.UserModel;
import com.seatPlan.project.service.SeatService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/seat")
public class SeatController {
     private final SeatService seatService;

    public SeatController( @Autowired SeatService seatService) {
        this.seatService = seatService;
    }

    


@GetMapping("/showAllSeat")
public List<Map<String, Object>> allSeat(){
        List<Map<String, Object>> seats = seatService.getAllSeat();
        return seats;
    }

    
@PostMapping("/insertComment")
public ResponseEntity<String> saveComment(@RequestBody CommentModel comment, HttpSession session) {
    try {
        UserModel creatorId = (UserModel) session.getAttribute("userSession");
        comment.setCreated_by(creatorId.getUser_id());
        comment.setUser_id(creatorId.getUser_id());
        seatService.saveComment(comment);
        return ResponseEntity.ok("Comment inserted successfully");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to insert comment");
    }
}

@GetMapping("/showAllCommentByUser_id")
public List<Map<String, Object>> getCommentByUserId(HttpSession session) {
    UserModel user = (UserModel) session.getAttribute("userSession");
    Long user_id = user.getUser_id();
    List<Map<String, Object>> comments = seatService.getCommentByUserId(user_id);
    return comments;
}


@GetMapping("/showAllComment")
public List<Map<String, Object>> allProject(){
    List<Map<String, Object>> comments = seatService.getAllComment();
    return comments;
}











}
