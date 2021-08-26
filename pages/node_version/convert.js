
const xlsx = require('xlsx');
const fs = require('fs');
const {jsonToCSV} = require("react-papaparse");

//# FILENAME_XLS : 내용을 읽어들일 엑셀 파일 이름
//@ type : string
const makeJSON = function(FILENAME_XLS){

    return new Promise((resolve,reject)=>{

        const workbook = xlsx.readFile(FILENAME_XLS);
        let i = workbook.SheetNames.length;
        
        const FILENAME_JSON = FILENAME_XLS.substring(0, 10)+'_rec.json'
        const json = {};

        while (i--) {
            const sheetname = workbook.SheetNames[i];
            json[sheetname] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetname]);
            
            fs.writeFile(FILENAME_JSON, JSON.stringify(json[sheetname]), function(){
                console.log("JSON 파일 생성 완료")
                resolve(FILENAME_JSON)
            });
        }

    });
}


//# FILENAME_JSON : 내용을 읽어들일 JSON 파일 이름
//@ type : string
const makeCSV = function(FILENAME_JSON){
 
    return new Promise((resolve,reject)=>{
        const thisDate = FILENAME_JSON.substring(0, 10)
        const FILENAME_CSV = thisDate+'_rec.csv'

        fs.readFile(FILENAME_JSON, 'utf8', (error, jsonFile) => {
            if (error) {
                
                console.log(error);
                reject(error)
            
            }else{

                const resultArrOfJson = JSON.parse(jsonFile);

                const minMaxShore = resultArrOfJson[22].__EMPTY_1.replace(/,/g,"").split(' / ');
                const minMaxJeJu = resultArrOfJson[22].__EMPTY_7.replace(/,/g,"").split(' / ');


                const minMaxAvg = resultArrOfJson[23].__EMPTY_1.replace(/,/g,"").split(' / ');
                const price = resultArrOfJson[24].__EMPTY_1.replace(/,/g,"");
                const diff = resultArrOfJson[25].__EMPTY_1;

                const parsedArrOfJson =[
                    {
                        date: thisDate,
                        trd_amount: resultArrOfJson[10].__EMPTY_8.replace(/,/g,""),
                        min: minMaxShore[0],
                        max: minMaxShore[1],
                        min_avg: minMaxAvg[0],
                        max_avg: minMaxAvg[1],
                        price : price,
                        diff : diff,
                        area_type:"1" //육지
                    },
                    {
                        date: thisDate,
                        trd_amount:  resultArrOfJson[11].__EMPTY_8.replace(/,/g,""),
                        min: minMaxJeJu[0],
                        max: minMaxJeJu[1],
                        min_avg: minMaxAvg[0],
                        max_avg: minMaxAvg[1],
                        price : price,
                        diff : diff,
                        area_type:"9" //제주
                    }   
                ] 



                const resultDataOfCSV = jsonToCSV (parsedArrOfJson, {
                    delimiter: "|",
                    header: true
                });
                

                console.log(resultDataOfCSV)

                    
                fs.writeFile(FILENAME_CSV, resultDataOfCSV, function(){
                    console.log("CSV 파일 생성 완료")
                    resolve(FILENAME_CSV)
                });
            }
        });
 
    });
}

module.exports = {
    makeJSON,
    makeCSV
};
