import {React,useState} from 'react'
import '../App.css'

function Navbar() {
    const [user, setuser] = useState("username")
    setuser
  return (
    <nav className="navbar navbar-expand-lg mt-3 ">
        <div className="container ">
            <a className="navbar-brand headerstyle fst-italic h1 fs-2" href="#">Odonto</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav m-auto mb-2 pb-3 mb-lg-0 ">
                <li className="nav-item">
                <a className="nav-link active navbarli1" aria-current="page" href="/">Home</a>
                </li>
                <li className="nav-item">
                <a className="nav-link navbarli1 text-black" href="#">Appointments</a>
                </li>
                <li className="nav-item">
                <a className="nav-link navbarli1 text-black" href="#">Chat</a>
                </li>
                <li className="nav-item">
                <a className="nav-link navbarli1 text-black" href="#">AI Assistant</a>
                </li>
            </ul>
            
            <span className="navbar-text  ">{user}</span>
                <span className="navbar-text">
                    <div className="text-center">
                    <img src="/female-person-default-profile-no-260nw-2069253950.webp" className="rounded-circle  h-50 w-50 navimg" alt="..."/>
                    </div>
                </span>
            </div>
  </div>
</nav>
  )
}



export default Navbar
