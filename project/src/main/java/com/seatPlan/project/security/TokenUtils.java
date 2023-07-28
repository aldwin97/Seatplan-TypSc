package com.seatPlan.project.security;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;


public class TokenUtils {
    private final static Key ACCESS_TOKEN_SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final static Long ACCESS_TOKEN_VALIDITY_SECONDS = 2_592_000L;

    public static String createToken( String username){
        long expirationTime = ACCESS_TOKEN_VALIDITY_SECONDS * 1_000;
        Date expirationDate = new Date(System.currentTimeMillis() + expirationTime);

        Map<String, Object> extra = new HashMap<>();
        extra.put("username", username); 

        return Jwts.builder()
                .setSubject(username)
                .setExpiration(expirationDate)
                .addClaims(extra)
                .signWith(ACCESS_TOKEN_SECRET_KEY)
                .compact();

}

public static UsernamePasswordAuthenticationToken getAuthentication(String token) {
     try{
         Claims claims = Jwts.parserBuilder()
                 .setSigningKey(ACCESS_TOKEN_SECRET_KEY)
                 .build()
                 .parseClaimsJws(token)
                 .getBody();
                 String username = claims.getSubject();
                 return new UsernamePasswordAuthenticationToken(username,null, Collections.emptyList());
}catch(JwtException e){
    return null;
}

}
}

