import Head from 'next/head'
import Rec from './rec';
import Smp from './smp';

export default function index(props) {

  return (
    <div className="container">
      <Head>
        <title>REC 크롤러 - DownLoad Excel And Convert To CSV Files</title>
      </Head>

      <main>
        <ul>
          <li><Smp /></li>
          <li><Rec /></li>
        </ul>
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
    const URL_DOMAIN = 'https://onerec.kmos.kr/portal/';
    const URL_BRD_LIST='selectBbsNttList.do?bbsNo=477&key=1970';

    function getUrl($){
      const linkStr =$(".bbsTable.mt10 table tbody tr:first-child td:nth-child(2) a").attr("href");
      return linkStr.slice(2, linkStr.length);
      console.log("getUrl")

    }



    //# 결과 1 : 글의 경로 
    const URL_CONTENTS = await goCrawlering(URL_DOMAIN+URL_BRD_LIST, getUrl);
    
    //# 결과 2 : 엑셀 파일 경로
    const URL_FILE = await goCrawlering(URL_DOMAIN+URL_CONTENTS, getExcelFile);
    console.log(URL_DOMAIN+URL_FILE)

    //# 결과 2 : 엑셀 파일 다운로드
    const result = await goCrawlering(URL_DOMAIN+URL_FILE);

    function getExcelFile($){
      const linkStr= $("#area_sub_content .bbsTableView .file-list li:nth-child(3) a").attr("href")
      return linkStr.slice(8, linkStr.length);
    }

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
  
    return { props: { data: "1" } }
}