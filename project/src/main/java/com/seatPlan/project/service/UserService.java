package com.seatPlan.project.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
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

    public UserModel getUserById(Long user_id) {
        return userMapper.getUserById(user_id);
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


}
