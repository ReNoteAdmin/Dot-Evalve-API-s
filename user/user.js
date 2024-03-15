/**
 * This code imports various modules and libraries required for the functionality of the program.
 * It imports the following modules:
 * - mysql2: A module for connecting to MySQL databases using promises.
 * - moment: A module for parsing, validating, manipulating, and formatting dates.
 * - path: A module for working with file paths.
 * - dotenv: A module for loading environment variables from a .env file.
 * - nodemailer: A module for sending emails.
 * - password-validator: A module for validating passwords based on customizable rules.
 * - reader: A module for reading Excel files.
 * - axios: A module for making HTTP requests.
 * - md5: A module for generating MD5 hashes.
 * - send_mail_to
 */
//Defines
const moment = require('moment');
const path = require("path");
require('dotenv').config({
   path: path.resolve(__dirname + '/.env')
});
var nodemailer = require('nodemailer');
var passVal = require('password-validator');
const reader = require('xlsx')
const axios = require("axios");
const md5 = require("md5");
// Defines End
// imports
const { send_mail_to_user } = require('../sendmail');
const { create_division, successResponse, errorResponse, mysql_real_escape_string, getAllChildDiviesions, getAllClassByParentId, getClassFromCode, getDatafromCode, getBlobTempPublicUrl, generateOTP, getResult } = require("../function.js");
const fn = require("../function.js");
const azure = require('azure-storage');
const generateUserCode = (userId) => {
   var code = "";
   strlen = ((userId).toString()).length // find length
   for (var i = 0; i < (5 - (strlen)); i++) {
      code += "0";
   }
   // console.log("LM"+code+(userId));
   return "JE" + code + (userId)
}
const generateInstitudeCode = (userId) => {
   var code = "";
   strlen = ((userId).toString()).length // find length
   for (var i = 0; i < (6 - (strlen)); i++) {
      code += "0";
   }
   // console.log("LM"+code+(userId));
   return "JEIT" + code + (userId)
}/**
 * Handles the registration process for a user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns None
 */
const registration = async (req, res) => {
   const email = req.body.email || "";
   const fullName = req.body.fullName || "";
   const os = req.body.os || "";
   const osVersion = req.body.osVersion || "";
   const device = req.body.device || "";
   const appVersion = req.body.appVersion || "";
   const password = req.body.password || "";
   const confirmPassword = req.body.confirmPassword || "";
   var schema = new passVal();
   schema.is().min(8).is().max(100).has().uppercase().has().lowercase().has().digits(1).has().not().spaces();
   var isValPass = schema.validate(password);
   if (email == "" || email == null || email == undefined) {
      errorResponse(res, "email Is Required")
   } else if (os == "" || os == null || os == undefined) {
      errorResponse(res, "os Is Required")
   } else if (osVersion == "" || osVersion == null || osVersion == undefined) {
      errorResponse(res, "osVersion Is Required")
   } else if (fullName == "" || fullName == null || fullName == undefined) {
      errorResponse(res, "fullName Is Required")
   } else if (device == "" || device == null || device == undefined) {
      errorResponse(res, "device Is Required")
   } else if (appVersion == "" || appVersion == null || appVersion == undefined) {
      errorResponse(res, "appVersion Is Required")
   } else if (password == "" || password == null || password == undefined) {
      errorResponse(res, "password Is Required")
   } else if (confirmPassword == "" || confirmPassword == null || confirmPassword == undefined) {
      errorResponse(res, "confirmPassword Is Required")
   } else if (confirmPassword != password) {
      errorResponse(res, "Confirm Password Does Not Match.")
   } else if (isValPass == false) {
      errorResponse(res, "Password Must Be Minimum 8 Digit AND Contain 1 Small ,1 Capital ,1 Numaric And 1 Special Character")
   } else {
      try {
         const otp = generateOTP();
         var result = await getResult("SELECT `userId`,`block`,`userCode` FROM  `user` WHERE `email`='" + email + "' AND `delete`='0'");
         if (result.length != 0) {
            errorResponse(res, "User Already Exist With  Same Email")
         } else {
            var updateUser = await getResult("INSERT INTO  `user` SET `otp`='" + otp + "' ,`loginType`='manual',`loginOs`='" + os + "',`loginOsVersion`='" + osVersion + "',`loginDevice`='" + device + "',`loginAppVersion`='" + appVersion + "', `email`='" + email + "' , `regOs`='" + os + "',`regOsVersion`='" + osVersion + "',`regDevice`='" + device + "',`registeredAppVersion`='" + appVersion + "',`fullName`='" + fullName + "',`password`='" + md5(password) + "'");
            var html = `Your Verification OTP is ${otp}`
            send_mail_to_user(email, "verification", html);
            var code = generateUserCode(updateUser.insertId)
            var updateUserd = await getResult("UPDATE `user` SET  `userCode`='" + code + "' WHERE `userId`='" + updateUser.insertId + "' AND `delete`='0'");
            res.send({
               status: 200,
               "message": "Success",
               "otp": otp,
               "code": code,
               "userId": updateUser.insertId
            })
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
/**
 * Handles the login functionality by checking the provided email and password against the database.
 * @param {Object} req - The request object containing the email and password in the body.
 * @param {Object} res - The response object to send the login result.
 * @returns None
 */
const login = async (req, res) => {
   const email = req.body.email || "";
   const password = req.body.password || "";
   var message = "";
   if (email.trim() == '' || email.trim() == 'null' || email.trim() == undefined) {
      message = "Email Required.";
      errorResponse(res, message)
   } else if (password.trim() == '' || password.trim() == 'null' || password.trim() == undefined) {
      message = "Password Required";
      errorResponse(res, message)
   } else {
      try {
         var result = await getResult("SELECT `permissions`,`userId`,`block`,`userCode`,`fullName`,`isVerified`,`loginType`,`isTeacher`,`instituteId` FROM  `user` WHERE `email`='" + email + "' AND `password`='" + md5(password) + "' AND `delete`='0'");
         if (result.length != 0) {
            if (result[0]["block"] == 0) {
               if (result[0]["isVerified"] == 0) {
                  const otp = generateOTP();
                  var html = `Your Verification OTP is ${otp}`
                  send_mail_to_user(email, "verification", html);
                  var updateUserd = await getResult("UPDATE `user` SET  `otp`='" + otp + "' WHERE `userId`='" + result[0]["userId"] + "' AND `delete`='0'");
               }
               res.send({
                  "status": 200,
                  "message": "Login Successfull",
                  "userId": result[0]["userId"],
                  "userCode": result[0]["userCode"],
                  "fullName": result[0]["fullName"],
                  "isVerified": result[0]["isVerified"],
                  "loginType": result[0]["loginType"],
                  "isTeacher": result[0]["isTeacher"],
                  "instituteId": result[0]["instituteId"],
                  "permission": await fn.teachersPermission(result[0]["permissions"] || ""),
               })
            } else {
               errorResponse(res, "Your Account is Blocked By Admin.")
            }
         } else {
            errorResponse(res, "Invalid Email Or Password")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const resetPassword = async (req, res) => {
   const userId = req.body.userId || ""
   const password = req.body.password || ""
   const confirmpassword = req.body.confirmpassword || ""
   var schema = new passVal();
   schema.is().min(8).is().max(100).has().uppercase().has().lowercase().has().digits(1).has().not().spaces();
   var isValPass = schema.validate(password);
   if (userId == null || userId == undefined || userId == "") {
      errorResponse(res, "userId Is Required")
   } else if (password == "" || password == null || password == undefined) {
      errorResponse(res, "password Is Required")
   } else if (isValPass == false) {
      errorResponse(res, "Password Must Be Minimum 8 max 100 character ,Must containe  1 small character , 1 capital character,1 numaric")
   } else if (password != confirmpassword) {
      errorResponse(res, "Confirm Password Does not Match")
   } else {
      try {
         var result = await getResult("SELECT `userId`,`block` FROM  `user` WHERE `userId`='" + userId + "' AND `delete`='0'");
         if (result.length != 0) {
            if (result[0]["block"] == 0) {
               await getResult("UPDATE `user` SET `password`='" + md5(password) + "' WHERE `userId`='" + userId + "'  AND `delete`='0'");
               res.send({
                  status: 200,
                  "message": "Success",
                  "userId": result[0]["userId"]
               })
            } else {
               errorResponse(res, "Your Account Has been Blocked By Authorities")
            }
         } else {
            errorResponse(res, "Invalid User")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const verifyOTP = async (req, res) => {
   const userId = req.body.userId || "";
   const otp = req.body.otp || "";
   if (userId == "" || userId == null || userId == undefined) {
      errorResponse(res, "userId Is Required")
   } else if (otp == "" || otp == null || otp == undefined) {
      errorResponse(res, "otp Is Required")
   } else {
      try {
         var result = await getResult("SELECT `userId`,`block` FROM  `user` WHERE `userId`='" + userId + "' AND `otp`='" + otp + "'AND `delete`='0'");
         if (result.length != 0) {
            var updateUser = await getResult("UPDATE `user` SET `isVerified`='1' WHERE `userId`='" + userId + "' AND `delete`='0'");
            successResponse(res, "success")
         } else {
            errorResponse(res, "Invalid Otp")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const forgetpassword = async (req, res) => {
   const email = req.body.email || ""
   if (email == null || email == undefined || email == "") {
      errorResponse(res, "email is Required")
   } else {
      try {
         var result = await getResult("SELECT `userId`,block FROM  `user` WHERE `email`='" + email + "' AND `delete`='0'");
         if (result.length != 0) {
            if (result[0]["block"] == 0) {
               const otp = generateOTP();
               var html = `Your Verification OTP is ${otp}`
               send_mail_to_user(email, "verification", html);
               await getResult("UPDATE `user` SET `otp` = '" + otp + "'  WHERE `userId`='" + result[0]["userId"] + "' AND `delete`='0'");
               res.send({
                  status: 200,
                  "message": "Suceess",
                  otp: otp,
                  "userId": result[0]["userId"]
               })
            } else {
               errorResponse(res, "Your Account is Blocked By Authorities")
            }
         } else {
            errorResponse(res, "Invalid Email")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const allCountry = async (req, res) => {
   try {
      var result = await getResult("SELECT  `name` AS `countryName`, `id` AS  `countryId` FROM `countries` ORDER BY  `name` ASC");
      res.send({
         status: 200,
         "message": "Success",
         data: result
      })
   } catch (error) {
      errorResponse(res, "Something Went Wrong", error)
   }
}
const allState = async (req, res) => {
   const countryId = req.body.countryId || "";
   if (countryId == "" || countryId == undefined || countryId == null) {
      errorResponse(res, "countryId is Required.",)
   } else {
      try {
         var result = await getResult("SELECT `name` AS `stateName`, `id` AS `stateId`,`iso2` FROM `states` WHERE `country_id` = '" + countryId + "' ORDER BY `name`   ");
         res.send({
            status: 200,
            "message": "Success",
            length: result.length,
            data: result
         })
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
// step-1 
const addInstituteDetails = async (req, res) => {
   const instituteName = req.body.instituteName || "";
   const email = req.body.email || "";
   const userId = req.body.userId || ""
   const countryId = req.body.countryId || "";
   const mobileNumber = req.body.mobileNumber || "";
   if (instituteName == "" || instituteName == undefined || instituteName == null) {
      errorResponse(res, "instituteName Is Required.",)
   } else if (email == "" || email == undefined || email == null) {
      errorResponse(res, "email Is Required.",)
   } else if (countryId == "" || countryId == undefined || countryId == null) {
      errorResponse(res, "countryId Is Required.",)
   } else if (mobileNumber == "" || mobileNumber == undefined || mobileNumber == null) {
      errorResponse(res, "mobileNumber Is Required.",)
   } else if (userId == "" || userId == undefined || userId == null) {
      errorResponse(res, "userId Is Required.",)
   } else {
      try {
         var result = await getResult("SELECT * FROM `institute` WHERE `email`='" + email + "' AND `delete`='0'");
         if (result.length != 0) {
            errorResponse(res, "Institude Already Exist With This Email",)
         } else {
            const otp = generateOTP()
            var insert = await getResult("INSERT INTO  `institute` SET `name`='" + mysql_real_escape_string(instituteName) + "',`email`='" + email + "',`mobileNumber`='" + mobileNumber + "',`countryId`='" + countryId + "',`createdBy`='" + userId + "' ,`otp`='" + otp + "'");
            var completedSteps = [{
               "instituteDetails": true,
               "headOfficeDetails": false,
               "selectStates": false,
               "selectZones": false,
               "selectCampus": false,
               "selectDepartment": false
            }]
            var instituteCode = generateInstitudeCode(insert.insertId)
            send_mail_to_user(email, "Institute Verification", "Your Verification Code is " + otp);
            var update = await getResult("UPDATE `institute` SET `instituteCode`='" + instituteCode + "',`completedSteps`='" + JSON.stringify(completedSteps) + "'  WHERE   `instituteId`='" + insert.insertId + "' AND  `delete`='0'");
            res.send({
               status: 200,
               "message": "Success",
               "instituteId": insert.insertId
            })
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
// step-2
const headOfficeDetails = async (req, res) => {
   const headOfficeName = req.body.headOfficeName || "";
   const instituteId = req.body.instituteId || "";
   const designation = req.body.designation || "";
   const address = req.body.address || "";
   const mobileNumber = req.body.mobileNumber || "";
   if (headOfficeName == "" || headOfficeName == undefined || headOfficeName == null) {
      errorResponse(res, "headOfficeName Is Required.",)
   } else if (instituteId == "" || instituteId == undefined || instituteId == null) {
      errorResponse(res, "instituteId Is Required.",)
   } else if (address == "" || address == undefined || address == null) {
      errorResponse(res, "address Is Required.",)
      // } else if (designation == "" || designation == undefined || designation == null) {
      //     errorResponse(res, "designation Is Required.",)
   } else {
      try {
         var result = await getResult("SELECT `completedSteps` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            var completedSteps = JSON.parse(result[0]["completedSteps"])
            completedSteps[0]["headOfficeDetails"] = true;
            var update = await getResult("UPDATE `institute` SET `headOfficeName` ='" + headOfficeName + "', `completedSteps`='" + JSON.stringify(completedSteps) + "' ,`headOfficeMobileNumber` ='" + mobileNumber + "',`designation`='" + designation + "' ,`headOfficeAddress`='" + mysql_real_escape_string(address) + "'WHERE   `instituteId`='" + instituteId + "' AND  `delete`='0'");
            res.send({
               status: 200,
               "message": "Success",
               completedSteps: (completedSteps)
            })
         } else {
            errorResponse(res, "Invalid Institute",)
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
// step-3
const selectStates = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   var stateIdArr = req.body.stateIdArr || []
   if (instituteId == "" || instituteId == undefined || instituteId == null) {
      errorResponse(res, "instituteId Is Required.",)
   } else if (stateIdArr == "" || stateIdArr == undefined || stateIdArr == null) {
      errorResponse(res, "stateIdArr Is Required.",)
   } else {
      try {
         var result = await getResult("SELECT `completedSteps`,`instituteCode` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            var completedSteps = JSON.parse(result[0]["completedSteps"])
            completedSteps[0]["selectStates"] = true;
            await getResult("UPDATE `institute` SET  `completedSteps`='" + JSON.stringify(completedSteps) + "',`states`='" + stateIdArr.toString() + "'  WHERE   `instituteId`='" + instituteId + "' AND  `delete`='0'");
            const tableName = await create_division(result[0]["instituteCode"])
            for (let i = 0; i < stateIdArr.length; i++) {
               const element = stateIdArr[i];
               var checkNoDiv = await getResult("SELECT * FROM `" + tableName + "` WHERE `divisionType`='No Div' AND `parentDivisionType`='0' AND `parentDivisionId`='" + element + "' AND `delete`='0'");
               if (checkNoDiv.length == 0) {
                  var date = new Date().getTime()
                  var code = "DIV" + date;
                  var checkNoDiv = await getResult("INSERT INTO  `" + tableName + "` SET `divisionName`='No Div' , `parentDivisionType`='0' , `parentDivisionId`='" + element + "',`divisionType`='No Div',`divisionCode`='" + code + "'");
               }
            }
            res.send({
               status: 200,
               "message": "Success",
               completedSteps: (completedSteps)
            })
         } else {
            errorResponse(res, "Invalid Institute",)
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const fetchZones = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   if (instituteId == "" || instituteId == undefined || instituteId == null) {
      errorResponse(res, "instituteId Is Required.",)
   } else {
      try {
         var result = await getResult("SELECT `completedSteps` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            var get = await getResult("SELECT  `zone`.`name`,`zoneId`,`stateId`,`zoneCode`,`states`.`name` AS `stateName`,`iso2`  FROM `zone` LEFT JOIN `states` on `zone`.`stateId`= `states`.`id`  WHERE `instituteId`='" + instituteId + "' ");
            for (let i = 0; i < get.length; i++) {
               get[i]["name"] = get[i]["name"] || ""
            }
            res.send({
               "status": 200,
               "message": "suceess",
               data: get
            })
         } else {
            errorResponse(res, "Invalid Institute",)
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const fetchInstituteStates = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   if (instituteId == "" || instituteId == undefined || instituteId == null) {
      errorResponse(res, "instituteId Is Required.")
   } else {
      try {
         var result = await getResult("SELECT `completedSteps`,`states`,`countryId` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            data = []
            if (result[0]["states"] != "" && result[0]["states"] != null) {
               var states = result[0]["states"].split(',');
               for (let i = 0; i < states.length; i++) {
                  var getStates = await getResult("SELECT `name`,`id`,`iso2` FROM  `states`  WHERE `id`='" + states[i] + "' ");
                  data.push(getStates[0])
               }
            }
            res.send({
               "status": 200,
               "message": "suceess",
               data: data,
               countryId: result[0]["countryId"]
            })
         } else {
            errorResponse(res, "Invalid Institute",)
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const addZones = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   const stateIdArr = req.body.stateIdArr || []
   if (instituteId == "" || instituteId == undefined || instituteId == null) {
      errorResponse(res, "instituteId Is Required.",)
   } else {
      try {
         var result = await getResult("SELECT `completedSteps` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            for (let i = 0; i < stateIdArr.length; i++) {
               var date = new Date().getTime()
               var Zone = "ZC" + date;
               await getResult("INSERT INTO `zone` SET `stateId` ='" + stateIdArr[i]["stateId"] + "', `zoneCode`='" + Zone + "' ,`instituteId`='" + instituteId + "',`name`='" + stateIdArr[i]["zoneName"] + "'");
            }
            var completedSteps = JSON.parse(result[0]["completedSteps"])
            completedSteps[0]["selectZones"] = true;
            await getResult("UPDATE `institute` SET  `completedSteps`='" + JSON.stringify(completedSteps) + "'WHERE   `instituteId`='" + instituteId + "' AND  `delete`='0'");
            res.send({
               status: 200,
               "message": "Success",
               completedSteps: (completedSteps)
            })
         } else {
            errorResponse(res, "Invalid Institute",)
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const addCampus = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   const zoneIdArr = req.body.zoneIdArr || [];
   if (instituteId == "" || instituteId == undefined || instituteId == null) {
      errorResponse(res, "instituteId Is Required.",)
   } else {
      try {
         var result = await getResult("SELECT `completedSteps` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            var completedSteps = JSON.parse(result[0]["completedSteps"])
            completedSteps[0]["selectCampus"] = true;
            for (let i = 0; i < zoneIdArr.length; i++) {
               var date = new Date().getTime()
               var Zone = "CC" + date;
               await getResult("INSERT INTO `campus` SET`zoneId` ='" + zoneIdArr[i]["zoneId"] + "' , `campusCode`='" + Zone + "' ,`instituteId`='" + instituteId + "',`campusName`='" + zoneIdArr[i]["campusName"] + "'");
            }
            var completedSteps = JSON.parse(result[0]["completedSteps"])
            completedSteps[0]["selectCampus"] = true;
            await getResult("UPDATE `institute` SET  `completedSteps`='" + JSON.stringify(completedSteps) + "'WHERE   `instituteId`='" + instituteId + "' AND  `delete`='0'");
            res.send({
               status: 200,
               "message": "Success",
               completedSteps: (completedSteps)
            })
         } else {
            errorResponse(res, "Invalid Institute",)
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const addDepartment = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   const departmenArr = req.body.departmenArr || [];
   if (instituteId == "" || instituteId == undefined || instituteId == null) {
      errorResponse(res, "instituteId Is Required.",)
   } else {
      try {
         var result = await getResult("SELECT `completedSteps` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            for (let i = 0; i < departmenArr.length; i++) {
               var date = new Date().getTime()
               var Zone = "DEP" + date;
               await getResult("INSERT INTO `department` SET `campusId` ='" + departmenArr[i]["campusId"] + "', `departmenCode`='" + Zone + "' ,`instituteId`='" + instituteId + "',`departmenName`='" + departmenArr[i]["departmenName"] + "'");
            }
            var completedSteps = JSON.parse(result[0]["completedSteps"])
            completedSteps[0]["selectDepartment"] = true;
            await getResult("UPDATE `institute` SET  `completedSteps`='" + JSON.stringify(completedSteps) + "' WHERE   `instituteId`='" + instituteId + "' AND  `delete`='0'");
            res.send({
               status: 200,
               "message": "Success",
               completedSteps: (completedSteps)
            })
         } else {
            errorResponse(res, "Invalid Institute",)
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const myInstitute = async (req, res) => {
   const userId = req.body.userId || "";
   if (userId == "" || userId == undefined || userId == null) {
      errorResponse(res, "userId Is Required.",)
   } else {
      try {
         const connection = "";
         var check = await getResult("SELECT `fullName`,`userCode`,`userId` FROM `user` WHERE `userId`='" + userId + "'  AND `delete`='0'");
         if (check.length != 0) {
            var result = await getResult("SELECT `completedSteps`,`name`,`isVerified`, `instituteId`,`countryId`,`instituteCode`,(SELECT COUNT(userId) FROM `user` WHERE `instituteId` = `institute`.`instituteId` AND `isTeacher`='2' AND `delete`='0' AND classId!=0 ) AS `noOfStudents` FROM `institute` WHERE `createdBy`='" + userId + "'  AND `delete`='0'");
            var data = []
            if (result.length != 0) {
               for (let i = 0; i < result.length; i++) {
                  var archives = await fn.checkIsArchived(result[i]["instituteId"], 0, userId)
                  result[i]["completedSteps"] = JSON.parse(result[i]["completedSteps"] || "[]");
                  if (archives) {
                     data.push(result[i])
                  }
               }
               res.send({
                  "status": 200,
                  "message": "sucess",
                  "data": data
               })
            } else {
               errorResponse(res, "No Data Avaliable",)
            }
         } else {
            errorResponse(res, "Invalid user",)
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const instituteDetails = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   if (instituteId == "" || instituteId == undefined || instituteId == null) {
      errorResponse(res, "instituteId Is Required.")
   } else {
      try {
         const connection = "";
         var result2 = await getResult("SELECT * FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result2.length != 0) {
            for (let i = 0; i < result2.length; i++) {
               result2[i]["completedSteps"] = JSON.parse(result2[i]["completedSteps"] || "[]");
               stateArr = result2[i]["states"] != null ? result2[i]["states"].split(',') : [];
               data = []
               var instituteCode = await create_division(result2[i]["instituteCode"], connection);
               for (let i = 0; i < stateArr.length; i++) {
                  var result = await getResult("SELECT `id` AS `statesId`,name FROM `states` WHERE `id`='" + stateArr[i] + "' ");
                  if (result.length != 0) {
                     data.push(result[0]);
                  }
               }
               result2[i]["states"] = data
            }
            successResponse(res, "success", result2)
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong.", error)
      }
   }
}
const addDivision = async (req, res) => {
   const parentDivisionType = req.body.parentDivisionType || 0; ///0= state 1 = division
   const divisionName = req.body.divisionName || "";
   const instituteId = req.body.instituteId || "";
   const parentDivisionId = req.body.parentDivisionId || "";
   const divisionType = req.body.divisionType || "";
   if (instituteId == "" || instituteId == undefined || instituteId == null) {
      errorResponse(res, "instituteId Is Required.")
   } else if (divisionName == "" || divisionName == undefined || divisionName == null) {
      errorResponse(res, "divisionName Is Required.")
   } else if (parentDivisionId == "" || parentDivisionId == undefined || parentDivisionId == null) {
      errorResponse(res, "parentDivisionId Is Required.")
   } else if (parentDivisionType == "" || parentDivisionType == undefined || parentDivisionType == null) {
      errorResponse(res, "parentDivisionType Is Required.")
   } else if (divisionType == "" || divisionType == undefined || divisionType == null) {
      errorResponse(res, "divisionType Is Required.")
   } else {
      try {
         const connection = ""
         var result = await getResult("SELECT `completedSteps`,`instituteCode` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            var instituteCode = await create_division(result[0]["instituteCode"], connection);
            var date = new Date().getTime()
            var code = "DIV" + date;
            var check = await getResult("SELECT * FROM  `" + instituteCode + "` WHERE LOWER(`divisionName`)='" + (divisionName).toLowerCase() + "' AND `delete`='0' ")
            if (check.length == 0) {
               var insert = await getResult("INSERT INTO `" + instituteCode + "` SET `parentDivisionType`='" + parentDivisionType + "',`parentDivisionId`='" + parentDivisionId + "',`divisionName`='" + divisionName + "',`divisionCode`='" + code + "',`divisionType`='" + divisionType + "' ")
               successResponse(res, "success", insert.insertId)
            } else {
               errorResponse(res, "Division Already Exist with This Name")
            }
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const InstituteHirarchy = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   if (instituteId == "" || instituteId == undefined || instituteId == null) {
      errorResponse(res, "instituteId Is Required.")
   } else {
      try {
         const connection = "";
         var result = await getResult("SELECT `completedSteps`,`instituteCode` ,`states`FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            var data = []
            var stateArr = ((result[0]["states"] != null && result[0]["states"] != "") ? result[0]["states"].split(',') : []);
            var instituteCode = await create_division(result[0]["instituteCode"], connection);
            if (stateArr.length != 0) {
               for (let i = 0; i < stateArr.length; i++) {
                  const element = stateArr[i];
                  var objs = await getAllChildDiviesions(instituteCode, connection, 0, stateArr[i])
                  objs.forEach(element => {
                     data.push(element)
                  });
               }
               successResponse(res, "success", data)
            } else {
               errorResponse(res, "No Data Avaliable")
            }
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const getAllDiv = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   if (instituteId == "" || instituteId == undefined || instituteId == null) {
      errorResponse(res, "instituteId Is Required.")
   } else {
      try {
         const connection = "";
         var result = await getResult("SELECT `completedSteps`,`instituteCode` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            var instituteCode = await create_division(result[0]["instituteCode"], connection);
            var data = await getAllChildDiviesions(instituteCode, connection, 0, 0)
            successResponse(res, "success", data,)
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const addClass = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   const divisionId = req.body.divisionId || "";
   const divisionType = req.body.divisionType || ""; //0=state 1= division
   const className = req.body.className || "";
   const classCode = req.body.classCode || "";
   const userId = req.body.userId || "";
   const studentArr = req.body.studentArr || [];
   if (instituteId == "" || instituteId == undefined || instituteId == null) {
      errorResponse(res, "instituteId Is Required.")
   } else if (divisionId == "" || divisionId == undefined || divisionId == null) {
      errorResponse(res, "divisionId Is Required.")
   } else if (divisionType == "" || divisionType == undefined || divisionType == null) {
      errorResponse(res, "divisionType Is Required.")
   } else if (className == "" || className == undefined || className == null) {
      errorResponse(res, "className Is Required.")
   } else if (classCode == "" || classCode == undefined || classCode == null) {
      errorResponse(res, "classCode Is Required.")
   } else if (userId == "" || userId == undefined || userId == null) {
      errorResponse(res, "userId Is Required.")
   } else {
      try {
         const connection = ""
         var result = await getResult("SELECT `completedSteps`,`instituteCode` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            var classData = await getClassFromCode(classCode, instituteId, connection);
            if (classData.length != 0) {
               errorResponse(res, "Class Code Is  Already Registerd")
            } else {
               var insert = await getResult("INSERT INTO `class` SET `instituteId`='" + instituteId + "',	`className`='" + className + "',`divisionId`='" + divisionId + "',	`divisionType` ='" + divisionType + "',`createdBy`='" + userId + "',`classCode`='" + classCode + "'");
               if (studentArr.length != 0) {
                  for (let i = 0; i < studentArr.length; i++) {
                     var result = await getResult("SELECT `studentId` FROM `student` WHERE `studentId`='" + studentArr[i] + "' AND `delete`='0' AND `instituteId`='" + instituteId + "' ")
                     if (result.length != 0) {
                        await getResult(" UPDATE `student` SET  `classId`='" + insert.insertId + "' WHERE `studentId`='" + result[0]["studentId"] + "'");
                     }
                  }
               }
               successResponse(res, "success", insert.insertId)
            }
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const addStudent = async (req, res) => {
   const classCode = req.body.classCode || "";
   const fullName = req.body.fullName || "";
   const mobileNumber = req.body.mobileNumber || "";
   const email = req.body.email || "";
   const rollNumber = req.body.rollNumber || "";
   const userId = req.body.userId || "";
   const instituteId = req.body.instituteId || "";
   const password = req.body.password || ""
   const cpassword = password
   if (classCode == null || classCode == "" || classCode == undefined) {
      errorResponse(res, "classCode is required",)
   } else if (fullName == null || fullName == "" || fullName == undefined) {
      errorResponse(res, "fullName is required",)
      // } else if (mobileNumber == null || mobileNumber == "" || mobileNumber == undefined) {
      //     errorResponse(res, "mobileNumber is required",)
   } else if (email == null || email == "" || email == undefined) {
      errorResponse(res, "email is required",)
   } else if (rollNumber == null || rollNumber == "" || rollNumber == undefined) {
      errorResponse(res, "rollNumber is required",)
   } else if (userId == null || userId == "" || userId == undefined) {
      errorResponse(res, "userId is required",)
   } else if (instituteId == null || instituteId == "" || instituteId == undefined) {
      errorResponse(res, "instituteId is required",)
   } else if (fn.validateData(password)) {
      errorResponse(res, "password is required",)
   } else if (fn.validateData(cpassword)) {
      errorResponse(res, "Confirm password is required",)
   } else if (password !== cpassword) {
      errorResponse(res, "Password Does Not Match",)
   } else {
      try {
         var result = await getResult("SELECT `completedSteps`,`instituteCode` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            var classData = await getClassFromCode(classCode, instituteId, connection = "");
            if (classData.length != 0) {
               var check = await getResult("SELECT userId FROM `user` WHERE `email`='" + email + "' AND `delete`='0' ");
               if (check.length == 0) {
                  var insert = await getResult("INSERT INTO `user` SET  `fullName`='" + fullName + "',`mobileNumber`='" + mobileNumber + "',`email`='" + email + "',`rollNumber`='" + rollNumber + "', `classId`='" + classData[0]["classId"] + "',`isTeacher`='2', `instituteId`='" + instituteId + "',`password`='" + md5(password) + "'")
                  var code = generateUserCode(insert.insertId)
                  var updateUserd = await getResult("UPDATE `user` SET  `userCode`='" + code + "' WHERE `userId`='" + insert.insertId + "' AND `delete`='0'");
                  successResponse(res, "success", insert.insertId)
               } else {
                  errorResponse(res, "Student Already Registerd With Your Institute",)
               }
            } else {
               errorResponse(res, "Invalid Class  Code",)
            }
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const addTeacher = async (req, res) => {
   const structureCode = req.body.structureCode || "";
   const fullName = req.body.fullName || "";
   const mobileNumber = req.body.mobileNumber || "";
   const email = req.body.email || "";
   const instituteId = req.body.instituteId || "";
   const password = req.body.password || ""
   const cpassword = password
   if (structureCode == null || structureCode == "" || structureCode == undefined) {
      errorResponse(res, "structureCode is required",)
   } else if (fullName == null || fullName == "" || fullName == undefined) {
      errorResponse(res, "fullName is required",)
      // } else if (mobileNumber == null || mobileNumber == "" || mobileNumber == undefined) {
      //     errorResponse(res, "mobileNumber is required",)
   } else if (email == null || email == "" || email == undefined) {
      errorResponse(res, "email is required",)
   } else if (instituteId == null || instituteId == "" || instituteId == undefined) {
      errorResponse(res, "instituteId is required",)
   } else if (fn.validateData(password)) {
      errorResponse(res, "password is required",)
   } else if (fn.validateData(cpassword)) {
      errorResponse(res, "Confirm password is required",)
   } else if (password !== cpassword) {
      errorResponse(res, "Password Does Not Match",)
   } else {
      try {
         var result = await fn.checkInstitute(instituteId);
         if (result.length != 0) {
            var data = await getDatafromCode(structureCode, instituteId, result[0]["instituteCode"], "");
            if (data.length != 0) {
               var type = data[0]["type"];
               if (type == "division" || type == "class") {
                  var check = await getResult("SELECT * FROM `user` WHERE `delete`='0' AND `email`='" + email + "'");
                  if (check.length == 0) {
                     var teacherArr = []
                     var date = new Date().getTime()
                     var teacherCode = 'TECHER' + date;
                     var insert = await getResult("INSERT INTO `user` SET `fullName`='" + fullName + "',`mobileNumber`='" + mobileNumber + "',`email`='" + email + "',`userCode`='" + teacherCode + "',`isTeacher`='1',`instituteId`='" + instituteId + "',`password`='" + md5(password) + "'")
                     const teacherId = insert.insertId
                     var insert = await getResult("INSERT INTO `teacherdepartment` SET `divisionId`='" + data[0][type + "Id"] + "',`divisionType`='" + type + "',	`instituteId`='" + instituteId + "',`userId`='" + teacherId + "'")
                     successResponse(res, "success", insert.insertId)
                  } else {
                     if (check[0]["isTeacher"] == 1) {
                        var teacherId = (check[0]["userId"]);
                        var checkDivision = await getResult("SELECT * FROM `teacherdepartment` WHERE `divisionId`='" + data[0][type + "Id"] + "'AND `divisionType`='" + data[0][type] + "' AND `instituteId`='" + instituteId + "'  AND `userId`='" + teacherId + "' AND `delete`='0'  ");
                        if (checkDivision.length == 0) {
                           var checkDivision = await getResult("INSERT INTO  teacherdepartment SET  `divisionId`='" + data[0][type + "Id"] + "', `divisionType`='" + data[0][type] + "' , `instituteId`='" + instituteId + "' ,`userId`='" + teacherId + "'  ");
                        }
                        successResponse(res, "success")
                     } else {
                        errorResponse(res, "This user Cannot be added as Teacher.")
                     }
                  }
               } else {
                  errorResponse(res, "No division or class found With This Code in Your Institute",)
               }
            } else {
               errorResponse(res, "No division or class found With This Code in Your Institute",)
            }
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const checkCode = async (req, res) => {
   const classCode = req.body.classCode || "";
   const instituteId = req.body.instituteId || "";
   try {
      const connection = '';
      var result = await getResult("SELECT `completedSteps`,`instituteCode` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
      if (result.length != 0) {
         var data = await getDatafromCode(classCode, instituteId, result[0]["instituteCode"], connection)
         successResponse(res, "success", data)
      } else {
         errorResponse(res, "Invalid Institute")
      }
   } catch (error) {
      errorResponse(res, "Something Went Wrong", error)
   }
}
const saveExcelFile = async (req, res) => {
   if (req.file == null || req.file == undefined || req.file == "") {
      res.send({
         "status": 400,
         "message": "file Is Required"
      })
   } else {
      var profile = req.file.url;
      res.send({
         "status": 200,
         "message": "Success",
         "url": (profile)
      })
   }
}
const multiStudentRegistration = async (req, res) => {
   const instituteId = req.body.instituteId;
   const url = req.body.filePath;
   var userId = req.body.userId;
   if (userId == null || userId == "" || userId == undefined) {
      errorResponse(res, "userId is required",)
   } else if (instituteId == null || instituteId == "" || instituteId == undefined) {
      errorResponse(res, "instituteId is required",)
   } else {
      try {
         var result = await getResult("SELECT `completedSteps`,`instituteCode` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            // reader code start 
            const options = { /// do not change these variables
               url,
               responseType: "arraybuffer"
            }
            let axiosResponse = await axios(options);
            const workbook = reader.read(axiosResponse.data);
            let worksheets = workbook.SheetNames.map(sheetName => {
               return {
                  sheetName,
                  data: reader.utils.sheet_to_json(workbook.Sheets[sheetName])
               };
            });
            const data = worksheets[0].data; // hear you will get all data of Your sheet
            // end
            var ExistingData = []
            var invalidClass = []
            if (data.length != 0) {
               for (let i = 0; i < data.length; i++) {
                  var FullName = data[i]["FullName"];
                  var Email = data[i]["Email"];
                  var MobileNumber = data[i]["MobileNumber"];
                  var ClassCode = data[i]["ClassCode"];
                  var RollNumber = data[i]["RollNumber"];
                  const result = await getResult("SELECT `userId` FROM `user` WHERE `email`='" + Email + "' AND `delete`='0' AND `instituteId`='" + instituteId + "' AND `isTeacher`='2' ")
                  if (result.length == 0) {
                     var classData = await getClassFromCode(ClassCode, instituteId, connection = '');
                     var date = new Date().getTime()
                     var studentCode = 'STUDENT' + date
                     if (classData.length != 0) {
                        var insert = await getResult("INSERT INTO `user` SET `mobileNumber`='" + MobileNumber + "',`fullName`='" + (FullName).trim() + "',`email`='" + Email + "', `classId`='" + classData[0]["classId"] + "',`rollNumber`='" + RollNumber + "',`instituteId`='" + instituteId + "', `isTeacher`='2' ");
                        var code = generateUserCode(insert.insertId)
                        var updateUserd = await getResult("UPDATE `user` SET  `userCode`='" + code + "' WHERE `userId`='" + insert.insertId + "' AND `delete`='0'");
                        // successResponse(res, "success", insert.insertId)
                     } else {
                        invalidClass.push(data[i])
                     }
                  } else {
                     ExistingData.push(data[i])
                  }
               }
               const erroredData = {
                  invalidClass: invalidClass,
                  ExistingData
               }
               successResponse(res, "success", erroredData)
            } else {
               errorResponse(res, "Cannot Import Empty Sheet")
            }
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something went wrong", error)
      }
   }
}
const addMultiDivision = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   const divisionArr = req.body.divisionArr || []
   if (instituteId == "" || instituteId == undefined || instituteId == null) {
      errorResponse(res, "instituteId Is Required.")
   } else {
      try {
         const connection = "";
         var result = await getResult("SELECT `completedSteps`,`instituteCode` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            var instituteCode = await create_division(result[0]["instituteCode"], connection);
            if (divisionArr.length != 0) {
               for (let i = 0; i < divisionArr.length; i++) {
                  var parentDivisionType = divisionArr[i]["parentDivisionType"]
                  var parentDivisionId = divisionArr[i]["parentDivisionId"]
                  var divisionName = divisionArr[i]["divisionName"]
                  var divisionType = divisionArr[i]["divisionType"]
                  var date = new Date().getTime()
                  var code = "DIV" + date;
                  var check = await getResult("SELECT * FROM  `" + instituteCode + "` WHERE `divisionName`='" + (divisionName) + "'  AND `delete`='0' ")
                  if (check.length == 0) {
                     await getResult("INSERT INTO `" + instituteCode + "` SET `parentDivisionType`='" + parentDivisionType + "',`parentDivisionId`='" + parentDivisionId + "',`divisionName`='" + divisionName + "',`divisionCode`='" + code + "',`divisionType`='" + divisionType + "'  ")
                  } else {
                     await getResult("UPDATE `" + instituteCode + "` SET `parentDivisionType`='" + parentDivisionType + "',`parentDivisionId`='" + parentDivisionId + "',`divisionName`='" + divisionName + "',`divisionCode`='" + code + "',`divisionType`='" + divisionType + "' WHERE `divisionId`='" + check[0]["divisionId"] + "' ")
                  }
               }
            }
            successResponse(res, "success",)
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const multiTeacherRegistration = async (req, res) => {
   const instituteId = req.body.instituteId;
   const url = req.body.filePath;
   const userId = req.body.userId;
   if (userId == null || userId == "" || userId == undefined) {
      errorResponse(res, "userId is required",)
   } else if (instituteId == null || instituteId == "" || instituteId == undefined) {
      errorResponse(res, "instituteId is required",)
   } else {
      try {
         var result = await fn.checkInstitute(instituteId)
         if (result.length != 0) {
            // reader code start 
            const options = { /// do not change these variables
               url,
               responseType: "arraybuffer"
            }
            let axiosResponse = await axios(options);
            const workbook = reader.read(axiosResponse.data);
            let worksheets = workbook.SheetNames.map(sheetName => {
               return {
                  sheetName,
                  data: reader.utils.sheet_to_json(workbook.Sheets[sheetName])
               };
            });
            const data = worksheets[0].data; // hear you will get all data of Your sheet
            // end
            var ExistingData = []
            var invalidClass = []
            if (data.length != 0) {
               for (let i = 0; i < data.length; i++) {
                  var FullName = data[i]["FullName"];
                  var Email = data[i]["Email"];
                  var MobileNumber = data[i]["MobileNumber"];
                  var structureCode = data[i]["structureCode"];
                  var typedata = await getDatafromCode(structureCode, instituteId, result[0]["instituteCode"], "");
                  if (typedata.length != 0) {
                     var type = typedata[0]["type"];
                     if (type == "division" || type == "class") {
                        const check = await getResult("SELECT * FROM `user` WHERE `delete`='0' AND `email`='" + Email + "'  ");
                        if (check.length == 0) {
                           var teacherArr = []
                           var date = new Date().getTime()
                           var teacherCode = 'TECHER' + date;
                           var insert = await getResult("INSERT INTO `user` SET `fullName`='" + FullName + "',`mobileNumber`='" + MobileNumber + "',`email`='" + Email + "',`userCode`='" + teacherCode + "',`instituteId`='" + instituteId + "',`isTeacher`='1'")
                           const teacherId = insert.insertId
                           var insert = await getResult("INSERT INTO `teacherdepartment` SET `divisionId`='" + typedata[0][type + "Id"] + "',`divisionType`='" + type + "',	`instituteId`='" + instituteId + "',`userId`='" + teacherId + "'")
                        } else {
                           // console.log(check);
                           ExistingData.push(data[i])
                        }
                     }
                  } else {
                     invalidClass.push(data[i])
                  }
               }
               successResponse(res, "success", {
                  invalidClass: invalidClass,
                  ExistingData: ExistingData
               })
            } else {
               errorResponse(res, "Cannot Import Empty Sheet")
            }
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const viewStudent = async (req, res) => {
   const body = fn.cleanObject(req.body)
   const instituteId = body.instituteId;
   const userId = body.user || ""
   const type = body.type || ""; // 'fullName' 'rollNumber' 
   const orderBy = body.orderBy || "ASC"; // 'ASC' 'DESC' 
   const typeFields = ['fullName', 'rollNumber']
   const orderByFields = ['ASC', 'DESC']
   if (instituteId == null || instituteId == "" || instituteId == undefined) {
      errorResponse(res, "instituteId is required",)
   } else {
      try {
         var resARrr = []
         var where = "";
         if (!fn.validateData(type)) {
            where += " ORDER BY  `" + type + "`  " + orderBy
         }
         var result = await getResult("SELECT `completedSteps`,`instituteCode` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            var data = await getResult("SELECT fullName, `userId` AS `studentId` ,`rollNumber`,`userCode` AS  `studentCode`,`classId`,(SELECT `className` FROM `class` WHERE `classId` =`user`.`classId` AND `delete`='0')  AS `className` FROM `user` WHERE `instituteId`='" + instituteId + "' AND `classId` !='0' AND `isTeacher`='2' " + where)
            for (let i = 0; i < data.length; i++) {
               const element = fn.cleanObject(data[i]);
               var check = await fn.checkIsArchived(element["studentId"], 1, userId);
               if (check) {
                  resARrr.push(element)
               }
            }
            successResponse(res, "success", resARrr,)
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const viewTeacher = async (req, res) => {
   const instituteId = req.body.instituteId;
   const userId = req.body.userId || "";
   if (instituteId == null || instituteId == "" || instituteId == undefined) {
      errorResponse(res, "instituteId is required",)
   } else {
      try {
         var result = await fn.checkInstitute(instituteId);
         if (result.length != 0) {
            var resARrr = []
            var data = await getResult("SELECT DISTINCT `teacherdepartment`. `userId` AS `teacherId`,`fullName`,userCode AS `teacherCode` FROM `teacherdepartment` LEFT JOIN `user` ON user.userId = `teacherdepartment`.`userId` WHERE  `user`.`instituteId`='" + instituteId + "' AND `teacherdepartment`.`delete`='0' ")
            for (let i = 0; i < data.length; i++) {
               const element = fn.cleanObject(data[i]);
               var check = await fn.checkIsArchived(element["teacherId"], 2, userId);
               if (check) {
                  resARrr.push(element)
               }
            }
            successResponse(res, "success", resARrr,)
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const updateZones = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   const stateIdArr = req.body.stateIdArr || []
   if (instituteId == "" || instituteId == undefined || instituteId == null) {
      res.send({
         status: 400,
         "message": "instituteId Is Required."
      })
   } else {
      try {
         var result = await getResult("SELECT `completedSteps` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            for (let i = 0; i < stateIdArr.length; i++) {
               var check = await getResult("SELECT `zoneId` FROM `zone` WHERE `instituteId`='" + instituteId + "' AND `zoneId`='" + stateIdArr[i]["zoneId"] + "'");
               if (check.length != 0) {
                  await getResult("UPDATE `zone` SET `stateId` ='" + stateIdArr[i]["stateId"] + "' ,`instituteId`='" + instituteId + "',`name`='" + stateIdArr[i]["zoneName"] + "' WHERE `instituteId`='" + instituteId + "' AND `zoneId`='" + stateIdArr[i]["zoneId"] + "'");
               } else {
                  var date = new Date().getTime()
                  var Zone = "ZC" + date;
                  await getResult("INSERT INTO `zone` SET `stateId` ='" + stateIdArr[i]["stateId"] + "', `zoneCode`='" + Zone + "' ,`instituteId`='" + instituteId + "',`name`='" + stateIdArr[i]["zoneName"] + "'");
               }
            }
            successResponse(res, "Success")
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const updateCampus = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   const zoneIdArr = req.body.zoneIdArr || [];
   if (instituteId == "" || instituteId == undefined || instituteId == null) {
      errorResponse(res, "instituteId Is Required.",)
   } else {
      try {
         const connection = ""
         var result = await getResult("SELECT `completedSteps` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            for (let i = 0; i < zoneIdArr.length; i++) {
               var check = await getResult("SELECT `campusId` FROM  `campus`  WHERE `campusId` ='" + zoneIdArr[i]["campusId"] + "' AND `instituteId`='" + instituteId + "'");
               if (check.length != 0) {
                  await getResult("UPDATE `campus` SET `zoneId` ='" + zoneIdArr[i]["zoneId"] + "' ,`campusName`='" + zoneIdArr[i]["campusName"] + "' WHERE `campusId` ='" + zoneIdArr[i]["campusId"] + "' AND `instituteId`='" + instituteId + "'");
               } else {
                  var date = new Date().getTime()
                  var Zone = "CC" + date;
                  await getResult("INSERT INTO `campus` SET`zoneId` ='" + zoneIdArr[i]["zoneId"] + "' , `campusCode`='" + Zone + "' ,`instituteId`='" + instituteId + "',`campusName`='" + zoneIdArr[i]["campusName"] + "'");
               }
            }
            successResponse(res, "success")
         } else {
            errorResponse(res, "Invalid Institute",)
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const updateDepartment = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   const departmenArr = req.body.departmenArr || [];
   if (instituteId == "" || instituteId == undefined || instituteId == null) {
      errorResponse(res, "instituteId Is Required.",)
   } else {
      try {
         var result = await getResult("SELECT `completedSteps` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            for (let i = 0; i < departmenArr.length; i++) {
               var check = await getResult("SELECT `departmentId` FROM   `department` WHERE `instituteId`='" + instituteId + "' AND `departmentId`='" + departmenArr[i]["departmentId"] + "'");
               if (check.length != 0) {
                  await getResult("UPDATE `department` SET `campusId` ='" + departmenArr[i]["campusId"] + "' , `departmenName`='" + departmenArr[i]["departmenName"] + "'WHERE   `departmentId`='" + departmenArr[i]["departmentId"] + "' AND `instituteId`='" + instituteId + "'");
               } else {
                  var date = new Date().getTime()
                  var Zone = "DEP" + date;
                  await getResult("INSERT INTO `department` SET `campusId` ='" + departmenArr[i]["campusId"] + "', `departmenCode`='" + Zone + "' ,`instituteId`='" + instituteId + "',`departmenName`='" + departmenArr[i]["departmenName"] + "'");
               }
            }
            successResponse(res, "success")
         } else {
            errorResponse(res, "Invalid Institute",)
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const allParents = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   const keyword = req.body.keyword || "";
   if (instituteId == "" || instituteId == undefined || instituteId == null) {
      res.send({
         status: 400,
         "message": "instituteId Is Required."
      })
   } else {
      try {
         const connection = "";
         var result = await getResult("SELECT `completedSteps`,`instituteCode` ,`states`FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            var data = [];
            var stateArr = ((result[0]["states"] != null && result[0]["states"] != "") ? result[0]["states"].split(',') : []);
            var instituteCode = await create_division(result[0]["instituteCode"], connection);
            if (stateArr.length != 0) {
               for (let i = 0; i < stateArr.length; i++) {
                  var result = await getResult("SELECT  `divisionType`,`divisionCode`,`divisionId` FROM `" + instituteCode + "` WHERE `delete`='0' GROUP BY `divisionType` ORDER BY divisionId  ");
               }
               successResponse(res, "success", result)
            } else {
               errorResponse(res, "No Data Avaliable")
            }
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const getAllParentsByKeyWord = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   const keyword = req.body.keyword || "";
   if (instituteId == null || instituteId == undefined || instituteId == "") {
      errorResponse(res, "instituteId is Required")
   } else if (keyword == null || keyword == undefined || keyword == "") {
      errorResponse(res, "keyword is Required")
   } else {
      try {
         const connection = ""
         var result = await getResult("SELECT `completedSteps`,`instituteCode` ,`states`FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            if (keyword.toLowerCase() == 'state') {
               data = []
               var stateArr = ((result[0]["states"] != null && result[0]["states"] != "") ? result[0]["states"].split(',') : []);
               for (let i = 0; i < stateArr.length; i++) {
                  var states = await getResult(" SELECT `name` AS `divisionName`, `id` AS `divisionId`,`iso2` AS `divisionCode` FROM `states`  WHERE `id`='" + stateArr[i] + "'  ");
                  if (states.length != 0) {
                     states[0][`divisionType`] = '',
                        states[0][`parentDivisionType`] = '0'
                     states[0][`parentDivisionId`] = '0'
                     states[0]["state"] = []
                     data.push(states[0])
                  }
               }
               successResponse(res, "success", data)
            } else {
               var data = [];
               var instituteCode = await create_division(result[0]["instituteCode"], connection);
               var results = await getResult("SELECT divisionId,divisionName,parentDivisionId,divisionCode,divisionType,parentDivisionType FROM `" + instituteCode + "` WHERE `delete`='0' AND LOWER(TRIM(`divisionType`)) LIKE TRIM(LOWER('" + keyword + "')) ");
               for (let i = 0; i < results.length; i++) {
                  const element = results[i];
                  var data = await fn.getStateOfDiviesions(instituteCode, element["divisionId"])
                  element["state"] = data
               }
               successResponse(res, "success", results)
            }
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const resendVerificationLink = async (req, res) => {
   const email = req.body.email || "";
   if (email == "" || email == undefined || email == null) {
      errorResponse(res, "email is Required");
   } else {
      try {
         var result = await getResult("SELECT *  FROM `user` WHERE `email`='" + email + "' AND `delete`='0'");
         if (result.length != 0) {
            const otp = generateOTP();
            var html = `Your Verification OTP is ${otp}`
            send_mail_to_user(email, "verification", html);
            await getResult("UPDATE `user` SET  `otp`='" + otp + "' WHERE `userId`='" + result[0]["userId"] + "' AND `delete`='0'");
            successResponse(res, "Verification Link Has Been Send To Your Email ",)
         } else {
            errorResponse(res, "Invalid Email , Please Check And Try Again.")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const generateClassCode = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   if (instituteId == "" || instituteId == undefined || instituteId == null) {
      errorResponse(res, "instituteId Is Required.")
   } else {
      try {
         var result = await getResult("SELECT `completedSteps`,`instituteCode` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            var date = new Date().getTime()
            var classCode = "CLS" + date;
            successResponse(res, "success", classCode)
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const updateInstituteDetails = async (req, res) => {
   const instituteName = req.body.instituteName || "";
   const instituteId = req.body.instituteId || "";
   const email = req.body.email || "";
   const userId = req.body.userId || ""
   const mobileNumber = req.body.mobileNumber || "";
   if (instituteName == "" || instituteName == undefined || instituteName == null) {
      errorResponse(res, "instituteName Is Required.")
   } else if (email == "" || email == undefined || email == null) {
      errorResponse(res, "email Is Required.")
   } else if (mobileNumber == "" || mobileNumber == undefined || mobileNumber == null) {
      errorResponse(res, "mobileNumber Is Required.")
   } else if (userId == "" || userId == undefined || userId == null) {
      errorResponse(res, "userId Is Required.")
   } else if (instituteId == "" || instituteId == undefined || instituteId == null) {
      errorResponse(res, "instituteId Is Required.")
   } else {
      try {
         var result = await getResult("SELECT `instituteId` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length == 0) {
            errorResponse(res, "Invalid Institute")
         } else {
            await getResult("UPDATE  `institute` SET `name`='" + mysql_real_escape_string(instituteName) + "',`email`='" + email + "',`mobileNumber`='" + mobileNumber + "',`createdBy`='" + userId + "' WHERE   `instituteId`='" + instituteId + "' AND  `delete`='0' ");
            successResponse(res, "Success")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const allClassByInstitute = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   const parentDivisionId = req.body.parentDivisionId || "";
   const parentDivisionType = req.body.parentDivisionType || ""; //0= state , 1 = division
   if (instituteId == null || instituteId == undefined || instituteId == "") {
      errorResponse(res, "instituteId Is Required")
   } else if (parentDivisionType == "" || parentDivisionType == undefined || parentDivisionType == null) {
      errorResponse(res, "parentDivisionType  Is Required", req.body.parentDivisionType)
   } else if (parentDivisionId == "" || parentDivisionId == undefined || parentDivisionId == null) {
      errorResponse(res, "parentDivisionId Is Required")
   } else {
      try {
         var result = await getResult("SELECT `instituteId` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length == 0) {
            errorResponse(res, "Invalid Institute")
         } else {
            var results = await getResult("SELECT `classCode`,`className`,`classId` FROM `class` WHERE `divisionId`='" + parentDivisionId + "' AND `instituteId`='" + instituteId + "' AND `divisionType`='" + parentDivisionType + "'   AND `delete`='0' AND `status`='0' ");
            successResponse(res, "success", results)
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong.", error)
      }
   }
}
const classListOfInstitute = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   const userId = req.body.userId || "";
   if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId Is Required")
   } else if (fn.validateData(userId)) {
      errorResponse(res, "userId Is Required")
   } else {
      try {
         var data = []
         var result = await getResult("SELECT `instituteId` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length == 0) {
            errorResponse(res, "Invalid Institute")
         } else {
            var results = await getResult("SELECT `classCode`,`className`,`classId` FROM `class` WHERE  `instituteId`='" + instituteId + "'  AND `status`='0'  AND `delete`='0' ");
            for (let i = 0; i < results.length; i++) {
               const element = results[i];
               var archives = await fn.checkIsArchived(results[i]["classId"], 3, userId)
               if (archives) {
                  data.push(element)
               }
            }
            successResponse(res, "success", data)
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong.", error)
      }
   }
}
const allStudentOfClass = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   const classId = req.body.classId || "";
   if (instituteId == null || instituteId == undefined || instituteId == "") {
      errorResponse(res, "instituteId is Required")
   } else if (classId == null || classId == undefined || classId == "") {
      errorResponse(res, "classId is Required")
   } else {
      try {
         var result = await getResult("SELECT `instituteId` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length == 0) {
            errorResponse(res, "Invalid Institute")
         } else {
            var results = await getResult("SELECT `userId` AS  `studentId`,`fullName`,`email` ,`rollNumber`,`userCode` AS  `studentCode` FROM `user` WHERE `classId`='" + classId + "'  AND `delete`='0' ");
            successResponse(res, "success", results)
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const updateMultiDivision = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   const divisionArr = req.body.divisionArr || []
   if (instituteId == "" || instituteId == undefined || instituteId == null) {
      errorResponse(res, "instituteId Is Required.")
   } else {
      try {
         const connection = "";
         var result = await getResult("SELECT `completedSteps`,`instituteCode` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            var instituteCode = await create_division(result[0]["instituteCode"], connection);
            if (divisionArr.length != 0) {
               for (let i = 0; i < divisionArr.length; i++) {
                  var parentDivisionType = divisionArr[i]["parentDivisionType"]
                  var parentDivisionId = divisionArr[i]["parentDivisionId"]
                  var divisionName = divisionArr[i]["divisionName"]
                  var divisionType = divisionArr[i]["divisionType"]
                  var date = new Date().getTime()
                  var code = "DIV" + date;
                  var check = await getResult("SELECT * FROM `" + instituteCode + "` WHERE `divisionId`='" + divisionArr[i]["divisionId"] + "'  AND `delete`='0'")
                  if (check.length != 0) {
                     await getResult("UPDATE`" + instituteCode + "` SET `parentDivisionType`='" + parentDivisionType + "',`parentDivisionId`='" + parentDivisionId + "',`divisionName`='" + divisionName + "',`divisionType`='" + divisionType + "' WHERE `divisionId`='" + divisionArr[i]["divisionId"] + "'  ")
                  } else {
                     await getResult("INSERT INTO `" + instituteCode + "` SET `parentDivisionType`='" + parentDivisionType + "',`parentDivisionId`='" + parentDivisionId + "',`divisionName`='" + divisionName + "',`divisionCode`='" + code + "',`divisionType`='" + divisionType + "'  ")
                  }
               }
            }
            successResponse(res, "success",)
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const divisionChildslist = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   const divisionId = req.body.divisionId || "";
   if (instituteId == "" || instituteId == undefined || instituteId == null) {
      errorResponse(res, "instituteId Is Required.")
   } else if (divisionId == "" || divisionId == undefined || divisionId == null) {
      errorResponse(res, "divisionId Is Required.")
   } else {
      try {
         const connection = "";
         var result = await getResult("SELECT `completedSteps`,`instituteCode` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            var instituteCode = await create_division(result[0]["instituteCode"], connection);
            var check = await getResult("SELECT `divisionId`,`divisionName`,`divisionCode`,`divisionType` FROM `" + instituteCode + "` WHERE  `parentDivisionId`='" + divisionId + "'  AND `delete`='0'")
            if (check.length != 0) {
               res.send({
                  "status": 200,
                  "divisionType": check[0]["divisionType"],
                  "message": "success",
                  "data": check
               })
            } else {
               res.send({
                  "status": 400,
                  "message": "No Data Avaliable",
                  "data": check
               })
            }
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const deleteDivision = async (req, res) => {
   const divisionId = req.body.divisionId || "";
   const instituteId = req.body.instituteId || ""
   if (divisionId == null || divisionId == undefined || divisionId == "") {
      errorResponse(res, "divisionId Is Required")
   } else if (instituteId == null || instituteId == undefined || instituteId == "") {
      errorResponse(res, "instituteId Is Required")
   } else {
      try {
         const connection = ""
         var result = await getResult("SELECT `completedSteps`,`instituteCode` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            var instituteCode = await create_division(result[0]["instituteCode"], connection);
            var division = await getResult("SELECT *  FROM `" + instituteCode + "` WHERE `delete`='0' AND `divisionId`='" + divisionId + "'");
            if (division.length != 0) {
               var childs = []
               var result = await getResult("SELECT * FROM `" + instituteCode + "` WHERE  `divisionId`='" + divisionId + "' ");
               if (result.length != 0) {
                  if (result.length != 0) {
                     for (let i = 0; i < result.length; i++) {
                        const element = result[i];
                        resData = await getAllChildDiviesions(instituteCode, connection, 1, divisionId);
                        obj = {
                           "divisionId": result[i]["divisionId"],
                           "divisionName": result[i]["divisionName"],
                           "parentDivisionId": result[i]["parentDivisionId"],
                           "divisionType": result[i]["divisionType"],
                           "parentDivisionType": result[i]["parentDivisionType"] == 0 ? "department" : "division",
                           "childs": resData,
                           "class": await getAllClassByParentId(instituteCode, connection, 1, result[i]["divisionId"])
                        }
                        childs.push(obj)
                     }
                  }
               }
               await fn.InActiveChildsAndClass(instituteCode, connection, childs)
               await getResult("UPDATE `" + instituteCode + "` SET   `delete`='1' WHERE  `divisionId`='" + divisionId + "'");
            }
            successResponse(res, "success",)
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "something Went Wrong", error)
      }
   }
}
const socialMediaLogin = async (req, res) => {
   const email = req.body.email || '';
   const loginType = req.body.loginType || 'googleId'; // googleId, facebookId,appleId
   const id = req.body.id || '';
   const os = req.body.os || "";
   const osVersion = req.body.osVersion || "";
   const device = req.body.device || "";
   const appVersion = req.body.appVersion || "";
   var columnName = '';
   if (email == null || email == undefined || email == "") {
      errorResponse(res, "email Is Required")
   } else if (loginType == null || loginType == undefined || loginType == "") {
      errorResponse(res, "loginType Is Required")
   } else if (os == "" || os == null || os == undefined) {
      errorResponse(res, "os Is Required")
   } else if (osVersion == "" || osVersion == null || osVersion == undefined) {
      errorResponse(res, "osVersion Is Required")
   } else if (device == "" || device == null || device == undefined) {
      errorResponse(res, "device Is Required")
   } else if (appVersion == "" || appVersion == null || appVersion == undefined) {
      errorResponse(res, "appVersion Is Required")
   } else if (id == null || id == undefined || id == "") {
      errorResponse(res, "id Is Required")
   } else {
      if (loginType == 'googleId') {
         columnName = 'google';
      } else if (loginType == 'facebookId') {
         columnName = 'facebook';
      } else if (loginType == 'appleId') {
         columnName = 'apple';
      }
      try {
         var result = await getResult("SELECT * FROM `user` WHERE  `email` = '" + email + "' AND `delete` = 0");
         if (result.length > 0) {
            var userId = result[0].userId;
            if (result[0].block == 0) {
               await getResult("UPDATE `user` SET `loginType` = '" + loginType + "',  `" + columnName + "` = '" + id + "' , `isVerified`='1' WHERE `userId` = '" + userId + "'");
               res.send({
                  "status": 200,
                  "message": "Login Successfull",
                  "userId": result[0]["userId"],
                  "userCode": result[0]["userCode"],
                  "fullName": result[0]["fullName"],
                  "isVerified": result[0]["isVerified"],
                  "loginType": result[0]["loginType"],
                  "isTeacher": result[0]["isTeacher"],
                  "permission": await fn.teachersPermission(result[0]["permissions"] || ""),
               })
            } else {
               errorResponse(res, 'You are not allowed to login')
            }
         } else {
            var updateUser = await getResult("INSERT INTO  `user` SET  `loginType`='" + loginType + "',`loginOs`='" + os + "',`loginOsVersion`='" + osVersion + "',`loginDevice`='" + device + "',`loginAppVersion`='" + appVersion + "', `email`='" + email + "' , `regOs`='" + os + "',`regOsVersion`='" + osVersion + "',`regDevice`='" + device + "',`registeredAppVersion`='" + appVersion + "',`isVerified`='1'");
            var code = generateUserCode(updateUser.insertId)
            var updateUserd = await getResult("UPDATE `user` SET  `userCode`='" + code + "' WHERE `userId`='" + updateUser.insertId + "' AND `delete`='0'");
            res.send({
               status: 200,
               "message": "Success",
               "userCode": code,
               "fullName": "",
               "isVerified": 1,
               "userId": updateUser.insertId,
               "loginType": loginType,
               "isTeacher": 0,
               "permission": []
            })
         }
      } catch (error) {
         errorResponse(res, "something Went Wrong", error)
      }
   }
}
const createExam = async (req, res) => {
   const instituteId = req.body.instituteId || ""
   const rollNumberDigits = req.body.rollNumberDigits || "";
   const structureCode = req.body.structureCode || "";
   const examName = req.body.examName || "";
   const date = req.body.date || "";
   const reportMode = req.body.reportMode || ""; //EXAM,APP,SMS
   const noOfSets = req.body.noOfSets || "";
   const subjectsData = req.body.subjects || "";
   const is_preset = req.body.is_preset || "0";
   const presetName = req.body.presetName || "";
   const pin = req.body.pin || "";
   if (instituteId == null || instituteId == undefined || instituteId == "") {
      errorResponse(res, "instituteId Is Required")
   } else if (rollNumberDigits == null || rollNumberDigits == undefined || rollNumberDigits == "") {
      errorResponse(res, "rollNumberDigits Is Required")
   } else if (structureCode == null || structureCode == undefined || structureCode == "") {
      errorResponse(res, "structureCode Is Required")
   } else if (examName == null || examName == undefined || examName == "") {
      errorResponse(res, "examName Is Required")
   } else if (date == null || date == undefined || date == "") {
      errorResponse(res, "date Is Required")
   } else if (reportMode == null || reportMode == undefined || reportMode == "") {
      errorResponse(res, "reportMode Is Required")
   } else if (subjectsData == null || subjectsData == undefined || subjectsData == "") {
      errorResponse(res, "subjects Is Required")
   } else if (noOfSets == null || noOfSets == undefined || noOfSets == "") {
      errorResponse(res, "noOfSets Is Required")
   } else if (pin == null || pin == undefined || pin == "") {
      errorResponse(res, "pin Is Required")
   } else {
      // try {
      const connection = "";
      var result = await getResult("SELECT * FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0' ")
      if (result.length != 0) {
         var structureData = await getDatafromCode(structureCode, instituteId, result[0]["instituteCode"], connection)
         if (structureData.length != 0) {
            var structureId = '';
            if (structureData[0]["type"] == 'division') {
               structureId = structureData[0]["divisionId"]
            } else if (structureData[0]["type"] == 'class') {
               structureId = structureData[0]["classId"]
            }
            var exam = await getResult("INSERT INTO `exam` SET `instituteId`='" + instituteId + "',`structureCode`='" + structureCode + "',`structureId`='" + structureId + "',`structureType`='" + structureData[0]["type"] + "',`rollNumberDigits`='" + rollNumberDigits + "',`examName`='" + mysql_real_escape_string(examName) + "',`date`='" + date + "',`noOfSets`='" + noOfSets + "',`pin`='" + pin + "',`is_preset`='" + is_preset + "',`presetName`='" + mysql_real_escape_string(presetName) + "' ")
            var examId = exam.insertId;
            var subjects = JSON.parse(subjectsData)
            for (let i = 0; i < subjects.length; i++) {
               var subject = subjects[i];
               var examsubject = await getResult("INSERT INTO `examsubject` SET `examId`='" + examId + "',`subjectName`='" + subject["subjectName"] + "',`noOfSection`='" + (subject["sections"]).length + "'")
               var examsubjectId = examsubject.insertId;
               var sections = subject["sections"]
               for (let j = 0; j < subject["sections"].length; j++) {
                  var section = sections[j];
                  var examsubject = await getResult("INSERT INTO `examsubjectsection` SET  `examId`='" + examId + "',`examsubjectId`='" + examsubjectId + "',`noOfQuestions`='" + section["noOfQuestions"] + "',`questionType`='" + section["questionType"] + "',`isAllowOptionalAttemp`='" + section["isAllowOptionalAttemp"] + "',	`isAllowPartialMarks`='" + section["isAllowPartialMarks"] + "',`marksForCorrect`='" + section["marksForCorrect"] + "',`marksForInCorrect`='" + section["marksForInCorrect"] + "'  ");
                  console.log(examsubject);
               }
            }
            var examCode = fn.generateCode(examId, "EXAM");
            var update = await getResult("UPDATE exam SET `examCode`='" + examCode + "' WHERE `examId`='" + examId + "'")
            successResponse(res, "Exam Created Successfully.", examId)
         } else {
            errorResponse(res, "Invalid Structure Code")
         }
      } else {
         errorResponse(res, "Invalid Institute")
      }
      // } catch (error) {
      //     errorResponse(res, "Something Went Wrong.", error)
      // }
   }
}
const uploadSheetImage = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   const examId = req.body.examId || "";
   const sheetName = req.body.sheetName || "";
   const templete = req.body.templete || "";
   if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId is Required")
   } else if (fn.validateData(examId)) {
      errorResponse(res, "examId is Required")
   } else if (fn.validateData(sheetName)) {
      errorResponse(res, "sheetName is Required")
   } else if (fn.validateData(templete)) {
      errorResponse(res, "templete is Required")
   } else {
      try {
         var result = await fn.checkInstitute(instituteId)
         if (result.length != 0) {
            var checkExam = await getResult("SELECT * FROM `exam` WHERE `examId`='" + examId + "' AND `instituteId`='" + instituteId + "'  AND `delete`='0'");
            if (checkExam.length != 0) {
               var checkExam = await getResult("UPDATE `exam` SET `sheetImage`='" + sheetName + "',`templete`='" + JSON.stringify(templete) + "' WHERE `examId`='" + examId + "' AND `instituteId`='" + instituteId + "'  AND `delete`='0'");
               successResponse(res, "success",)
            } else {
               errorResponse(res, "Invalid Exam")
            }
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const generateOMROld = async (req, res) => {
   const data = req.body.data || "";
   if (fn.validateData(data)) {
      errorResponse(res, "data Is Required")
   } else {
      try {
         const generateUserCode = (userId, end) => {
            var code = "";
            strlen = ((userId).toString()).length // find length
            for (var i = 0; i < (end - (strlen)); i++) {
               code += "0";
            }
            return code + (userId)
         }
         const PDFDocument = require('pdfkit');
         const fs = require('fs');
         // Add OMR elements to the PDF for each section
         var spacing = 12;
         var yIncrement = 14;
         var bubbleSize = spacing - 2;
         var origx = 40;
         var origy = 350;
         var x = origx;
         var questionCounter = 0;
         var page = 0;
         var hightStart = 0;
         var labelStartY = 0;
         // Default  Header  
         var fontSize = spacing + 2
         const isLayoutCustome = data["isLayoutCustome"]
         origx = 50
         const templateJson = {
            "pageDimensions": [595, 842],
            "bubbleDimensions": [bubbleSize, bubbleSize],
            "preProcessors": [{
               "name": "GaussianBlur",
               "options": {
                  "kSize": [3, 3],
                  "sigmaX": 0
               }
            }, {
               "name": "CropPage",
               "options": {
                  "morphKernel": [9, 9]
               }
            }]
         }
         // end
         var noOfQuestion = 0;
         var subjectsArr = JSON.parse(data["subjects"])
         for (let s = 0; s < subjectsArr.length; s++) {
            const subjects = subjectsArr[s];
            for (let h = 0; h < subjects.sections.length; h++) {
               const section = subjects.sections[h];
               for (let k = 0; k < section.questions; k++) {
                  noOfQuestion++;
               }
            }
         }
         var noOfBlock = Math.ceil(noOfQuestion / 5)
         var targetRow = data["rows"]
         var targetColumn = data["column"]
         if (isLayoutCustome == "0") {
            targetRow = data["rows"]
            targetColumn = data["column"]
         } else {
            var col = rowAndColumnGenerator(noOfBlock);
            targetRow = col["rows"];
            targetColumn = col["cols"];
         }
         function rowAndColumnGenerator(n) {
            let rows;
            let cols;
            // Find factors of the given number
            for (let i = 1; i <= Math.sqrt(n); i++) {
               if (n % i === 0) {
                  rows = i;
                  cols = n / i;
               }
            }
            // Adjust rows and columns to minimize the difference
            if (cols < rows) {
               [rows, cols] = [cols, rows];
            }
            // Adjust columns to meet the constraint
            if (cols > 8) {
               cols = 8;
               rows = Math.ceil(n / cols);
            }
            // Adjust rows and columns to meet the difference constraint
            if (cols - rows > 3) {
               const mid = Math.floor((rows + cols) / 2);
               rows = mid;
               cols = mid;
            }
            if (rows == 1 && cols < 4) {
               rows = cols;
               cols = 1;
            }
            return {
               rows: rows,
               cols: cols
            };
         }
         x = origx
         const newLine = (x, y) => {
            var pageHight = 0;
            var pageWidth = 0;
            if (targetRow * targetColumn <= 9) {
               size = "A4"
               pageHight = 740;
               const first = 150
               const second = 250
               const third = 350;
               const forth = 450
               if (x == origx) {
                  x = first;
               } else if (x == first) {
                  x = second
               } else if (x == second) {
                  x = third
               } else if (x == third) {
                  // x = forth
               }
               if (page == 0) {
                  y = origy - spacing
               } else {
                  y = 100
               }
            } else if (9 < targetRow * targetColumn && targetRow * targetColumn <= 25 && targetColumn <= 5) {
               size = "A4"
               pageHight = 740;
               const first = 150
               const second = 250
               const third = 350;
               const forth = 450
               if (x == origx) {
                  x = first;
               } else if (x == first) {
                  x = second
               } else if (x == second) {
                  x = third
               } else if (x == third) {
                  x = forth
               }
               if (page == 0) {
                  y = origy
               } else {
                  y = 100
               }
            } else if (25 < targetRow * targetColumn && targetRow * targetColumn <= 70 && targetColumn < 10) {
               size = "A3"
               var pageHight = 4861;
               var pageWidth = 3408;
               const first = 200;
               const second = 300;
               const third = 400;
               const forth = 500;
               const fifth = 600;
               const sixth = 700;
               if (x == origx) {
                  x = first;
               } else if (x == first) {
                  x = second
               } else if (x == second) {
                  x = third
               } else if (x == third) {
                  x = forth
               } else if (x == forth) {
                  x = fifth
               } else if (x == fifth) {
                  x = sixth
               }
               if (page == 0) {
                  y = origy
               } else {
                  y = 100
               }
            } else {
               // size = "A2"
               // var pageHight = 5016;
               // var pageWidth = 4060;
               // const first = 200;
               // const second = 300;
               // const third = 400;
               // const forth = 500;
               // const fifth = 600;
               // const sixth = 700;
               // const seventh = 800;
               // const eighth = 900;
               // const ninegth = 1000;
               // const tenth = 1000;
               // if (x == origx) {
               //     x = first;
               // } else if (x == first) {
               //     x = second
               // } else if (x == second) {
               //     x = third
               // } else if (x == third) {
               //     x = forth
               // } else if (x == forth) {
               //     x = fifth
               // } else if (x == fifth) {
               //     x = sixth
               // } else if (x == sixth) {
               //     x = seventh
               // } else if (x == seventh) {
               //     x = eighth
               // } else if (x == eighth) {
               //     x = ninegth
               // } else if (x == ninegth) {
               //     x = tenth
               // }
               // if (page == 0) {
               //     y = origy
               // } else {
               //     y = 100
               // }
               size = "A4"
               pageHight = 740;
               const first = 150
               const second = 250
               const third = 350;
               const forth = 450
               if (x == origx) {
                  x = first;
               } else if (x == first) {
                  x = second
               } else if (x == second) {
                  x = third
               } else if (x == third) {
                  // x = forth
               }
               if (page == 0) {
                  y = origy - spacing
               } else {
                  y = 100
               }
            }
            return {
               x,
               y,
               size,
               pageHight,
               pageWidth
            }
         }
         obj = newLine()
         const pageHight = obj.pageHight
         const pageWidth = obj.pageWidth
         const doc = new PDFDocument({
            size: obj.size
         });
         // Define the OMR sheet template
         var subjectsArr = JSON.parse(data.subjects)
         if (data.headerType == 0) {
            var width = 0
            if (obj.size == "A4") {
               width = 400
            } else if (obj.size == "A3") {
               width = 650
            } else if (obj.size == "A2") {
               width = 1000
            }
            doc.lineJoin('miter').rect(x, 20, width, 50).stroke();
            doc.lineJoin('miter').rect(x, 45, width, 50).stroke();
            doc.fontSize(10).text("Name :", x + 10, 30);
            doc.fontSize(10).text("Exam :", x + 10, 55);
            doc.fontSize(10).text("Date :", x + 10, 80);
         } else if (data.headerType == 1) {
            var width = 0
            if (obj.size == "A4") {
               width = 400
            } else if (obj.size == "A3") {
               width = 650
            } else if (obj.size == "A2") {
               width = 1000
            }
            doc.lineJoin('miter').rect(x, 20, width - 25, 25).stroke();
            doc.lineJoin('miter').rect(x, 45, (width / 2), 25).stroke();
            doc.lineJoin('miter').rect(x + (width / 2), 45, (width / 2) - 25, 25).stroke();
            doc.fontSize(10).text("Name :", x + 10, 30);
            doc.fontSize(10).text("Exam :", x + 10, 55);
            doc.fontSize(10).text("Date :", x + (width / 2) + 10, 55);
         } else if (data.headerType == 2) {
            var width = 0
            if (obj.size == "A4") {
               width = 500
            } else if (obj.size == "A3") {
               width = 650
            } else if (obj.size == "A2") {
               width = 1000
            }
            var hightStart = 45;
            var labelStartY = 55;
            doc.lineJoin('miter').rect(x, hightStart, width - 25, 25).stroke();
            doc.fontSize(10).text("Name :", x + 10, labelStartY);
            hightStart += 25
            labelStartY += 25
            doc.lineJoin('miter').rect(x, hightStart, width - 25, 25).stroke();
            doc.fontSize(10).text("Exam :", x + 10, labelStartY);
            hightStart += 25
            labelStartY += 25
            for (let i = 0; i < data.labels.length; i++) {
               const element = data.labels[i];
               if (i % 2 == 0) {
                  if (i == (data.labels.length - 1)) {
                     doc.lineJoin('miter').rect(x, hightStart, width - 25, 25).stroke();
                     doc.fontSize(10).text(element.labelName + ":", x + 10, labelStartY);
                     hightStart += 25
                     labelStartY += 25
                  } else {
                     doc.lineJoin('miter').rect(x, hightStart, (width / 2) - 25, 25).stroke();
                     doc.fontSize(10).text(element.labelName + ":", x + (width / 2) - 15, labelStartY);
                  }
               } else {
                  doc.lineJoin('miter').rect(x, hightStart, width - 25, 25).stroke();
                  doc.fontSize(10).text(element.labelName + ":", x + 10, labelStartY);
                  hightStart += 25;
                  labelStartY += 25;
               }
            }
         }
         var rollNumberY = (hightStart == 0) ? spacing * 15 : (hightStart + 50)
         doc.fontSize(fontSize).text(("Set"), x + 135, rollNumberY - 40);
         // sets 
         for (let i = 0; i < data.examSet; i++) {
            var circleSpacings = x + 140 + i * spacing;
            doc.fontSize(fontSize).text((String.fromCharCode(i + 65)), circleSpacings - 5, rollNumberY - 20);
         }
         doc.lineWidth(0.2);
         for (let i = 0; i < data.examSet; i++) {
            var circleSpacings = x + 140 + i * spacing;
            doc.circle(circleSpacings, rollNumberY + 2, bubbleSize / 2).stroke();
         }
         // Roll Number
         doc.fontSize(fontSize).text(("Roll Number"), x - 5, rollNumberY - 40);
         for (let i = 0; i < data.roleNumbeDigit; i++) {
            var circleSpacings = x + i * spacing;
            doc.lineJoin('miter').rect(circleSpacings - 5, rollNumberY - 20, 10, 10).stroke();
         }
         doc.lineWidth(0.2);
         for (let j = 0; j < 10; j++) {
            doc.fontSize(yIncrement).text((j + "."), x - 15, rollNumberY);
            for (let i = 0; i < data.roleNumbeDigit; i++) {
               var circleSpacings = x + i * spacing;
               doc.circle(circleSpacings, rollNumberY + 2, bubbleSize / 2).stroke();
            }
            rollNumberY += yIncrement;
         }
         diffX = x + data.roleNumbeDigit * spacing
         diff = rollNumberY - origy
         if (diff > 0) {
            origy += diff + 20
         } else {
            origy
         }
         let y = origy;
         var subjectsArr = JSON.parse(data.subjects)
         // xspacings
         var rows = 0;
         var column = -1;
         // end
         var blockNumber = 1
         var objOutput = {}
         var scannerY = 0
         for (let s = 0; s < subjectsArr.length; s++) {
            const subjects = subjectsArr[s];
            for (let h = 0; h < subjects.sections.length; h++) {
               const section = subjects.sections[h];
               if (y >= pageHight) {
                  var obj = newLine(x, y)
                  x = obj.x
                  y = obj.y
               }
               doc.lineWidth(0.2);
               if (h != 0) {
                  y += spacing + 5
               }
               for (let k = 0; k < section.questions; k++) {
                  questionCounter++
                  if (k % 5 == 0) {
                     if (++column >= targetRow) {
                        if (++rows < targetColumn) {
                           var obj = newLine(x, y)
                           x = obj.x
                           y = obj.y
                           column = 0
                        } else {
                           doc.addPage();
                           x = origx;
                           page++;
                           rows = 0;
                           column = 0;
                        }
                        if (page == 0) {
                           y = origy - 15;
                        } else {
                           y = 80;
                        }
                     }
                     if (y + 60 >= pageHight) {
                        var obj = newLine(x, y);
                        x = obj.x;
                        y = obj.y;
                     }
                  }
                  if (h == 0 && k == 0) {
                     if (s != 0) {
                        y += 10;
                     } else {
                        origy += 10;
                        y += 10;
                     }
                     if (data.subjectInColume == 1 && s != 0) {
                        var obj = newLine(x, y)
                        x = obj.x;
                        y = obj.y;
                     }
                     doc.fontSize(fontSize).text(subjects.subjectName, x + spacing, y - spacing);
                  } else if (h != 0 && k == 0) {
                     y += 10;
                     console.log(questionCounter);
                  }
                  if (k % 5 == 0) {
                     if (k != 0) {
                        y += (yIncrement + 5)
                     }
                     strBlockNumber = generateUserCode(blockNumber, 2)
                     var key = "q" + strBlockNumber + "block"
                     var lastQuestion = noOfQuestion % 5;
                     if (lastQuestion == 0 && questionCounter != noOfQuestion) {
                        if (questionCounter == 1) {
                           label = [`q${questionCounter}..${questionCounter + 4}`]
                        } else if (questionCounter + 4 > noOfQuestion) {
                           label = [`q${questionCounter}..${noOfQuestion}`]
                        } else {
                           label = [`q${questionCounter}..${questionCounter + 4}`]
                        }
                        var subObject = {}
                        subObject["origin"] = [x + 20, y - column];
                        subObject["bubblesGap"] = 9;
                        subObject["labelsGap"] = 10;
                        subObject["fieldLabels"] = label;
                        subObject["fieldType"] = "QTYPE_MCQ" + (JSON.parse(section.answerOptions).length);
                        objOutput[key] = subObject
                     } else if (questionCounter == (noOfQuestion - lastQuestion)) {
                        label = [`q${questionCounter}..${questionCounter + lastQuestion}`]
                        var subObject = {}
                        subObject["origin"] = [x + 20, y - column];
                        subObject["bubblesGap"] = 9;
                        subObject["labelsGap"] = 10;
                        subObject["fieldLabels"] = label;
                        subObject["fieldType"] = "QTYPE_MCQ" + (JSON.parse(section.answerOptions).length);
                        objOutput[key] = subObject
                     } else if (questionCounter == 1) {
                        label = [`q${questionCounter}..${questionCounter + lastQuestion}`]
                        var subObject = {}
                        subObject["origin"] = [x + 20, y - column];
                        subObject["bubblesGap"] = 9;
                        subObject["labelsGap"] = 10;
                        subObject["fieldLabels"] = label;
                        subObject["fieldType"] = "QTYPE_MCQ" + (JSON.parse(section.answerOptions).length);
                        objOutput[key] = subObject
                     } else {
                        label = [`q${questionCounter}..${questionCounter + 4}`]
                        var subObject = {}
                        subObject["origin"] = [x + 20, y - column];
                        subObject["bubblesGap"] = 9;
                        subObject["labelsGap"] = 10;
                        subObject["fieldLabels"] = label;
                        subObject["fieldType"] = "QTYPE_MCQ" + (JSON.parse(section.answerOptions).length);
                        objOutput[key] = subObject
                     }
                     blockNumber++;
                     y += 6;
                  }
                  var options = JSON.parse(section.answerOptions)
                  for (let i = 0; i < options.length; i++) {
                     var circleSpacings = x + 12 + i * spacing;
                     if (y >= pageHight) {
                        var obj = newLine(x, y)
                        x = obj.x
                        y = obj.y
                     }
                     var circleSpacings = x + 12 + i * spacing;
                  }
                  doc.fontSize(fontSize).text(`${generateUserCode(questionCounter, 3)}.`, (x - spacing - 8), y - 4);
                  for (let i = 0; i < options.length; i++) {
                     if (y >= pageHight) {
                        var obj = newLine(x, y)
                        x = obj.x
                        y = obj.y
                     }
                     var circleSpacings = x + 15 + i * spacing;
                     doc.circle(circleSpacings, y + 2, bubbleSize / 2).stroke();
                  }
                  y += yIncrement;
               }
            }
            if (y >= pageHight) {
               var obj = newLine(x, y)
               x = obj.x;
               y = obj.y;
            }
         }
         templateJson["fieldBlocks"] = objOutput;
         // Convert JSON object to a string
         const jsonString = JSON.stringify(templateJson,);
         // // Write the JSON string to a file
         // fs.writeFile('output.json', jsonString, 'utf8', (err) => {
         //     if (err) {
         //         console.error('Error writing JSON file:', err);
         //         return;
         //     }
         //     console.log('JSON file has been created successfully.');
         // });
         // doc.pipe(fs.createWriteStream(`JustEvelve/images/${name}`));
         const uniqueSuffix = Date.now();
         var pdfFileName = `${uniqueSuffix}.pdf`
         // var pdfFileName = `${'pdf'}.pdf`
         // doc.pipe(fs.createWriteStream(`JustEvelve/images/${pdfFileName}`));
         const stream = doc.pipe(fs.createWriteStream(pdfFileName));
         stream.on('finish', () => {
            const blobService = azure.createBlobService(fn.connectionString);
            // Upload the PDF to Azure Blob Storage
            blobService.createBlockBlobFromLocalFile(fn.container, pdfFileName, pdfFileName,
               (error, result, response) => {
                  if (error) {
                     console.error('Error uploading the PDF:', error);
                  } else {
                     console.log('PDF uploaded successfully!');
                     // Optionally, you can delete the local file after uploading it to Azure Blob Storage
                     fs.unlink(pdfFileName, (unlinkError) => {
                        if (unlinkError) {
                           console.error('Error deleting the local PDF file:', unlinkError);
                        } else {
                           console.log('Local PDF file deleted.');
                        }
                     });
                  }
               });
         });
         doc.end();
         resData = [{
            "url": getBlobTempPublicUrl(pdfFileName),
            "name": (pdfFileName),
            "templete": templateJson
         }]
         successResponse(res, "success", resData)
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const generateOMR = async (req, res) => {
   const data = req.body.data || "";
   if (fn.validateData(data)) {
      errorResponse(res, "data Is Required")
   } else {
      // try {


      const serializeJsonX = (jsonX,answerOptions=3) => {

         if(answerOptions == 3){
     
           if (jsonX >= 140 && jsonX <= 150) {
             return 120
           } else if (jsonX >= 180 && jsonX <= 230) {
             return 190
           } else if (jsonX > 230 && jsonX < 295) {
             return   265
           } else if (jsonX >= 295 && jsonX < 380) {
             return 340
           } else if (jsonX >= 380 && jsonX <= 400) {
             return 415
           }else{
             return jsonX
           }
     
         }else if(answerOptions == 4){
     
           if (jsonX >= 140 && jsonX <= 150) {
             return 130
           } else if (jsonX >= 180 && jsonX <= 230) {
             return 220
           } else if (jsonX > 260 && jsonX < 330) {
             return   310
           } else if (jsonX >= 330 && jsonX < 450) {
             return   400
           } else if (jsonX >= 450 ) {
             return   400
           // } else if (jsonX >= 295 && jsonX < 380) {
           //   return 405
           // } else if (jsonX >= 380 && jsonX <= 400) {
           //   return 415
           }else{
             return jsonX
           }
     
         }
     
     
       }
     
     
       
      const requestData = data;
      const { PDFDocument, rgb } = require('pdf-lib');
      const fs = require('fs');
      const pdfDoc = await PDFDocument.create();
      async function drawImageOnPage(page, x, y, width, height) {

         const imageBytes = fs.readFileSync('omr_marker.png'); // Replace with the actual path to your image

         // Embed the image into the PDF
         const image = await pdfDoc.embedPng(imageBytes);

         page.drawImage(image, {
            x,
            y,
            width: 30,
            height: 30,
         });
      }

      const input = (requestData);
      const subjects = JSON.parse(input.subjects);
      if (!subjects || !Array.isArray(subjects)) {
         throw new Error('Invalid input data: "subjects" array is missing or invalid.');
      }
      const pageWidth = 595; // A4 width in points
      const pageHeight = 841; // A4 height in points
      const bubbleRadius = 6;
      const bubbleSpacing = 15;
      const xOffsetStart = 35;
      var yOffsetStart = pageHeight - 30;
      var maxMarging = 0;
      var maxMargingJson = 0;
      var jsonX = 40;
      const jsonXStart = jsonX;
      var jsonY = 0
      const templateJson = {
         "pageDimensions": [parseInt(pageWidth), parseInt(pageHeight)],
         "bubbleDimensions": [12, 12],
         "preProcessors": [
           {
               "name": "CropOnMarkers",
               "options": {
                   "relativePath": "../../../markers/omr_marker.jpg",
                   "sheetToMarkerWidthRatio": 18
               }
           }
       ],
       }
   
       let page = pdfDoc.addPage([pageWidth, pageHeight]); // Declare page using let
       const maxBubbleRadius = Math.min(15, (page.getWidth() - xOffsetStart) / (2 * subjects.length + 20));
       const maxColumns = Math.floor((page.getWidth() - xOffsetStart) / (2 * bubbleSpacing * subjects.length + 20));
       const columnMargin = 10;
       const ySpacing = 5;
   
   
   
       const calculateColumnMargin = (pageWidth, xOffsetStart, bubbleSpacing, maxColumns) => {
         const availableSpace = pageWidth - xOffsetStart - bubbleSpacing * 2 * subjects.length * maxColumns;
         return availableSpace / (maxColumns - 1);
       };
       const fontSize = 10;
       const drawText = (text, x, y, options = {}) => {
         const fontSize = options.fontSize || maxFontSize;
         page.drawText(text, {
           x,
           y,
           size: fontSize,
           ...options
         });
       };
       const drawCircle = (x, y, radius, alphabet) => {
         const adjustedRadius = Math.min(radius, maxBubbleRadius);
         page.drawEllipse({
           x: x + adjustedRadius,
           y: y + adjustedRadius,
           xScale: adjustedRadius,
           yScale: adjustedRadius,
           borderColor: rgb(0, 0, 0),
           borderWidth: 1,
           color: rgb(1, 1, 1),
         });
         if (alphabet) {
           const fontSize = 6; // You can adjust the font size as needed
           const textX = x + (adjustedRadius * 2 - fontSize) / 2; // Center the text horizontally
           const textY = y + (adjustedRadius * 2 - fontSize) / 2; // Center the text vertically
           drawText((alphabet).toString(), textX + 1, textY + 1, {
             fontSize
           });
         }
       };
       const generateUserCode = (userId, end) => {
         var code = "";
         strlen = ((userId).toString()).length // find length
         for (var i = 0; i < (end - (strlen)); i++) {
           code += "0";
         }
         return code + (userId)
       }
       let yOffset = yOffsetStart;
       await drawImageOnPage(page, xOffsetStart - 30, yOffset -= 20, 25, 25); // Adjust width and height as needed
       await drawImageOnPage(page, pageWidth - 40, yOffset, 15, 15); // Adjust width and height as needed
       yOffset -= 30
       const boxWidth = 150;
       const boxHeight = 25;
       const boxMargin = 10;
       const boxY = pageHeight - 30;
       let xOffset = xOffsetStart;
   
       // Draw boxes for Full Name, Exam, and Date at the top
       var totalQuestionInExam = 0
       for (let subjectIndex = 0; subjectIndex < subjects.length; subjectIndex++) {
         const subject = subjects[subjectIndex];
         const subjectName = subject.subjectName;
         for (let sectionIndex = 0; sectionIndex < subject.sections.length; sectionIndex++) {
           const section = subject.sections[sectionIndex];
           const answerOptions = (section.answerOptions);
           // Calculate the total number of questions, including any necessary empty slots
           const totalQuestions = section.questions
           totalQuestionInExam += totalQuestions
         }
       }
       const drawBox = (x, boxY, boxWidth, boxHeight, label) => {
         page.drawRectangle({
           x,
           y: boxY,
           width: boxWidth,
           height: boxHeight,
           borderColor: rgb(0, 0, 0),
           borderWidth: 1
         });
         drawText(label, x + boxMargin, boxY + boxHeight - 15, {
           fontSize: fontSize
         });
       };
       if (input.headerType == 0) {
         drawBox(xOffset, yOffset, 425, 25, 'Full Name:');
         drawBox(xOffset, yOffset -= 25, 425, 25, 'Exam:');
         drawBox(xOffset, yOffset -= 25, 425, 25, 'Date:');
         jsonY += 16
         jsonY += 16
         // drawBox(40 , boxWidth + boxMargin +250,25, 'Date:');
       } else if (input.headerType == 1) {
         drawBox(xOffset, yOffset, 425, 25, 'Full Name:');
         drawBox(xOffset, yOffset -= 25, 425 / 2, 25, 'Exam:');
         drawBox(xOffset + 425 / 2, yOffset, 425 / 2, 25, 'Date:');
         jsonY += 16
         jsonY += 16
         jsonY += 16
       } else if (input.headerType == 2) {
         const boxWidth2 = 425 / 2; // Adjust as needed
         const labelMargin = 10;
         let boxX = xOffsetStart;
         drawBox(xOffset, yOffset, 425, 25, 'Full Name:');
         drawBox(xOffset, yOffset -= 25, 425 / 2, 25, 'Exam:');
         drawBox(xOffset + 425 / 2, yOffset, 425 / 2, 25, 'Date:');
         let labelY = yOffset - 25;
         jsonY += 16
         jsonY += 16
         for (let i = 0; i < input.labels.length; i++) {
           const element = input.labels[i];
           if (i % 2 === 0) {
             if (i === input.labels.length - 1) {
               page.drawRectangle({
                 x: boxX,
                 y: labelY,
                 width: boxWidth2 * 2,
                 height: boxHeight,
                 borderColor: rgb(0, 0, 0),
                 borderWidth: 1
               });
               drawText(`${element.labelName}:`, boxX + labelMargin, labelY + boxHeight - 15, {
                 fontSize: fontSize
               });
             } else {
               page.drawRectangle({
                 x: boxX + 425 / 2,
                 y: labelY,
                 width: boxWidth2,
                 height: boxHeight,
                 borderColor: rgb(0, 0, 0),
                 borderWidth: 1
               });
               drawText(`${element.labelName}:`, boxX + labelMargin, labelY + boxHeight - 15, {
                 fontSize: fontSize
               });
             }
             yOffset -= 25
             jsonY += 16
           } else {
             page.drawRectangle({
               x: boxX,
               y: labelY,
               width: boxWidth2,
               height: boxHeight,
               borderColor: rgb(0, 0, 0),
               borderWidth: 1
             });
             drawText(`${element.labelName}:`, boxX + labelMargin + 425 / 2, labelY + boxHeight - 15, {
               fontSize: fontSize
             });
             labelY -= boxHeight;
             yOffset -= 25
             jsonY += 16
           }
         }
       }
       // Roll Number
       yOffset = yOffset - 25
       // jsonY=2
       var setOffset = yOffset
       drawText(`Roll Number`, xOffset, yOffset, {
         fontSize: fontSize
       });
       yOffset = yOffset - 25
       jsonY += 6
       for (let j = 0; j < input.roleNumbeDigit; j++) {
         drawBox(xOffset + 20 + j * bubbleSpacing, yOffset, 10, 10, '');
       }
       for (let i = 0; i < 10; i++) {
         yOffset = yOffset - 10
         jsonY += 20
         drawText(`${generateUserCode(i, 1)}`, xOffset, yOffset - bubbleSpacing + 8, {
           fontSize: fontSize
         });
         for (let j = 0; j < input.roleNumbeDigit; j++) {
           drawCircle(xOffset + 20 + j * bubbleSpacing, yOffset - 10, bubbleRadius);
         }
         yOffset = yOffset - 5
         jsonY += 5
       }
       yOffset = yOffset - 5
       drawText(`Sets`, xOffset + 425 / 2, setOffset, {
         fontSize: fontSize
       });
       for (let i = 0; i < input.examSet.length; i++) {
         drawText(input.examSet[i], xOffset + (425 / 2) + bubbleSpacing * i, setOffset - 20, {
           fontSize: fontSize
         });
         drawCircle(xOffset + (425 / 2) + bubbleSpacing * i, setOffset - 40, bubbleRadius);
       }
       // Top Left 
       jsonY += 47
       yOffsetStart = yOffset
       const jsonYStart = jsonY
       var pageCounter = 0;
       let counter = 1;
       const questionsPerSlot = 5;
       var objOutput = {}
       let sloatCounter = 0;
       // console.log(350-jsonYStart);
       for (let subjectIndex = 0; subjectIndex < subjects.length; subjectIndex++) {
         const subject = subjects[subjectIndex];
         const subjectName = subject.subjectName;
         for (let sectionIndex = 0; sectionIndex < subject.sections.length; sectionIndex++) {
           const section = subject.sections[sectionIndex];
           const answerOptions = (section.answerOptions);
           // Calculate the total number of questions, including any necessary empty slots
           const totalQuestions = Math.ceil(section.questions / questionsPerSlot) * questionsPerSlot;
           const totalSlots = Math.ceil(totalQuestions / questionsPerSlot);
           for (let slot = 0; slot < totalSlots; slot++) {
             let columnFull = false;
             let questionsInSlot = Math.min(questionsPerSlot, totalQuestions - slot * questionsPerSlot);
             const columnWidthNeeded = (2 * bubbleSpacing * answerOptions.length) + calculateColumnMargin(page.getWidth(), xOffsetStart, bubbleSpacing, maxColumns);
             while (!columnFull) {
               if (sectionIndex == 0 && subjectIndex != 0 && slot == 0) {
                 if (input.subjectInColume == 1) {
                   yOffset -= (questionsInSlot - 1) * bubbleSpacing;
                   var marg = bubbleSpacing * answerOptions.length + calculateColumnMargin(page.getWidth(), xOffsetStart, bubbleSpacing, maxColumns);
                   if (maxMarging < marg) {
                     maxMarging = marg
                   }
                   jsonMarg = (answerOptions.length) * 25
                   if (maxMargingJson < jsonMarg) {
                     maxMargingJson = jsonMarg
                   }
                   jsonX += (maxMargingJson);
                   jsonX =  serializeJsonX(jsonX,answerOptions.length)
   
                   xOffset += maxMarging;
                   if ((xOffset + maxMarging) > (pageWidth - xOffsetStart)) {
                     var yOffsetImg = 0
                     if (pageCounter == 0) {
                       yOffsetImg = yOffsetStart;
   
                     } else {
                       yOffsetImg = pageHeight - 30;
                     }
                     await drawImageOnPage(page, xOffsetStart - 30, yOffset -= 40, 15, 15); // Adjust width and height as needed
                     await drawImageOnPage(page, xOffsetStart - 30, 15, 15, 15); // Adjust width and height as needed
                     await drawImageOnPage(page, pageWidth - 40, 15, 15, 15); // Adjust width and height as needed
                     page = pdfDoc.addPage([pageWidth, pageHeight]);
                     xOffset = xOffsetStart;
                     yOffset = pageHeight - 30;
                     await drawImageOnPage(page, xOffset - 20, yOffset -= 15, 15, 15); // Adjust width and height as needed
                     pageCounter++;
                     jsonY = jsonYStart;
                   }
                   if (yOffset - 20 < 30) {
                     columnFull = true;
                     var marg = bubbleSpacing * answerOptions.length + calculateColumnMargin(page.getWidth(), xOffsetStart, bubbleSpacing, maxColumns);
                     if (maxMarging < marg) {
                       maxMarging = marg;
                     }
                     xOffset += maxMarging
                     jsonMarg = (answerOptions.length) * 25
   
   
                     if (maxMargingJson < jsonMarg) {
                       maxMargingJson = jsonMarg
                     }
                     jsonX += (maxMargingJson);
                     jsonX =  serializeJsonX(jsonX,answerOptions.length)
                     if (pageCounter == 0) {
                       yOffset = yOffsetStart;
                       jsonY = jsonYStart
                     } else {
                       yOffset = pageHeight - 30;
                     }
                     var yOffsetImg = 0
                     if (pageCounter == 0) {
                       yOffsetImg = yOffsetStart;
   
                     } else {
                       yOffsetImg = pageHeight - 30;
                     }
                     await drawImageOnPage(page, xOffsetStart - 30, yOffset -= 40, 15, 15); // Adjust width and height as needed
                     await drawImageOnPage(page, xOffsetStart - 30, 15, 15, 15); // Adjust width and height as needed
                     await drawImageOnPage(page, pageWidth - 40, 15, 15, 15); // Adjust width and height as needed
                     page = pdfDoc.addPage([pageWidth, pageHeight]);
                     xOffset = xOffsetStart;
                     yOffset = pageHeight - 30;
                     await drawImageOnPage(page, xOffset - 20, yOffset -= 15, 15, 15); // Adjust width and height as needed
                     pageCounter++;
   
                   } else {
                     if (xOffset > (pageWidth - xOffsetStart)) {
                       var yOffsetImg = 0
                       if (pageCounter == 0) {
                         yOffsetImg = yOffsetStart;
   
                       } else {
                         yOffsetImg = pageHeight - 30;
                       }
                       await drawImageOnPage(page, xOffsetStart - 30, yOffset -= 40, 15, 15); // Adjust width and height as needed
                       await drawImageOnPage(page, xOffsetStart - 30, 15, 15, 15); // Adjust width and height as needed
                       await drawImageOnPage(page, pageWidth - 40, 15, 15, 15); // Adjust width and height as needed
                       page = pdfDoc.addPage([pageWidth, pageHeight]);
                       xOffset = xOffsetStart;
                       yOffset = pageHeight - 30;
                       await drawImageOnPage(page, xOffset - 20, yOffset -= 15, 15, 15); // Adjust width and height as needed
                       pageCounter++;
                     }
                     columnFull = true;
                   }
                   if (pageCounter == 0) {
                     yOffset = yOffsetStart;
                   } else {
                     yOffset = pageHeight - 30;
                   }
                   drawText(`${subjectName}`, xOffset + 20, yOffset - 0 * bubbleSpacing - 15, {
                     fontSize: fontSize
                   });
                 } else {
                   drawText(`${subjectName}`, xOffset + 20, yOffset - 0 * bubbleSpacing - 15, {
                     fontSize: fontSize
                   });
                 }
               } else if (sectionIndex == 0 && slot == 0) {
                 if (input.subjectInColume == 1 && subjectIndex != 0) {
                   var marg = bubbleSpacing * answerOptions.length + calculateColumnMargin(page.getWidth(), xOffsetStart, bubbleSpacing, maxColumns);
                   if (maxMarging < marg) {
                     maxMarging = marg;
                   }
                   jsonMarg = (answerOptions.length) * 25
                   if (maxMargingJson < jsonMarg) {
                     maxMargingJson = jsonMarg
                   }
                   jsonX += maxMargingJson + 3;
                   xOffset += maxMarging
                   if (pageCounter == 0) {
                     yOffset = yOffsetStart;
                   } else {
                     yOffset = pageHeight - 30;
                   }
                   drawText(`${subjectName}`, xOffset + 20, yOffset - 0 * bubbleSpacing - 15, {
                     fontSize: fontSize
                   });
                 } else {
                   drawText(`${subjectName}`, xOffset + 20, yOffset - 0 * bubbleSpacing - 15, {
                     fontSize: fontSize
                   });
                 }
               }
               if (yOffset - questionsInSlot * bubbleSpacing < 30) {
                 if (xOffset + columnWidthNeeded > pageWidth - xOffsetStart) {
   
                   var yOffsetImg = 0
                   if (pageCounter == 0) {
                     yOffsetImg = yOffsetStart;
   
                   } else {
                     yOffsetImg = pageHeight - 30;
                   }
                   //   await drawImageOnPage(page, xOffsetStart - 30, yOffset -= 40, 15, 15); // Adjust width and height as needed
                   // await drawImageOnPage(page, xOffsetStart - 30, 15, 15, 15); // Adjust width and height as needed
                   // await drawImageOnPage(page, pageWidth - 40, 15, 15, 15); // Adjust width and height as needed
   
                   var marg = bubbleSpacing * answerOptions.length + calculateColumnMargin(page.getWidth(), xOffsetStart, bubbleSpacing, maxColumns);
                   if (maxMarging < marg) {
                     maxMarging = marg
                   }
                   jsonMarg = (answerOptions.length) * 25
   
                   if (maxMargingJson < jsonMarg) {
                     maxMargingJson = jsonMarg
                   }
   
                   jsonX += (maxMargingJson);
                   jsonX =  serializeJsonX(jsonX,answerOptions.length)
   
   
   
                   xOffset += maxMarging
   
                   page = pdfDoc.addPage([pageWidth, pageHeight]);
                   xOffset = xOffsetStart;
                   yOffset = pageHeight - 30;
                   // await drawImageOnPage(page, xOffset - 20, yOffset -= 15, 15, 15); // Adjust width and height as needed
                   pageCounter++;
                 } else {
                   var marg = bubbleSpacing * answerOptions.length + calculateColumnMargin(page.getWidth(), xOffsetStart, bubbleSpacing, maxColumns);
                   if (maxMarging < marg) {
                     maxMarging = marg
                   }
                   const jsonMarg = (answerOptions.length) * 25
   
                   if (maxMargingJson < jsonMarg) {
                     maxMargingJson = jsonMarg
                   }
                   jsonX += (maxMargingJson);
                   jsonX =  serializeJsonX(jsonX,answerOptions.length)
                   // xOffset += maxMarging
                   // console.log(jsonX);
   
                   xOffset += bubbleSpacing * answerOptions.length + calculateColumnMargin(page.getWidth(), xOffsetStart, bubbleSpacing, maxColumns);
                   var yOffsetImg = yOffsetStart;
                   if (pageCounter == 0) {
                     yOffset = yOffsetStart;
                     yOffsetImg = yOffsetStart;
                     jsonY = jsonYStart
                   } else {
                     yOffset = pageHeight - 45;
                     yOffsetImg = pageHeight - 30;
                   }
                 }
               }
               if (xOffset + columnWidthNeeded > pageWidth - xOffsetStart) {
   
                 var marg = bubbleSpacing * answerOptions.length + calculateColumnMargin(page.getWidth(), xOffsetStart, bubbleSpacing, maxColumns);
                 if (maxMarging < marg) {
                   maxMarging = marg
                 }
                 jsonMarg = (answerOptions.length) * 25
   
                 if (maxMargingJson < jsonMarg) {
                   maxMargingJson = jsonMarg
                 }
                 jsonX += (maxMargingJson);
                 jsonX =  serializeJsonX(jsonX,answerOptions.length)
                 var yOffsetImg = yOffsetStart;
                 if (pageCounter == 0) {
                   yOffsetImg = yOffsetStart;
   
                 } else {
                   yOffsetImg = pageHeight - 30;
                 }
   
   
                 // await drawImageOnPage(page, pageWidth - 40, yOffset, 15, 15); // Adjust width and height as needed
                 await drawImageOnPage(page, xOffsetStart - 30, 15, 15, 15); // Adjust width and height as needed
                 await drawImageOnPage(page, pageWidth - 40, 15, 15, 15); // Adjust width and height as needed
                 page = pdfDoc.addPage([pageWidth, pageHeight]);
                 xOffset = xOffsetStart;
                 yOffset = pageHeight - 30;
                 await drawImageOnPage(page, pageWidth - 40, yOffset-=15, 15, 15); // Adjust width and height as needed
                 await drawImageOnPage(page, xOffsetStart - 30, yOffset , 15, 15); // Adjust width and height as needed
                 pageCounter++;
               }
               let questionsInSlotb = Math.min(questionsPerSlot, section.questions - slot * questionsPerSlot);
               var bufferSpace = questionsInSlotb - questionsInSlot
               var sectionQuestionCounter = 0
               for (let i = 0; i < questionsInSlot + bufferSpace; i++) {
                 if (i === 0) {
   
   
                   if (sloatCounter % 5 == 0) {
   
                     jsonY += 15
                   } else {
                     jsonY += 5
                   }
   
                   if (jsonY == 350) {
                     jsonY = 345
                   }
                   if (jsonY == 530) {
                     jsonY = 525
                   }
                   if (jsonY == 445) {
                     jsonY = 445
                   }
                   if (jsonY ==  435) {
                     jsonY = 445
                   }
                   if (jsonY == 440) {
                     jsonY = 445
                   }
                   if (jsonY == 430) {
                     jsonY = 445
                   }
                   if (jsonY == 625) {
                     jsonY = 640
                   }
                   if (jsonY == 620) {
                     jsonY = 640
                   }
                   if (jsonY ==  640) {
                     jsonY = 640
                   }
                   if (jsonY == 635) {
                     jsonY = 640
                   }
                   if (jsonY == 630) {
                     jsonY = 640
                   }
                   if (jsonY == 610) {
                     jsonY = 640
                   }
                   if (jsonY == 520) {
                     jsonY = 540
                   }
                   if (jsonY == 540) {
                     jsonY = 540
                   }
                   if (jsonY == 525) {
                     jsonY = 540
                   }
                   if (jsonY == 705) {
                     jsonY = 735
                   }
                   if (jsonY == 720) {
                     jsonY = 735
                   }
                   if (jsonY == 725) {
                     jsonY = 735
                   }
                   if (jsonY ==   730) {
                     jsonY = 735
                   }
                   if (jsonY == 700) {
                     jsonY = 735
                   }
                   var strBlockNumber = generateUserCode(sloatCounter + 1, 2)
                   var key = "q" + strBlockNumber + "block"
                   label = [`q${counter}..${counter + questionsInSlot - 1}`]
                   var subObject = {}
                   subObject["origin"] = [parseInt(jsonX), parseInt(jsonY)];
                   subObject["bubblesGap"] = 15;
                   subObject["labelsGap"] = 15;
                   subObject["fieldLabels"] = label;
                   subObject["fieldType"] = "QTYPE_MCQ" + ((section.answerOptions).length);
                   objOutput[key] = subObject
                   yOffset -= 30;
                   sloatCounter++
                 }
                 jsonY += 10
                 if (i == 0 && sloatCounter % 2 == 0) {
                   // console.log(i);
                   // jsonY+=10
                   jsonY += 40
                 } else if (i == 0 && sloatCounter % 2 != 0) {
                   jsonY += 30
                 }
                 // if(i==1){
                 //    jsonY-=40
                 // }else   if(i==3){
                 //    jsonY-=10
                 // }else if(i>=2){
                 //    jsonY+=15
                 // }
                 if ((i + 1) >= bufferSpace) {
                   drawText(`${generateUserCode(counter, 3)}.`, xOffset, yOffset - i * bubbleSpacing, {
                     fontSize: fontSize
                   });
                   for (let j = 0; j < answerOptions.length; j++) {
                     drawCircle(xOffset + 20 + j * bubbleSpacing, yOffset - i * bubbleSpacing, bubbleRadius, answerOptions[j]);
                   }
                   counter++;
                   sectionQuestionCounter++;
                 }
               }
               yOffset -= (questionsInSlot - 1) * bubbleSpacing;
               if (yOffset - 20 < 30) {
                 columnFull = true;
                 var marg = bubbleSpacing * answerOptions.length + calculateColumnMargin(page.getWidth(), xOffsetStart, bubbleSpacing, maxColumns);
                 if (maxMarging < marg) {
                   maxMarging = marg
                 }
                 jsonMarg = (answerOptions.length) * 25
   
                 if (maxMargingJson < jsonMarg) {
                   maxMargingJson = jsonMarg
                 }
                 jsonX += (maxMargingJson);
                 jsonX = serializeJsonX(jsonX,answerOptions.length)
                 xOffset += maxMarging
   
                 var yOffsetImg = yOffsetStart;
                 if (pageCounter == 0) {
                   yOffset = yOffsetStart;
                   yOffsetImg = yOffsetStart;
                   jsonY = jsonYStart
                 } else {
                   yOffset = pageHeight - 30;
                   yOffsetImg = pageHeight - 30;
                 }
                 if (xOffset >= (pageWidth - xOffsetStart)) {
   
                   // await drawImageOnPage(page, pageWidth - 40, yOffset, 15, 15); // Adjust width and height as needed
                   // await drawImageOnPage(page, xOffsetStart - 30, 15, 15, 15); // Adjust width and height as needed
                   // await drawImageOnPage(page, pageWidth - 40, 15, 15, 15); // Adjust width and height as needed
                   page = pdfDoc.addPage([pageWidth, pageHeight]);
                   xOffset = xOffsetStart;
                   yOffset = pageHeight - 30;
                   // await drawImageOnPage(page, xOffset - 20, yOffset -= 15, 15, 15); // Adjust width and height as needed
                   pageCounter++;
                 }
               } else {
                 var yOffsetImg = 0
                 if (pageCounter == 0) {
                   yOffsetImg = yOffsetStart;
   
                 } else {
                   yOffsetImg = pageHeight - 30;
                 }
                 if (xOffset >= (pageWidth - xOffsetStart)) {
   
                   page = pdfDoc.addPage([pageWidth, pageHeight]);
                   xOffset = xOffsetStart;
                   yOffset = pageHeight - 30;
                   // await drawImageOnPage(page, xOffset - 20, yOffset -= 15, 15, 15); // Adjust width and height as needed
                   pageCounter++;
                 }
                 columnFull = true;
               }
             }
           }
         }
       }
       var yOffsetImg = yOffsetStart;
       if (pageCounter == 0) {
         yOffsetImg = yOffsetStart;
         // jsonY = jsonYStart
       } else {
         yOffsetImg = pageHeight - 30;
       }
       // Bottoms
       await drawImageOnPage(page, xOffsetStart - 30, 15, 15, 15); // Adjust width and height as needed 
       await drawImageOnPage(page, pageWidth - 40, 15, 15, 15); // Adjust width and height as needed
       templateJson["fieldBlocks"] = objOutput;
      // Convert JSON object to a string
      const pdfBytes = await pdfDoc.save();
      const outputPath = 'auto_adjusted_bubble_sheet.pdf'; // Local output path
      fs.writeFileSync(outputPath, pdfBytes);
      const uniqueSuffix = Date.now();
      // Upload the PDF to Azure Blob Storage
      const blobService = azure.createBlobService(fn.connectionString);
      const pdfFileName = `${uniqueSuffix}.pdf`; // Replace with the d
      blobService.createBlockBlobFromLocalFile(fn.container, pdfFileName, outputPath,
         (error, result, response) => {
            if (error) {
               console.error('Error uploading the PDF:', error);
            } else {
               console.log('PDF uploaded successfully!');
               // Optionally, you can delete the local file after uploading it to Azure Blob Storage
               fs.unlink(outputPath, (unlinkError) => {
                  if (unlinkError) {
                     console.error('Error deleting the local PDF file:', unlinkError);
                  } else {
                     console.log('Local PDF file deleted.');
                  }
               });
            }
         });
      resData = [{
         "url": getBlobTempPublicUrl(pdfFileName),
         "name": (pdfFileName),
         "templete": templateJson
      }]
      successResponse(res, "success", resData)
      // } catch (error) {
      //    errorResponse(res, "Something Went Wrong", error)
      // }
   }
}
// const generateOMR = async (req, res) => {
//     const data = req.body.data || "";
//     if (fn.validateData(data)) {
//         errorResponse(res, "data Is Required")
//     } else {
//         try {
//             const generateUserCode = (userId, end) => {
//                 var code = "";
//                 strlen = ((userId).toString()).length // find length
//                 for (var i = 0; i < (end - (strlen)); i++) {
//                     code += "0";
//                 }
//                 return code + (userId)
//             }
//             const PDFDocument = require('pdfkit');
//             const fs = require('fs');
//             // Add OMR elements to the PDF for each section
//             var spacing = 10;
//             var yIncrement = 10;
//             var bubbleSize = spacing - 2;
//             var origx = 40;
//             var origy = 350;
//             var x = origx;
//             var questionCounter = 0;
//             var page = 0;
//             var hightStart = 0;
//             var labelStartY = 0;
//             // Default  Header  
//             var fontSize = spacing
//             const isLayoutCustome = data["isLayoutCustome"]
//             origx = 100
//             // end
//             var noOfQuestion = 0;
//             var subjectsArr = JSON.parse(data["subjects"])
//             for (let s = 0; s < subjectsArr.length; s++) {
//                 const subjects = subjectsArr[s];
//                 for (let h = 0; h < subjects.sections.length; h++) {
//                     const section = subjects.sections[h];
//                     for (let k = 0; k < section.questions; k++) {
//                         noOfQuestion++
//                     }
//                 }
//             }
//             var noOfBlock = Math.ceil(noOfQuestion / 5)
//             var targetRow = data["rows"]
//             var targetColumn = data["column"]
//             if (isLayoutCustome == "0") {
//                 targetRow = data["rows"]
//                 targetColumn = data["column"]
//             } else {
//                 var col = rowAndColumnGenerator(noOfBlock)
//                 console.log(col);
//                 targetRow = col["rows"]
//                 targetColumn = col["cols"]
//             }
//             function rowAndColumnGenerator(n) {
//                 let rows;
//                 let cols;
//                 // Find factors of the given number
//                 for (let i = 1; i <= Math.sqrt(n); i++) {
//                     if (n % i === 0) {
//                         rows = i;
//                         cols = n / i;
//                     }
//                 }
//                 // Adjust rows and columns to minimize the difference
//                 if (cols < rows) {
//                     [rows, cols] = [cols, rows];
//                 }
//                 // Adjust rows and columns to meet the difference constraint
//                 if (cols - rows > 3) {
//                     const mid = Math.floor((rows + cols) / 2);
//                     rows = mid;
//                     cols = mid;
//                 }
//                 if (rows == 1 && cols < 4) {
//                     rows = cols
//                     col = 1
//                 }
//                 return {
//                     rows: rows,
//                     cols: cols
//                 };
//             }
//             x = origx
//             const newLine = (x, y) => {
//                 var pageHight = 0;
//                 var pageWidth = 0;
//                 if (targetRow * targetColumn <= 9) {
//                     size = "A4"
//                     pageHight = 740;
//                     const first = 200
//                     const second = 300
//                     const third = 300;
//                     const forth = 480
//                     if (x == origx) {
//                         x = first;
//                     } else if (x == first) {
//                         x = second
//                     } else if (x == second) {
//                         x = third
//                     } else if (x == third) {
//                         // x = forth
//                     }
//                     if (page == 0) {
//                         y = origy
//                     } else {
//                         y = 100
//                     }
//                 } else if (9 < targetRow * targetColumn && targetRow * targetColumn <= 16 && targetColumn <= 5) {
//                     size = "A4"
//                     pageHight = 740;
//                     const first = 200
//                     const second = 300
//                     const third = 400;
//                     const forth = 500
//                     if (x == origx) {
//                         x = first;
//                     } else if (x == first) {
//                         x = second
//                     } else if (x == second) {
//                         x = third
//                     } else if (x == third) {
//                         x = forth
//                     }
//                     if (page == 0) {
//                         y = origy
//                     } else {
//                         y = 100
//                     }
//                 } else if (25 < targetRow * targetColumn && targetRow * targetColumn <= 70 && targetColumn <= 10) {
//                     size = "A3"
//                     var pageHight = 4861;
//                     var pageWidth = 3408;
//                     const first = 200;
//                     const second = 300;
//                     const third = 400;
//                     const forth = 500;
//                     const fifth = 600;
//                     const sixth = 700;
//                     if (x == origx) {
//                         x = first;
//                     } else if (x == first) {
//                         x = second
//                     } else if (x == second) {
//                         x = third
//                     } else if (x == third) {
//                         x = forth
//                     } else if (x == forth) {
//                         x = fifth
//                     } else if (x == fifth) {
//                         x = sixth
//                     }
//                     if (page == 0) {
//                         y = origy
//                     } else {
//                         y = 100
//                     }
//                 } else {
//                     size = "A2"
//                     var pageHight = 5016;
//                     var pageWidth = 4060;
//                     const first = 200;
//                     const second = 300;
//                     const third = 400;
//                     const forth = 500;
//                     const fifth = 600;
//                     const sixth = 700;
//                     const seventh = 800;
//                     const eighth = 900;
//                     const ninegth = 1000;
//                     const tenth = 1000;
//                     if (x == origx) {
//                         x = first;
//                     } else if (x == first) {
//                         x = second
//                     } else if (x == second) {
//                         x = third
//                     } else if (x == third) {
//                         x = forth
//                     } else if (x == forth) {
//                         x = fifth
//                     } else if (x == fifth) {
//                         x = sixth
//                     } else if (x == sixth) {
//                         x = seventh
//                     } else if (x == seventh) {
//                         x = eighth
//                     } else if (x == eighth) {
//                         x = ninegth
//                     } else if (x == ninegth) {
//                         x = tenth
//                     }
//                     if (page == 0) {
//                         y = origy
//                     } else {
//                         y = 100
//                     }
//                 }
//                 return { x, y, size, pageHight, pageWidth }
//             }
//             obj = newLine()
//             const pageHight = obj.pageHight
//             const pageWidth = obj.pageWidth
//             const doc = new PDFDocument({ size: obj.size });
//             // Define the OMR sheet template
//             var subjectsArr = JSON.parse(data["subjects"])
//             if (data.headerType == 0) {
//                 var width = 0
//                 if (obj.size == "A4") {
//                     width = 400
//                 } else if (obj.size == "A3") {
//                     width = 650
//                 } else if (obj.size == "A2") {
//                     width = 1000
//                 }
//                 doc.lineJoin('miter')
//                     .rect(x, 20, width, 50)
//                     .stroke();
//                 doc.lineJoin('miter')
//                     .rect(x, 45, width, 50)
//                     .stroke();
//                 doc.fontSize(10).text("Name :", x + 10, 30);
//                 doc.fontSize(10).text("Exam :", x + 10, 55);
//                 doc.fontSize(10).text("Date :", x + 10, 80);
//             } else if (data.headerType == 1) {
//                 var width = 0
//                 if (obj.size == "A4") {
//                     width = 400
//                 } else if (obj.size == "A3") {
//                     width = 650
//                 } else if (obj.size == "A2") {
//                     width = 1000
//                 }
//                 doc.lineJoin('miter')
//                     .rect(x, 20, width - 25, 25)
//                     .stroke();
//                 doc.lineJoin('miter')
//                     .rect(x, 45, (width / 2), 25)
//                     .stroke();
//                 doc.lineJoin('miter')
//                     .rect(x + (width / 2), 45, (width / 2) - 25, 25)
//                     .stroke();
//                 doc.fontSize(10).text("Name :", x + 10, 30);
//                 doc.fontSize(10).text("Exam :", x + 10, 55);
//                 doc.fontSize(10).text("Date :", x + (width / 2) + 10, 55);
//             } else if (data.headerType == 2) {
//                 var width = 0
//                 if (obj.size == "A4") {
//                     width = 400
//                 } else if (obj.size == "A3") {
//                     width = 650
//                 } else if (obj.size == "A2") {
//                     width = 1000
//                 }
//                 var hightStart = 45;
//                 var labelStartY = 55;
//                 doc.lineJoin('miter')
//                     .rect(x, hightStart, width - 25, 25)
//                     .stroke();
//                 doc.fontSize(10).text("Name :", x + 10, labelStartY);
//                 hightStart += 25
//                 labelStartY += 25
//                 doc.lineJoin('miter')
//                     .rect(x, hightStart, width - 25, 25)
//                     .stroke();
//                 doc.fontSize(10).text("Exam :", x + 10, labelStartY);
//                 hightStart += 25
//                 labelStartY += 25
//                 for (let i = 0; i < data.labels.length; i++) {
//                     const element = data.labels[i];
//                     if (i % 2 == 0) {
//                         if (i == (data.labels.length - 1)) {
//                             doc.lineJoin('miter')
//                                 .rect(x, hightStart, width - 25, 25)
//                                 .stroke();
//                             doc.fontSize(10).text(element.labelName + ":", x + 10, labelStartY);
//                             hightStart += 25
//                             labelStartY += 25
//                         } else {
//                             doc.lineJoin('miter')
//                                 .rect(x, hightStart, (width / 2) - 25, 25)
//                                 .stroke();
//                             doc.fontSize(10).text(element.labelName + ":", x + (width / 2) - 15, labelStartY);
//                         }
//                     } else {
//                         doc.lineJoin('miter')
//                             .rect(x, hightStart, width - 25, 25)
//                             .stroke();
//                         doc.fontSize(10).text(element.labelName + ":", x + 10, labelStartY);
//                         hightStart += 25;
//                         labelStartY += 25;
//                     }
//                 }
//             }
//             var rollNumberY = (hightStart == 0) ? spacing * 15 : (hightStart + 50)
//             doc.fontSize(fontSize).text(("Set"), x + 135, rollNumberY - 40);
//             // sets 
//             for (let i = 0; i < data.examSet; i++) {
//                 var circleSpacings = x + 140 + i * spacing;
//                 doc.fontSize(fontSize).text((String.fromCharCode(i + 65)), circleSpacings - 5, rollNumberY - 20);
//             }
//             doc.lineWidth(0.2);
//             for (let i = 0; i < data.examSet; i++) {
//                 var circleSpacings = x + 140 + i * spacing;
//                 doc.circle(circleSpacings, rollNumberY + 2, bubbleSize / 2).stroke();
//             }
//             // Roll Number
//             doc.fontSize(fontSize).text(("Roll Number"), x - 05, rollNumberY - 40);
//             for (let i = 0; i < data.roleNumbeDigit; i++) {
//                 var circleSpacings = x + i * spacing;
//                 doc.lineJoin('miter')
//                     .rect(circleSpacings - 5, rollNumberY - 20, 10, 10)
//                     .stroke();
//             }
//             doc.lineWidth(0.2);
//             for (let j = 0; j < 10; j++) {
//                 doc.fontSize(yIncrement).text((j + "."), x - 15, rollNumberY);
//                 for (let i = 0; i < data.roleNumbeDigit; i++) {
//                     var circleSpacings = x + i * spacing;
//                     doc.circle(circleSpacings, rollNumberY + 2, bubbleSize / 2).stroke();
//                 }
//                 rollNumberY += yIncrement;
//             }
//             diffX = x + data.roleNumbeDigit * spacing
//             diff = rollNumberY - origy
//             if (diff > 0) {
//                 origy += diff + 20
//             } else {
//                 origy
//             }
//             let y = origy;
//             var subjectsArr = JSON.parse(data["subjects"])
//             // xspacings
//             var rows = 0;
//             var column = -1;
//             // end
//             for (let s = 0; s < subjectsArr.length; s++) {
//                 const subjects = subjectsArr[s];
//                 for (let h = 0; h < subjects.sections.length; h++) {
//                     const section = subjects.sections[h];
//                     if (y >= pageHight) {
//                         var obj = newLine(x, y)
//                         x = obj.x
//                         y = obj.y
//                     }
//                     doc.lineWidth(0.2);
//                     if (h != 0) {
//                         y += spacing + 5
//                     }
//                     for (let k = 0; k < section.questions; k++) {
//                         questionCounter++
//                         if (k % 5 == 0) {
//                             if (++column >= targetRow) {
//                                 if (++rows < targetColumn) {
//                                     var obj = newLine(x, y)
//                                     x = obj.x
//                                     y = obj.y
//                                     column = 0
//                                 } else {
//                                     doc.addPage();
//                                     x = origx;
//                                     page++;
//                                     rows = 0
//                                     column = 0
//                                 }
//                                 if (page == 0) {
//                                     y = origy - 15
//                                 } else {
//                                     y = 80
//                                 }
//                             }
//                             if (y + 60 >= pageHight) {
//                                 var obj = newLine(x, y)
//                                 x = obj.x
//                                 y = obj.y
//                             }
//                         }
//                         if (h == 0 && k == 0) {
//                             if (s != 0) {
//                                 y += 10
//                             } else {
//                                 origy += 10
//                                 y += 10
//                             }
//                             if (data.subjectInColume == 1 && s != 0) {
//                                 var obj = newLine(x, y)
//                                 x = obj.x
//                                 y = obj.y
//                             }
//                             doc.fontSize(fontSize).text(subjects.subjectName, x + spacing, y - spacing);
//                         }
//                         if (k % 5 == 0) {
//                             if (k != 0) {
//                                 y += (yIncrement + 5)
//                             } else {
//                                 y += 6
//                             }
//                         }
//                         var options = JSON.parse(section.answerOptions)
//                         for (let i = 0; i < options.length; i++) {
//                             var circleSpacings = x + 12 + i * spacing;
//                             if (y >= pageHight) {
//                                 var obj = newLine(x, y)
//                                 x = obj.x
//                                 y = obj.y
//                             }
//                             var circleSpacings = x + 12 + i * spacing;
//                         }
//                         doc.fontSize(fontSize).text(`${generateUserCode(questionCounter, 3)}.`, x - 10, y);
//                         for (let i = 0; i < options.length; i++) {
//                             if (y >= pageHight) {
//                                 var obj = newLine(x, y)
//                                 x = obj.x
//                                 y = obj.y
//                             }
//                             var circleSpacings = x + 15 + i * spacing;
//                             doc.circle(circleSpacings, y + 2, bubbleSize / 2).stroke();
//                         }
//                         y += yIncrement;
//                     }
//                 }
//                 if (y >= pageHight) {
//                     var obj = newLine(x, y)
//                     x = obj.x;
//                     y = obj.y;
//                 }
//             }
//             const uniqueSuffix = Date.now();
//             var pdfFileName = `${uniqueSuffix}.pdf`
//             // doc.pipe(fs.createWriteStream(`JustEvelve/images/${name}`));
//             const stream = doc.pipe(fs.createWriteStream(pdfFileName));
//             stream.on('finish', () => {
//                 const blobService = azure.createBlobService(fn.connectionString);
//                 // Upload the PDF to Azure Blob Storage
//                 blobService.createBlockBlobFromLocalFile(
//                   fn.container,
//                   pdfFileName,
//                   pdfFileName,
//                   (error, result, response) => {
//                     if (error) {
//                       console.error('Error uploading the PDF:', error);
//                     } else {
//                       console.log('PDF uploaded successfully!');
//                       // Optionally, you can delete the local file after uploading it to Azure Blob Storage
//                       fs.unlink(pdfFileName, (unlinkError) => {
//                         if (unlinkError) {
//                           console.error('Error deleting the local PDF file:', unlinkError);
//                         } else {
//                           console.log('Local PDF file deleted.');
//                         }
//                       });
//                     }
//                   }
//                 );
//               });
//             doc.end();
//             resData = [{ "url": getBlobTempPublicUrl(pdfFileName), "name": (pdfFileName) }]
//             successResponse(res, "success", resData)
//         } catch (error) {
//             errorResponse(res, "Something Went Wrong", error)
//         }
//     }
// }
const examList = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId Is Required")
   } else {
      try {
         var result = await getResult("SELECT `instituteId` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0' ")
         if (result.length != 0) {
            var checkExam = await getResult("SELECT examId,examCode,examName,date,`sheetImage` ,`answerKey` FROM `exam` WHERE `instituteId`='" + instituteId + "'  AND `delete`='0'");
            for (let i = 0; i < checkExam.length; i++) {
               const checkExams = fn.cleanObject(checkExam[i]);
               checkExams["sheetImage"] = getBlobTempPublicUrl(checkExams["sheetImage"])
               checkExams["date"] = moment(checkExams["date"]).format("DD-MM-YYYY")
               checkExams["isKeySubmited"] = !fn.validateData(checkExams["answerKey"])
            }
            successResponse(res, "success", checkExam)
         } else {
            errorResponse(res, "Invalid institute. ")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong.", error)
      }
   }
}
const examListOfTeacher = async (req, res) => {
   const teacherId = req.body.teacherId || "";
   const instituteId = req.body.instituteId || "";
   if (fn.validateData(teacherId)) {
      errorResponse(res, "teacherId Is Required")
   } else if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId Is Required")
   } else {
      try {
         var classList = [];
         var result = await getResult("SELECT * FROM `teacherdepartment` WHERE `userId` ='" + teacherId + "' AND `delete`='0' AND `instituteId`='" + instituteId + "' ")
         if (result.length != 0) {
            for (let i = 0; i < result.length; i++) {
               const ele = result[i];
               if (ele["divisionType"] == "class") {
                  classList.push(ele["divisionId"])
               }
            }
            data = [];
            for (let i = 0; i < classList.length; i++) {
               var exams = await getResult("SELECT date,examName,noOfScans,sheetImage,examId FROM `exam` WHERE `structureId` ='" + classList[i] + "' AND `structureType`='class' AND `delete`='0'")
               for (let i = 0; i < exams.length; i++) {
                  const exam = exams[i];
                  exam["sheetImage"] = getBlobTempPublicUrl(exam["sheetImage"])
                  exam["date"] = moment(exam["date"], ["YYYY-MM-DD"]).format("DD-MM-YYYY")
                  data.push(exam)
               }
            }
            successResponse(res, "success", data)
         } else {
            errorResponse(res, "Invalid Teacher")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const deleteTeacher = async (req, res) => {
   const teacherId = req.body.teacherId || "";
   const instituteId = req.body.instituteId || "";
   if (fn.validateData(teacherId)) {
      errorResponse(res, "teacherId Is Required")
   } else if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId Is Required")
   } else {
      try {
         var result = await getResult("SELECT `instituteId` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0' ")
         if (result.length != 0) {
            var classes = await getResult("SELECT `userId`FROM `teacherdepartment` WHERE  `delete`='0' AND `userId`='" + teacherId + "' ");
            if (classes.length != 0) {
               var classes = await getResult("UPDATE `teacherdepartment` SET `delete`='1' WHERE   `userId`='" + teacherId + "' AND  `instituteId`='" + instituteId + "'  ");
               successResponse(res, "success",)
            } else {
               errorResponse(res, "Invalid Teacher ")
            }
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const editTeacher = async (req, res) => {
   const teacherId = req.body.teacherId || "";
   const structureCode = req.body.structureCode || "";
   const fullName = req.body.fullName || "";
   const mobileNumber = req.body.mobileNumber || "";
   const email = req.body.email || "";
   const instituteId = req.body.instituteId || "";
   if (fn.validateData(teacherId)) {
      errorResponse(res, "teacherId is Required")
   } else if (fn.validateData(structureCode)) {
      errorResponse(res, "structureCode is Required")
   } else if (fn.validateData(fullName)) {
      errorResponse(res, "fullName is Required")
   } else if (fn.validateData(email)) {
      errorResponse(res, "email is Required")
   } else if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId is Required")
   } else {
      try {
         const connection = "";
         var result = await getResult("SELECT `instituteId`,`instituteCode` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0' ")
         if (result.length != 0) {
            var data = await getDatafromCode(structureCode, instituteId, result[0]["instituteCode"], connection);
            if (data.length != 0) {
               var type = data[0]["type"];
               var check = await getResult("SELECT * FROM `user` WHERE `delete`='0' AND `email`='" + email + "'AND userId != " + teacherId + "");
               if (check.length != 0) {
                  errorResponse(res, "Email Already Taken.")
               } else {
                  const checkTeacher = await fn.checkUser(teacherId)
                  if (checkTeacher[0]["isTeacher"] == 1) {
                     var checkDivision = await getResult("SELECT * FROM `teacherdepartment` WHERE `divisionId`='" + data[0][type + "Id"] + "'AND `divisionType`='" + type + "' AND `instituteId`='" + instituteId + "'  AND `userId`='" + teacherId + "' AND `delete`='0'  ");
                     if (checkDivision.length == 0) {
                        var checkDivision = await getResult("INSERT INTO  teacherdepartment SET  `divisionId`='" + data[0][type + "Id"] + "', `divisionType`='" + type + "' , `instituteId`='" + instituteId + "' ,`userId`='" + teacherId + "'");
                     }
                     await getResult("UPDATE `user` SET `fullName`='" + mysql_real_escape_string(fullName) + "' , `email`='" + email + "',`mobileNumber`='" + mobileNumber + "' WHERE  `delete`='0' AND `userId`='" + teacherId + "'")
                     successResponse(res, "success")
                  } else {
                     errorResponse(res, "Invalid Teacher")
                  }
               }
            } else {
               errorResponse(res, "No division or class found With This Code in Your Institute",)
            }
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const deleteStudent = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   const studentId = req.body.studentId || "";
   if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId Is Required")
   } else if (fn.validateData(studentId)) {
      errorResponse(res, "studentId Is Required")
   } else {
      try {
         var result = await getResult("SELECT `instituteId`,`instituteCode` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0' ")
         if (result.length != 0) {
            var check = await getResult("SELECT * FROM `user` WHERE `instituteId`='" + instituteId + "' AND `delete`='0' AND `userId`='" + studentId + "'");
            if (check.length != 0) {
               data = await getResult("UPDATE `user` SET `classId`='0',`instituteId`='0' WHERE  `delete`='0' AND `userId`='" + studentId + "'");
               successResponse(res, "success",)
            } else {
               errorResponse(res, "Invalide Student")
            }
         } else {
            errorResponse(res, "Invalid Institute.")
         }
      } catch (error) {
         errorResponse(res, "something Went Wrong")
      }
   }
}
const editStudent = async (req, res) => {
   const classCode = req.body.classCode || "";
   const fullName = req.body.fullName || "";
   const mobileNumber = req.body.mobileNumber || "";
   const email = req.body.email || "";
   const rollNumber = req.body.rollNumber || "";
   const userId = req.body.userId || "";
   const instituteId = req.body.instituteId || "";
   const studentId = req.body.studentId || "";
   if (fn.validateData(fullName)) {
      errorResponse(res, "fullName is required",)
   } else if (fn.validateData(email)) {
      errorResponse(res, "email is required",)
   } else if (fn.validateData(rollNumber)) {
      errorResponse(res, "rollNumber is required",)
   } else if (fn.validateData(userId)) {
      errorResponse(res, "userId is required",)
   } else if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId is required",)
   } else if (fn.validateData(studentId)) {
      errorResponse(res, "studentId is required",)
   } else {
      try {
         var result = await getResult("SELECT `completedSteps`,`instituteCode` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            var check = await getResult("SELECT userId FROM `user` WHERE  `email`='" + email + "' AND `delete`='0' AND `userId`!='" + studentId + "'  ");
            if (check.length == 0) {
               var insert = await getResult("UPDATE  `user` SET `instituteId`='" + instituteId + "',`fullName`='" + fullName + "',`mobileNumber`='" + mobileNumber + "',`email`='" + email + "',`rollNumber`='" + rollNumber + "' WHERE `userId`='" + studentId + "'  ");
               successResponse(res, "success",)
            } else {
               errorResponse(res, "Student Already Registerd With Your Institute",)
            }
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const deleteClass = async (req, res) => {
   const classId = req.body.classId || "";
   const instituteId = req.body.instituteId || "";
   if (fn.validateData(classId)) {
      errorResponse(res, "classId Is Required")
   } else if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId Is Required")
   } else {
      try {
         var result = await getResult("SELECT `completedSteps`,`instituteCode` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            var checkClass = await getResult("SELECT * FROM `class` WHERE `instituteId`='" + instituteId + "' AND `delete`='0' AND `classId`='" + classId + "'");
            if (checkClass.length != 0) {
               await getResult("update `class` SET `status`='1' WHERE `instituteId`='" + instituteId + "' AND `delete`='0' AND `classId`='" + classId + "'");
               await getResult("update `student` SET `classId`='0' WHERE `delete`='0' AND `classId`='" + classId + "'");
               successResponse(res, "success")
            } else {
               errorResponse(res, "invalid Class")
            }
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "something went Wrong ")
      }
   }
}
const editClass = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   const classId = req.body.classId || ""
   const className = req.body.className || ""
   const studentArr = req.body.studentArr || []
   if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId Is Required")
   } else if (fn.validateData(classId)) {
      errorResponse(res, "classId Is Required")
   } else if (fn.validateData(className)) {
      errorResponse(res, "className Is Required")
   } else {
      try {
         var result = await getResult("SELECT `completedSteps`,`instituteCode` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            var checkClass = await getResult("SELECT * FROM `class` WHERE `instituteId`='" + instituteId + "' AND `delete`='0' AND `classId`='" + classId + "'");
            if (checkClass.length != 0) {
               await getResult(" UPDATE `class` SET `className`='" + mysql_real_escape_string(className) + "' WHERE `instituteId`='" + instituteId + "' AND `delete`='0' AND `classId`='" + classId + "'");
               for (let i = 0; i < studentArr.length; i++) {
                  const element = studentArr[i];
                  update = await getResult("UPDATE `user` SET classId='" + classId + "' WHERE `userId`='" + element + "' ")
               }
               successResponse(res, "success")
            } else {
               errorResponse(res, "invalid Class")
            }
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "something went Wrong", error)
      }
   }
}
const TeacherDetails = async (req, res) => {
   const teacherId = req.body.teacherId
   const instituteId = req.body.instituteId
   if (fn.validateData(teacherId)) {
      errorResponse(res, "teacherId Is Required")
   } else if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId Is Required")
   } else {
      try {
         var result = await getResult("SELECT `completedSteps`,`instituteCode` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            var checkTeacher = await getResult("SELECT * FROM `user` WHERE `delete`='0' AND `userId`='" + teacherId + "'");
            var data = []
            var className = "";
            if (checkTeacher.length != 0) {
               var classId = await getResult("SELECT `divisionId` AS `classId` FROM `teacherdepartment` WHERE `delete`='0' AND `divisionType`='class' AND `userId`='" + teacherId + "' AND `instituteId`='" + instituteId + "' AND `delete`='0' ORDER BY teacherdepartmentId DESC");
               var teacher = checkTeacher[0];
               const obj = {};
               obj["fullName"] = (teacher["fullName"] || "")
               obj["mobileNumber"] = (teacher["mobileNumber"] || "")
               obj["email"] = (teacher["email"] || "")
               obj["teacherId"] = (teacher["userId"] || "")
               obj["teacherCode"] = (teacher["userCode"] || "")
               obj["classId"] = (classId.length != 0) ? classId[0]["classId"] : "0"
               data.push(obj)
               successResponse(res, "success", data)
            } else {
               errorResponse(res, "Invalid Teacher")
            }
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "something went Wrong", error)
      }
   }
}
const studentDetails = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   const studentId = req.body.studentId || "";
   if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId Is Required")
   } else if (fn.validateData(studentId)) {
      errorResponse(res, "studentId Is Required")
   } else {
      try {
         // const connection = await sqlConnect();
         var result = await getResult("SELECT `completedSteps`,`instituteCode` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            var checkTeacher = await getResult("SELECT className,userId,`fullName`,`mobileNumber`,`email`,`rollNumber`,`userCode`  FROM `user` JOIN `class` ON `class`.`classId`=`user`.`classId` WHERE `user`. `instituteId`='" + instituteId + "' AND `user`.`delete`='0' AND `userId`='" + studentId + "' ");
            var data = []
            if (checkTeacher.length != 0) {
               var teacher = checkTeacher[0];
               const obj = {};
               obj["fullName"] = (teacher["fullName"] || "")
               obj["mobileNumber"] = (teacher["mobileNumber"] || "")
               obj["email"] = (teacher["email"] || "")
               obj["rollNumber"] = (teacher["rollNumber"] || "")
               obj["studentCode"] = (teacher["userCode"] || "")
               obj["className"] = (teacher["className"] || "")
               data.push(obj)
               successResponse(res, "success", data)
            } else {
               errorResponse(res, "invalid Student")
            }
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "something Went wrong", error)
      }
   }
}
const emailVerificationOfInstitute = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   const otp = req.body.otp || "";
   if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId Is Required")
   } else {
      try {
         var result = await getResult("SELECT `completedSteps`,`instituteCode`,`otp` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            if (result[0]["otp"] == otp) {
               var result = await getResult("UPDATE `institute` SET `isVerified`='1' WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
               successResponse(res, "success")
            } else {
               errorResponse(res, "Invalid OTP")
            }
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "something went Wrong", error)
      }
   }
}
const deleteInstitute = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   const userId = req.body.userId || "";
   if (instituteId == null || instituteId == undefined || instituteId == "") {
      errorResponse(res, "instituteId Is Required")
   } else if (userId == null || userId == undefined || userId == "") {
      errorResponse(res, "instituteId Is Required")
   } else {
      try {
         var result = await getResult("SELECT `completedSteps`,`instituteCode`,`otp` FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
         if (result.length != 0) {
            var update = await getResult("UPDATE  `institute` SET  `delete`='1',`deletedBy`='" + userId + "',`deletedByType`='1',`deleteAt`='" + moment().format("YYYY-MM-DD HH:mm:ss") + "' WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
            successResponse(res, "success")
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const permissionList = async (req, res) => {
   const teacherId = req.body.teacherId || ""
   try {
      var result = await getResult("SELECT `name`,`permissionId` FROM `permission` WHERE `delete`='0'  ");
      var permission = []
      var checkTeacher = await fn.checkTeacher(teacherId);
      if (checkTeacher.length != 0) {
         permission = (checkTeacher[0]["permissions"] || "").split(",")
         const stringArray = permission
         permission = stringArray.map(str => parseInt(str));
      }
      for (let i = 0; i < result.length; i++) {
         const element = result[i];
         if (permission.includes(element["permissionId"])) {
            element["checked"] = 1
         } else {
            element["checked"] = 0
         }
         element["name"] = element["name"].toLowerCase().replace(/\b[a-z]/g, function (letter) {
            return letter.toUpperCase();
         });
      }
      successResponse(res, "success", result)
   } catch (error) {
      errorResponse(res, "Something Went Wrong", error)
   }
}
const setPermission = async (req, res) => {
   const teacherId = req.body.teacherId || "";
   const instituteId = req.body.instituteId || "";
   const permissionArray = req.body.permissionArray || "";
   if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId Is Required")
   } else if (fn.validateData(teacherId)) {
      errorResponse(res, "teacherId Is Required")
   } else if (fn.validateData(permissionArray)) {
      errorResponse(res, "permissionArray Is Required")
   } else {
      try {
         var check = await fn.checkInstitute(instituteId);
         if (check.length != 0) {
            var checkTeachers = await fn.checkTeacher(teacherId);
            if (checkTeachers.length != 0) {
               var update = await getResult("UPDATE `user` SET `permissions`='" + permissionArray.toString() + "' WHERE userId ='" + teacherId + "'")
               successResponse(res, "suceess")
            } else {
               errorResponse(res, "Invalid Teacher")
            }
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const getPermissionsOfTeacher = async (req, res) => {
   const teacherId = req.body.teacherId || "";
   if (fn.validateData(teacherId)) {
      errorResponse(res, "teacherId Is Required")
   } else {
      try {
         var checkTeacher = await fn.checkTeacher(teacherId);
         if (checkTeacher.length != 0) {
            var permission = await fn.teachersPermission(checkTeacher[0]["permissions"])
            successResponse(res, "success", permission)
         } else {
            errorResponse(res, "Invalid Teacher")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const exportTeachers = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId Is Required")
   } else {
      try {
         var checkInstitute = await fn.checkInstitute(instituteId);
         if (checkInstitute.length != 0) {
            var resARrr = []
            var data = await getResult("SELECT fullName,`email`,`userCode`,userId FROM `user` WHERE `instituteId`='" + instituteId + "' AND `isTeacher`='1' AND `delete`='0'")
            for (let i = 0; i < data.length; i++) {
               const element = fn.cleanObject(data[i]);
               var className = await getResult("SELECT * FROM `teacherdepartment` LEFT JOIN `class` ON `class`.`classId`=`teacherdepartment`.`divisionId` WHERE teacherdepartment.`divisionType`='class' AND teacherdepartment.`delete`='0' AND `userId`='" + element["userId"] + "' AND teacherdepartment.`instituteId`='" + instituteId + "' ")
               if (className.length != 0) {
                  resARrr.push({
                     fullName: element["fullName"],
                     email: element["email"],
                     userCode: element["userCode"],
                     className: className[0]["className"]
                  })
               }
            }
            var unique = resARrr.filter((obj, index, self) => {
               return index === self.findIndex((t) => (t.instituteId === obj.instituteId));
            });
            const ExcelJS = require('exceljs');
            // Create a new workbook
            const workbook = new ExcelJS.Workbook();
            // Add a new worksheet
            const worksheet = workbook.addWorksheet('Teachers');
            // Define the columns
            worksheet.columns = [{
               header: 'FullName',
               key: 'fullName'
            }, {
               header: 'Email',
               key: 'email'
            }, {
               header: 'Teacher Code',
               key: 'userCode'
            }, {
               header: 'Class Name',
               key: 'className'
            },];
            // Add the data
            unique.forEach((row) => {
               worksheet.addRow(row);
            });
            // // Save the workbook
            const uniqueSuffix = Date.now();
            var fileName = uniqueSuffix + ".xlsx"
            const buffer = await workbook.xlsx.writeBuffer();
            const blobService = azure.createBlobService(fn.storageaccount, fn.accesskey);
            const options = {
               contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            };
            await new Promise((resolve, reject) => {
               blobService.createBlockBlobFromText(fn.container, fileName, buffer, options,
                  (error, result, response) => {
                     if (error) {
                        reject(error);
                     } else {
                        resolve(result);
                     }
                  });
            });
            successResponse(res, "", getBlobTempPublicUrl(fileName))
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const exportStudents = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId Is Required")
   } else {
      try {
         var checkInstitute = await fn.checkInstitute(instituteId);
         if (checkInstitute.length != 0) {
            var resARrr = []
            var where = ""
            var data = await getResult("SELECT fullName, `userId` AS `studentId` ,`rollNumber`,`userCode` AS  `studentCode`,`classId`,(SELECT `className` FROM `class` WHERE `classId` =`user`.`classId` AND `delete`='0')  AS `className` FROM `user` WHERE `instituteId`='" + instituteId + "' AND `classId` !='0' AND `isTeacher`='2' " + where)
            for (let i = 0; i < data.length; i++) {
               const element = fn.cleanObject(data[i]);
               resARrr.push(element)
            }
            const ExcelJS = require('exceljs');
            // Create a new workbook
            const workbook = new ExcelJS.Workbook();
            // Add a new worksheet
            const worksheet = workbook.addWorksheet('Teachers');
            // Define the columns
            worksheet.columns = [{
               header: 'FullName',
               key: 'fullName'
            }, {
               header: 'Email',
               key: 'email'
            }, {
               header: 'Roll Number',
               key: 'rollNumber'
            }, {
               header: 'Student Code',
               key: 'studentCode'
            }, {
               header: 'Class Name',
               key: 'className'
            },];
            // Add the data
            resARrr.forEach((row) => {
               worksheet.addRow(row);
            });
            // // Save the workbook
            const uniqueSuffix = Date.now();
            var fileName = uniqueSuffix + ".xlsx"
            const buffer = await workbook.xlsx.writeBuffer();
            const blobService = azure.createBlobService(fn.storageaccount, fn.accesskey);
            const options = {
               contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            };
            await new Promise((resolve, reject) => {
               blobService.createBlockBlobFromText(fn.container, fileName, buffer, options,
                  (error, result, response) => {
                     if (error) {
                        reject(error);
                     } else {
                        resolve(result);
                     }
                  });
            });
            successResponse(res, "", getBlobTempPublicUrl(fileName))
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const examPreSet = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   const examId = req.body.examId || "";
   const reqSubjectsStr = req.body.subject || [];
   if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId Is Required")
   } else if (fn.validateData(examId)) {
      errorResponse(res, "examId Is Required")
   } else {
      try {
         var checkExam = await getResult("SELECT examId,`noOfSets`,`rollNumberDigits`,`examName`,`examCode`,`pin`,`is_preset`,`noOfScans` FROM `exam` WHERE `instituteId` = '" + instituteId + "'AND `is_preset`='1' AND `examId`='" + examId + "' AND `delete`='0' ")
         if (checkExam.length != 0) {
            const examId = checkExam[0]["examId"]
            var subjects = await getResult("SELECT `subjectName`,`noOfSection`,`examsubjectId` FROM `examsubject`  WHERE `examId` = '" + examId + "' AND `delete`='0'")
            for (let i = 0; i < subjects.length; i++) {
               const element = subjects[i];
               var sections = await getResult(" SELECT `noOfQuestions`,`questionType`,`isAllowPartialMarks`,`marksForCorrect`,`marksForInCorrect`,`isAllowOptionalAttemp` FROM `examsubjectsection` WHERE `examsubjectId`='" + element["examsubjectId"] + "' AND  `examId` = '" + examId + "' AND `delete`='0'")
               let reqSubjects = JSON.parse((reqSubjectsStr == "") ? "[]" : reqSubjectsStr)
               const sectionsNumber = reqSubjects[i];
               for (let i = 0; i < sections.length; i++) {
                  const element1 = sections[i];
                  element1["marksForCorrect"] = (parseFloat(element1["marksForCorrect"])).toFixed(1)
                  element1["marksForInCorrect"] = (parseFloat(element1["marksForInCorrect"])).toFixed(1)
                  // if (reqSubjects.length > subjects.length) {
                  if (sectionsNumber - sections.length > 0) {
                     for (let d = 0; d < sectionsNumber; d++) {
                        const section = {}
                        section["noOfQuestions"] = ""
                        section["questionType"] = ""
                        section["isAllowPartialMarks"] = ""
                        section["marksForCorrect"] = 0
                        section["isAllowOptionalAttemp"] = ""
                        section["marksForInCorrect"] = 0
                        if (sections.length + 1 <= sectionsNumber) {
                           sections.push(section)
                        }
                     }
                  }
                  // }
               }
               element["sections"] = sections
            }
            let reqSubjects = JSON.parse((reqSubjectsStr == "") ? "[]" : reqSubjectsStr)
            if (reqSubjects.length != 0) {
               var end = reqSubjects.length - subjects.length
               for (let end = 0; end < reqSubjects.length; end++) {
                  const subject = {}
                  subject["subjectName"] = ""
                  subject["noOfSection"] = ""
                  subject["examsubjectId"] = ""
                  const sectionsNumber = reqSubjects[end];
                  var sections = []
                  for (let d = 0; d < sectionsNumber; d++) {
                     const section = {}
                     section["noOfQuestions"] = ""
                     section["questionType"] = ""
                     section["isAllowPartialMarks"] = ""
                     section["marksForCorrect"] = 0
                     section["isAllowOptionalAttemp"] = ""
                     section["marksForInCorrect"] = 0
                     if (sections.length + 1 <= sectionsNumber) {
                        sections.push(section)
                     }
                  }
                  if (subjects[end] == undefined) {
                     subjects.push(subject)
                     subject["sections"] = sections
                  } else {
                     if (subjects[end].length != 0) {
                        sections.forEach(element => {
                           if (sections.length > sectionsNumber) {
                              subjects[end].sections.push(element)
                           }
                        });
                     } else {
                        subject["sections"] = sections
                     }
                  }
                  if (subjects[end].length == 0) {
                     subjects[end].push(subject)
                  }
               }
            }
            checkExam[0]["subjects"] = subjects
            successResponse(res, "success", checkExam)
         } else {
            errorResponse(res, "Invalid Exam", checkExam)
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const archiveInstitute = async (req, res) => {
   const userId = req.body.userId || "";
   const instituteId = req.body.instituteId || "";
   const status = req.body.status || "0"
   if (fn.validateData(userId)) {
      errorResponse(res, "userId is Required")
   } else if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId is Required")
   } else if (fn.validateData(status)) {
      errorResponse(res, "status is Required")
   } else {
      try {
         var result = await fn.checkInstitute(instituteId)
         if (result.length != 0) {
            var data = []
            var stateArr = ((result[0]["states"] != null && result[0]["states"] != "") ? result[0]["states"].split(',') : []);
            var instituteCode = await create_division(result[0]["instituteCode"], connection = "");
            if (stateArr.length != 0) {
               for (let i = 0; i < stateArr.length; i++) {
                  const element = stateArr[i];
                  var objs = await fn.archiveDivision(instituteCode, userId, status, 0, stateArr[i])
               }
            }
            if (status == 0) {
               var update = await fn.addSingleArchive(instituteId, 0, userId)
               successResponse(res, "success")
            } else {
               var update = await fn.removeSingleArchive(instituteId, 0, userId)
               successResponse(res, "success")
            }
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const studentArchive = async (req, res) => {
   const studentId = req.body.studentId || ""
   const userId = req.body.userId || ""
   const status = req.body.status || ""
   if (fn.validateData(studentId)) {
      errorResponse(res, "studentId Is Required")
   } else if (fn.validateData(userId)) {
      errorResponse(res, "userId Is Required")
   } else if (fn.validateData(status)) {
      errorResponse(res, "status Is Required")
   } else {
      try {
         var check = await getResult("SELECT * FROM `user` WHERE `userId`='" + studentId + "'AND `isTeacher`='2' AND `delete`='0'")
         if (check.length != 0) {
            if (status == 0) {
               var update = await fn.addSingleArchive(studentId, 1, userId)
               successResponse(res, "success")
            } else {
               var update = await fn.removeSingleArchive(studentId, 1, userId)
               successResponse(res, "success")
            }
         } else {
            errorResponse(res, "Invalid Student")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const studentArchiveList = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   const userId = req.body.userId || "";
   if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId Is Required")
   } else if (fn.validateData(userId)) {
      errorResponse(res, "userId Is Required")
   } else {
      try {
         var students = await getResult("SELECT `fullName`,`recordId`, `userCode` AS `studentCode` FROM `archives` LEFT JOIN `user` ON `archives`.`recordId`=`user`.`userId` WHERE `recordType`='1' AND `archives`.`status`='0' AND `archives`.`delete`='0' AND `user`.`delete`='0'  AND `archives`.`userId`='" + userId + "' ")
         successResponse(res, "success", students)
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const instituteArchiveList = async (req, res) => {
   const userId = req.body.userId || "";
   if (fn.validateData(userId)) {
      errorResponse(res, "userId Is Required")
   } else {
      try {
         var check = await getResult("SELECT * FROM `user` WHERE `userId`='" + userId + "' AND `delete`='0'");
         if (check.length != 0) {
            var results = await getResult("SELECT `name`,`recordId`,instituteCode FROM `archives` JOIN `institute`ON `institute`.`instituteId`=`archives`.`recordId`  WHERE `archives`.`delete`='0' AND `institute`.`delete`='0' AND `archives`.`userId`='" + userId + "' AND `recordType`='0' AND `archives`.`status`='0'");
            successResponse(res, "success", results)
         } else {
            errorResponse(res, "Invalid User")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const classArchive = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   const classId = req.body.classId || "";
   const userId = req.body.userId || "";
   const status = req.body.status || "";
   if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId Is Required")
   } else if (fn.validateData(classId)) {
      errorResponse(res, "classId Is Required")
   } else if (fn.validateData(userId)) {
      errorResponse(res, "userId Is Required")
   } else if (fn.validateData(status)) {
      errorResponse(res, "status Is Required")
   } else {
      try {
         var checkInstitute = await fn.checkInstitute(instituteId);
         if (checkInstitute.length != 0) {
            const element = checkInstitute[0];
            var classs = await fn.checkClass(classId);
            if (classs.length != 0) {
               if (classs[0]["instituteId"] == instituteId) {
                  var data = await fn.archiveSingleClass(element["instituteCode"], userId, status, classs[0]["divisionType"], classs[0]["divisionId"], classId)
                  successResponse(res, "success")
               } else {
                  errorResponse(res, "Class Does not Belongs to institute")
               }
            } else {
               errorResponse(res, "Invalid Class")
            }
         } else {
            errorResponse(res, "Invalid Institute");
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const classArchiveList = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   const userId = req.body.userId || "";
   if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId Is Required")
   } else if (fn.validateData(userId)) {
      errorResponse(res, "userId Is Required")
   } else {
      try {
         var classes = await getResult("SELECT `className`,`recordId`,classCode,`class`.`instituteId` FROM `archives` LEFT JOIN `class` ON `archives`.`recordId`=`class`.`classId` WHERE `recordType`='3' AND `archives`.`status`='0' AND `archives`.`delete`='0' AND `class`.`delete`='0' AND `userId`='" + userId + "'")
         successResponse(res, "success", classes)
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const teacherArchive = async (req, res) => {
   const teacherId = req.body.teacherId || "";
   const userId = req.body.userId || "";
   const status = req.body.status || ""
   const instituteId = req.body.instituteId || "";
   if (fn.validateData(teacherId)) {
      errorResponse(res, "teacherId Is Required")
   } else if (fn.validateData(userId)) {
      errorResponse(res, "userId Is Required")
   } else if (fn.validateData(status)) {
      errorResponse(res, "status Is Required")
   } else if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId Is Required")
   } else {
      try {
         var check = await getResult("SELECT * FROM `user` WHERE `userId`='" + teacherId + "' AND `delete`='0'  ")
         if (check.length != 0) {
            if (status == 0) {
               var update = await fn.addSingleArchive(teacherId, 2, userId)
               successResponse(res, "success")
            } else {
               var update = await fn.removeSingleArchive(teacherId, 2, userId)
               successResponse(res, "success")
            }
         } else {
            errorResponse(res, "Invalid Teacher")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const teacherArchiveList = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   const userId = req.body.userId || "";
   if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId Is Required")
   } else if (fn.validateData(userId)) {
      errorResponse(res, "userId Is Required")
   } else {
      try {
         var classes = await getResult("SELECT `fullName`,`recordId`,`userCode` AS `teacherCode`,user.instituteId FROM `archives` LEFT JOIN `user` ON `archives`.`recordId`=`user`.`userId` WHERE `recordType`='2' AND `archives`.`status`='0' AND `archives`.`delete`='0' AND `user`.`delete`='0' AND `archives`.`userId`='" + userId + "'")
         successResponse(res, "success", classes)
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const presetList = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId Is Required")
   } else {
      try {
         var check = await fn.checkInstitute(instituteId);
         if (check.length != 0) {
            var result = await getResult("SELECT `examId`,`presetName` FROM `exam` WHERE `is_preset`='1' AND `instituteId`='" + instituteId + "' AND `delete`='0'")
            for (let i = 0; i < result.length; i++) {
               const element = fn.cleanObject(result[i]);
            }
            successResponse(res, "succes", result)
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const examDetails = async (req, res) => {
   const examId = req.body.examId;
   if (fn.validateData(examId)) {
      errorResponse(res, "examId Is Required")
   } else {
      try {
         resArr = []
         var exam = await getResult("SELECT * FROM `exam` WHERE `delete`='0' AND `examId`='" + examId + "'");
         if (exam.length != 0) {
            obj = {};
            var numberOfQuestion = 0;
            const element = fn.cleanObject(exam[0])
            obj["examId"] = examId
            obj["noOfSets"] = element["noOfSets"]
            obj["rollNumberDigits"] = element["rollNumberDigits"]
            obj["examName"] = element["examName"]
            obj["examCode"] = element["examCode"]
            obj["date"] = element["date"]
            obj["pin"] = element["pin"]
            obj["noOfScans"] = element["noOfScans"]
            obj["is_preset"] = element["is_preset"]
            obj["sheetImage"] = getBlobTempPublicUrl(element["sheetImage"])
            var subject = await getResult("SELECT examsubjectId,subjectName,noOfSection FROM `examsubject` WHERE `examId`='" + examId + "' AND `delete`='0' ")
            for (let j = 0; j < subject.length; j++) {
               const element2 = fn.cleanObject(subject[j]);
               var section = await getResult("SELECT examsubjectsectionId,examId,examsubjectId,noOfQuestions,questionType FROM `examsubjectsection` WHERE `examId`='" + examId + "' AND  `examsubjectId`='" + element2["examsubjectId"] + "' AND `delete`='0' ")
               for (let k = 0; k < section.length; k++) {
                  const element3 = fn.cleanObject(section[k]);
                  numberOfQuestion += parseInt(element3["noOfQuestions"])
               }
               element2["section"] = section
            }
            obj["subject"] = subject
            obj["totalQuestion"] = numberOfQuestion
            resArr.push(obj)
            successResponse(res, "success", resArr)
         } else {
            errorResponse(res, "Invalid Exam")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const saveAnswerKey = async (req, res) => {
   const examId = req.body.examId || "";
   const key = req.body.key || "";
   if (fn.validateData(examId)) {
      errorResponse(res, "examId Is Required")
   } else if (fn.validateData(key)) {
      errorResponse(res, "key Is Required")
   } else {
      try {
         var exam = await getResult("SELECT `examId` FROM `exam` WHERE `delete`='0' AND `examId`='" + examId + "'");
         if (exam.length != 0) {
            var update = await getResult("UPDATE `exam` SET `answerKey`='" + JSON.stringify(key) + "' WHERE `examId`='" + examId + "' ")
            successResponse(res, "success",)
         } else {
            errorResponse(res, "Invalid Exam")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const examListOfStudent = async (req, res) => {
   const studentId = req.body.studentId || "";
   if (fn.validateData(studentId)) {
      errorResponse(res, "studentId Is Required");
   } else {
      try {
         var check = await getResult("SELECT * FROM `user` WHERE `userId`='" + studentId + "' AND `delete`='0'")
         if (check.length != 0) {
            var classId = check[0]["classId"];
            var instituteId = check[0]["instituteId"];
            // console.log(classId);
            data = [];
            var exams = await getResult("SELECT date,examName,noOfScans,sheetImage,examId,className FROM `exam` LEFT JOIN `class` ON `exam`.`structureId` =`class` .`classId`   WHERE exam.`structureId` ='" + classId + "' AND `exam`.`instituteId`='" + instituteId + "'AND `structureType`='class' AND exam.`delete`='0'")
            for (let i = 0; i < exams.length; i++) {
               const exam = exams[i];
               const exampaper = await getResult("SELECT * FROM `exampaper` WHERE `examId`='" + exam["examId"] + "' AND `studentId`='" + studentId + "' ");


               var subject = await getResult("SELECT examsubjectId,subjectName,noOfSection FROM `examsubject` WHERE `examId`='" + exam["examId"] + "' AND `delete`='0' ")
               let numberOfQuestion = 0;
               for (let j = 0; j < subject.length; j++) {
                  const element2 = fn.cleanObject(subject[j]);
                  var section = await getResult("SELECT examsubjectsectionId,examId,examsubjectId,noOfQuestions,questionType FROM `examsubjectsection` WHERE `examId`='" + exam["examId"] + "' AND examsubjectId='" + element2["examsubjectId"] + "' AND `delete`='0' ")
                  for (let k = 0; k < section.length; k++) {
                     const element = fn.cleanObject(section[k]);
                     numberOfQuestion += element["noOfQuestions"]
                  }
               }
               exam["isSubmitted"] = (exampaper.length != 0)
               exam["noOfQuestion"] = numberOfQuestion
               const result = await fn.studentResultByExam(studentId, exam["examId"])
               exam["noOfCorrectAns"] = 0
               exam["noOfWrongAns"] = 0
               if (result.length != 0) {
                  for (let j = 0; j < result.length; j++) {
                     const element = result[j];
                     exam["noOfCorrectAns"] += element["correct"]
                     exam["noOfWrongAns"] += element["incorrect"]
                  }
               }
               exam["sheetImage"] = getBlobTempPublicUrl(exam["sheetImage"])
               exam["date"] = moment(exam["date"], ["YYYY-MM-DD"]).format("DD-MM-YYYY")
               data.push(exam)
            }
            successResponse(res, "success", data)
         } else {
            errorResponse(res, "Invalid Student")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const exportAnswerKey = async (req, res) => {
   const examId = req.body.examId || "";
   if (fn.validateData(examId)) {
      errorResponse(res, "examId Is Required")
   } else {
      try {
         var data = await getResult("SELECT * FROM `exam` WHERE `delete`='0' AND `examId`='" + examId + "'");
         if (data.length != 0) {
            const answerKey = JSON.parse((data[0]["answerKey"] == "" || data[0]["answerKey"] == null) ? "[]" : data[0]["answerKey"]);
            const ExcelJS = require('exceljs');
            // Create a new workbook
            const workbook = new ExcelJS.Workbook();
            // Add a new worksheet
            const worksheet = workbook.addWorksheet('Teachers');
            // Define the columns
            worksheet.columns = [{
               header: 'question',
               key: 'question'
            }, {
               header: 'answer',
               key: 'answer'
            },];
            // Set the font size for the headers
            worksheet.getRow(1).font = {
               size: 14,
               bold: true
            };
            // Add the data
            answerKey.forEach((row) => {
               const newRow = worksheet.addRow(row);
               newRow.font = {
                  size: 12
               };
            });
            // // // Save the workbook
            const uniqueSuffix = Date.now();
            var fileName = uniqueSuffix + ".xlsx"
            const buffer = await workbook.xlsx.writeBuffer();
            const blobService = azure.createBlobService(fn.storageaccount, fn.accesskey);
            const options = {
               contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            };
            await new Promise((resolve, reject) => {
               blobService.createBlockBlobFromText(fn.container, fileName, buffer, options,
                  (error, result, response) => {
                     if (error) {
                        reject(error);
                     } else {
                        resolve(result);
                     }
                  });
            });
            // // Get a reference to a container
            // const containerClient = blobServiceClient.getContainerClient(fn.container);
            // // Upload the buffer as a blob to Azure Blob Storage
            // const blockBlobClient = containerClient.getBlockBlobClient(fileName);
            // await blockBlobClient.upload(buffer, buffer.length);
            successResponse(res, "", getBlobTempPublicUrl(fileName))
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const scanSheet = async (req, res) => {
   const examId = req.body.examId || "";
   const studentId = req.body.studentId || "";
   const teacherId = req.body.teacherId || "";
   if (fn.validateData(examId)) {
      errorResponse(res, "examId Is Required")
   } else if (fn.validateData(studentId)) {
      errorResponse(res, "studentId Is Required")
   } else if (fn.validateData(teacherId)) {
      errorResponse(res, "teacherId Is Required")
   } else {
      try {
         if ((req.files["sheet"]).length == 0) {
            errorResponse(res, "Sheet Image Is Required")
         } else {
            var fileName = (req.files["sheet"][0]["blobName"])
            var numberOfQuestion = 0;
            var totalMarks = 0;
            var checkExam = await getResult("SELECT * FROM `exam` WHERE `examId`='" + examId + "' AND `delete`='0'");
            if (checkExam.length != 0) {
               var checkStudent = await fn.checkUser(studentId, 2)
               if (checkStudent.length != 0) {
                  var check = await getResult("SELECT * FROM `exampaper` WHERE `examId`='" + examId + "' AND `studentId`='" + studentId + "' AND `delete`='0' ")
                  if (check.length != 0) {
                     var subject = await getResult("SELECT examsubjectId,subjectName,noOfSection FROM `examsubject` WHERE `examId`='" + examId + "' AND `delete`='0' ")
                     for (let j = 0; j < subject.length; j++) {
                        const element2 = fn.cleanObject(subject[j]);
                        var section = await getResult("SELECT examsubjectsectionId,examId,examsubjectId,noOfQuestions,questionType,`marksForCorrect` FROM `examsubjectsection` WHERE `examId`='" + examId + "' AND `delete`='0' ")
                        for (let k = 0; k < section.length; k++) {
                           const element = fn.cleanObject(section[k]);
                           numberOfQuestion += element["noOfQuestions"]
                           // totalMarks += (element["noOfQuestions"]) * (element["marksForCorrect"])
                        }
                     }
                     var templete = JSON.parse(checkExam[0]["templete"]);
                     var url = getBlobTempPublicUrl(fileName);
                     var input_paths = ["inputs/exam" + examId + "/stud" + studentId + "/"];
                     var folder_name = "exam" + examId + "/stud" + studentId + "/";
                     for (let i = 0; i < templete.length; i++) {
                        const element = templete[i];
                        for (dia in element["pageDimensions"]) {
                           parseInt(dia)
                        }
                        for (dia in element["pageDimensions"]) {
                           parseInt(dia)
                        }
                     }
                     var requests = {
                        templete: templete,
                        url: url,
                        input_paths: input_paths,
                        fileName: fileName,
                        folder_name: folder_name
                     }
                     var data = await fn.callApi("http://20.219.56.218:5000/omrchecker", requests)
                     if (data.status == 200) {
                        const answerKey = (JSON.parse(checkExam[0]["answerKey"] || "[]"))
                        const answerData = fn.evaluateAnswers(data.data, answerKey)
                        totalMarks = answerData["correct"].length;
                        // incorrectMarks = answerData["incorrect"].length + answerData["not_attempted"].length;
                        var insert = await getResult("UPDATE `exampaper` SET  `examId`='" + examId + "',`studentId`='" + studentId + "',`submittedKey`='" + JSON.stringify(data.data) + "',`totalQuestion`='" + numberOfQuestion + "',`totalMarks`='" + totalMarks + "',`teacherId`='" + teacherId + "',`image`='" + fileName + "' WHERE exampaperId = '"+check[0]["exampaperId"]+"'  ")
                        successResponse(res, "success", data)
                     } else {
                        errorResponse(res, "Can't Detect From Image Please Make sure You Are Uploading Correct image Or Corner Of Sheets are Visible.")
                     }
                  } else {
                     var subject = await getResult("SELECT examsubjectId,subjectName,noOfSection FROM `examsubject` WHERE `examId`='" + examId + "' AND `delete`='0' ")
                     for (let j = 0; j < subject.length; j++) {
                        const element2 = fn.cleanObject(subject[j]);
                        var section = await getResult("SELECT examsubjectsectionId,examId,examsubjectId,noOfQuestions,questionType,`marksForCorrect` FROM `examsubjectsection` WHERE `examId`='" + examId + "' AND `delete`='0' ")
                        for (let k = 0; k < section.length; k++) {
                           const element = fn.cleanObject(section[k]);
                           numberOfQuestion += element["noOfQuestions"]
                           // totalMarks += (element["noOfQuestions"]) * (element["marksForCorrect"])
                        }
                     }
                     var templete = JSON.parse(checkExam[0]["templete"]);
                     var url = getBlobTempPublicUrl(fileName);
                     var input_paths = ["inputs/exam" + examId + "/stud" + studentId + "/"];
                     var folder_name = "exam" + examId + "/stud" + studentId + "/";
                     for (let i = 0; i < templete.length; i++) {
                        const element = templete[i];
                        for (dia in element["pageDimensions"]) {
                           parseInt(dia)
                        }
                        for (dia in element["pageDimensions"]) {
                           parseInt(dia)
                        }
                     }
                     var requests = {
                        templete: templete,
                        url: url,
                        input_paths: input_paths,
                        fileName: fileName,
                        folder_name: folder_name
                     }
                     var data = await fn.callApi("http://20.219.56.218:5000/omrchecker", requests)
                     if (data.status == 200) {
                        const answerKey = (JSON.parse(checkExam[0]["answerKey"] || "[]"))
                        const answerData = fn.evaluateAnswers(data.data, answerKey)
                        totalMarks = answerData["correct"].length;
                        // incorrectMarks = answerData["incorrect"].length + answerData["not_attempted"].length;
                        var insert = await getResult("INSERT INTO `exampaper` SET  `examId`='" + examId + "',`studentId`='" + studentId + "',`submittedKey`='" + JSON.stringify(data.data) + "',`totalQuestion`='" + numberOfQuestion + "',`totalMarks`='" + totalMarks + "',`teacherId`='" + teacherId + "',`image`='" + fileName + "' ")
                        successResponse(res, "success", data)
                     } else {
                        errorResponse(res, "Can't Detect From Image Please Make sure You Are Uploading Correct image Or Corner Of Sheets are Visible.")
                     }
                  }
               } else {
                  errorResponse(res, "Invalid Student")
               }
            } else {
               errorResponse(res, "Invalid Exam")
            }
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}

const viewAnswerKey = async (req, res) => {
   const examId = req.body.examId || "";
   if (fn.validateData(examId)) {
      errorResponse(res, "examId Is Required")
   } else {
      try {
         var data = await getResult("SELECT * FROM `exam` WHERE `delete`='0' AND `examId`='" + examId + "'");
         if (data.length != 0) {
            const answerKey = JSON.parse((data[0]["answerKey"] == "" || data[0]["answerKey"] == null) ? "[]" : data[0]["answerKey"]);
            successResponse(res, "success", answerKey)
         } else {
            errorResponse(res, "Invalid Exam")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const teacherlistByExam = async (req, res) => {
   const examId = req.body.examId || "";
   const instituteId = req.body.instituteId || "";
   if (fn.validateData(examId)) {
      errorResponse(res, "examId Is Required")
   } else if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId Is Required")
   } else {
      try {
         var data = await getResult("SELECT * FROM `exam` WHERE `delete`='0' AND `examId`='" + examId + "'");
         if (data.length != 0) {
            var classId = data[0]["structureId"];
            var data = await getResult("SELECT `teacherdepartment`.`userId` AS `teacherId`,`fullName`,`email`,`mobileNumber` FROM `teacherdepartment` LEFT JOIN `user` ON `user`.`userId`=`teacherdepartment`.`userId` WHERE `teacherdepartment`.`delete`='0' AND `user`.`delete`='0' AND `divisionType` = 'class'AND `divisionId`='" + classId + "'AND `teacherdepartment`.`instituteId`='" + instituteId + "'");
            successResponse(res, "success", data)
         } else {
            errorResponse(res, "Invalid Exam")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const studentListByExam = async (req, res) => {
   const examId = req.body.examId || "";
   const rollNumber = req.body.rollNumber || "";
   const name = req.body.name || "";
   if (fn.validateData(examId)) {
      errorResponse(res, "examId is Required")
   } else {
      // try {
      var exam = await getResult("SELECT `structureId`,`instituteId`,`examName`,`date` FROM `exam` WHERE `examId` ='" + examId + "'  AND `delete`='0'")
      if (exam.length != 0) {
         var numberOfQuestion = 0
         var subject = await getResult("SELECT examsubjectId,subjectName,noOfSection FROM `examsubject` WHERE `examId`='" + examId + "' AND `delete`='0' ")
         for (let j = 0; j < subject.length; j++) {
            const element2 = fn.cleanObject(subject[j]);
            var section = await getResult("SELECT examsubjectsectionId,examId,examsubjectId,noOfQuestions,questionType FROM `examsubjectsection` WHERE `examId`='" + examId + "' AND examsubjectId='" + element2["examsubjectId"] + "' AND `delete`='0' ")
            for (let k = 0; k < section.length; k++) {
               const element = fn.cleanObject(section[k]);
               numberOfQuestion += element["noOfQuestions"]
            }
         }
         var classId = exam[0]["structureId"];
         var student = await getResult("SELECT `fullName`,`email`,`mobileNumber`,`userId` AS `studentId` FROM `user` WHERE `classId`='" + classId + "' AND `delete`='0' ")
         var teacher = await getResult("SELECT `teacherdepartment`.`userId` AS `teacherId` FROM `teacherdepartment`  WHERE `teacherdepartment`.`delete`='0' AND  `divisionType` = 'class'AND `divisionId`='" + classId + "'AND `teacherdepartment`.`instituteId`='" + exam[0]["instituteId"] + "'");
         for (let i = 0; i < student.length; i++) {
            const element = fn.cleanObject(student[i]);
            var paper = await getResult("SELECT * FROM `exampaper` WHERE `examId`='" + examId + "' AND `studentId`='" + element["studentId"] + "' AND `delete`='0' ")
            const classData = await getResult("SELECT className FROM class WHERE `classId`='" + exam[0]["structureId"] + "'")
            element["instituteId"] = exam[0]["instituteId"]
            element["examName"] = exam[0]["examName"]
            element["isSubmitted"] = (paper.length != 0)
            element["noOfQuestion"] = numberOfQuestion
            element["noOfCorrectAns"] = (element["isSubmitted"]) ? paper[0]["totalMarks"] : 0
            element["noOfWrongAns"] = 0
            element["className"] = (classData.length != 0) ? classData[0]["className"] : ""
            element["date"] = moment(exam[0]["date"], "YYYY-MM-DD").format("DD-MM-YYYY")
            element["teacherId"] = (teacher.length != 0) ? teacher[0]["teacherId"] : ""
         }
         successResponse(res, "success", student)
      } else {
         errorResponse(res, "Invalid Exam")
      }
      // } catch (error) {
      //    errorResponse(res, "Something Went Wrong", error)
      // }
   }
}
const examListByTeacher = async (req, res) => {
   const teacherId = req.body.teacherId || "";
   if (fn.validateData(teacherId)) {
      errorResponse(res, "teacherId is Required")
   } else {
      try {
         var resArr = []
         var teacher = await getResult("SELECT `teacherdepartment`.`userId` AS `teacherId`,`fullName`,`email`,`divisionId` FROM `teacherdepartment` LEFT JOIN `user` ON `user`.`userId`= `teacherdepartment`.`userId`   WHERE `teacherdepartment`.`delete`='0' AND  `divisionType` = 'class'AND `teacherdepartment`.`userId`='" + teacherId + "'");
         for (let i = 0; i < teacher.length; i++) {
            const element = teacher[i];
            var exam = await getResult("SELECT answerKey, `examId`,`structureId` AS classId,sheetImage,`instituteId`,`examName`,`date`,instituteId,examName,date FROM `exam` WHERE `structureId` ='" + element["divisionId"] + "'  AND `delete`='0'")
            for (let j = 0; j < exam.length; j++) {
               const element = exam[j];
               element["sheetImage"] = getBlobTempPublicUrl(element["sheetImage"])
               element["isKeySubmited"] = (!fn.validateData(element["answerKey"]))
               element["date"] = moment(element["data"]).format("DD-MM-YYYY")
               resArr.push(element)
            }
         }
         successResponse(res, "success", resArr)
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const userDetails = async (req, res) => {
   const userId = req.body.userId || "";
   if (fn.validateData(userId)) {
      errorResponse(res, "userId Is Required")
   } else {
      try {
         var check = await fn.checkUser(userId)
         if (check.length != 0) {
            var obj = {}
            const element = fn.cleanObject(check[0])
            obj["userId"] = element["userId"]
            obj["fullName"] = element["fullName"]
            obj["email"] = element["email"]
            obj["mobileNumber"] = element["mobileNumber"];
            successResponse(res, "success", [obj])
         } else {
            errorResponse(res, "Invalid User")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const editUserDetails = async (req, res) => {
   const userId = req.body.userId || "";
   const fullName = req.body.fullName || "";
   const email = req.body.email || "";
   if (fn.validateData(userId)) {
      errorResponse(res, "userId Is Required")
   } else if (fn.validateData(fullName)) {
      errorResponse(res, "fullName Is Required")
   } else if (fn.validateData(email)) {
      errorResponse(res, "email Is Required")
   } else {
      try {
         var check = await fn.checkUser(userId)
         if (check.length != 0) {
            var update = await getResult("UPDATE `user` SET `fullName`='" + fullName + "', `email`='" + email + "' WHERE `userId`='" + userId + "'  ")
            successResponse(res, "success",)
         } else {
            errorResponse(res, "Invalid User")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const studentResult = async (req, res) => {
   const examId = req.body.examId || "";
   const studentId = req.body.studentId || "";
   if (fn.validateData(examId)) {
      errorResponse(res, "examId Is Required")
   } else if (fn.validateData(studentId)) {
      errorResponse(res, "studentId Is Required")
   } else {
      try {
         const checkExam = await getResult("SELECT * FROM `exam` WHERE `examId`='" + examId + "' AND `delete`='0' ")
         if (checkExam.length != 0) {
            const exampaper = await getResult("SELECT * FROM `exampaper` WHERE `examId`='" + examId + "' AND `studentId`='" + studentId + "' ");
            const subjects = []
            if (exampaper.length != 0) {
               var data = await getResult("SELECT * FROM `examsubjectsection` LEFT JOIN `examsubject` ON examsubject.examsubjectId= examsubjectsection.examsubjectId WHERE examsubjectsection.`examId`='" + examId + "'");
               var question = 0
               for (let i = 0; i < data.length; i++) {
                  const element = data[i];
                  const index = subjects.findIndex(obj => obj.subjectId === element["examsubjectId"]);
                  if (index !== -1) {
                     subjects[index]["noOfQuestions"] += element["noOfQuestions"]
                     subjects[index]["totalMarks"] += element["noOfQuestions"] * element["marksForCorrect"]
                     element["totalMarks"] = element["noOfQuestions"] * element["marksForCorrect"]
                     element["subjectStart"] = ++question
                     question = question + element["noOfQuestions"] - 1
                     element["subjectEnd"] = question
                     subjects[index]["sections"].push(element)
                  } else {
                     const subject = {}
                     subject["subjectId"] = element["examsubjectId"]
                     subject["subjectName"] = element["subjectName"]
                     subject["noOfQuestions"] = element["noOfQuestions"]
                     subject["totalMarks"] = element["noOfQuestions"] * element["marksForCorrect"]
                     element["totalMarks"] = element["noOfQuestions"] * element["marksForCorrect"]
                     subject["sections"] = []
                     if (question == 0) {
                        element["subjectStart"] = ++question
                        question = question + element["noOfQuestions"] - 1
                     } else {
                        element["subjectStart"] = ++question
                        question = question + element["noOfQuestions"] - 1
                     }
                     element["subjectEnd"] = question
                     subject["sections"].push(element)
                     subjects.push(subject)
                  }
               }
               const answerKey = JSON.parse((checkExam[0]["answerKey"] || "[]"))
               const answerData = fn.evaluateAnswers(JSON.parse(exampaper[0]["submittedKey"] || "[]"), answerKey)
               function categorizeValues(firstSet, secondSet,) {
                  for (const subject of firstSet) {
                     subject.obtainMarks = 0;
                     subject.correct = 0;
                     for (const section of subject.sections) {
                        const start = section.subjectStart;
                        const end = section.subjectEnd;
                        section.correct = secondSet.correct.filter(question => question >= start && question <= end).sort();
                        section.incorrect = secondSet.incorrect.filter(question => question >= start && question <= end).sort();
                        section.not_attempted = secondSet.not_attempted.filter(question => question >= start && question <= end).sort();
                        section.obtainMarks = section.correct.length * section.marksForCorrect;
                        subject.obtainMarks += section.obtainMarks;
                        subject.correct += (section.correct).length
                     }
                     const percentage = (subject.obtainMarks / subject.totalMarks) * 100;
                     subject.percentage = percentage;
                  }
                  return firstSet;
               }
               const filterd = categorizeValues(subjects, answerData)
               function calculateMarks(data, answerKey, submittedKey) {
                  const marksData = [];
                  var counter = 1
                  for (const subject of data) {
                     const {
                        subjectName,
                        sections
                     } = subject;
                     for (const section of sections) {
                        const { noOfQuestions, correct, incorrect, obtainMarks, marksForCorrect, marksForInCorrect } = section;
                        for (let i = 1; i <= noOfQuestions; i++) {
                           const questionNumber = i;
                           const yourAnswer = correct.includes(counter.toString()) ? correct[correct.indexOf(counter.toString())] : incorrect[(incorrect.indexOf(counter.toString()))]
                           const matchingAnswer = answerKey.length != 0 ? answerKey.find(item => (item.question) == counter) : "";
                           const marks = (submittedKey[yourAnswer] == matchingAnswer.answer) ? marksForCorrect : 0;
                           const questionData = {
                              questionNumber: counter,
                              yourAnswer: submittedKey[yourAnswer] || "",
                              correctAnswer: matchingAnswer.answer,
                              marks,
                           };
                           counter++
                           marksData.push(questionData);
                        }
                     }
                  }
                  return marksData;
               }
               var anTable = (calculateMarks(filterd, answerKey, JSON.parse(exampaper[0]["submittedKey"] || "[]")))
               for (const subject of filterd) {
                  delete subject.sections;
               }
               var student = await fn.checkUser(studentId)
               var classData = await fn.checkClass(student[0]["classId"])
               var className = ""
               if (classData.length != 0) {
                  className = classData[0]["className"]
               }
               const resData = {
                  "className": className,
                  "rollNumber": student[0]["rollNumber"],
                  "result": filterd,
                  "question": anTable,
                  "responseImage": await fn. uploadImageFromUrlToBlob(exampaper[0]["image"])
               }
               successResponse(res, "suceess", resData)
            } else {
               errorResponse(res, "Record Not found")
            }
         } else {
            errorResponse(res, "Invalid Exam")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
// plans 
const planList = async (req, res) => {
   try {
      var data = await getResult("SELECT `planId`,`name`,`credit`,`price` FROM `plan` WHERE `delete`='0' ORDER BY `price` ASC")
      successResponse(res, "success", data)
   } catch (error) {
      errorResponse(res, "Something Went Wrong", error)
   }
}
const purchasePlan = async (req, res) => {
   const userId = req.body.userId || "";
   const planId = req.body.planId || "";
   const instituteId = req.body.instituteId || "";
   const quantity = req.body.quantity || "1";
   if (fn.validateData(userId)) {
      errorResponse(res, "userId Is Required")
   } else if (fn.validateData(planId)) {
      errorResponse(res, "planId Is Required")
   } else if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId Is Required")
   } else if (fn.validateData(quantity)) {
      errorResponse(res, "quantity Is Required")
   } else {
      try {
         const check = await fn.checkUser(userId);
         if (check.length != 0) {
            const checkInstitute = await fn.checkInstitute(instituteId);
            if (checkInstitute.length != 0) {
               const planDetails = await fn.planDetails(planId)
               if (planDetails.length != 0) {
                  const plan = planDetails[0]
                  var grandTotal = parseFloat(quantity) * parseFloat(plan["price"])
                  const totalCredit = parseFloat(plan["credit"]) * parseFloat(quantity)
                  const insert = await getResult("INSERT INTO `order` SET `userId`='" + userId + "',`instituteId`='" + instituteId + "' ,`planId`='" + planId + "',`quantity`='" + quantity + "',`grandTotal`='" + grandTotal + "',`total`='" + grandTotal + "',`totalCredit`='" + totalCredit + "'")
                  // update Institute
                  await fn.addCredits(instituteId, totalCredit, "Purchase plan")
                  successResponse(res, "success")
               } else {
                  errorResponse(res, "Invalid Plan")
               }
            } else {
               errorResponse(res, "Invalid Institute")
            }
         } else {
            errorResponse(res, "Invalid User")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const orderHistory = async (req, res) => {
   const instituteId = req.body.instituteId || "";
   if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId Is Required")
   } else {
      try {
         const check = await fn.checkInstitute(instituteId)
         if (check.length != 0) {
            var data = await getResult("SELECT orderId,totalCredit,grandTotal,created FROM `order`  WHERE `instituteId`='" + instituteId + "' AND `delete`='0' ORDER BY orderId DESC")
            for (let i = 0; i < data.length; i++) {
               const element = data[i];
               element["created"] = moment(element["created"]).format("DD MMM YYYY hh:mm A")
            }
            const data2 = {
               "instituteCredits": check[0]["credits"],
               "history": data
            }
            successResponse(res, "success", data2)
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
const editDivision = async (req, res) => {
   const divisionId = req.body.divisionId || "";
   const instituteId = req.body.instituteId || "";
   const divisionName = req.body.divisionName || "";
   const divisionType = req.body.divisionType || "";
   if (fn.validateData(divisionId)) {
      errorResponse(res, "divisionId Is Required")
   } else if (fn.validateData(instituteId)) {
      errorResponse(res, "instituteId Is Required")
   } else if (fn.validateData(divisionType)) {
      errorResponse(res, "divisionType Is Required")
   } else {
      try {
         const result = await fn.checkInstitute(instituteId);
         if (result.length != 0) {
            const tableName = await create_division(result[0]["instituteCode"])
            var checkNoDiv = await getResult("SELECT * FROM `" + tableName + "` WHERE  `divisionId`='" + divisionId + "' AND `delete`='0'");
            if (checkNoDiv.length != 0) {
               values = "`divisionType`='" + divisionType + "'"
               if (!fn.validateData(divisionName)) {
                  let values = +",`divisionName`='" + mysql_real_escape_string(divisionName) + "'"
               }
               const update = await getResult("UPDATE `" + tableName + "`  SET " + values + " WHERE `divisionId`='" + divisionId + "'   ")
               successResponse(res, "success")
            } else {
               errorResponse(res, "Invalid Division")
            }
         } else {
            errorResponse(res, "Invalid Institute")
         }
      } catch (error) {
         errorResponse(res, "Something Went Wrong", error)
      }
   }
}
module.exports = {
   editDivision,
   orderHistory,
   studentResult,
   purchasePlan,
   planList,
   exportStudents,
   editUserDetails,
   userDetails,
   examListByTeacher,
   studentListByExam,
   teacherlistByExam,
   viewAnswerKey,
   scanSheet,
   exportAnswerKey,
   examListOfStudent,
   saveAnswerKey,
   examDetails,
   presetList,
   teacherArchiveList,
   teacherArchive,
   classArchiveList,
   classArchive,
   instituteArchiveList,
   archiveInstitute,
   studentArchiveList,
   studentArchive,
   examPreSet,
   exportTeachers,
   getPermissionsOfTeacher,
   setPermission,
   permissionList,
   deleteInstitute,
   emailVerificationOfInstitute,
   studentDetails,
   TeacherDetails,
   editClass,
   deleteClass,
   editStudent,
   deleteStudent,
   editTeacher,
   deleteTeacher,
   examListOfTeacher,
   examList,
   generateOMR,
   uploadSheetImage,
   createExam,
   socialMediaLogin,
   deleteDivision,
   classListOfInstitute,
   divisionChildslist,
   updateMultiDivision,
   allStudentOfClass,
   allClassByInstitute,
   updateInstituteDetails,
   generateClassCode,
   resendVerificationLink,
   getAllParentsByKeyWord,
   allParents,
   updateCampus,
   updateDepartment,
   updateZones,
   viewTeacher,
   viewStudent,
   multiTeacherRegistration,
   addMultiDivision,
   multiStudentRegistration,
   saveExcelFile,
   addTeacher,
   checkCode,
   addStudent,
   addClass,
   InstituteHirarchy,
   getAllDiv,
   addDivision,
   instituteDetails,
   myInstitute,
   addDepartment,
   addCampus,
   addZones,
   fetchInstituteStates,
   fetchZones,
   selectStates,
   headOfficeDetails,
   addInstituteDetails,
   allState,
   allCountry,
   forgetpassword,
   registration,
   login,
   resetPassword,
   verifyOTP
}