(async()=>{

  //# LIBRARY
  const fs = require('fs');
  const axios = require('axios').default;

  //# CUSTOM FUNCTION
  //@ - 1. goCrawlering
  //@ - 2. makeJSON
  //@ - 3. makeCSV
  const convert = require('./convert');

  //# URL
  const URL_DOMAIN = 'https://onerec.kmos.kr/portal/';
  const URL_BRD_LIST='selectBbsNttList.do?bbsNo=477&key=1970';


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


  
  //# 0 데이터 날짜
  const FILENAME_DATE = await convert.goCrawlering(URL_DOMAIN+URL_BRD_LIST, getFileName);

  //# 1 글의 경로 
  const URL_CONTENTS = await convert.goCrawlering(URL_DOMAIN+URL_BRD_LIST, geContentstUrl);

  //# 2 엑셀 파일 경로
  const URL_FILE = await convert.goCrawlering(URL_DOMAIN+URL_CONTENTS, getExcelFileUrl);

  //# 3 : 엑셀 파일 다운로드
  const FILENAME_XLS = await getExcelFile(URL_DOMAIN+URL_FILE, FILENAME_DATE);

  //# 4 : JSON 파일 변환
  const FILENAME_JSON = await convert.makeJSON(FILENAME_XLS);

  //# 5 : CSV 파일 변환
  const FILENAME_CSV = await convert.makeCSV(FILENAME_JSON);

})();

