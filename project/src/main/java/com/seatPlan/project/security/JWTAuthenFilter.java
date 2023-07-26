package com.seatPlan.project.security;

import java.io.IOException;
import java.util.Collections;


import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.seatPlan.project.security.Service.UserDetailsImpl;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JWTAuthenFilter extends UsernamePasswordAuthenticationFilter {

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException{

        try{
            AuthCredentials authCredentials = new ObjectMapper().readValue(request.getReader(),AuthCredentials.class);
            if(!StringUtils.hasLength(authCredentials.getUsername()) || !StringUtils.hasLength(authCredentials.getPassword())){
                throw new BadCredentialsException("Username or Password is empty");
            }
            return getAuthenticationManager().authenticate(new UsernamePasswordAuthenticationToken(
                authCredentials.getUsername(),
                authCredentials.getPassword(),
                Collections.emptyList()
                ));
        }catch(IOException e){
            throw new AuthenticationServiceException("Authentication failed",e);
        }


    }

    @Override
    protected void successfulAuthentication(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain chain,
        Authentication authResult) throws IOException, ServletException {

            UserDetailsImpl userDetails = (UserDetailsImpl) authResult.getPrincipal();
            String token = TokenUtils.createToken(userDetails.getUsername());
            response.addHeader("Authrization","Bearer " + token);
            response.getWriter().flush();
            super.successfulAuthentication(request, response, chain, authResult);   
        }
    
}
