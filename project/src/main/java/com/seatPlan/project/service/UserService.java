//Kenneth Christian B. Gutierrez
package com.seatPlan.project.service;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.seatPlan.project.dao.UserDao;
import com.seatPlan.project.model.UserModel;
import jakarta.servlet.http.HttpSession;


@Service
public class UserService{

    
    public UserDao userDao;

    public UserService(@Autowired(required=true) UserDao userDao) {
        this.userDao = userDao;
    }

    public UserModel authenticateUser(String username, String password, HttpSession session) {
        UserModel user = userDao.getUserByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            session.setAttribute("userSession", user);
            return user;
        } else {
            return null;
        }
    }


    public int countUsers() {
        return userDao.countUsers();
    }

    
     public void deleteUserByUsername(String username) {
        userDao.deleteUserByUsername(username);
    }

    public void updateUser(UserModel userModel) {
        userDao.updateUser(userModel);
    }

    public boolean isUsernameExists(String username) {
        return userDao.getUserByUsername(username) != null;
    }

     public boolean isUserEmailExists(String email) {
        return userDao.getUserByEmail(email) != null;
    }

    public UserModel getUserByUsername(String username) {
        return userDao.getUserByUsername(username);
    }

    public List<Map<String, Object>>  showUserById(Long user_id){
        List<UserModel> userInfos = userDao. showUserById(user_id);
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
            return userInfoMap;

        }).collect(Collectors.toList());

        return filteredUserInfo;
    }

    public UserModel getUserById(Long user_id) {
       return userDao.getUserById(user_id);
    }

}
