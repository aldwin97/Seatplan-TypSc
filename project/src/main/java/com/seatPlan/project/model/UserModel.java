package com.seatPlan.project.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserModel {
    private Long userId;
    private Long projectId;
    private Long seatId;
    private String fname;
    private String lname;
    private String email;
    private int mobile;
    private String address;
    private String username;
    private String password;
    private Long userTypeId;
    private Long positionId;
    private String userProfile;
    private Boolean isDeleted;
    private LocalDateTime createdTime;
    private String createdBy;
    private LocalDateTime  updatedTime;
    private String updatedBy;
}
