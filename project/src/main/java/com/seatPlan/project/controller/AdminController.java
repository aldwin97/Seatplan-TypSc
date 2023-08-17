//Kenneth Christian B. Gutierrez
package com.seatPlan.project.controller;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.seatPlan.project.model.CommentModel;
import com.seatPlan.project.model.UserInputModel;
import com.seatPlan.project.model.UserModel;
import javax.servlet.http.HttpSession;
import com.seatPlan.project.service.AdminService;

@RestController
@RequestMapping("/admin")
public class AdminController {
    
    @Autowired
    private AdminService adminService;


    // To show all the Position in the Database.
    @GetMapping("/showAllPosition")
    public List<Map<String, Object>> allPosition(HttpSession session){
       List<Map<String, Object>> positions = adminService.getAllPosition();
       return positions;
    }

    //To show all the Project in the Database.
    @GetMapping("/showAllProject")
    public List<Map<String, Object>> allProject(){
        List<Map<String, Object>> projects = adminService.getAllProject();
        return projects;
    }

    //To show all the user type in the Database.
    @GetMapping("/showAllUserType")
    public List<Map<String, Object>> allUserType(){
        List<Map<String, Object>> userTypes = adminService.getAllUserType();
        return userTypes;
    }


    //To show all the user in the Database.
    @GetMapping("/showAllUser")
    public List<Map<String, Object>> allUser(){
        List<Map<String, Object>> users = adminService.getAllUser();
        return users;
    }


    //To show all the staff status in the Database.
    @GetMapping("/showAllStaffStatus")
    public List<Map<String, Object>> allStaffStatus(){
        List<Map<String, Object>> stuffs = adminService.getAllStaffStatus();
        return stuffs;
    }

    //To delete a single user by ID.
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
    public ResponseEntity<String> insertUser(@RequestBody UserInputModel userInputModel) {
        try {
                if (adminService.isUsernameExists(userInputModel.getUsername())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
                }

                if (adminService.isUserEmailExists(userInputModel.getEmail())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists");
                }
                adminService.insertUser(userInputModel);
                long generatedUserId = userInputModel.getUser_id();
                adminService.insertMultipleProject(generatedUserId, userInputModel.getProject_id());
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

            if (adminService.isUserEmailExists(userModel.getEmail())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists");
            }

            if (userModel.getFirst_name() != null) {
                existingUser.setFirst_name(userModel.getFirst_name());
            }

            if (userModel.getLast_name() != null) {
                existingUser.setLast_name(userModel.getLast_name());
            }

            if (userModel.getEmail() != null) {
                existingUser.setEmail(userModel.getEmail());
            }

            if (userModel.getMobile_num() != null) {
                existingUser.setMobile_num(userModel.getMobile_num());
            }

            if (userModel.getProject_id() != null) {
                existingUser.setProject_id(userModel.getProject_id());
                adminService.deleteExistingProject(user_id);
                adminService.insertMultipleProject(user_id,existingUser.getProject_id());
            }

            if (userModel.getPassword() != null) {
                existingUser.setPassword(userModel.getPassword());
            }

            if (userModel.getUsertype_id() != null) {
                existingUser.setUsertype_id(userModel.getUsertype_id());
            }

            if (userModel.getStaffstatus_id() != null) {
                existingUser.setStaffstatus_id(userModel.getStaffstatus_id());
            }

            if (userModel.getPosition_id() != null) {

                existingUser.setPosition_id(userModel.getPosition_id());
            }

            if (userModel.getLast_name() != null) {
                existingUser.setLast_name(userModel.getLast_name());
            }

            // Set the updated_by field with the value from the frontend
            if (userModel.getUpdated_by() != null) {
                existingUser.setUpdated_by(userModel.getUpdated_by());
            }


            adminService.updateUser(existingUser);
            return ResponseEntity.ok("User updated successfully");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update user");
        }
    }


    //Reply comment to the viewer
    @PostMapping("/replyComment")
    public ResponseEntity<String> saveComment(@RequestBody CommentModel comment) {
        try {
            adminService.saveComment(comment);
            return ResponseEntity.ok("Comment inserted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to insert comment");
        }
    }


    @GetMapping("/showAllCommentBy/{seat_id}")
    public List<Map<String, Object>> getCommentBySeatId(@PathVariable ("seat_id") Long seat_id) {
        List<Map<String, Object>> comments = adminService.getCommentBySeatId(seat_id);
        return comments;
    }



    @DeleteMapping("deleteComment/{comment_id}")
       public ResponseEntity<String> deleteCommentById(@PathVariable Long comment_id) {
        try {
              adminService.deleteCommentById(comment_id);
           return ResponseEntity.ok("Comment deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete comment");
        }    
    }


     @DeleteMapping("handleClearComments/{seat_id}")
       public ResponseEntity<String> handleClearComments(@PathVariable Long seat_id) {
        try {
              adminService.handleClearComments(seat_id);
           return ResponseEntity.ok("Comment deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete comment");
        }    
    }

}
