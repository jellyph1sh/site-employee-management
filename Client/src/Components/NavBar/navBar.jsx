import './navBar.css'

export const NavBar = () => {
    return (
        <nav>
            <div className="container_title_nav">
                <span className='dots'></span>
                <h1 className='main_title'>TokaTeam</h1>
                <h1 className='subtitle'>Pro</h1>
                <span className='dots'></span>
            </div>
            <div className="container_title_nav_mobile">
                <span className='dots'></span>
                <h1 className='main_title'>Toka</h1>
                <h1 className='subtitle'>Pro</h1>
                <span className='dots'></span>
            </div>
            <img className='background_nav_header' src="./src/assets/images/background_nav.png" alt="background_nav_image" />
            <div className='container_categories'>
                <a href="">
                    <div className='container_one_cat_nav'>
                        <span></span>
                        <p >my employees</p>
                    </div>
                </a>
                <a href="">
                    <div className='container_one_cat_nav'>
                        <span></span>
                        <p >my employees</p>
                    </div>
                </a>
                <a href="">
                    <div className='container_one_cat_nav'>
                        <span></span>
                        <p >my employees</p>
                    </div>
                </a>
              
            </div>
            <div className='signIn_container'>
                <a className='btn_singIn_register' href="">SignIn</a>
                <a className='btn_singIn_register' href="">Register</a>
            </div>
        </nav>
    )
}