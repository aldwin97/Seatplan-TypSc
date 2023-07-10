package com.seatPlan.project.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seatPlan.project.model.UserModel;
import com.seatPlan.project.service.AdminService;

@RestController
@RequestMapping("/admin")
public class AdminController {
    
    private AdminService  adminService;


    public AdminController(@Autowired AdminService adminService){
        this.adminService = adminService;
    }

    @GetMapping("/showAllPosition")
    public List<Map<String, Object>> allPosition(){
       List<Map<String, Object>> positions = adminService.getAllPosition();
       return positions;
    }


    @GetMapping("/showAllProject")
    public List<Map<String, Object>> allProject(){
        List<Map<String, Object>> projects = adminService.getAllProject();
        return projects;
    }


    @GetMapping("/showAllUserType")
    public List<Map<String, Object>> allUserType(){
        List<Map<String, Object>> userTypes = adminService.getAllUserType();
        return userTypes;
    }

    @GetMapping("/showAllUser")
    public List<Map<String, Object>> allUser(){
        List<Map<String, Object>> users = adminService.getAllUser();
        return users;
    }

    @GetMapping("/showAllStaffStatus")
    public List<Map<String, Object>> allStaffStatus(){
        List<Map<String, Object>> stuffs = adminService.getAllStaffStatus();
        return stuffs;
    }


    @PostMapping("/delete/{user_id}")
    public ResponseEntity<String> deleteUserById(@PathVariable Long user_id) {
          try {
              adminService.deleteUserById(user_id);
           return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete user");
        }    
    }

     @PostMapping("/insert")
    public ResponseEntity<String> insertUser(@RequestBody UserModel userModel) {
          try {
             adminService.insertUser(userModel);
           return ResponseEntity.ok("User inserted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to insert user");
        }   
    }


    @PutMapping("/update/{user_id}")
    public ResponseEntity<String> updateUser(@PathVariable("user_id") Long user_id, @RequestBody UserModel userModel) {
        try {
            UserModel existingUser = adminService.getUserById(user_id);
            if (existingUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            if (userModel.getFirst_name() != null) {
                existingUser.setFirst_name(userModel.getFirst_name());
            }
            
            if (userModel.getLast_name() != null) {
                existingUser.setLast_name(userModel.getLast_name());
            }
            
            if (userModel.getEmail() != null) {
                existingUser.setEmail(userModel.getEmail());}

            if (userModel.getMobile_num() != null) {
                existingUser.setMobile_num(userModel.getMobile_num());
            }

            if (userModel.getProject_id() != null) {
                existingUser.setProject_id(userModel.getProject_id());
            }

            if (userModel.getPassword() != null) {
                existingUser.setPassword(userModel.getPassword());
            }

            if (userModel.getStaffstatus_id() != null) {
                existingUser.setStaffstatus_id(userModel.getStaffstatus_id());
            }

            if (userModel.getUsertype_id() != null) {
                existingUser.setUsertype_id(userModel.getUsertype_id());
            }

            if (userModel.getPosition_id() != null) {
                existingUser.setPosition_id(userModel.getPosition_id());
            }

            if (userModel.getLast_name() != null) {
                existingUser.setLast_name(userModel.getLast_name());
            }

            adminService.updateUser(existingUser);
            return ResponseEntity.ok("User updated successfully");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update user");
        }
    }


}
