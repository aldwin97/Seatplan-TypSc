package com.seatPlan.project.security.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.seatPlan.project.dao.UserDao;
import com.seatPlan.project.model.UserModel;

@Service
public class MyUserDetailsService implements UserDetailsService{

    @Autowired
    private UserDao userDao;

    @Override
    public UserDetails loadUserByUsername(String username)throws UsernameNotFoundException{
        UserModel user = userDao.getUserByUsername(username);
        
        return new User(user.getUsername(), user.getPassword(), user.getAuthorities()); //implement get authorities
        
    }
    
}
