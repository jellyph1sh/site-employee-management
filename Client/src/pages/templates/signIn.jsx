import '../styles/signIn.css'
import { useNavigate } from "react-router";
import axios from "axios";
import { NavBar } from '../../Components/NavBar/navBar'
import { TitlePage } from '../../Components/title_page/title_page';

export const SignIn = () => {

    const navigate = useNavigate();
    const url = "http://localhost:3001/";
    let email = "";
    let password = "";

    async function isValidUser(email, password){
        const returned = await axios.post(url+"isValidUser", {"email": email,"password":password})
        return returned.data
    }

    function setCookie(name, value, minutesToExpire) {
        const date = new Date();
        date.setTime(date.getTime() + (minutesToExpire * 60 * 1000)); 
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + "; " + expires + "; path=/";
    }
    
    async function onClick() {
        isValidUser(email, password).then((isLoged) => {
            if (isLoged[Object.keys(isLoged)] != false){
                setCookie("permissionConnected",isLoged[Object.keys(isLoged)],30)
                
                navigate("/");
            } else {
                document.location.href='signin';
            }
        });
   
    }

    return (
        <main>
            <NavBar />
            <TitlePage title={'SignIn'}/>
            <div className="container_global_sign">
                <h1 className="title_signin">Welcome back !</h1>
                <h3 className="subtite_signin">Please enter your email and password</h3>
                <div className="container_content_sign">
                    <h3 className="label_sign">email :</h3>
                    <input className='input_signin' type="email" placeholder='Enter your nickname' onChange={(e) => email = e.target.value}/>
                    <h3 className="label_sign">password :</h3>
                    <input className='input_signin' type="password" placeholder='Enter your password' onChange={(e) => password = e.target.value}/>
                </div>
                <div onClick={onClick} className='container_sign_btn'>
                    <p>Login</p>
                </div>
            </div>
        </main>
    );
}