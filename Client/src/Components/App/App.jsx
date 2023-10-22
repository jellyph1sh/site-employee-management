import { NavBar } from '../NavBar/navBar'
import './App.css'
import React, { useState ,useEffect} from 'react';
import axios from 'axios'


function App() {

  const url = "http://192.168.1.88:3001/";
  const [data, setData] = useState([]);

  
  const fetchInfo = () => {
    return fetch(url).then((res) => res.json()).then((d) => setData(d))
  }


  const putInfo = async () => {

    const data = await axios.post('http://192.168.1.88:3001/test', {'message': 'tokateam'})
    console.log(data.data);
    return data.data
  }

  

  useEffect(() => {

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
