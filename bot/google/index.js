import { google } from "googleapis";
import { configDotenv } from "dotenv";
configDotenv();
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_KEY_FILE_PATH,
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive",
  ],
});

const drive = google.drive({ version: "v3", auth });
const sheets = google.sheets({ version: "v4", auth });

export async function updateOrCreateSpreadsheetWidthFolder({
  userEmail,
  folderName,
  sheetName,
  values,
}) {
  try {
    const folderId = await findOrCreateFolder(folderName);

    await setPermissions(folderId, userEmail, "writer");
    const createdFolderShortCut = await drive.files.create({
      resource: {
        name: folderName,
        mimeType: "application/vnd.google-apps.shortcut",
        parents: ["root"],
        shortcutDetails: {
          targetId: folderId,
        },
      },
      fields: "id",
    });

    console.log("added shortcut", createdFolderShortCut);
    const sheetId = await findOrCreateSpreadSheet(sheetName, folderId);
    await setPermissions(sheetId, userEmail, "writer");
    await writeToSheet(sheetId, values);

    console.log(`sheet and folder created`);
    console.log(`folder: https://drive.google.com/drive/folders/${folderId}`);
    console.log(`sheet: https://docs.google.com/spreadsheets/d/${sheetId}`);
  } catch (error) {
    console.error(error.message);
  }
}

async function findOrCreateFolder(folderName) {
  try {
    const folders = await drive.files.list({
      q: `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id, name)",
    });
    if (folders.data.files.length) {
      console.log("folder found, id", folders.data.files[0].id);
      return folders.data.files[0].id;
    }
    const createdFolder = await drive.files.create({
      resource: {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: ["root"],
      },
      fields: "id",
    });

    console.log("folder created, id", createdFolder.data.id);

    return createdFolder.data.id;
  } catch (error) {
    console.error(error);
  }
}

async function findOrCreateSpreadSheet(sheetName, folderId) {
  try {
    const fileRes = await drive.files.list({
      q: `name = '${sheetName}' and '${folderId}' in parents and trashed = false`,
      fields: "files(id)",
    });
    if (fileRes.data.files.length > 0) {
      console.log("spreadsheet found, id", fileRes.data.files[0].id);
      await deleteSpreadsheet(fileRes.data.files[0].id);
    }
    const spreadsheet = await sheets.spreadsheets.create({
      resource: {
        properties: { title: sheetName },
      },
      fields: "spreadsheetId",
    });
    const sheetId = spreadsheet.data.spreadsheetId;
    console.log("spreadsheet created, id", sheetId);
    await drive.files.update({
      fileId: sheetId,
      addParents: folderId,
      fields: "id",
    });
    console.log("spreadsheet updated");
    return sheetId;
  } catch (error) {
    console.error(error);
  }
}

async function setPermissions(fileId, userEmail, role) {
  try {
    await drive.permissions.create({
      fileId: fileId,
      resource: {
        type: "user",
        role: role,
        emailAddress: userEmail,
      },
    });

    console.log(
      `premission ${role} is set to fileId${fileId} to email ${userEmail}`
    );
  } catch (error) {
    console.error(error);
  }
}

async function writeToSheet(sheetId, values) {
  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: "Sheet1!A1",
      valueInputOption: "RAW",
      resource: { values },
    });
    console.log(`sheet has been updated`);
  } catch (error) {
    console.error(error);
  }
}

async function deleteFolder(folderId) {
  try {
    await drive.files.update({
      fileId: folderId,
      resource: { trashed: true },
    });
    console.log(` Folder moved to trash: ${folderId}`);
  } catch (error) {
    console.error("Error moving folder to trash:", error);
  }
}
async function deleteSpreadsheet(spreadsheetId) {
  try {
    await drive.files.delete({
      fileId: spreadsheetId,
    });

    console.log("Spreadsheet deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting spreadsheet:", error);
    return false;
  }
}
