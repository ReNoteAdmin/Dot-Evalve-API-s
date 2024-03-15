const express = require('express');
const app = express();
const {connectionString,container,storageaccount,accessKey}= require("./function.js");
const {createBackup}= require("./backup.js");
const je_user = require("./user/user.js");
const je_teacher = require("./teacher/teacher.js");
const bodyParser = require('body-parser');
const multer = require('multer');
const {  successResponse,getBlobTempPublicUrl } = require("./function.js");
const path = require("path")
require('dotenv').config({ path: path.resolve(__dirname + '/.env') });
const MulterAzureStorage = require('multer-azure-blob-storage').MulterAzureStorage;
const fn = require("./function.js");
const cron = require('node-cron');





// const justEvel = multer.diskStorage({
//   destination: "images/",
//   filename: function (req, file, cb) {
//       var str = file.mimetype;
//       var first = str.indexOf("/");
//       var last = str.length;
//       var between = str.substring((first + 1), last);
//       const uniqueSuffix = Date.now();
//       let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
//       cb(null, uniqueSuffix + ext );
//   },
// });
// const justEvelMult = multer({ storage: justEvel });
const azureStorage = new MulterAzureStorage({
	connectionString: connectionString,
	accessKey: accessKey,
	accountName: storageaccount,
	containerName: container,
	containerAccessLevel: 'blob',
});
const justEvelMult = multer({
	storage: azureStorage
});
app.use(bodyParser.json());
app.get("/", (req, res) => res.send("Welcome To Dot Evalve"))
app.post("/JE/api/studentSheetDemo", (req, res) => {
	successResponse(res, getBlobTempPublicUrl("Book1.xlsx"))
})
app.post("/JE/api/teacherSheetDemo", (req, res) => {
	successResponse(res, getBlobTempPublicUrl("1680172122435.xlsx"))
})
app.use(function(req, res, next) {
	if('b361dc54ca90a4dd02efaf412ed54f9a' != req.headers.apitoken) {
		res.status(401).json({
			"status": 401,
			"message": "Authentication failed!!"
		});
	} else {
		next()
	}
});
// <====================== App Apis ======================>
app.post("/JE/api/registration", je_user.registration);
app.post("/JE/api/login", je_user.login);
app.post("/JE/api/resetPassword", je_user.resetPassword);
app.post("/JE/api/verifyOTP", je_user.verifyOTP);
app.post("/JE/api/forgetpassword", je_user.forgetpassword);
app.post("/JE/api/allCountry", je_user.allCountry);
app.post("/JE/api/allState", je_user.allState);
app.post("/JE/api/addInstituteDetails", je_user.addInstituteDetails);
app.post("/JE/api/headOfficeDetails", je_user.headOfficeDetails);
app.post("/JE/api/selectStates", je_user.selectStates);
app.post("/JE/api/fetchZones", je_user.fetchZones);
app.post("/JE/api/fetchInstituteStates", je_user.fetchInstituteStates);
app.post("/JE/api/addZones", je_user.addZones);
app.post("/JE/api/addCampus", je_user.addCampus);
app.post("/JE/api/addDepartment", je_user.addDepartment);
app.post("/JE/api/myInstitute", je_user.myInstitute);
app.post("/JE/api/instituteDetails", je_user.instituteDetails);
app.post("/JE/api/addDivision", je_user.addDivision);
app.post("/JE/api/getAllDiv", je_user.getAllDiv);
app.post("/JE/api/InstituteHirarchy", je_user.InstituteHirarchy);
app.post("/JE/api/addClass", je_user.addClass);
app.post("/JE/api/addStudent", je_user.addStudent);
app.post("/JE/api/checkCode", je_user.checkCode);
app.post("/JE/api/addTeacher", je_user.addTeacher);
app.post("/JE/api/saveExcelFile", justEvelMult.single("file"), je_user.saveExcelFile);
app.post("/JE/api/multiStudentRegistration", je_user.multiStudentRegistration);
app.post("/JE/api/multiTeacherRegistration", je_user.multiTeacherRegistration);
app.post("/JE/api/addMultiDivision", je_user.addMultiDivision);
app.post("/JE/api/viewStudent", je_user.viewStudent);
app.post("/JE/api/viewTeacher", je_user.viewTeacher);
app.post("/JE/api/updateZones", je_user.updateZones);
app.post("/JE/api/updateCampus", je_user.updateCampus);
app.post("/JE/api/updateZones", je_user.updateDepartment);
app.post("/JE/api/updateDepartment", je_user.updateDepartment);
app.post("/JE/api/allParents", je_user.allParents);
app.post("/JE/api/getAllParentsByKeyWord", je_user.getAllParentsByKeyWord);
app.post("/JE/api/resendVerificationLink", je_user.resendVerificationLink);
app.post("/JE/api/generateClassCode", je_user.generateClassCode);
app.post("/JE/api/updateInstituteDetails", je_user.updateInstituteDetails);
app.post("/JE/api/allClassByInstitute", je_user.allClassByInstitute);
app.post("/JE/api/allStudentOfClass", je_user.allStudentOfClass);
app.post("/JE/api/updateMultiDivision", je_user.updateMultiDivision);
app.post("/JE/api/divisionChildslist", je_user.divisionChildslist);
app.post("/JE/api/classListOfInstitute", je_user.classListOfInstitute);
app.post("/JE/api/deleteDivision", je_user.deleteDivision);
app.post("/JE/api/socialMediaLogin", je_user.socialMediaLogin);
app.post("/JE/api/createExam", je_user.createExam);
app.post("/JE/api/generateOMR", je_user.generateOMR);
app.post("/JE/api/uploadSheetImage", je_user.uploadSheetImage);
app.post("/JE/api/examList", je_user.examList);
app.post("/JE/api/examListOfTeacher", je_user.examListOfTeacher);
app.post("/JE/api/deleteTeacher", je_user.deleteTeacher);
app.post("/JE/api/editTeacher", je_user.editTeacher);
app.post("/JE/api/deleteStudent", je_user.deleteStudent);
app.post("/JE/api/editStudent", je_user.editStudent);
app.post("/JE/api/deleteClass", je_user.deleteClass);
app.post("/JE/api/TeacherDetails", je_user.TeacherDetails);
app.post("/JE/api/editClass", je_user.editClass);
app.post("/JE/api/studentDetails", je_user.studentDetails);
app.post("/JE/api/emailVerificationOfInstitute", je_user.emailVerificationOfInstitute);
app.post("/JE/api/deleteInstitute", je_user.deleteInstitute);
app.post("/JE/api/permissionList", je_user.permissionList);
app.post("/JE/api/setPermission", je_user.setPermission);
app.post("/JE/api/getPermissionsOfTeacher", je_user.getPermissionsOfTeacher);
app.post("/JE/api/exportTeachers", je_user.exportTeachers);
app.post("/JE/api/examPreSet", je_user.examPreSet);
app.post("/JE/api/presetList", je_user.presetList);
app.post("/JE/api/examDetails", je_user.examDetails);
app.post("/JE/api/saveAnswerKey", je_user.saveAnswerKey);
app.post("/JE/api/examListOfStudent", je_user.examListOfStudent);
app.post("/JE/api/exportAnswerKey", je_user.exportAnswerKey);
app.post("/JE/api/viewAnswerKey", je_user.viewAnswerKey);
app.post("/JE/api/teacherlistByExam", je_user.teacherlistByExam);
app.post("/JE/api/studentListByExam", je_user.studentListByExam);
app.post("/JE/api/examListByTeacher", je_user.examListByTeacher);
app.post("/JE/api/userDetails", je_user.userDetails);
app.post("/JE/api/editUserDetails", je_user.editUserDetails);
app.post("/JE/api/planList", je_user.planList);
app.post("/JE/api/purchasePlan", je_user.purchasePlan);
app.post("/JE/api/orderHistory", je_user.orderHistory);
app.post("/JE/api/editDivision", je_user.editDivision);
app.post("/JE/api/scanSheet", justEvelMult.fields([{
	name: 'sheet',
	maxCount: 1
}]), je_user.scanSheet);
// archives 
app.post("/JE/api/studentArchive", je_user.studentArchive);
app.post("/JE/api/studentArchiveList", je_user.studentArchiveList);
app.post("/JE/api/archiveInstitute", je_user.archiveInstitute);
app.post("/JE/api/instituteArchiveList", je_user.instituteArchiveList);
app.post("/JE/api/classArchive", je_user.classArchive);
app.post("/JE/api/classArchiveList", je_user.classArchiveList);
app.post("/JE/api/teacherArchive", je_user.teacherArchive);
app.post("/JE/api/teacherArchiveList", je_user.teacherArchiveList);
app.post("/JE/api/exportStudents", je_user.exportStudents);
app.post("/JE/api/studentResult", je_user.studentResult);
// ======================/Teacher Apis /============================>
app.post("/JE/api/teacherLogin", je_teacher.teacherLogin);
app.post("/JE/api/otpVerifcation", je_teacher.otpVerifcation);
app.post("/JE/api/resetTeacherPassword", je_teacher.resetTeacherPassword);
app.post("/JE/api/verifyEmail", je_teacher.verifyEmail);
// <====================== Admin Apis ======================>
const port = 3000
app.listen(port, () => {
	console.log(`connection is setup at ` + port);
});



cron.schedule('* * * * * ', () => {
  createBackup();
});
module.exports = app;