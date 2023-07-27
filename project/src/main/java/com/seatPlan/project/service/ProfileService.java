package com.seatPlan.project.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.seatPlan.project.dao.ProfileDao;
import com.seatPlan.project.model.UserModel;

@Service
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


}
