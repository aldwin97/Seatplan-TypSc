package com.seatPlan.project.controller;

import java.util.List;


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
import com.seatPlan.project.service.UserService;


@RestController
@RequestMapping("/user")
public class UserController {
    
    private final UserService userService;

    
    public UserController(@Autowired UserService userService) {
        this.userService = userService;

    }


// Authentication of user log in
@PostMapping("/login")
public ResponseEntity<UserModel> authenticateUser(@RequestBody UserModel userModel) {
    String username = userModel.getUsername();
    String password = userModel.getPassword();

    UserModel authenticatedUser = userService.authenticateUser(username, password);

    if (authenticatedUser != null) {
        return ResponseEntity.ok(authenticatedUser);
    } else {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }
}   

    
    // display all users
     @GetMapping("/show/AllUser")
    public List<UserModel> getAllUsers() {
        return userService.getAllUsers();
    }
    
    // count the number of row in the table
     @GetMapping("/count")
    public int countUsers() {
        return userService.countUsers();
    }

    @PostMapping("/delete/{username}")
    public ResponseEntity<String> deleteUserByUsername(@PathVariable String username) {
    userService.deleteUserByUsername(username);
        return ResponseEntity.ok("User deleted successfully");
    }


    @PutMapping("/updatePofile/{user_id}")
    public ResponseEntity<String> updateUser(@PathVariable("user_id") Long user_id, @RequestBody UserModel userModel) {
        try {
            UserModel existingUser = userService.getUserById(user_id);
            if (existingUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            if (userService.isUsernameExists(userModel.getUsername())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
            }
    
            if(userService.isUsernameExists(userModel.getEmail())){
                 return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists");
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

            if (userModel.getPassword() != null) {
                existingUser.setPassword(userModel.getPassword());
            }

            if (userModel.getLast_name() != null) {
                existingUser.setLast_name(userModel.getLast_name());
            }

            userService.updateUser(existingUser);
            return ResponseEntity.ok("User updated successfully");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update user");
        }
    }














}
