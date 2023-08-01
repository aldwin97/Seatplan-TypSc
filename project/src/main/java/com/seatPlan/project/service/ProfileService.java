package com.seatPlan.project.service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
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

        UserModel user = profileDao.getUserById(user_id);
        String targetDirectory = "C:\\Storage\\Profile";
        String filename = user.getUser_picture();
        File pictureFile = new File(targetDirectory, filename);



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
            
            try (InputStream inputStream = new FileInputStream(pictureFile)) {
                        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                        byte[] buffer = new byte[1024];
                        int bytesRead;
                        while ((bytesRead = inputStream.read(buffer)) != -1) {
                            outputStream.write(buffer, 0, bytesRead);
                        }
                        byte[] imageBytes = outputStream.toByteArray();
                        String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                        userInfoMap.put("user_picture", base64Image);
                    } catch (IOException e) {
                        // Handle the exception here
                    }

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


}
