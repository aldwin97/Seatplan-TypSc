package com.seatPlan.project.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;




@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentInputModel {

    private Long user_id;
    private Long recipient_id;
    private Long seat_id;
    private String comment;
    private int is_deleted;
    private LocalDateTime created_time;
    private Long created_by;
}
