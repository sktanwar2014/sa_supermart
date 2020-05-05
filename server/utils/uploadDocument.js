const { promisify } = require("util");
const fs = require("fs");

async function uploadDocument(path, data) {
    if (!fs.existsSync('./files')){
        fs.mkdirSync('./files');
    }
    const writeFile = promisify(fs.writeFile);
    await writeFile(path, data, { encoding: 'base64' });
    console.info("file uploaded successfully!");
}
  

module.exports = { uploadDocument: uploadDocument };