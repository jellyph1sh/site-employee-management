import { NavBar } from '../../Components/NavBar/navBar'
import '../styles/home.css'
import { useState,useEffect } from 'react';
import { TitlePage } from '../../Components/title_page/title_page';
import {Chart as ChartJS,Tooltip,Legend, ArcElement} from 'chart.js'
import { Pie } from 'react-chartjs-2';
ChartJS.register(ArcElement,Tooltip,Legend);


function Home() {
  const url = "http://localhost:3001/api";
  const [dataEmployees, setDataEmployees] = useState([]);
  const [nbEmployee, setNbEmployees] = useState(0);
  const jobGroups = {};

  const fetchInfoEmployees = async () => {
    const response = await fetch(url + "/employees");
    const data = await response.json();
    setDataEmployees(data);
    setNbEmployees(data.length)
  };

  useEffect(() => {
    async function fetchData() {
      await fetchInfoEmployees();
     
    }
    fetchData();
  }, []);



  dataEmployees.forEach((person) => {
    const job  = person["jobName"];
    if (jobGroups[job] == undefined) {
      jobGroups[job] = 1;
    } else {
      jobGroups[job] += 1;
    }
  });


  const dataPie = {
    labels: Object.keys(jobGroups),
    datasets : [
      {
        data : Object.values(jobGroups),
        backgroundColor :  ['#FF5733','#41B3A3', '#9B59B6', '#E74C3C','#3498DB','#F1C40F','#34495E','#E67E22','#2ECC71','#8E44AD','#ECF0F1','#D35400','#27AE60'],
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        display: true, // Affiche la légende
        position: 'right', // Positionne la légende en dessous du graphique
        labels: {
          color: 'black', // Couleur du texte de légende
        },
      },
    },
  };

  return (
    
    <main>
      <NavBar/>
      <TitlePage title={"Home"} />
      <div className='container_content_home'>
          <div className='container_infos_left'>
            <div className='bg_small1_info container_small_info'>
              <p className='nb_employees'>{nbEmployee ? nbEmployee : "0"}</p>
              <p className='text_small_info'>employees</p>
            </div>
            <a href="/employees#add" className='bg_small2_info container_small_info'>
              <h5 className='text_card_home '>Add an employee</h5>
              <img className='img_add_employee' src="./src/assets/images/add_employee.png" alt="add_employee_img" />
            </a>
          </div>
          <div className='container_presentation_website'>
            <h1>TokaTeam<span>Pro</span></h1>
            <p>" all your employee data, just a click away "</p>
            <img src="./src/assets/images/Click_here.png" alt="click_here_img" />
          </div>
          <div className='container_infos_right'>
            <div className='bg_small2_info container_small_info'>
              <h5 className='text_card_home '>Proportion of employees per jobs</h5>
            </div>
            <div className='container_big_info'>
              <Pie data={dataPie} options={options} />
            </div>
          </div>  
        </div>
    </main>
  )
}

export default Home
