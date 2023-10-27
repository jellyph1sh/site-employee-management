import { NavBar } from '../NavBar/navBar'
import './App.css'
import React, { useState ,useEffect} from 'react';
import axios from 'axios'


function App() {

  const url = "http://localhost:3001/";
  const [data, setData] = useState([]);

  
  const fetchInfo = () => {
    return fetch(url).then((res) => res.json()).then((d) => setData(d))
  }


  const putInfo = async () => {

    const data = await axios.post(url+'test', {'message': 'tokateam'})
    console.log(data.data);
    return data.data
  }

  

  useEffect(() => {
    fetchInfo()
    // putInfo();
  }, []);

  console.log(data);
  
  return (
    
    <div>
      <NavBar/>
      <h1>{"nothing"}</h1>
    </div>
  )
}

export default App
