import './employee.css'

export const Employee = (props ) => {
    // console.log(employee["employeesData"]);
    const { employeesData } = props;
    const entries = Object.entries(employeesData)
   
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
        </div>
    )
}