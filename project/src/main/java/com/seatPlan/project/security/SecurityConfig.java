package com.seatPlan.project.security;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.seatPlan.project.security.service.MyUserDetailsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity( prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter{
    @Autowired
    private MyUserDetailsService myUserDetailsService;

    

    @Override
    protected void configure(HttpSecurity http) throws Exception {
                http
               //.csrf(csrf -> csrf.disable()) //This is for JWT - WiP
                .authorizeHttpRequests(requests -> requests
                        .antMatchers("/admin/**").hasRole("Admin")
                        .antMatchers("/viewer/**").hasAnyRole("Viewer", "Admin", "Editor")
                        .antMatchers("/editor/**").hasAnyRole("Editor", "Admin")
                        .anyRequest().authenticated());
                http
                .formLogin(form -> form
                        .loginPage("/login")
                        .permitAll());
                http
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .permitAll());
                // http
                // .oauth2ResourceServer().jwt();
    }
    

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(myUserDetailsService).passwordEncoder(passwordEncoder());
    }

  

}
