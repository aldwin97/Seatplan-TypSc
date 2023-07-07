// package com.seatPlan.project.util;
// package com.seatPlan.project;

// import io.jsonwebtoken.Claims;
// import io.jsonwebtoken.Jws;
// import io.jsonwebtoken.Jwts;
// import io.jsonwebtoken.SignatureAlgorithm;
// import io.jsonwebtoken.security.Keys;

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Component;

// import com.seatPlan.project.model.UserModel;

// import java.util.Date;
// import java.util.HashMap;
// import java.util.Map;

// import javax.crypto.SecretKey;

// @Component
// public class JwtUtil {

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
// }
