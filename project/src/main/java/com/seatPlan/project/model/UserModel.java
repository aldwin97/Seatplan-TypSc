package com.seatPlan.project.model;

import java.time.LocalDateTime;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias("table_user")
public class UserModel {
    private Long user_id;
    private Long project_id;
    private String first_name;
    private String last_name;
    private String email;
    private Long mobile_num;
    private String username;
    private String password;
    private Long stuffstatus_id;
    private Long usertype_id;
    private Long position_id;
    private String user_picture;
    private int is_deleted;
    private LocalDateTime created_time;
    private Long created_by;
    private LocalDateTime updated_time;
    private Long updated_by;
    
    // Additional field for joining table_position
    private String position_name;
    private String usertype_name;
    private String stuffstatus_name;
    private String project_name;
}
