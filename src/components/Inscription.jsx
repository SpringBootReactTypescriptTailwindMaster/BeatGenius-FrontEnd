import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApiService from "../../service/ApiService";

export const Inscription = () => {
  const monService = new ApiService("http://localhost:8080/auth/register");
  const [loginError, setLoginError] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [acceptConditions, setAcceptConditions] = useState(false);
  const [acceptConditionsError, setAcceptConditionsError] = useState("");

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
  };

  const handleAutoLogin = async (email, password) => {
    try {
      const loginData = { email: email, password: password };
      await monService
        .post("http://localhost:8080/auth/login", loginData)
        .then((data) => {
          localStorage.setItem("id", data.id);
          localStorage.setItem("authToken", data.token);
          window.location.href = "/";
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleRegister = async () => {
    let hasError = false;
    let emailErrorMessage = "";
    let passwordErrorMessage = "";
    let acceptConditionsErrorMessage = "";

    if (!acceptConditions) {
      acceptConditionsErrorMessage =
        "Veuillez accepter les conditions d'utilisation.";
      hasError = true;
    } 

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      emailErrorMessage = "Veuillez saisir une adresse e-mail valide.";
      hasError = true;
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/.test(password)
    ) {
      passwordErrorMessage =
        "Le mot de passe doit contenir au minimum 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial";
      hasError = true;
    }

    setEmailError(emailErrorMessage);
    setPasswordError(passwordErrorMessage);
    setAcceptConditionsError(acceptConditionsErrorMessage);

    if (hasError) {
      return;
    }
    try {
      const registerData = {
        email: email,
        password: password,
      };

      await monService.post(undefined, registerData).then((response) => {
        console.log(response);
        setLoginError("Utilisateur créé !");
        handleAutoLogin(email, password);
      });
    } catch (error) {
      setLoginError("Erreur lors de l'envoi des données");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleRegister();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleRegister]);

  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card mx-auto w-full max-w-md shadow-xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card-body"
        >
          <h2 className="card-title mx-auto text-4xl">BeatGenius</h2>
          <p className="text-center pb-6">
            Inscrivez-vous pour écouter les instrumentales tendances du moment.
          </p>
          <div className="flex flex-col space-y-6">
            <div className="form-control">
              <input
                type="text"
                placeholder="Adresse e-mail"
                className="input w-full"
                value={email}
                onChange={handleEmailChange}
              />
              {emailError && (
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-error text-sm font-medium mt-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 inline mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {emailError}
                </motion.span>
              )}
            </div>

            <div className="form-control">
              <input
                type="password"
                placeholder="Mot de passe"
                className="input w-full"
                value={password}
                onChange={handlePasswordChange}
              />
              {passwordError && (
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-error text-sm font-medium mt-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 inline mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {passwordError}
                </motion.span>
              )}
            </div>
          </div>

          <div className="divider">OU</div>

          <div className="flex flex-col space-y-4">
            <button className="btn btn-outline gap-2 bg-red-50 border-red-500 text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Connexion via Google
            </button>

            <button className="btn btn-outline gap-2 bg-orange-50 border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500 hover:border-orange-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
              Connexion via Soundcloud
            </button>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={acceptConditions}
                  onChange={() => {
                    setAcceptConditions(!acceptConditions);
                  }}
                />
                <span className="label-text text-sm text-gray-600">
                  En vous inscrivant, vous acceptez nos{" "}
                  <a href="#" className="link link-hover text-blue-500">
                    Conditions générales
                  </a>{" "}
                  et notre{" "}
                  <a href="#" className="link link-hover text-blue-500">
                    Politique de confidentialité
                  </a>
                  .
                </span>
              </label>
              {acceptConditionsError && (
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-error text-sm font-medium mt-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 inline mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {acceptConditionsError}
                </motion.span>
              )}
            </div>
          </div>

          <div className="card-actions justify-between items-center pt-3">
            <button className="btn btn-link p-0">Se connecter</button>
            <button className="btn btn-primary" onClick={handleRegister}>
              S'inscrire
            </button>
          </div>

          {loginError && (
            <div className="alert alert-error shadow-lg mt-6">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{loginError}</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
