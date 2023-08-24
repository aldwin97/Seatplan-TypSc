 package com.seatPlan.project.security.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider{
    @Autowired
    private JwtConfig jwtconfig;

   public String generateToken(Authentication authentication){
    UserDetails userDetails = (UserDetails) authentication.getPrincipal();
    List<SimpleGrantedAuthority> roles = userDetails.getAuthorities().stream()
    .map(role -> new SimpleGrantedAuthority(role.getAuthority()))
    .collect(Collectors.toList());

    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + jwtconfig.getExpirationTime());

    return Jwts.builder()
        .setSubject(userDetails.getUsername())
        .claim("roles", roles)
        .setIssuedAt(now)
        .setExpiration(expiryDate)
        .signWith(SignatureAlgorithm.HS256, jwtconfig.getSecretKey())
        .compact();
   }

   public boolean validateToken(String jwt, UserDetails userDetails){
    final String username = getUsernameFromToken(jwt);
    return(username.equals(userDetails.getUsername()) && !isTokenExpired(jwt));
   }

    public String getUsernameFromToken(String token) {
    return Jwts.parser()
               .setSigningKey(jwtconfig.getSecretKey())
               .parseClaimsJws(token)
               .getBody()
               .getSubject();
}
public boolean isTokenExpired(String token) {
    Date expiryDate = Jwts.parser()
                              .setSigningKey(jwtconfig.getSecretKey())
                              .parseClaimsJws(token)
                              .getBody()
                              .getExpiration();
    return expiryDate.before(new Date());
}



}