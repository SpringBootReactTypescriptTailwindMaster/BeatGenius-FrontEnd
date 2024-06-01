import ApiService from "../../service/ApiService";
import { useEffect, useState } from "react";

function HomePage() {
  const monService = new ApiService("http://localhost:8080/catalogues");
  const [catalogues, setCatalogues] = useState([]);
  const [catalogueToChild, setCatalogueToChild] = useState([0, 0]);

  useEffect(() => {
    monService
      .get()
      .then((response) => {
        setCatalogues(response.content);
        console.log(response.content);
        setCatalogueToChild(response.content[0]);
      })
      .catch((error) => {
        // Ici: Ajustez en fonction de comment on souhaite traîter notre erreur
        alert(error.message);
      })
      // finally: s'exécutera après avoir reçu la réponse ou un retour d'erreur. Dans tous les cas,
      // il s'exécutera
      .finally(() => console.log("Get terminé"));
  }, []);

  return (
    <>
    {/*
      <div className="btn-group btn-group-vertical">
        {catalogues.map((catalogue) => (
          <button
            className="btn btn-outline"
            key={catalogue.id}
            onClick={() => setCatalogueToChild(catalogue)}
          >
            {catalogue.name}
          </button>
        ))}
      </div>
      <Catalogue catalogueChild={catalogueToChild} />
    */}
    </>
  );
}

function Catalogue({ catalogueChild }) {
  const [instrumentales, setInstrumentales] = useState([]);

  useEffect(() => {
    setInstrumentales(catalogueChild.instrumentales);
  }, [catalogueChild]);

  console.log(instrumentales);

  return (
    <>
      
    </>
  );
}

export default HomePage;