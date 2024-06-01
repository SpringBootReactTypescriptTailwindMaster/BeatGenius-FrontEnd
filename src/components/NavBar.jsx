import { useEffect, useState } from "react";

function NavBar() {

  const [isLoginIn, setIsLoginIn] = useState(false);


  useEffect(()=>{
    if(localStorage.getItem('authToken')){
      setIsLoginIn(true);
    }
    console.log(isLoginIn);
  })

    return (
      <>
        <div className="flex justify-between items-center bg-gray-800 text-white py-4 px-6 mb-8">
          <div className="flex items-center">
            <a className="btn btn-ghost text-xl" href="/">BeatGenius</a>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li>
                {/* <a href="/apiwithservice">ApiWithService</a>
                <a href="/api-instrumentale">Api Instrumentale</a>
              <a href="/api-test">Api Test</a> 
              <a href="/apicatalogue">Catalogue</a>*/}
                
                { !isLoginIn && <a href="/login">Se Connecter</a> }
                { !isLoginIn && <a href="/inscription">Inscription</a> }
                { isLoginIn && <a href="/instrumentales">Mes Intrumentales</a> }
                { isLoginIn && <a href="/catalogue">Mes Catalogues</a> }
                { isLoginIn && <a href="/modifier-profile">Modifier Votre Profile</a> }
                { isLoginIn && <a href="/logout">Se Déconnecter</a> }
                
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  }
  
  export default NavBar