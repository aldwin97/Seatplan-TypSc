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
import com.seatPlan.project.service.AddUserService;

@RestController
@RequestMapping("/api/addUser")
public class AddUserController {
    
    private AddUserService  addUserService;


    public AddUserController(@Autowired AddUserService addUserService){
        this.addUserService = addUserService;
    }

    @GetMapping("/allPosition")
    public List<Map<String, Object>> allPosition(){
       List<Map<String, Object>> positions = addUserService.getAllPosition();
       return positions;
    }


    @GetMapping("/allProject")
    public List<Map<String, Object>> allProject(){
        List<Map<String, Object>> projects = addUserService.getAllProject();
        return projects;
    }


    @GetMapping("/allUserType")
    public List<Map<String, Object>> allUserType(){
        List<Map<String, Object>> userTypes = addUserService.getAllUserType();
        return userTypes;
    }

    @GetMapping("/allUsers")
    public List<Map<String, Object>> allUser(){
        List<Map<String, Object>> users = addUserService.getAllUser();
        return users;
    }

    @GetMapping("/allStuffStatus")
    public List<Map<String, Object>> allStuffStatus(){
        List<Map<String, Object>> stuffs = addUserService.getAllStuffStatus();
        return stuffs;
    }


    @PostMapping("/delete/{user_id}")
    public ResponseEntity<String> deleteUserById(@PathVariable Long user_id) {
          try {
              addUserService.deleteUserById(user_id);
           return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete user");
        }    
    }

     @PostMapping("insert")
    public ResponseEntity<String> insertUser(@RequestBody UserModel userModel) {
          try {
             addUserService.insertUser(userModel);
           return ResponseEntity.ok("User inserted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to insert user");
        }   
    }


    @PutMapping("/updateInfo/{user_id}")
    public ResponseEntity<String> updateUser(@PathVariable("user_id") Long userId, @RequestBody UserModel userModel) {
      try {
              userModel.setUser_id(userId);
              addUserService.updateUser(userModel);
            return ResponseEntity.ok("User updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update user");
        }
    }




}
