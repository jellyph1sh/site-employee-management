import { NavBar } from '../../Components/NavBar/navBar'
import { TitlePage } from '../../Components/title_page/title_Page'
import '../styles/employees_page.css'

export const EmployeePage = () => {
    return(
        <div>
            <NavBar/>
            <TitlePage title={"Employees"}></TitlePage>
        </div>
    )
}