import { jsonToCSV  } from 'react-papaparse';


export default function Rec(props) {


  return (
    <dl className="container">
    
        <dt className="title">
          REC 크롤러 - To CSV Files
        </dt>

        <dd className="description">
          <button onClick={parseToCSV}>오늘의 시간대별 REC 가격 받기</button>
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

  
    return { props: { data: resultArrOfJson } }
}