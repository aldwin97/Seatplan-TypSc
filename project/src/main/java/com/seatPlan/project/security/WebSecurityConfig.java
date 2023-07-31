package com.seatPlan.project.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.seatPlan.project.security.Service.UserDetailsServiceImpl;

import lombok.AllArgsConstructor;

@Configuration
@AllArgsConstructor

public class WebSecurityConfig {
    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private final JWTAuthorFilter jwtAuthorFilter;


    public void SecurityConfig(UserDetailsServiceImpl userDetailsService){
        this.userDetailsService = userDetailsService;
    }

    protected void configure(AuthenticationManagerBuilder auth) throws Exception{
        auth.userDetailsService(userDetailsService);
    }

    @Bean
    SecurityFilterChain filterChain(
        HttpSecurity http,
        AuthenticationManager authManager) throws Exception{
            JWTAuthenFilter jwtAuthenFilter = new JWTAuthenFilter();
            jwtAuthenFilter.setAuthenticationManager(authManager);
            jwtAuthenFilter.setFilterProcessesUrl("/login");

            return http
                .csrf().disable()
                .authorizeHttpRequests()
                .anyRequest()
                .authenticated()
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .addFilter(jwtAuthenFilter)
                .addFilterBefore(jwtAuthorFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
                
        }

        @Bean
        AuthenticationManager authManager(HttpSecurity http, PasswordEncoder passwordEncoder) throws Exception{
            return http.getSharedObject(AuthenticationManagerBuilder.class)
                        .userDetailsService(userDetailsService)
                        .passwordEncoder(passwordEncoder())
                        .and()
                        .build();
        }

        @Bean
        PasswordEncoder passwordEncoder(){
            return new BCryptPasswordEncoder();
        }
    
    
    
}
