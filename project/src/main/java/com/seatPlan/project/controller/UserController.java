package com.seatPlan.project.controller;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seatPlan.project.model.UserModel;
import com.seatPlan.project.service.UserService;


@RestController
@RequestMapping("/api/user")
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
     @GetMapping("/all")
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







}
