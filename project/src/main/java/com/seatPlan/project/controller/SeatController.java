//Kenneth Christian B. Gutierrez
package com.seatPlan.project.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.seatPlan.project.model.CommentModel;
import com.seatPlan.project.model.SeatModel;
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

    //Show all the seat in the database
    @GetMapping("/showAllSeat")
    public List<Map<String, Object>> allSeat(){
            List<Map<String, Object>> seats = seatService.getAllSeat();
            return seats;
        }

    // Create a comment
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

    //Show all the comment by logged user
    @GetMapping("/showAllCommentByUserId")
    public List<Map<String, Object>> getCommentByUserId(HttpSession session) {
        UserModel user = (UserModel) session.getAttribute("userSession");
        Long user_id = user.getUser_id();
        List<Map<String, Object>> comments = seatService.getCommentByUserId(user_id);
        return comments;
    }

    //show all the comment in the database
    @GetMapping("/showAllComment")
    public List<Map<String, Object>> allProject(){
        List<Map<String, Object>> comments = seatService.getAllComment();
        return comments;
    }

    //swap seat
    @PutMapping("/swap/{seat_id}")
    public ResponseEntity<String> updateSeat(HttpSession session ,@PathVariable("seat_id") Long seat_id, @RequestBody SeatModel seat) {
        try {
            UserModel user = (UserModel) session.getAttribute("userSession");
            Long updator = user.getUser_id();
            SeatModel existingSeat = seatService.getSeatById(seat_id);
            if (existingSeat == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seat not found");
            }
            
            if (seat.getUser_id() != null) {
                existingSeat.setUser_id(seat.getUser_id());
            }
            if (seat.getSeatstatus_id() != null) {
                existingSeat.setSeatstatus_id(seat.getSeatstatus_id());
            }
            if (seat.getAreaId() != null) {
                existingSeat.setAreaId(seat.getAreaId());
            }
            
            if(updator != null){
                seat.setUpdatedBy(updator);
            }

            seatService.updateSeat(existingSeat);
            
            return ResponseEntity.ok("Seat updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update seat");
        }
    }


}
