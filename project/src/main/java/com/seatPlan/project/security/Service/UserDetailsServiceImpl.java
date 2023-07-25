package com.seatPlan.project.security.Service;

import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.seatPlan.project.dao.UserDao;
import com.seatPlan.project.model.UserModel;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    
    @Autowired
    private UserDao userDao;

    public UserDetailsServiceImpl(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
        UserModel user = userDao.findByUsername(username);
        if(user != null){
            List<GrantedAuthority> roles = Arrays.asList(new SimpleGrantedAuthority("ROLE_USER"));
            return new UserDetailsImpl(user.getUsername(), user.getPassword(), user.getUser_id());
        }else{
            throw new UsernameNotFoundException("username not found");
        }
    }
}