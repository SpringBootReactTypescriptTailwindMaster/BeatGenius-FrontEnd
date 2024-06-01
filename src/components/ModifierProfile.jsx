import { useEffect, useState, useContext } from "react";
import ApiService from "../../service/ApiService";
import SidemenuContext from "./SidemenuContext";

export const ModifierProfile = () => {
  const monService = new ApiService("http://localhost:8080/users");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [formEnvoyer, setFormEnvoyer] = useState("");
  const { isOpen } = useContext(SidemenuContext);
  console.log("isOpen:", isOpen); // Ajoutez cette ligne

  useEffect(() => {
    monService
      .get(`/${localStorage.getItem("id")}`)
      .then((response) => {
        setUser(response);
        setUsername(response.username);
        setEmail(response.email);
        console.log(response);
      })
      .catch((error) => {
        // Ici: Ajustez en fonction de comment on souhaite traîter notre erreur
        alert(error.message);
      })
      // finally: s'exécutera après avoir reçu la réponse ou un retour d'erreur. Dans tous les cas,
      // il s'exécutera
      .finally(() => console.log("Get terminé"));
  }, []);

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    setEmailError("");
  };

  const handleUsernameChange = (event) => {
    const newUsername = event.target.value;
    setUsername(newUsername);
    setUsernameError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Vérification de l'email
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Veuillez saisir une adresse e-mail valide.");
      return;
    }

    // Vérification de la longueur du nom d'utilisateur
    if (username.length > 60 || username.length < 2) {
      setUsernameError(
        "Le nom d'utilisateur doit posséder au moins 2 caractère et ne doit pas dépasser 60 caractères."
      );
      return;
    }
    if (/\s/.test(username)) {
      setUsernameError("Le nom d'utilisateur ne peut pas contenir d'espace.");
      return;
    }
    const data = user;
    console.log(data);
    data.username = username;
    data.email = email;
    console.log(data);

    monService
      .post(undefined, data)
      .then((response) => {
        console.log(response);
        setFormEnvoyer("Les modifications ont bien été effectué");
      })
      .catch((error) => {
        // Ici: Ajustez en fonction de comment on souhaite traîter notre erreur
        alert(error.message);
      })
      // finally: s'exécutera après avoir reçu la réponse ou un retour d'erreur. Dans tous les cas,
      // il s'exécutera
      .finally(() => console.log("Post terminé"));

    // Le formulaire est valide, vous pouvez procéder à l'envoi des données
    console.log("Email:", email);
    console.log("Username:", username);

    // Réinitialiser le formulaire après la soumission
  };

  return (
    <>
    <div className={`mt-24 ${isOpen ? 'ml-72' : ''}`}>
      {formEnvoyer && (

          <div className="alert alert-error shadow-lg mb-4">
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
              <span>{formEnvoyer}</span>
            </div>
          </div>
      )}
      <h1 className="text-2xl font-bold mb-4">
        Modifier vos informations personnelles
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            placeholder="Entrez votre username"
            className="input input-bordered"
            type="text"
            name="username"
            value={username}
            onChange={handleUsernameChange}
          />
          {usernameError && (
            <label className="label">
              <span className="label-text-alt text-error">{usernameError}</span>
            </label>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            placeholder="Entrez votre email"
            className="input input-bordered"
            type="text"
            name="email"
            value={email}
            onChange={handleEmailChange}
          />
          {emailError && (
            <label className="label">
              <span className="label-text-alt text-error">{emailError}</span>
            </label>
          )}
        </div>
        <button className="btn btn-primary">Modifier vos informations</button>
      </form>
      </div>
    </>
  );
};
