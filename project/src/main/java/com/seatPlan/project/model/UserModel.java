package com.seatPlan.project.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserModel {

    private Long user_id;
    private Long project_id;
    private String first_name;
    private String last_name;
    private String email;
    private int mobile_num;
    private String username;
    private String password;
    private Long usertype_id;
    private Long position_id;
    private String user_picture;
    private int is_deleted;
    private LocalDateTime created_time;
    private Long created_by;
    private LocalDateTime updated_time;
    private Long updated_by;

}
