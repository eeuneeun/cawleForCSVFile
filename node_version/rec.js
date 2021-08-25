(async()=>{

  //# LIBRARY
  const Crawler = require("crawler");
  const fs = require('fs');
  const axios = require('axios').default;

  // // CUSTOM FUNCTION
  const convert = require('./convert');

  //# URL
  const URL_DOMAIN = 'https://onerec.kmos.kr/portal/';
  const URL_BRD_LIST='selectBbsNttList.do?bbsNo=477&key=1970';



  function goCrawlering(urlsite, func){
      
    return new Promise((resolve,reject)=>{
      //# 크롤링 규칙 할당
      var c = new Crawler({
        maxConnections : 10,
        callback : function (error, res, done) {

            if(error){
              console.log(error);
              reject(error)
            }else{
              var $ = res.$;
              let result = null;
            
              if(func){
                result = func($);
              }
                    
              resolve(result);
            }

            done()

          }
        });
      c.queue(urlsite);
    });
  }

  function getFileName($){
    const dateStr =$(".bbsTable.mt10 table tbody tr:first-child td:nth-child(4)").text();
    return  dateStr.trim();
  }

  function geContentstUrl($){
    const linkStr =$(".bbsTable.mt10 table tbody tr:first-child td:nth-child(2) a").attr("href");
    
    return linkStr.slice(2, linkStr.length);
  }

  function getExcelFileUrl($){
    const linkStr= $("#area_sub_content .bbsTableView .file-list li:nth-child(3) a").attr("href")
    return linkStr.slice(8, linkStr.length);
  }

  function getExcelFile(targetUrl, filename){
    return axios.request({
      
      responseType: 'arraybuffer',
      url: targetUrl,
      method: 'get',
      headers: {
        'Content-Type': 'blob',
      }

    }).then((result) => {
      fileNameForExcel = filename + '_rec.xls'
      fs.writeFileSync(fileNameForExcel, result.data);
      return fileNameForExcel;

    });
  }



  
  // //# 0 데이터 날짜
  const FILENAME = await goCrawlering(URL_DOMAIN+URL_BRD_LIST, getFileName);

  //# 1 글의 경로 
  const URL_CONTENTS = await goCrawlering(URL_DOMAIN+URL_BRD_LIST, geContentstUrl);

  //# 2 엑셀 파일 경로
  const URL_FILE = await goCrawlering(URL_DOMAIN+URL_CONTENTS, getExcelFileUrl);

  //# 3 : 엑셀 파일 다운로드
  getExcelFile(URL_DOMAIN+URL_FILE, FILENAME);

  //# 4 : JSON 파일 변환
  convert.makeJSON(FILENAME);

})();

