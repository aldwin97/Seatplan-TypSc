package com.seatPlan.project.security.service;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.seatPlan.project.dao.UserDao;
import com.seatPlan.project.dao.UserTypeDao;
import com.seatPlan.project.model.UserModel;
import com.seatPlan.project.model.UserTypeModel;

@Service("userDetailsService")
@Transactional
public class MyUserDetailsService implements UserDetailsService{

    @Autowired
    private UserDao userDao;
    private UserTypeDao userTypeDao;
    private Long usertype_id;
    @Override
    public UserDetails loadUserByUsername(String username)throws UsernameNotFoundException{
        UserModel user = userDao.getUserByUsername(username);
        if(user == null){
            throw new UsernameNotFoundException("Username not found");
        }

        
        usertype_id = user.getUsertype_id();
        UserTypeModel role = userTypeDao.getUsertypeName(usertype_id);
        
        return new org.springframework.security.core.userdetails.User(
            user.getUsername(), user.getPassword(), Arrays.asList(new SimpleGrantedAuthority(role.getUsertype_name())));
    
}
}
