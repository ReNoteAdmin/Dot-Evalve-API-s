
const moment = require('moment');
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname + '/.env') });
var nodemailer = require('nodemailer');
var passVal = require('password-validator');
const reader = require('xlsx')
const axios = require("axios");
const md5 = require("md5");
// Defines End
// imports
const { send_mail_to_user } = require('../sendmail');
const { create_division, successResponse, errorResponse, mysql_real_escape_string, getAllChildDiviesions, getAllClassByParentId, getClassFromCode, getDatafromCode, getBlobTempPublicUrl, generateOTP, getResult,cleanObject } = require("../function.js");
const fn = require("../function.js");
const { validate } = require('node-cron');

const VERIFICATION_URL = "https://gogagner.com/JustEvelve/"


const teacherLogin = async (req, res) => {
    const email = req.body.email || "";
    const password = req.body.password || "";
    var message = "";
    if (fn.validateData(email)) {
        message = "Email Required.";
        errorResponse(res, message)
    } else if (fn.validateData(password)) {
        message = "Password is  Required.";
        errorResponse(res, message)

    } else {
        try {
            var result = await getResult("SELECT `instituteId`,`teacherId`,`teacherCode`,`fullName`,`isVerified`,`password` FROM  `teacher` WHERE `email`='" + email + "' AND `delete`='0'");
            if (result.length != 0) {
                const otp = generateOTP();
                var data = [{
                    "teacherId": result[0]["teacherId"],
                    "teacherCode": result[0]["teacherCode"],
                    "fullName": result[0]["fullName"],
                    "isVerified": result[0]["isVerified"],
                    "instituteId": result[0]["instituteId"],
                    "otp": otp
                }]
                if (result[0]["isVerified"] == 0) {
                    var html = `Your Verification OTP is ${otp}`
                    send_mail_to_user(email, "verification", html);
                    var updateUserd = await getResult("UPDATE `teacher` SET  `otp`='" + otp + "' WHERE `teacherId`='" + result[0]["teacherId"] + "' AND `delete`='0'");
                    successResponse(res, "Verification OTP send successfully", data)
                } else {
                    if (md5(password) == result[0]["password"]) {
                        successResponse(res, "success", data)
                    } else {
                        errorResponse(res, "Invalid Email Or Password")
                    }
                }
            } else {
                errorResponse(res, "Invalid Email Or Password")
            }
        } catch (error) {
            errorResponse(res, "Something Went Wrong", error)
        }
    }
}


const otpVerifcation = async (req, res) => {
    const otp = req.body.otp || "";
    const teacherId = req.body.teacherId || "";
    if (fn.validateData(otp)) {
        errorResponse(res, "otp Is Required")
    } else if (fn.validateData(teacherId)) {
        errorResponse(res, "teacherId Is Required")

    } else {
        try {
            var checkTeacher = await fn.checkTeacher(teacherId);
            if (checkTeacher.length != 0) {
                var teacher = cleanObject(checkTeacher[0])
                if (teacher["otp"] == otp) {
                    var update = await getResult("UPDATE `user` SET `isVerified`='1' WHERE `userId`='" + teacherId + "' AND `delete`='0'")
                    successResponse(res, "success")
                } else {
                    errorResponse(res, "invalid OTP ")
                }
            } else {
                errorResponse(res, "Invalid Teacher")
            }
        } catch (error) {
            errorResponse(res, "Something Went Wrong", error)
        }
    }
}


const resetTeacherPassword = async (req, res) => {
    const teacherId = req.body.teacherId || "";
    const password = req.body.password || "";
    const confirmPassword = req.body.confirmPassword || "";
    if (fn.validateData(teacherId)) {
        errorResponse(res, "teacherId Is Required")
    } else if (fn.validateData(password)) {
        errorResponse(res, "password Is Required")
    } else if (fn.validateData(confirmPassword)) {
        errorResponse(res, "confirmPassword Is Required")
    } else if (password != confirmPassword) {
        errorResponse(res, "Password Does not Match")
    } else {
        try {
            var check = await fn.checkTeacher(teacherId);
            if (check.length != 0) {
                var update = await getResult("UPDATE `userId` SET `password`='" + md5(password) + "' WHERE `userId`='" + teacherId + "' AND `delete`='0'")
                successResponse(res, "Password Set Successfully")
            } else {
                errorResponse(res, "Invalid Teacher")
            }
        } catch (error) {
            errorResponse(res, "Something Went Wrong", error)
        }
    }
}

const verifyEmail = async(req,res)=>{
    const email = req.body.email ||"";
    if (fn.validateData(email)) {
        errorResponse(res,"email is Required")
    } else {
     try {
        var result = await getResult("SELECT `userId`,`userCode`,`fullName`,`isVerified`,`password` FROM  `teacher` WHERE `email`='" + email + "' AND `delete`='0'");
        if (result.length!= 0) {
            const otp = generateOTP();
            var data = [{
                "teacherId": result[0]["userId"],
                "userCode": result[0]["userCode"],
                "fullName": result[0]["fullName"],
                "isVerified": result[0]["isVerified"],
                
                "otp": otp
            }]
            if (result[0]["isVerified"] == 0) {
                var html = `Your Verification OTP is ${otp}`
                send_mail_to_user(email, "verification", html);
                var updateUserd = await getResult("UPDATE `user` SET  `otp`='" + otp + "' WHERE `userId`='" + result[0]["userId"] + "' AND `delete`='0'");
                successResponse(res, "Verification OTP send successfully", data)
            } else {
                successResponse(res, "success", data)
     
            }
        } else {
            errorResponse(res,"Invalid Email")
        }
     
     } catch (error) {
        errorResponse(res,"Something Went Wrong", error)
     }
        
    }
}
module.exports = {
    verifyEmail,
    resetTeacherPassword,
    otpVerifcation,
    teacherLogin
}

