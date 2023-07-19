//Kenneth Christian B. Gutierrez
package com.seatPlan.project.model;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInputModel {

    private String first_name;
    private String last_name;
    private String email;
    private Long mobile_num;
    private String username;
    private String password;
    private Long project_id;
    private Long staffstatus_id;
    private Long usertype_id;
    private Long position_id;
    private Long created_by;
}
