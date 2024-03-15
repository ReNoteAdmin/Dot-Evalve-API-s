const connection2 = require("./db.js");
const azureStorage = require('azure-storage');
const moment = require("moment");
const storageaccount = "justevalve"
const container = "justevalvemedia"
const connectionString = "DefaultEndpointsProtocol=https;AccountName=justevalve;AccountKey=WsBRcPtw9lLqyhcLCcf+oPHbOx7Xmiu937MLE4xoQgFjJCy8u45qU1zOT2mPLrR7UaVFOeChvAxl+AStembD1g==;EndpointSuffix=core.windows.net"
const accesskey = "WsBRcPtw9lLqyhcLCcf+oPHbOx7Xmiu937MLE4xoQgFjJCy8u45qU1zOT2mPLrR7UaVFOeChvAxl+AStembD1g=="
const fetch = require('node-fetch');
const path = require('path');
const { BlobServiceClient } = require('@azure/storage-blob');
const { getUnpackedSettings } = require("http2");
const { error } = require("console");
// success Response









async function uploadImageFromUrlToBlob(originalBlobName) {


	// Extract blob name and extension from the URL
	const blobName = originalBlobName;
	const extension = path.extname(originalBlobName);

	// Append a suffix to the blob name
	const suffix = '-result';
	const newBlobName = originalBlobName.replace(extension, suffix + extension);

	var blobExists = await checkBlobExistence(newBlobName)
	console.log(blobExists);
	if (!blobExists) {

		const url = "http://20.219.56.218:5000/outputs/" + (blobName)
		const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
		const containerClient = blobServiceClient.getContainerClient(container);
		const blockBlobClient = containerClient.getBlockBlobClient(newBlobName);

		const response = await fetch(url);
		const blobData = await response.buffer();

		const uploadBlobResponse = await blockBlobClient.upload(blobData, blobData.length);
	}

	return getBlobTempPublicUrl(newBlobName)

}

function successResponse(res, message, data) {
	res.send({
		status: 200,
		"message": message,
		"data": data
	})
}
// Error Response
function errorResponse(res, message, data) {
	res.send({
		status: 400,
		"message": message,
		"error": data
	})
}
// convert string in to sql storable form
function mysql_real_escape_string(str) {
	return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
		switch (char) {
			case "\0":
				return "\\0";
			case "\x08":
				return "\\b";
			case "\x09":
				return "\\t";
			case "\x1a":
				return "\\z";
			case "\n":
				return "\\n";
			case "\r":
				return "\\r";
			case "\"":
			case "'":
			case "\\":
			case "%":
				return "\\" + char; // prepends a backslash to backslash, percent,
			// and double/single quotes
		}
	});
}

async function  checkBlobExistence(blobName) {

		const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
		const containerClient = blobServiceClient.getContainerClient(container);
		const blobClient = containerClient.getBlobClient(blobName);

		try {
			await blobClient.getProperties();
			// console.log(`Blob ${blobName} exists.`);
			return(true);
		} catch (error) {
			if (error.statusCode === 404) {
				// console.log(`Blob ${blobName} does not exist.`);
				return(false);
			} else {
				console.error(`Error checking existence of blob ${blobName}: ${error.message}`);
				return(error);
			}
		}

}
// Return image with url
const getBlobTempPublicUrl = (blobName) => {




	return ("https://justevalve.blob.core.windows.net/justevalvemedia/" + blobName);





}
// capitalfirst Letter
function ucFirst(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
// validate email address
function ValidateEmail(mail) {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
		return (true)
	}
	return (false)
}
//3) generate otp 
function generateOTP() {
	// Declare a digits variable 
	// which stores all digits
	var digits = '0123456789';
	let OTP = '';
	for (let i = 0; i < 4; i++) {
		OTP += digits[Math.floor(Math.random() * 10)];
	}
	return OTP;
}
// <=======// async and Database Related Functions //========>
// Create Dynamic Table if not exist and return Table Name
const create_division = async (instituteCode, connection = "") => {
	var create_query = "CREATE TABLE IF NOT EXISTS `" + instituteCode + "_division` (`divisionId` int NOT NULL AUTO_INCREMENT,  `divisionName` varchar(255) DEFAULT NULL,  `parentDivisionId` int NOT NULL DEFAULT '0',`divisionCode` varchar(50) DEFAULT NULL,`divisionType` varchar(255) DEFAULT NULL,`parentDivisionType` tinyint NOT NULL DEFAULT '0' COMMENT '0= department\r\n1 = division',`created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,`updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,`delete` tinyint NOT NULL DEFAULT '0',PRIMARY KEY (`divisionId`)) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;"
	var result = await getResult(create_query)
	return "" + instituteCode + "_division";
}
// fetch all childs 
const getAllChildDiviesions = async (instituteCode, connection = "", type, parentDivisionId) => {
	/// type    0= department 1 = division
	var queryString = ""
	if (type == 0) {
		if (parentDivisionId == 0) {
			queryString = " `parentDivisionType`='" + type + "' AND `delete`='0'"
		} else {
			queryString = " `parentDivisionType`='" + type + "' AND `parentDivisionId`='" + parentDivisionId + "' AND `delete`='0'"
		}
	} else {
		queryString = " `parentDivisionType`='" + type + "' AND `parentDivisionId`='" + parentDivisionId + "' AND `delete`='0'"
	}
	var result = await getResult("SELECT * FROM `" + instituteCode + "` WHERE " + queryString + " ");
	if (result.length != 0) {
		var data = []
		if (result.length != 0) {
			for (let i = 0; i < result.length; i++) {
				const element = result[i];
				res = await getAllChildDiviesions(instituteCode, connection, 1, result[i]["divisionId"]);
				obj = {
					"divisionId": result[i]["divisionId"],
					"divisionName": result[i]["divisionName"],
					"parentDivisionId": result[i]["parentDivisionId"],
					"divisionType": result[i]["divisionType"],
					"divisionCode": result[i]["divisionCode"],
					"parentDivisionType": result[i]["parentDivisionType"] == 0 ? "department" : "division",
					"childs": res,
					"class": await getAllClassByParentId((instituteCode).toLowerCase(), connection, 1, result[i]["divisionId"])
				}
				data.push(obj)
			}
		}
		return data
	} else {
		return []
	}
}
// Return all child with less response
const getAllChildDiviesionsNamesOnly = async (instituteCode, connection, type, parentDivisionId) => {
	/// type    0= department 1 = division
	var queryString = ""
	if (type == 0) {
		if (parentDivisionId == 0) {
			queryString = " `parentDivisionType`='" + type + "' AND `delete`='0'"
		} else {
			queryString = " `parentDivisionType`='" + type + "' AND `parentDivisionId`='" + parentDivisionId + "' AND `delete`='0'"
		}
	} else {
		queryString = " `parentDivisionType`='" + type + "' AND `parentDivisionId`='" + parentDivisionId + "' AND `delete`='0'"
	}
	var result = await getResult("SELECT  divisionId,divisionName,parentDivisionId FROM `" + instituteCode + "` WHERE " + queryString + " ");
	if (result.length != 0) {
		var data = []
		if (result.length != 0) {
			for (let i = 0; i < result.length; i++) {
				const element = result[i];
				res = await getAllChildDiviesionsNamesOnly(instituteCode, connection, 1, result[i]["divisionId"]);
				obj = {
					"divisionId": result[i]["divisionId"],
					"divisionName": result[i]["divisionName"],
					"parentDivisionId": result[i]["parentDivisionId"],
					"childs": res
				}
				data.push(obj)
			}
		}
		return data
	} else {
		return []
	}
}
// Return all class by Id
const getAllClassByParentId = async (instituteCode, connection, type, divisionId) => {
	/// type    0= department 1 = division
	var queryString = ""
	if (type == 0) {
		if (divisionId == 0) {
			queryString = " `divisionType`='" + type + "' AND `delete`='0'"
		} else {
			queryString = " `divisionType`='" + type + "' AND `divisionId`='" + divisionId + "' AND `delete`='0' "
		}
	} else {
		queryString = " `divisionType`='" + type + "' AND `divisionId`='" + divisionId + "' AND `delete`='0'"
	}
	code = instituteCode.split("_")
	var data2 = await getResult("SELECT `instituteId` FROM `institute` WHERE `instituteCode`='" + code[0] + "' ");
	if (data2.length != 0) {
		var result = await getResult("SELECT * FROM `class` WHERE " + queryString + "   AND `status`='0'");
		if (result.length != 0) {
			var data = []
			if (result.length != 0) {
				for (let i = 0; i < result.length; i++) {
					obj = {
						"classId": result[i]["classId"],
						"className": result[i]["className"],
						"classCode": result[i]["classCode"],
						"parentDivisionType": result[i]["parentDivisionType"] == 0 ? "department" : "division",
					}
					data.push(obj)
				}
			}
			return data
		} else {
			return []
		}
	} else {
		return []
	}
}
// return class   from  classcode
const getClassFromCode = async (code, instituteId, connection) => {
	var result = await getResult("SELECT * FROM `class` WHERE `classCode` ='" + code + "' AND `instituteId` = '" + instituteId + "' AND `delete` ='0'")
	return result
}
// Find and return Code // class  ,department , campus , divisions
const getDatafromCode = async (code, instituteId, institute_code, connection) => {
	var type;
	var string = "";
	if (code.toUpperCase().includes("CAMPUS")) {
		type = "campus";
		string = "SELECT * FROM `campus` WHERE `campusCode`='" + code + "' AND `instituteId`='" + instituteId + "' ";
	} else if (code.toUpperCase().includes("CLS")) {
		type = "class";
		string = "SELECT * FROM `class` WHERE `classCode`='" + code + "' AND `instituteId`='" + instituteId + "' ";
	} else if (code.toUpperCase().includes("DEP")) {
		type = "department";
		string = "SELECT * FROM `department` WHERE `departmenCode`='" + code + "' AND `instituteId`='" + instituteId + "' ";
	} else {
		type = "division"
		var instituteCode = await create_division(institute_code, connection);
		string = "SELECT * FROM `" + instituteCode + "` WHERE `divisionCode`='" + code + "' ";
	}
	var result = await getResult(string);
	if (result.length != 0) {
		result[0]["type"] = type
	}
	return result
}
// Return all child with less response
const InActiveChildsAndClass = async (instituteCode, connection, array) => {
	for (let i = 0; i < array.length; i++) {
		if (array[i]["childs"].length != 0) {
			var currnetChilds = array[i]["childs"]
			for (let ch = 0; ch < currnetChilds.length; ch++) {
				var data = await getAllChildDiviesions(instituteCode, connection, 0, currnetChilds[ch]["divisionId"])
				if (data.length != 0) {
					await InActiveChildsAndClass(instituteCode, connection, data)
				}
				await getResult("UPDATE `" + instituteCode + "` SET `delete`='1' WHERE `divisionId` ='" + currnetChilds[ch]["divisionId"] + "'");
			}
		}
		if (array[i]["class"].length != 0) {
			var currnetClass = array[i]["class"];
			for (let k = 0; k < currnetClass.length; k++) {
				await getResult("UPDATE `class` SET `status`='1' WHERE `classId` ='" + currnetClass[k]["classId"] + "'");
				await getResult("UPDATE `user` SET `classId`='0' WHERE `classId` ='" + currnetClass[k]["classId"] + "'");
			}
		}
	}
}
// finds all all parent from div 
// !Need To work
/**
 * Retrieves all parent divisions for a given institute code and parent division ID.
 * @param {string} instituteCode - The code of the institute.
 * @param {number} parentDivisionId - The ID of the parent division.
 * @returns {Promise<Array>} - A promise that resolves to an array of parent divisions.
 */
const getAllParentsDiviesions = async (instituteCode, parentDivisionId) => {
	/// type    0= department 1 = division
	var queryString = ""
	var result = await getResult("SELECT * FROM `" + instituteCode + "` WHERE `divisionId`='" + parentDivisionId + "' AND `delete`='0'");
	if (result.length != 0) {
		var data = []
		if (result.length != 0) {
			for (let i = 0; i < result.length; i++) {
				if (result[i]["parentDivisionType"] == 1) {
					res = await getAllParentsDiviesions(instituteCode, result[i]["parentDivisionId"]);
					var obj = {
						"divisionId": result[i]["divisionId"],
						"divisionName": result[i]["divisionName"],
						"parentDivisionId": result[i]["parentDivisionId"],
						"parentDivisionType": result[i]["parentDivisionType"],
						"parents": res
					}
					data.push(obj)
				} else {
					var states = await getResult(" SELECT `name` AS `divisionName`, `id` AS `divisionId`,`iso2` AS `divisionCode` FROM `states`  WHERE `id`='" + result[i]["parentDivisionId"] + "'  ");
					var obj = {
						"divisionId": result[i]["divisionId"],
						"divisionName": result[i]["divisionName"],
						"parentDivisionId": result[i]["parentDivisionId"],
						"parentDivisionType": result[i]["parentDivisionType"],
						"parents": states
					}
					data.push(obj)
				}
			}
		}
		return data
	} else {
		return []
	}
}
/**
 * Retrieves the state of divisions for a given institute code and parent division ID.
 * @param {string} instituteCode - The code of the institute.
 * @param {string} parentDivisionId - The ID of the parent division.
 * @returns {Promise<Array>} - A promise that resolves to an array of division states.
 */
const getStateOfDiviesions = async (instituteCode, parentDivisionId) => {
	/// type    0= department 1 = division
	var queryString = ""
	var result = await getResult("SELECT * FROM `" + instituteCode + "` WHERE `divisionId`='" + parentDivisionId + "' AND `delete`='0'");
	if (result.length != 0) {
		var data = []
		if (result.length != 0) {
			for (let i = 0; i < result.length; i++) {
				if (result[i]["parentDivisionType"] == 1) {
					res = await getStateOfDiviesions(instituteCode, result[i]["parentDivisionId"]);
					return res
				} else {
					var states = await getResult(" SELECT `name` AS `divisionName`, `id` AS `divisionId`,`iso2` AS `divisionCode` FROM `states`  WHERE `id`='" + result[i]["parentDivisionId"] + "'  ");
					return states
				}
			}
		}
	} else {
		return []
	}
}
// General Query Function 
/**
 * Executes a database query using the provided query string and returns the result.
 * @param {string} qry - The query string to execute.
 * @returns {Promise<any>} - A promise that resolves to the result of the query.
 * @throws {Error} - If an error occurs during the query execution.
 */
const getResult = async (qry) => {
	try {
		const h = await new Promise((resolve, reject) => {
			connection2.query(qry, (err, res) => {
				if (err != null) {
					resolve(err)
				} else {
					resolve(res)
				}
			})
		})
		return h
	} catch (error) {
		console.log(error)
	}
}
/**
 * Generates a code by concatenating a string with a zero-padded ID.
 * @param {number} id - The ID to be zero-padded and concatenated with the string.
 * @param {string} strings - The string to be concatenated with the zero-padded ID.
 * @returns {string} The generated code.
 */
const generateCode = (id, strings) => {
	var code = "";
	strlen = ((id).toString()).length // find length
	for (var i = 0; i < (6 - (strlen)); i++) {
		code += "0";
	}
	return strings + code + (id)
}
/**
 * Cleans a string by removing any null, undefined, or empty values.
 * @param {string} data - The string to clean.
 * @returns {string} - The cleaned string.
 */
const cleanString = (data) => {
	return (data == null || data == undefined || data == "") ? "" : data
}
/**
 * Validates the given data to check if it is null, undefined, or an empty string.
 * @param {*} data - The data to validate.
 * @returns {boolean} - True if the data is null, undefined, or an empty string, false otherwise.
 */
const validateData = (data) => {
	if (data == null || data == undefined || data == "") {
		return true
	} else {
		return false
	}
}
const checkInstitute = async (instituteId) => {
	var result = await getResult("SELECT * FROM `institute` WHERE `instituteId`='" + instituteId + "' AND `delete`='0'");
	return result
}
const checkTeacher = async (teacherId) => {
	var checkTeacher = await getResult("SELECT * FROM `user` WHERE  `delete`='0' AND `userId`='" + teacherId + "' AND `isTeacher`='1'");
	return checkTeacher
}
/**
 * Checks the permissions of teachers based on the given permission string.
 * @param {string} permissionString - The permission string to check.
 * @returns {Promise<Array>} - An array of objects containing the name, permissionId, and status of each permission.
 *                            The status is 1 if the permission is included in the permissionString, and 0 otherwise.
 */
var teachersPermission = async (permissionString) => {
	if (permissionString == "" || permissionString == null || permissionString == undefined) {
		return []
	} else {
		var result = await getResult("SELECT `name`,`permissionId` FROM `permission` WHERE `delete`='0' ")
		// "`permissionId` IN (" + permissionString + ")";
		var array = permissionString.split(',').map(function (item) {
			return parseInt(item, 10);
		});
		for (let i = 0; i < result.length; i++) {
			const element = result[i];
			if (array.includes(element["permissionId"])) {
				element["status"] = 1
			} else {
				element["status"] = 0
			}
		}
		return result
	}
}
/**
 * Cleans up an object by removing null values and trimming string values.
 * @param {object} myObject - The object to clean up.
 * @returns {object} - The cleaned up object.
 */
const cleanObject = (myObject) => {
	Object.keys(myObject).map(function (key, index) {
		if (myObject[key] == null) {
			myObject[key] = "";
		} else {
			if (typeof (myObject[key]) == "string") {
				myObject[key] = (myObject[key]).trim();
			}
		}
	});
	return myObject
}
/**
 * Checks if a record is archived based on the provided record ID, record type, and user ID.
 * @param {string} recordId - The ID of the record to check.
 * @param {string} recordType - The type of the record to check.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<boolean>} - A promise that resolves to true if the record is archived, false otherwise.
 */
const checkIsArchived = async (recordId, recordType, userId) => {
	var check = await getResult("SELECT * FROM `archives` WHERE `recordType`='" + recordType + "'AND `recordId`='" + recordId + "' AND `delete`='0' AND `userId`='" + userId + "'")
	if (check.length != 0) {
		return (check[0]["status"] == 0) ? false : true
	} else {
		return true
	}
}
/**
 * Adds a single record to the archives table in the database.
 * @param {number} recordId - The ID of the record to be added.
 * @param {string} recordType - The type of the record to be added.
 * @param {number} userId - The ID of the user associated with the record.
 * @returns {Promise<boolean>} - A promise that resolves to true if the record was successfully added, or false if it already exists with a status of 1.
 */
const addSingleArchive = async (recordId, recordType, userId) => {
	var check = await getResult("SELECT * FROM `archives` WHERE `recordType`='" + recordType + "'AND `recordId`='" + recordId + "' AND `delete`='0'")
	if (check.length != 0) {
		if (check[0]["status"] == 1) {
			var check = await getResult("UPDATE `archives` SET `status`='0' WHERE `recordType`='" + recordType + "'AND `recordId`='" + recordId + "' AND `delete`='0' AND `archivesId`='" + check[0]["archivesId"] + "'")
			return true
		} else {
			return false
		}
	} else {
		var check = await getResult("INSERT INTO  `archives` SET `status`='0' , `recordType`='" + recordType + "',`recordId`='" + recordId + "' ,`userId`='" + userId + "'")
		return true
	}
}
/**
 * Removes a single archive record from the database.
 * @param {number} recordId - The ID of the record to remove.
 * @param {string} recordType - The type of the record.
 * @param {number} userId - The ID of the user performing the action.
 * @returns {Promise<boolean>} - A promise that resolves to true if the record was successfully removed, or false if it was not.
 */
const removeSingleArchive = async (recordId, recordType, userId) => {
	var check = await getResult("SELECT * FROM `archives` WHERE `recordType`='" + recordType + "'AND`recordId`='" + recordId + "' AND `delete`='0'")
	if (check.length != 0) {
		if (check[0]["status"] == 0) {
			var check = await getResult("UPDATE `archives` SET `status`='1' WHERE `recordType`='" + recordType + "'AND `recordId`='" + recordId + "' AND `delete`='0' AND `archivesId`='" + check[0]["archivesId"] + "'")
			return true
		} else {
			return false
		}
	} else {
		var check = await getResult("INSERT INTO  `archives` SET `status`='1' , `recordType`='" + recordType + "',`recordId`='" + recordId + "' ,`userId`='" + userId + "'")
		return true
	}
}
/**
 * Archives a class based on the provided parameters.
 * @param {string} instituteCode - The code of the institute.
 * @param {string} userId - The ID of the user performing the action.
 * @param {number} status - The status of the class (0 for archive, 1 for unarchive).
 * @param {number} type - The type of the division.
 * @param {number} divisionId - The ID of the division.
 * @returns {Array} - An array of objects containing information about the archived classes.
 */
const archiveClass = async (instituteCode, userId, status, type, divisionId) => {
	/// type    0= department 1 = division
	var queryString = ""
	if (type == 0) {
		if (divisionId == 0) {
			queryString = " `divisionType`='" + type + "' AND `delete`='0'"
		} else {
			queryString = " `divisionType`='" + type + "' AND `divisionId`='" + divisionId + "' AND `delete`='0' "
		}
	} else {
		queryString = " `divisionType`='" + type + "' AND `divisionId`='" + divisionId + "' AND `delete`='0'"
	}
	code = instituteCode.split("_")
	var data2 = await getResult("SELECT `instituteId` FROM `institute` WHERE `instituteCode`='" + code[0] + "' ");
	if (data2.length != 0) {
		var result = await getResult("SELECT * FROM `class` WHERE " + queryString + "   AND `status`='0'");
		if (result.length != 0) {
			var data = []
			if (result.length != 0) {
				for (let i = 0; i < result.length; i++) {
					if (status == 0) {
						var update = await addSingleArchive(result[i]["classId"], 3, userId)
					} else {
						var update = await removeSingleArchive(result[i]["classId"], 3, userId)
					}
					obj = {
						"classId": result[i]["classId"],
						"className": result[i]["className"],
						"classCode": result[i]["classCode"],
						"parentDivisionType": result[i]["parentDivisionType"] == 0 ? "department" : "division",
					}
					data.push(obj)
					// student
					var students = await getResult("SELECT *,`userId` AS `studentId` FROM `user` WHERE `classId`='" + result[i]["classId"] + "' AND `instituteId`='" + data2[0]["instituteId"] + "' AND `isTeacher`='2' ")
					if (students.length != 0) {
						for (let j = 0; j < students.length; j++) {
							const element = students[j];
							if (status == 0) {
								var update = await addSingleArchive(element["studentId"], 1, userId)
							} else {
								var update = await removeSingleArchive(element["studentId"], 1, userId)
							}
						}
					}
					// var teacher = await getResult("SELECT * FROM `teacher` WHERE  `instituteId`='" + data2[0]["instituteId"] + "' ")
					// for (let l= 0; l < teacher.length; l++) {
					//     const element = teacher[l];
					//     var classes = JSON.parse(element["classes"])
					//     if (classes.length != 0) {  
					//         for (let k = 0; k < classes.length; k++) {
					//             const elementClass = classes[k];
					//             if(elementClass["type"]=="class" && (elementClass["id"]).includes(result[i]["classId"]) ){
					//                 if (status == 0) {
					//                     var update = await addSingleArchive(element["teacherId"], 2, userId)
					//                 } else {
					//                     var update = await removeSingleArchive(element["teacherId"], 2, userId)
					//                 }
					//             }
					//         }
					//     }
					// }
					var teacher = await getResult("SELECT *,userId AS teacherId FROM `teacherdepartment` WHERE  `instituteId`='" + data2[0]["instituteId"] + "' AND `divisionId`='" + result[i]["classId"] + "' AND `divisionType`='class'  ")
					for (let l = 0; l < teacher.length; l++) {
						const element = teacher[l];
						if (status == 0) {
							var update = await addSingleArchive(element["teacherId"], 2, userId)
						} else {
							var update = await removeSingleArchive(element["teacherId"], 2, userId)
						}
					}
				}
			}
			return data
		} else {
			return []
		}
	} else {
		return []
	}
}
/**
 * Archives a single class based on the provided parameters.
 * @param {string} instituteCode - The code of the institute.
 * @param {string} userId - The ID of the user performing the action.
 * @param {number} status - The status of the class (0 for active, 1 for archived).
 * @param {number} type - The type of division (0 for department, 1 for division).
 * @param {number} divisionId - The ID of the division.
 * @param {number} classId - The ID of the class to archive.
 * @returns {Array} - An array of objects containing information about the archived classes.
 */
const archiveSingleClass = async (instituteCode, userId, status, type, divisionId, classId) => {
	/// type    0= department 1 = division
	var queryString = ""
	if (type == 0) {
		if (divisionId == 0) {
			queryString = " `divisionType`='" + type + "' AND `delete`='0'"
		} else {
			queryString = " `divisionType`='" + type + "' AND `divisionId`='" + divisionId + "' AND `delete`='0' "
		}
	} else if (type == 3) { } else {
		queryString = " `divisionType`='" + type + "' AND `divisionId`='" + divisionId + "' AND `delete`='0'"
	}
	code = instituteCode.split("_")
	var data2 = await getResult("SELECT `instituteId` FROM `institute` WHERE `instituteCode`='" + code[0] + "' ");
	if (data2.length != 0) {
		var result = await getResult("SELECT * FROM `class` WHERE " + queryString + "  AND `classId`='" + classId + "'  AND `status`='0'");
		if (result.length != 0) {
			var data = []
			if (result.length != 0) {
				for (let i = 0; i < result.length; i++) {
					if (status == 0) {
						var update = await addSingleArchive(result[i]["classId"], 3, userId)
					} else {
						var update = await removeSingleArchive(result[i]["classId"], 3, userId)
					}
					obj = {
						"classId": result[i]["classId"],
						"className": result[i]["className"],
						"classCode": result[i]["classCode"],
						"parentDivisionType": result[i]["parentDivisionType"] == 0 ? "department" : "division",
					}
					data.push(obj)
					// student
					var students = await getResult("SELECT *,`userId` AS `studentId` FROM `user` WHERE `classId`='" + result[i]["classId"] + "' AND `instituteId`='" + data2[0]["instituteId"] + "' AND `isTeacher`='2' ")
					if (students.length != 0) {
						for (let j = 0; j < students.length; j++) {
							const element = students[j];
							if (status == 0) {
								var update = await addSingleArchive(element["studentId"], 1, userId)
							} else {
								var update = await removeSingleArchive(element["studentId"], 1, userId)
							}
						}
					}
					var teacher = await getResult("SELECT *,userId AS teacherId FROM `teacherdepartment` WHERE   `instituteId`='" + data2[0]["instituteId"] + "' AND `divisionId`='" + result[i]["classId"] + "' AND `divisionType`='class'  ")
					for (let l = 0; l < teacher.length; l++) {
						const element = teacher[l];
						if (status == 0) {
							var update = await addSingleArchive(element["teacherId"], 2, userId)
						} else {
							var update = await removeSingleArchive(element["teacherId"], 2, userId)
						}
					}
				}
			}
			return data
		} else {
			return []
		}
	} else {
		return []
	}
}
/**
 * Archives a division based on the provided parameters.
 * @param {string} instituteCode - The code of the institute.
 * @param {string} userId - The ID of the user performing the action.
 * @param {number} status - The status of the division (0 for archiving, 1 for unarchiving).
 * @param {number} type - The type of the division.
 * @param {number} parentDivisionId - The ID of the parent division.
 * @returns {Promise<Array>} - An array of archived divisions.
 */
const archiveDivision = async (instituteCode, userId, status, type, parentDivisionId) => {
	var queryString = ""
	if (type == 0) {
		if (parentDivisionId == 0) {
			queryString = " `parentDivisionType`='" + type + "' AND `delete`='0'"
		} else {
			queryString = " `parentDivisionType`='" + type + "' AND `parentDivisionId`='" + parentDivisionId + "' AND `delete`='0'"
		}
	} else {
		queryString = " `parentDivisionType`='" + type + "' AND `parentDivisionId`='" + parentDivisionId + "' AND `delete`='0'"
	}
	var result = await getResult("SELECT * FROM `" + instituteCode + "` WHERE " + queryString + " ");
	if (result.length != 0) {
		var data = []
		if (result.length != 0) {
			for (let i = 0; i < result.length; i++) {
				const element = result[i];
				if (status == 0) {
					var update = await addSingleArchive(result[i]["divisionId"], 4, userId)
				} else {
					var update = await removeSingleArchive(result[i]["divisionId"], 4, userId)
				}
				res = await archiveDivision(instituteCode, userId, status, 1, result[i]["divisionId"]);
				obj = {
					"divisionId": result[i]["divisionId"],
					"divisionName": result[i]["divisionName"],
					"parentDivisionId": result[i]["parentDivisionId"],
					"divisionType": result[i]["divisionType"],
					"divisionCode": result[i]["divisionCode"],
					"parentDivisionType": result[i]["parentDivisionType"] == 0 ? "department" : "division",
					"childs": res,
					"class": await archiveClass((instituteCode).toLowerCase(), userId, status, 1, result[i]["divisionId"])
				}
				data.push(obj)
			}
		}
		return data
	}
}
/**
 * Checks if a class with the given classId exists in the database.
 * @param {string} classId - The ID of the class to check.
 * @returns {Promise} A promise that resolves to the data of the class if it exists, or null if it doesn't.
 */
const checkClass = async (classId) => {
	var data = await getResult("SELECT * FROM class WHERE `classId`='" + classId + "' AND `delete`='0'");
	return data
}
/**
 * Checks if a user exists in the database based on their userId and optional type.
 * @param {string} userId - The userId of the user to check.
 * @param {string} [type=""] - The type of user to check (e.g. "teacher", "student").
 * @returns {Promise<Object>} - A promise that resolves to the user data if found, or null if not found.
 */
const checkUser = async (userId, type = "") => {
	var subQuery = "";
	if (!validateData(type)) {
		subQuery += "AND `isTeacher`='" + type + "'"
	}
	var data = await getResult("SELECT * FROM `user` WHERE `userId`='" + userId + "' AND `delete`='0'" + subQuery);
	return data
}
/**
 * Calls an API endpoint with the given URL and request body.
 * @param {string} url - The URL of the API endpoint.
 * @param {object} raw - The request body to send to the API.
 * @returns {Promise<object>} - A promise that resolves to the response data from the API.
 * @throws {Error} - If there is an error calling the API.
 */
const callApi = async (url = "", raw = {}) => {
	try {
		const requestOptions = {
			method: 'POST', // Change this to 'PUT' if you want to make a PUT request
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(raw),
		};
		const response = await fetch(url, requestOptions);
		const data = await response.json();


		console.log(data);
		return data
	} catch (error) {
		console.error('Error calling the API:', error.message);
	}
}

function evaluateAnswers(submittedAnswers, answerKey) {
	// Initialize an object to store the results
	const results = {
		correct: [],
		incorrect: [],
		not_attempted: []
	};
	// Loop through the answer key
	// for (const item of answerKey) {
	// 	const question = item.question; // Get the question number

	// 	const correctAnswer = item.answer; // Get the correct answer
	// 	const submittedAnswer = submittedAnswers[question] || ""; // Get the submitted answer or an empty string if not submitted
	// 	// Check if the question was not attempted

	// 	if (submittedAnswer == "") {
	// 		results.not_attempted.push(question);
	// 	} else if (submittedAnswer == correctAnswer) { // Check if the submitted answer is correct
	// 		results.correct.push(question);


	// 	} else { // If neither not attempted nor correct, it's incorrect
	// 		results.incorrect.push(question);
	// 	}
	// }

	for (let i = 0; i < answerKey.length; i++) {
		const item = answerKey[i];
		const question = item.question; // Get the question number
		const correctAnswer = item.answer; // Get the correct answer
		const submittedAnswer = submittedAnswers[question] || ""; // Get the submitted answer or an empty string if not submitted

		// Check if the question was not attempted
		if (submittedAnswer == "") {
			results.not_attempted.push(question);
		} else if (submittedAnswer == correctAnswer) { // Check if the submitted answer is correct
			results.correct.push(question);
		} else { // If neither not attempted nor correct, it's incorrect
			results.incorrect.push(question);
		}
	}
	// Return the results object
	return results;
}
const planDetails = async (planId) => {
	var data = await getResult("SELECT `planId`,`name`,`credit`,`price` FROM `plan` WHERE planId='" + planId + "' AND `delete`='0' ORDER BY `price` ASC")
	return data
}
const addCredits = async (instituteId, credits, remarks = "") => {
	try {
		const update = await getResult("UPDATE `institute` SET `credits`= (`credits`+ '" + credits + "') WHERE `instituteId`='" + instituteId + "' ")
		const creditHistory = await getResult("INSERT INTO `credithistory` SET `credits`='" + credits + "',`instituteId`='" + instituteId + "',`action`='CREDIT',`remarks`='" + remarks + "' ")
		return true
	} catch (error) {
		console.log(error);
		return false
	}
}
const timeSince = (date) => {
	var a = moment();
	var b = moment(date,);
	a.diff(b, "seconds") // 1
	var seconds = a.diff(b, "seconds");
	var interval = seconds / 31536000;
	if (interval > 1) {
		return Math.floor(interval) + " years ago";
	}
	interval = seconds / 2592000;
	if (interval > 1) {
		return Math.floor(interval) + " months ago";
	}
	interval = seconds / 86400;
	if (interval > 1) {
		return Math.floor(interval) + " days ago";
	}
	interval = seconds / 3600;
	if (interval > 1) {
		return Math.floor(interval) + " hours ago";
	}
	interval = seconds / 60;
	if (interval > 1) {
		return Math.floor(interval) + " minutes ago";
	}
	return Math.floor(seconds) + " seconds ago";
}

const studentResultByExam = async (studentId, examId) => {


	const checkExam = await getResult("SELECT * FROM `exam` WHERE `examId`='" + examId + "' ");

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
			const answerData = evaluateAnswers(JSON.parse(exampaper[0]["submittedKey"] || "[]"), answerKey)

			function categorizeValues(firstSet, secondSet,) {
				for (const subject of firstSet) {
					subject.obtainMarks = 0;
					subject.correct = 0;
					subject.incorrect = 0;
					for (const section of subject.sections) {
						const start = section.subjectStart;
						const end = section.subjectEnd;
						section.correct = secondSet.correct.filter(question => question >= start && question <= end).sort();
						section.incorrect = secondSet.incorrect.filter(question => question >= start && question <= end).sort();
						section.not_attempted = secondSet.not_attempted.filter(question => question >= start && question <= end).sort();
						section.obtainMarks = section.correct.length * section.marksForCorrect;
						subject.obtainMarks += section.obtainMarks;
						subject.correct += (section.correct).length
						subject.incorrect += (section.incorrect).length
					}
					const percentage = (subject.obtainMarks / subject.totalMarks) * 100;
					subject.percentage = percentage;
				}
				return firstSet;
			}
			const filterd = categorizeValues(subjects, answerData)

			// var anTable = (calculateMarks(filterd, answerKey, JSON.parse(exampaper[0]["submittedKey"] || "[]")))
			for (const subject of filterd) {
				delete subject.sections;
			}
			// var student = await fn.checkUser(studentId)


			return filterd;

		} else {
			return [];
		}
	} else {
		return [];
	}

}



const responseImage = async (blobName) => {

}

module.exports = {
	uploadImageFromUrlToBlob,
	studentResultByExam,
	timeSince,
	addCredits,
	planDetails,
	evaluateAnswers,
	callApi,
	checkUser,
	archiveSingleClass,
	archiveClass,
	checkClass,
	archiveDivision,
	checkIsArchived,
	removeSingleArchive,
	addSingleArchive,
	cleanObject,
	teachersPermission,
	checkTeacher,
	checkInstitute,
	validateData,
	generateCode,
	InActiveChildsAndClass,
	getResult,
	generateOTP,
	getAllParentsDiviesions,
	ucFirst,
	ValidateEmail,
	getBlobTempPublicUrl,
	getClassFromCode,
	getDatafromCode,
	getAllClassByParentId,
	getAllChildDiviesions,
	create_division,
	successResponse,
	errorResponse,
	mysql_real_escape_string,
	getAllChildDiviesionsNamesOnly,
	getStateOfDiviesions,
	cleanString,
	storageaccount,
	container,
	connectionString,
	accesskey
}