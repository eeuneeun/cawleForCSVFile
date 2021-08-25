import Head from 'next/head'
import { jsonToCSV  } from 'react-papaparse';


export default function CustomCrawler(props) {

  const jsonArr = props.data;

  //# CSV 파일로 파싱
  function parseToCSV(){
    const resultCSV = jsonToCSV (jsonArr, {
      delimiter: "|",
      header: true
    });
    downLoadCSV(resultCSV)
  }
    
  //# 오늘 날짜 구하기
  function getToday(){
    const D = new Date();
    const year = D.getFullYear();
    const month = ("0" + (1 + D.getMonth())).slice(-2);
    const day = ("0" + D.getDate()).slice(-2);
    const today = year + "-" + month + "-" + day;
    
    return today;
  }
 
  //# 파일 생성 & 다운로드
  function downLoadCSV(resultCSV){
    
    const today = getToday();
    const fileName = today+"_smp";   

    // 요소 생성
    const link = document.createElement("a");    
      link.href = 'data:text/csv;charset=utf-8,' + escape(resultCSV);
      link.style = "visibility:hidden";
      link.download = fileName + ".csv";

    // 할당 & 다운로드 및 요소 해제
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="container">
      <Head>
        <title>SMP 크롤러 - To CSV Files</title>
      </Head>

      <main>
        <h1 className="title">
          SMP 크롤러 - To CSV Files
        </h1>

        <p className="description">
          <button onClick={parseToCSV}>오늘의 시간대별 SMP 가격 받기</button>
        </p>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        button{padding: 10px 20px; font-size:15px; background: #0CBA7F; border:0; border-radius:5px; color:#fff}
       
      `}</style>
    </div>
  )
}


export async function getServerSideProps() {

    //# 크롤러 객체
    const Crawler = require("crawler");

    //# URL
    const URL = 'https://onerec.kmos.kr/portal/rec/selectRecSMPList.do?key=1965';

    //# 결과 JSON 배열 
    const resultArrOfJson = await goCrawlering(URL);

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
  
    return { props: { data: resultArrOfJson } }
}