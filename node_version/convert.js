
const xlsx = require('xlsx');
const fs = require('fs');

//# readExcelfile : 내용을 읽어들일 엑셀 파일 이름
//@ type : string
const makeJSON = function(readExcelfile){
    const workbook = xlsx.readFile(readExcelfile+'_rec.xls');
    const json = {};
    let i = workbook.SheetNames.length;

    while (i--) {
        const sheetname = workbook.SheetNames[i];
        json[sheetname] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetname]);
        
        fs.writeFile(readExcelfile+'_rec.json', JSON.stringify(json[sheetname]), function(){
            console.log("파일 작성!")
        });
    }
}


//# readExcelfile : 내용을 읽어들일 엑셀 파일 이름
//@ type : string
const makeCSV = function(readExcelfile){
    const workbook = xlsx.readFile(readExcelfile);
    console.log(readExcelfile)
    const json = {};
    let i = workbook.SheetNames.length;

    while (i--) {
        const sheetname = workbook.SheetNames[i];
        json[sheetname] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetname]);
        
        fs.writeFile(readExcelfile+'_rec.json', JSON.stringify(json[sheetname]), function(){
            console.log("파일 작성!")
        });
    }
}

module.exports = {
    makeJSON,
    makeCSV
};
