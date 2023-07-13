package com.seatPlan.project.service;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.seatPlan.project.mapper.UserMapper;
import com.seatPlan.project.model.UserModel;

import jakarta.servlet.http.HttpSession;


@Service
public class UserService{

    
    public UserMapper userMapper;

    public UserService(@Autowired UserMapper userMapper) {
        this.userMapper = userMapper;
    }



    public UserModel authenticateUser(String username, String password, HttpSession session) {
        UserModel user = userMapper.getUserByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            session.setAttribute("userSession", user);
            return user;
        } else {
            return null;
        }
    }


    // displaying all the data in user table
     public List<UserModel> getAllUsers() {
        return userMapper.getAllUsers();
    }

    // count the all row in the user table
    public int countUsers() {
        return userMapper.countUsers();
    }


    // delete a user base on the username
     public void deleteUserByUsername(String username) {
        userMapper.deleteUserByUsername(username);
    }



    public void updateUser(UserModel userModel) {
        userMapper.updateUser(userModel);
    }

    

    public boolean isUsernameExists(String username) {
        return userMapper.getUserByUsername(username) != null;
    }

     public boolean isUserEmailExists(String email) {
        return userMapper.getUserByEmail(email) != null;
    }

    public UserModel getUserByUsername(String username) {
        return userMapper.getUserByUsername(username);
    }




      public List<Map<String, Object>>  showUserById(Long user_id){
        List<UserModel> userInfos = userMapper. showUserById(user_id);
        List<Map<String, Object>> filteredUserInfo = userInfos.stream()
        .map(userInfo ->{
            Map<String, Object> userInfoMap = new HashMap<>();
            userInfoMap.put("user_id",userInfo.getUser_id());
            userInfoMap.put("last_name", userInfo.getFirst_name());
            userInfoMap.put("first_name",userInfo.getLast_name());
            userInfoMap.put("email",userInfo.getEmail());
            userInfoMap.put("username",userInfo.getUsername());
            userInfoMap.put("mobile_num", userInfo.getMobile_num());
            userInfoMap.put("position_name", userInfo.getPosition_name());
            userInfoMap.put("userType_name", userInfo.getUsertype_name());
            userInfoMap.put("staffstatus_name",userInfo.getStaffstatus_name());
            userInfoMap.put("project_name",userInfo.getProject_name());
            return userInfoMap;

        }).collect(Collectors.toList());

        return filteredUserInfo;
    }



    public UserModel getUserById(Long user_id) {
       return userMapper.getUserById(user_id);
    }

}
