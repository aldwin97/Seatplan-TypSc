package com.seatPlan.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
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


    //Authentication of user log in
   @PostMapping("/login")
    public ResponseEntity<String> authenticateUser(@RequestBody UserModel userModel) {
        String username = userModel.getUsername();
        String password = userModel.getPassword();

        // Perform authentication logic
        boolean isAuthenticated = userService.authenticateUser(username, password);

        if (isAuthenticated) {
            // Authentication successful
            return ResponseEntity.ok("Authentication successful");
        } else {
            // Authentication failed
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }
    //Authentication of user log in


    //insert user
     @PostMapping("/addUser")
    public ResponseEntity<String> createUser(@RequestBody UserModel userModel) {
        try {
            userService.createUser(userModel);
            return ResponseEntity.ok("User created successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create user");
        }
    }

    // display all users
     @GetMapping("/allUsers")
    public List<UserModel> getAllUsers() {
        return userService.getAllUsers();
    }
    
    // count the number of row in the table
     @GetMapping("/count")
    public int countUsers() {
        return userService.countUsers();
    }

     @DeleteMapping("/users/{username}")
    public ResponseEntity<String> deleteUserByUsername(@PathVariable String username) {
        userService.deleteUserByUsername(username);
        return ResponseEntity.ok("User deleted successfully");
    }






}
