package com.seatPlan.project.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.seatPlan.project.mapper.UserMapper;
import com.seatPlan.project.model.UserModel;


@Service
public class UserService{

    
    public UserMapper userMapper;

    public UserService(@Autowired UserMapper userMapper) {
        this.userMapper = userMapper;
    }

     public boolean authenticateUser(String username, String password) {
        UserModel user = userMapper.getUserByUsername(username);
        return user != null && user.getPassword().equals(password);
    }

    //for creating user
     public void createUser(UserModel userModel) {
        userMapper.insertUser(userModel);
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
}
