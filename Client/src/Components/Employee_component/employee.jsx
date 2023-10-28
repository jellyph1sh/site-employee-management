import { Popup } from '../Popup/popup';
import './employee.css'
import { useState } from 'react';

export const Employee = (props ) => {
    const { employeesData } = props;
    var entries = Object.entries(employeesData);
    var jobId = entries.slice(entries.length-1)
    entries = entries.slice(0,entries.length-1);
    const [visibilityAdd ,setVisibilityAdd] = useState(false);
    return (
        <div className="container_global_employee">
            <img className='img_employee' src="./src/assets/images/icon_employee.png" alt="icon_employees" />
            {
                entries.map(([key,value],index) => (
           
                    <div key={index} className=" container_one_value">
                        <div className='wrapper'>
                            <h5 className='title_cat_employee'>{key ?? ""}</h5>
                            <p className='content_employee'>{value ?? ""}</p>
                        </div>
                    </div>
                ))
            }
            <span onClick={(e) => {setVisibilityAdd(!visibilityAdd)}} className="material-symbols-outlined edit_icon">settings</span>
           { visibilityAdd &&  <Popup jobId={jobId} datas={entries} isAdd={false} setVisibilityAdd={setVisibilityAdd}/>}
            
        </div>
    )
}