package com.seatPlan.project.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;


import com.seatPlan.project.model.UserModel;

@Service
public class JwtUtil {

    private static final String SECRET_KEY ="bc3ab580db4a24f0ce4ca7a175b16cc4644a887fe5c4e69946cfd5668e436f0e";

    public String extractUsername(String token){
        return extractClaim(token, Claims::getSubject);
    }

    public <T> extractClaim(String token, Function<Claims, T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails){
        return generateToken(new HashMap<>(), userDetails);
    }


    public String generateToken(
        Map<String, Object> extraClaims,
        UserDetails userDetails
        ){
            return Jwts
            .builder()
            .setClaims(extraClaims)
            .serSubject(userDetails.getUsername())
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 *10))
            .signWith(getSignInkey(), SignatureAlgorithm.HS256)
            .compact();
        }

        public boolean isTokenValid(String token, UserDetails userDetails){
            final String username = extractUsername(token);
            return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
        }
    

    Private Claims extractAllClaims(String token){
        return Jwts.parserBuilder()
        .setSigningKey(getSignInkey())
        .build()
        .parseClaimsJws(token)
        .getBody();
    }

    private Key getSignInkey(){
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

//     SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

//     @Value("${jwt.secret}")
//     private String secret;

//     @Value("${jwt.expiration}")
//     private Long expiration;

//     public String generateToken(UserModel user) {
//         Date now = new Date();
//         Date expiryDate = new Date(now.getTime() + expiration);

//         Map<String, Object> claims = new HashMap<>();
//         claims.put("userId", user.getUser_id());
//         claims.put("userType", user.getUsertype_id());

//         return Jwts.builder()
//                 .setClaims(claims)
//                 .setIssuedAt(now)
//                 .setExpiration(expiryDate)
//                 .signWith(secretKey)
//                 .compact();
//     }

//    public Long getUserIdFromToken(String token) {
//         Jws<Claims> claimsJws = Jwts.parserBuilder()
//                 .setSigningKey(secretKey)
//                 .build()
//                 .parseClaimsJws(token);

//         Claims claims = claimsJws.getBody();
//         return Long.parseLong(claims.get("userId").toString());
//     }

//      public Long getUserTypeFromToken(String token) {
//         Jws<Claims> claimsJws = Jwts.parserBuilder()
//                 .setSigningKey(secretKey)
//                 .build()
//                 .parseClaimsJws(token);

//         Claims claims = claimsJws.getBody();
//         return Long.parseLong(claims.get("userType").toString());
//     }

//     public boolean validateToken(String token) {
//         try {
//             Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
//             return true;
//         } catch (Exception e) {
//             return false;
//         }
//     }
}
