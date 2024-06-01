import { useEffect, useState, useCallback } from "react";
import ApiService from "../../service/ApiService";

const monService = new ApiService("http://localhost:8080/auth/login");

export const Authentification = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginIn, setIsLoginIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = useCallback(async () => {
    setIsLoginIn(true);
    try {
      const loginData = { email: email, password: password };
      console.log(loginData);
      await monService
        .post(undefined, loginData)
        .then((data) => {
          console.log(data);
          localStorage.setItem("id", data.id);
          localStorage.setItem("authToken", data.token);
          window.location.href = "/";
        })
        .catch((error) => {
          setLoginError("Nom d'utilisateur ou mot de passe incorrect");
          console.error(error.message);
        })
        .finally(() => console.log("Post terminé"));
    } catch (error) {
      setLoginError("Nom d'utilisateur ou mot de passe incorrect");
      console.log(error.message);
    } finally {
      setIsLoginIn(false);
    }
  }, [email, password]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleLogin();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleLogin]);

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
          <h2 className="mb-8 text-3xl font-bold text-center">Connexion</h2>
          <div className="mb-6">
            <button className="w-full py-2 mb-4 font-bold text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none">
              Se connecter avec Google
            </button>
            <button className="w-full py-2 font-bold text-white bg-orange-600 rounded hover:bg-orange-700 focus:outline-none">
              Se connecter avec Soundcloud
            </button>
          </div>
          <div className="mb-4 text-center">
            <span className="text-gray-600">OU</span>
          </div>
          <div className="mb-4">
            <input
              type="text"
              id="email"
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded appearance-none focus:outline-none focus:shadow-outline"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded appearance-none focus:outline-none focus:shadow-outline"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className={`px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline ${
                isLoginIn && "opacity-50 cursor-not-allowed"
              }`}
              onClick={handleLogin}
              disabled={isLoginIn}
            >
              Log In
            </button>
            <a
              className="inline-block text-sm font-bold text-blue-500 align-baseline hover:text-blue-800"
              href="#"
            >
              Mot de passe oublié ?
            </a>
          </div>
          {loginError && <p className="mt-4 text-red-600">{loginError}</p>}
          <div className="mt-8 text-sm text-center text-gray-600">
            Vous n'avez pas de compte ?{" "}
            <a href="#" className="font-semibold text-blue-500 hover:text-blue-700">
              S'inscrire
            </a>
          </div>
        </div>
      </div>
    </>
  );
};