package com.seatplanproj.seatplan.user;

import org.springframework.boot.autoconfigure.domain.EntityScan;

@Entity
@Table(name = "users_table")
public class usermodel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userId")
    private Long userId;

    private String username;
    private String password;
    private String fname;
    private String lname;
    private String email;
    private String address;
    private String contact;
    private Long userTypeId;
    private Long positionId;
    private String img;
    private Long markAsDeleteId;

    public usermodel() {
        // Default constructor
    }

    public usermodel(Long userId, String username, String password, String fname, String lname, String email, String address, String contact, Long userTypeId, Long positionId, String img, Long markAsDeleteId) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.fname = fname;
        this.lname = lname;
        this.email = email;
        this.address = address;
        this.contact = contact;
        this.userTypeId = userTypeId;
        this.positionId = positionId;
        this.img = img;
        this.markAsDeleteId = markAsDeleteId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFname() {
        return fname;
    }

    public void setFname(String fname) {
        this.fname = fname;
    }

    public String getLname() {
        return lname;
    }

    public void setLname(String lname) {
        this.lname = lname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public Long getUserTypeId() {
        return userTypeId;
    }

    public void setUserTypeId(Long userTypeId) {
        this.userTypeId = userTypeId;
    }

    public Long getPositionId() {
        return positionId;
    }

    public void setPositionId(Long positionId) {
        this.positionId = positionId;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public Long isMarkAsDeleteId() {
        return markAsDeleteId;
    }

    public void setMarkAsDeleteId(Long markAsDeleteId) {
        this.markAsDeleteId = markAsDeleteId;
    }
}
