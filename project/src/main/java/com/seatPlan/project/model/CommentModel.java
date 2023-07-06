package com.seatPlan.project.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentModel {
    private Long comment_id;
    private Long user_id;
    private String comment;
    private int is_deleted;
    private LocalDateTime created_time;
    private Long created_by;
    private LocalDateTime updated_time;
    private Long updated_by;

}