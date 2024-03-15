
// const {storageaccount, accesskey,container,connectionString,saveWithoutModel} = require("./index.js")
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const moment = require("moment")
const storageaccount = "justevalve"
const container = "justevalvemedia"
const connectionString = "DefaultEndpointsProtocol=https;AccountName=justevalve;AccountKey=WsBRcPtw9lLqyhcLCcf+oPHbOx7Xmiu937MLE4xoQgFjJCy8u45qU1zOT2mPLrR7UaVFOeChvAxl+AStembD1g==;EndpointSuffix=core.windows.net"
const accesskey = "WsBRcPtw9lLqyhcLCcf+oPHbOx7Xmiu937MLE4xoQgFjJCy8u45qU1zOT2mPLrR7UaVFOeChvAxl+AStembD1g=="
const { spawn } = require('child_process');
const { BlobServiceClient,  } = require('@azure/storage-blob');
const { getResult } = require("./function.js");

const mysqldump = require('mysqldump');
const databaseConfig = {
 host: process.env.DB_HOST,
 user: process.env.DB_USER,
 password: process.env.DB_PASSWORD,
 database: process.env.DB_DATABASE,
};


async function createBackup(req,res) {
 try {
   const blobConfig = {
     accountName: storageaccount,
     accountKey: accesskey,
     containerName: 'db-backup',
     connectionString:connectionString,

   };

   const timestamp = moment().format('DD-MM-YYYY-HH_mm_ss'); // Remove colons for filename
   const backupFileName = `backup-${timestamp}.sql`;




   const date = moment().format('YYYY-MM-DD');
   // Export the database data to an SQL file
   var check = await getResult("SELECT * FROM `dbbackup` WHERE `date`='" + date + "'");

   if (check.length == 0) {
     const sqlContent = await exportDatabaseToSQL();

     // Upload the SQL content directly to Amazon S3
     const url = await uploadBackupToAzureBlob(blobConfig, sqlContent, backupFileName);
     var save = await getResult("INSERT INTO `dbbackup` SET time='"+moment().format("YYYY-MM-DD HH:mm:ss")+"', `type`='auto',`fileName`='"+url+"',`date`='"+date+"'",);
     console.log(save);
     console.log(`Backup created and uploaded successfully: ${backupFileName}`);
   }
 } catch (err) {
   console.error('Error creating and uploading backup:', err);
 }
}


async function exportDatabaseToSQL() {
  try {
    // Use mysqldump library to generate the SQL dump
    const dump = await mysqldump({
      connection: {
        host: databaseConfig.host,
        user: databaseConfig.user,
        password: databaseConfig.password,
        database: databaseConfig.database
      },
      // Specify the file where you want to save the dump
    });
    
    return dump["dump"]["schema"]+ dump["dump"]["data"];
  } catch (err) {
    throw new Error(`Error exporting database to SQL file: ${err.message}`);
  }
}

async function uploadBackupToAzureBlob(blobConfig, sqlContent, backupFileName) {
 try {
   const connectionString = blobConfig.connectionString; // Assuming you have connectionString and container defined somewhere
   const container = blobConfig.containerName;

   const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
   const containerClient = blobServiceClient.getContainerClient(container);
   const blockBlobClient = containerClient.getBlockBlobClient(backupFileName);

   const sqlBuffer = Buffer.from(sqlContent, 'utf-8');

   const uploadResponse = await blockBlobClient.upload(sqlBuffer, sqlBuffer.length, {
     blobHTTPHeaders: { blobContentType: 'text/plain' },
     accessConditions: { modifiedAccessConditions: { ifNoneMatch: '*' } },
   });


   // Retrieve and return the URL of the uploaded blob
   const blobUrl = blockBlobClient.url;
   return blobUrl;
 } catch (error) {
   console.error('Error uploading file:', error);
   return null; // Handle the error or return an appropriate value
 }
}
module.exports = {
 createBackup,
};