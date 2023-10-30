import './title_page.css'

export const TitlePage = (props) => {
    return (
        <div className='container_titlePage'>
            <img className='image_title' src="./src/assets/images/background_header.png" alt="background_title_page" />
            <h1>{props.title}</h1>
        </div>
    )
}