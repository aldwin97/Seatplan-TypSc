//Kenneth Christian B. Gutierrez
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
    private Long recipient_id;
    private Long seat_id;
    private String comment;
    private int is_deleted;
    private LocalDateTime created_time;
    private Long created_by;
    private LocalDateTime updated_time;
    private Long updated_by;




    private String first_name;
    private String last_name;
    private int seat_num;
    private String user_picture;
}
