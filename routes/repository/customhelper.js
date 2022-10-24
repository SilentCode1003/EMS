const fs = require('fs');

//#region READ & WRITE JSON FILES
exports.ReadJSONFile = function (filepath) {
    console.log(`Read JSON file: ${filepath}`);
    var data = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(data);
};

exports.GetFolderList = function (dir) {
    console.log(`Content: ${dir}`);
    var data = fs.readdirSync(dir);
    return data;
};

exports.GetFiles = function (dir) {
    console.log(`Content: ${dir}`);
    var data = fs.readdirSync(dir);
    return data;
};

exports.CreateJSON = (filenamepath, data) => {
    console.log(`Path: ${filenamepath} Content: ${data}`);
    fs.writeFileSync(filenamepath, data, (err) => {
        return err;
    })

    return 'Success';
};

exports.GetUser = (id, password) => {

}
//#endregion