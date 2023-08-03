//Kenneth Christian B. Gutierrez
package com.seatPlan.project.controller;

import java.util.HashMap;
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
import com.seatPlan.project.service.UserService;
import jakarta.servlet.http.HttpSession;


@RestController
@RequestMapping("/user")
public class UserController {
    
    private final UserService userService;

    
    public UserController(@Autowired UserService userService) {
        this.userService = userService;
    }



    @PostMapping("/login")
    public ResponseEntity<UserModel> authenticateUser(@RequestBody UserModel userModel, HttpSession session) {
        String username = userModel.getUsername();
        String password = userModel.getPassword();

        UserModel authenticatedUser = userService.authenticateUser(username, password, session);

        if (authenticatedUser != null) {
            return ResponseEntity.ok(authenticatedUser);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }   
    
    
     @GetMapping("/count")
    public int countUsers() {
        return userService.countUsers();
    }

    
    @PostMapping("/delete/{username}")
    public ResponseEntity<String> deleteUserByUsername(@PathVariable String username) {
    userService.deleteUserByUsername(username);
        return ResponseEntity.ok("User deleted successfully");
    }

    
    @PutMapping("/updateProfile")
    public ResponseEntity<String> updateUser(HttpSession session, @RequestBody UserModel userModel ) {
        UserModel user = (UserModel) session.getAttribute("userSession");
        try {
            Long user_id = user.getUser_id();
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

            if(user != null){
                existingUser.setUpdated_by(user_id);
            }

            userService.updateUser(existingUser);
            return ResponseEntity.ok("User updated successfully");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update user");
        }
    }

    
    @GetMapping("/checkSession")
    public Map<String, String> checkSession(HttpSession session) {
        Map<String, String> response = new HashMap<>();
        UserModel userSession = (UserModel) session.getAttribute("userSession");
        if (userSession != null) {
            response.put("status", "success");
        } else {
            response.put("status", "error");
        }
        return response;
    }

     
     @GetMapping("/logout")
     public String logout(HttpSession session) {
         if (session != null) {
         session.invalidate();
         }
         return "{\"status\":\"success\"}";
    }
     
    @GetMapping("/showLogedUserInfo/{user_id}")
    public List<Map<String, Object>> showUserById(@PathVariable ("user_id") Long user_id  ) {
            List<Map<String, Object>> userInfo = userService.showUserById(user_id);
            return userInfo;
    }


    

}
