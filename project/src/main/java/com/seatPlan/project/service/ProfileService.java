package com.seatPlan.project.service;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.seatPlan.project.dao.ProfileDao;
import com.seatPlan.project.model.UserModel;

@Service
@Transactional
public class ProfileService {


     public ProfileDao profileDao;

    public ProfileService(@Autowired(required=true) ProfileDao profileDao) {
        this.profileDao = profileDao;
    }


     public List<Map<String, Object>>  showUserById(Long user_id){
        List<UserModel> userInfos = profileDao. showUserById(user_id);
        List<Map<String, Object>> filteredUserInfo = userInfos.stream()
        .map(userInfo ->{
            Map<String, Object> userInfoMap = new HashMap<>();
            userInfoMap.put("user_id",userInfo.getUser_id());
            userInfoMap.put("first_name", userInfo.getFirst_name());
            userInfoMap.put("last_name",userInfo.getLast_name());
            userInfoMap.put("email",userInfo.getEmail());
            userInfoMap.put("username",userInfo.getUsername());
            userInfoMap.put("mobile_num", userInfo.getMobile_num());
            userInfoMap.put("position_name", userInfo.getPosition_name());
            userInfoMap.put("user_picture",userInfo.getUser_picture());
            return userInfoMap;

        }).collect(Collectors.toList());

        return filteredUserInfo;
    }
    
    public UserModel getUserById(Long user_id) {
        return profileDao.getUserById(user_id);
    }


    public boolean isUserEmailExists(String email,Long user_id) {
        return profileDao.getUserByEmail(email,user_id) != null;
    }

    public void updateUser(UserModel userModel) {
        profileDao.updateUser(userModel);
    }

     public void updateUserPassword(UserModel userModel) {
        profileDao.updateUserPassword(userModel);
    }


    public void updateUserPicture(UserModel userModel) {
         profileDao.updateUserPicture(userModel);
    }


    public ResponseEntity<FileSystemResource> getUserPicture(Long user_id) {
        try {
            UserModel user = profileDao.getUserById(user_id);
            if (user == null || user.getUser_picture() == null) {
                return ResponseEntity.notFound().build();
            }

            String targetDirectory = "C:\\Storage\\Profile";
            String filename = user.getUser_picture();

            File pictureFile = new File(targetDirectory, filename);

            if (!pictureFile.exists()) {
                return ResponseEntity.notFound().build();
            }

            // Set the Content-Disposition header to "inline" to display the image in the browser.
            return ResponseEntity
                    .ok()
                    .header("Content-Disposition", "inline; filename=\"" + filename + "\"")
                    .contentType(MediaType.parseMediaType("image/jpeg"))
                    .body(new FileSystemResource(pictureFile));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


}
