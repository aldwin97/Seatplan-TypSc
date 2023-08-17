//Kenneth Christian B. Gutierrez
package com.seatPlan.project.controller;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.seatPlan.project.model.CommentInputModel;
import com.seatPlan.project.model.SeatModel;
import com.seatPlan.project.service.SeatService;

@RestController
@RequestMapping("/seat")
@PreAuthorize("hasRole('Admin','Editor','Viewer')") //needs further changes to specify for each function
public class SeatController {

    @Autowired
     private SeatService seatService;

   

    @GetMapping("/showAllSeat")
    public List<Map<String, Object>> allSeat(){
            List<Map<String, Object>> seats = seatService.getAllSeat();
            return seats;
        }

    @PostMapping("/insertComment")
    public ResponseEntity<String> saveComment(@RequestBody CommentInputModel comment) {
        try {
            seatService.saveComment(comment);
            return ResponseEntity.ok("Comment inserted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to insert comment");
        }
    }

    @GetMapping("/showAllCommentBy/{user_id}/{seat_id}")
    public List<Map<String, Object>> getCommentByUserId(@PathVariable ("user_id") Long user_id, @PathVariable ("seat_id") Long seat_id) {
        List<Map<String, Object>> comments = seatService.getCommentByUserId(user_id,seat_id);
        return comments;
    }

    

    @PutMapping("/update/{seat_id}")
    public ResponseEntity<String> updateSeat(@PathVariable("seat_id") Long seat_id, @RequestBody SeatModel seat) {
        try {
            SeatModel existingSeat = seatService.getSeatById(seat_id);

            if (existingSeat == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seat not found");
            }

            if (seat.getUser_id() != null && !seat.getUser_id().equals(existingSeat.getUser_id())) {
                if (seatService.isUserAlreadyAssigned(seat.getUser_id())) {
                    return ResponseEntity.badRequest().body("The user_id is already assigned to another seat.");
                }
                existingSeat.setUser_id(seat.getUser_id());
            }

            if (seat.getUpdated_by() != null) {
                existingSeat.setUpdated_by(seat.getUpdated_by());
            }

            seatService.updateSeat(existingSeat);

            return ResponseEntity.ok("Seat updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update seat");
        }
    }



    @GetMapping("/showAllUser")
    public List<Map<String, Object>> allUser(){
        List<Map<String, Object>> users = seatService.getAllUser();
        return users;
    }


    @PostMapping("/swap/{seatId1}/{seatId2}/{updated_by}")
    public ResponseEntity<String> swapUserIds(
            @PathVariable("seatId1") Long seatId1,
            @PathVariable("seatId2") Long seatId2,
            @PathVariable("updated_by") Long updated_by) {

        try {
            seatService.swapUserIds(seatId1, seatId2, updated_by);
            return ResponseEntity.ok("User IDs swapped successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to swap user IDs");
        }
    }




    @GetMapping("/showChatCommentBy/{user_id}/{recipient_id}/{seat_id}")
    public List<Map<String, Object>> getCommentByUserId(@PathVariable ("user_id") Long user_id, @PathVariable ("seat_id") Long seat_id,@PathVariable ("recipient_id") Long recipient_id) {
        List<Map<String, Object>> comments = seatService.getCommentByChatId(user_id,seat_id,recipient_id);
        return comments;
    }




}