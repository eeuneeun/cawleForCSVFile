import { jsonToCSV  } from 'react-papaparse';


export default function Smp(props) {

  const jsonArr = props.data;

  //# CSV 파일로 파싱
  function parseToCSV(){
    if(jsonArr){ 
      
      const resultCSV = jsonToCSV (jsonArr, {
        delimiter: "|",
        header: true
      });
      downLoadCSV(resultCSV)

    }else{

      console.log(props.data)

    }
    
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
    <dl className="container">
    
        <dt className="title">
          SMP 크롤러 - To CSV Files
        </dt>

        <dd className="description">
          <button onClick={parseToCSV}>오늘의 시간대별 SMP 가격 받기</button>
        </dd>
      
        <style jsx>{`
         .container {
            min-height: 100vh;
            padding: 0 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          button{padding: 10px 20px; font-size:15px; background: #0CBA7F; border:0; border-radius:5px; color:#fff; margin-top:20px}
       
        `}</style>
    </dl>
  )
}


export async function getServerSideProps() {

  //# CUSTOM FUNCTION
    //@ - 1. goCrawlering
    //@ - 2. makeJSON
    //@ - 3. makeCSV
    const convert = require('./node_version/convert');

    //# URL
    const URL = 'https://onerec.kmos.kr/portal/rec/selectRecSMPList.do?key=1965';


    //# 오늘 날짜 
    //@ type : string
    function getDate($){
      const dateTmp = $("#div1_t table thead tr th:last-child").last().text();
      const date = "2021-"+dateTmp.substr(0,2)+"-"+dateTmp.substr(3,2);

      return date;
    }

    //# SMP 지역 타입 
    //@ type : string
    //@ 육지 : 0 , 제주 : 1, 통합 : total
    function getSmpType($){
      const areaType =$("select#area_type").val()

      return areaType;
    }

    //# 시간별 SMP 가격
    //@ type : []
    function getJsonArr($){
      
      let smpArr = [];
      let smpTmpArr= $("#div1_t table tbody:last-child tr td:last-child").get();

      for ( var i = 0; i < smpTmpArr.length; i++) { 
        smpArr.push( smpTmpArr[i].children[0].data );
      }
     
      return smpArr;
    }
  
    //# 결과 JSON 배열 
    const date = await convert.goCrawlering(URL, getDate);
      
    //# 결과 JSON 배열 
    const smpType = await convert.goCrawlering(URL, getSmpType);

    //# 결과 JSON 배열 
    const smpArr = await convert.goCrawlering(URL, getJsonArr);
    
    //# 가공한 Json 객체들을 담을 빈 배열 
    //@ type : []
    let resultArrOfJson = []

    smpArr.map((item, idx)=>{
      resultArrOfJson.push(
        {
          "date" : date,
          "hour" : idx,
          "area_type" : smpType,
          "value" : item
        }
      )
    });

    return { props: { data: resultArrOfJson } }
}