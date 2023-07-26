//Kenneth Christian B. Gutierrez
package com.seatPlan.project.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.seatPlan.project.service.DashBoardService;

@RestController
@RequestMapping("/dashboard")
public class DashBoardController {
    

    
    private final DashBoardService dashBoardService;


    public DashBoardController (@Autowired DashBoardService dashBoardService){
        this.dashBoardService = dashBoardService;
    }

   @GetMapping("/display")
    public ResponseEntity<Map<String, Object>> dashboard() {
        
       int countUser = dashBoardService.countUser();

       int countSeatAvailable = dashBoardService.countSeatAvailable();

       int countTrainee = dashBoardService.countTrainee();
       
       int countRegular = dashBoardService.countRegular();

       int countUnderMaintenance = dashBoardService.countUnderMaintenance();

       int countOccupied = dashBoardService.countOccupied(); 

        Map<String , Object> data = new HashMap<>();
        data.put("countUser", countUser);
        data.put("countSeatAvailable", countSeatAvailable);
        data.put("countTrainee", countTrainee);
        data.put("countRegular", countRegular);
        data.put("countOccupied", countOccupied);
        data.put("countUnderMaintenance", countUnderMaintenance);
        return ResponseEntity.ok(data);
       
    }

    @GetMapping("/countPerProject")
    public List<Map<String, Object>> allUser(){
        List<Map<String, Object>> userCountList = dashBoardService.countUsersPerProject();
        return userCountList;
    }



    @GetMapping("/showAllComment")
    public List<Map<String, Object>> allComment(){
            List<Map<String, Object>> comments = dashBoardService.getAllComment();
            return comments;
        }






}
