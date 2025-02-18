import { google } from "googleapis";
import { configDotenv } from "dotenv";

configDotenv();

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_KEY_FILE_PATH,
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/gmail.send",
  ],
});

const drive = google.drive({ version: "v3", auth });
const sheets = google.sheets({ version: "v4", auth });
const gmail = google.gmail({ version: "v1", auth });

export async function updateOrCreateSpreadsheetWidthFolder({
  userEmail,
  folderName,
  sheetName,
  values,
}) {
  try {
    const folderId = await findOrCreateFolder(folderName);
    await setPermissions({
      fileId: folderId,
      userEmail: userEmail,
      role: "writer",
    });
    const createdFolderShortCut = await drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: "application/vnd.google-apps.shortcut",
        parents: ["root"],
        shortcutDetails: {
          targetId: folderId,
        },
      },
      fields: "id",
    });

    const sheetId = await findOrCreateSpreadSheet(sheetName, folderId);
    await setPermissions({
      fileId: sheetId,
      userEmail: userEmail,
      role: "writer",
    });
    await writeToSheet(sheetId, values);
  } catch (error) {
    console.error(error);
  }
}

async function findOrCreateFolder(folderName) {
  try {
    const folders = await drive.files.list({
      q: `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id, name)",
    });
    if (folders.data.files.length) {
      return folders.data.files[0].id;
    }
    const createdFolder = await drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: ["root"],
      },
      fields: "id",
    });

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
      await deleteFile(fileRes.data.files[0].id);
    }
    const spreadsheet = await sheets.spreadsheets.create({
      requestBody: {
        properties: { title: sheetName, timeZone: "Europe/Kiev" },
      },
      fields: "spreadsheetId",
    });
    const sheetId = spreadsheet.data.spreadsheetId;

    await drive.files.update({
      fileId: sheetId,
      addParents: folderId,
      fields: "id",
    });

    return sheetId;
  } catch (error) {
    console.error(error);
  }
}

async function setPermissions({ fileId, userEmail, role }) {
  try {
    await drive.permissions.create({
      fileId,
      requestBody: {
        type: "user",
        role,
        emailAddress: userEmail,
      },
    });
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
      requestBody: { values },
    });
  } catch (error) {
    console.error(error);
  }
}

async function deleteFile(fileId) {
  try {
    await drive.files.delete({
      fileId,
    });
    await drive.files.emptyTrash();

    return true;
  } catch (error) {
    console.error("Error deleting spreadsheet:", error);
    return false;
  }
}

// const list = await drive.files.list();
// list.data.files.forEach(async (file) => {
//   await drive.files.delete({ fileId: file.id });
// });
// await drive.files.emptyTrash();
// console.log(await drive.files.list().data);
