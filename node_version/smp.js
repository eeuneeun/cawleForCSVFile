

(async () => {
	console.log('start');
//# 크롤러 객체
    const Crawler = require("crawler");
	
	const {jsonToCSV} = require("react-papaparse");
    //# URL
    const URL = 'https://onerec.kmos.kr/portal/rec/selectRecSMPList.do?key=1965';
	
	
//# 결과 JSON 배열 

    const resultArrOfJson = await goCrawlering(URL);

//console.log(resultArrOfJson);

	const resultCSV = jsonToCSV (resultArrOfJson, {
      delimiter: "|",
      header: true
    });
	
	console.log(resultCSV);

    function goCrawlering(urlsite){
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
                
                //# 오늘 날짜 
                //@ type : string
                const todayTmp = $("#div1_t table thead tr th:last-child").last().text();
                const today = "2021-"+todayTmp.substr(0,2)+"-"+todayTmp.substr(3,2);

                //# SMP 지역 타입 
                //@ type : string
                //@ 육지 : 0 , 제주 : 1, 통합 : total
                const areaType =$("select#area_type").val()

                //# 시간별 SMP 가격
                //@ type : []
                const smpArr = $("#div1_t table tbody:last-child tr td:last-child");

                //# 가공한 Json 객체들을 담을 빈 배열 
                //@ type : []
                let tmpJsonArr = []
                          

                smpArr.each(function(idx){
                  tmpJsonArr.push(
                    {
                      "date" : today,
                      "hour" : idx,
                      "area_type" : areaType,
                      "value" : $(this).text()
                    }
                  )
                });
                
                resolve(tmpJsonArr);
              }

              done()

            }
          });
        c.queue(urlsite);
      });
    }	
})();


    