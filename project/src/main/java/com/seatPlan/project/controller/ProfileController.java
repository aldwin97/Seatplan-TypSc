package com.seatPlan.project.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.seatPlan.project.model.UserModel;
import com.seatPlan.project.service.ProfileService;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;



@RestController
@RequestMapping("/profile")
public class ProfileController {


     private final ProfileService profileService;

    
    public ProfileController(@Autowired ProfileService profileService) {
        this.profileService = profileService;
    }
    
    @GetMapping("/showLogedUserInfo/{user_id}")
    public List<Map<String, Object>> showUserById(@PathVariable ("user_id") Long user_id  ) {
            List<Map<String, Object>> userInfo = profileService.showUserById(user_id);
            return userInfo;
    }



    @PutMapping("/updatePersonalInfo/{user_id}")
    public ResponseEntity<String> updateUserInfo(@PathVariable("user_id") Long user_id, @RequestBody UserModel userModel) {
    try {
        UserModel existingUser = profileService.getUserById(user_id);
        if (existingUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        if (profileService.isUserEmailExists(userModel.getEmail(),user_id)) {
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

        if (userModel.getUpdated_by() != null) {
            existingUser.setUpdated_by(userModel.getUpdated_by());
        }

        profileService.updateUser(existingUser);
        return ResponseEntity.ok("User updated successfully");

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update user");
    }
}

@PutMapping("/updatePassword/{user_id}")
public ResponseEntity<String> updateUserPassword(@PathVariable("user_id") Long user_id, @RequestBody UserModel userModel) {
    try {
        UserModel existingUser = profileService.getUserById(user_id);
        if (existingUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        if (userModel.getOldPassword() == null || !userModel.getOldPassword().equals(existingUser.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Old password is incorrect");
        }

        if (userModel.getPassword() != null && userModel.getPassword().equals(existingUser.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("New password cannot be the same as the old password");
        }

        if (userModel.getPassword() != null) {
            existingUser.setPassword(userModel.getPassword());
        }

        if (userModel.getUpdated_by() != null) {
            existingUser.setUpdated_by(userModel.getUpdated_by());
        }

        profileService.updateUserPassword(existingUser);
        return ResponseEntity.ok("User updated successfully");

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update user");
    }
}


@PutMapping("/updatePicture/{user_id}")
public ResponseEntity<String> updateUserPicture(
        @PathVariable("user_id") Long user_id,
        @RequestParam("user_picture") MultipartFile user_picture
) {
    try {
        UserModel existingUser = profileService.getUserById(user_id);
        if (existingUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        long maxFileSize = 5 * 1024 * 1024;

        if (user_picture != null && !user_picture.isEmpty()) {
            if (user_picture.getSize() > maxFileSize) {
                return ResponseEntity.badRequest().body("File size exceeds the maximum limit.");
            }

            String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
            String originalFilename = user_picture.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf('.'));
            String newFilename = timeStamp + fileExtension;

            String targetDirectory = "C:\\Storage\\Profile";

            File directory = new File(targetDirectory);

            if (!directory.exists()) {
                directory.mkdirs();
            }

            Path targetPath = Paths.get(targetDirectory, newFilename);

            Files.copy(user_picture.getInputStream(), targetPath);

            existingUser.setUser_picture(newFilename);

            System.out.println(newFilename);

            profileService.updateUserPicture(existingUser);
            return ResponseEntity.ok("User picture uploaded successfully");
        }

        return ResponseEntity.badRequest().body("Please select a picture to upload.");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload user picture");
    }
}








}
