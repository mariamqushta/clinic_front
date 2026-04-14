import {React,useState} from 'react'
import '../App.css'

function Navbar() {
    const [user, setuser] = useState("username")
    
  return (
    <nav class="navbar navbar-expand-lg mt-3 ">
        <div class="container ">
            <a class="navbar-brand headerstyle fst-italic" href="#">Odonto</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarText">
            <ul class="navbar-nav m-auto mb-2 pb-3 mb-lg-0 ">
                <li class="nav-item">
                <a class="nav-link active navbarli1" aria-current="page" href="#">Home</a>
                </li>
                <li class="nav-item">
                <a class="nav-link navbarli1 text-black" href="#">Appointments</a>
                </li>
                <li class="nav-item">
                <a class="nav-link navbarli1 text-black" href="#">Chat</a>
                </li>
                <li class="nav-item">
                <a class="nav-link navbarli1 text-black" href="#">AI Assistant</a>
                </li>
            </ul>
            
            <span class="navbar-text  ">{user}</span>
                <span class="navbar-text">
                    <div class="text-center">
                    <img src="female-person-default-profile-no-260nw-2069253950.webp" class="rounded-circle  h-50 w-50 navimg" alt="..."/>
                    </div>
                </span>
            </div>
  </div>
</nav>
  )
}



export default Navbar
