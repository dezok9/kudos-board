import './Header.css'

function Header() {
    return(
        <header className='navigation'>
            <p><i className="fa-solid fa-user fa-xl navigation-item"></i></p>
            <i className="fa-solid fa-house fa-xl"></i>
            <i className="fa-solid fa-magnifying-glass fa-xl navigation-icon"></i>
        </header>
    )
}

export default Header;
