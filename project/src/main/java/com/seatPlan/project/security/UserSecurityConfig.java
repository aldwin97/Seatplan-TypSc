// package com.seatPlan.project.security;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;


// @Configuration
// @EnableWebSecurity
// public class UserSecurityConfig {
//     private static final String[] SECURED_URLS ={};
//     private static final String[] UN_SECURED_URLS = {};



 
//     @Bean
//     public PasswordEncoder oPasswordEncoder(){
//         return new BCryptPasswordEncoder();
//     }

//     @Bean
// public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//     return http
//     .csrf(csrf -> csrf.disable())
//     .authorizeHttpRequests(auth -> auth.anyRequest()
//     .permitAll())
//     .build();
// }
    


// }
