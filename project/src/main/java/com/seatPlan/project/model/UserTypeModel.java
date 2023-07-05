package com.seatPlan.project.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserTypeModel {
    private Long usersTypeId;
    private String usersTypeName;
    private Boolean isDeleted;
    private LocalDateTime createdTime;
    private String createdBy;
    private LocalDateTime  updatedTime;
    private String updatedBy;

}
