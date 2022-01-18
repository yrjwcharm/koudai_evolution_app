package com.licaimofang.readcard.bean;

public class IdDetailBean {


    /**
     * idType : 01
     * name : 张三
     * sex : 男
     * nation : 汉
     * birthDate : 19880808
     * address : 北京市朝阳区XX街XX号
     * idnum : XXXXXX19880808XXXX
     * signingOrganization : 北京市公安局朝阳分局
     * beginTime : 20051005
     * endTime : 20151005
     */

    private String idType;
    private String name;
    private String sex;
    private String nation;
    private String birthDate;
    private String address;
    private String idnum;
    private String signingOrganization;
    private String beginTime;
    private String endTime;
    private String picture;


    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public String getIdType() {
        return idType;
    }

    public void setIdType(String idType) {
        this.idType = idType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getNation() {
        return nation;
    }

    public void setNation(String nation) {
        this.nation = nation;
    }

    public String getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getIdnum() {
        return idnum;
    }

    public void setIdnum(String idnum) {
        this.idnum = idnum;
    }

    public String getSigningOrganization() {
        return signingOrganization;
    }

    public void setSigningOrganization(String signingOrganization) {
        this.signingOrganization = signingOrganization;
    }

    public String getBeginTime() {
        return beginTime;
    }

    public void setBeginTime(String beginTime) {
        this.beginTime = beginTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }
}
