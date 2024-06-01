import { useEffect, useState, useRef } from "react";
import ApiService from "../../service/ApiService";
import ReactModal from "react-modal";
import "typeface-montserrat";
import { motion, AnimatePresence } from "framer-motion";

export const ApiUserInstrumentale = () => {
  const monService = new ApiService("http://localhost:8080/users");
  const monServiceCatalogue = new ApiService(
    "http://localhost:8080/catalogues"
  );
  const monServiceInstrumentale = new ApiService(
    "http://localhost:8080/instrumentales"
  );
  const [products, setProducts] = useState([]);
  const [catalogues, setCatalogues] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [audioRefs, setAudioRefs] = useState({});
  const [currentTimes, setCurrentTimes] = useState({});
  const [isPlaying, setIsPlaying] = useState({});
  const [durations, setDurations] = useState({});
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastProduct = currentPage * 4;
  const indexOfFirstProduct = indexOfLastProduct - 4;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const [name, setName] = useState("");
  const [selectedCatalogue, setSelectedCatalogue] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverError, setCoverError] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [audioError, setAudioError] = useState("");
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
  });

  const resetForm = () => {
    setName("");
    setSelectedCatalogue("");
    setCoverFile(null);
    setAudioFile(null);
    setCoverError("");
    setAudioError("");
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/gif") &&
      file.size <= 2097152
    ) {
      setCoverFile(file);
      setCoverError("");
    } else {
      setCoverFile(null);
      setCoverError(
        "Please select a valid image file (PNG, JPG, or GIF) with a maximum size of 2MB."
      );
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "audio/mpeg" ||
        file.type === "audio/wav" ||
        file.type === "audio/aiff") &&
      file.size <= 20971520
    ) {
      setAudioFile(file);
      setAudioError("");
    } else {
      setAudioFile(null);
      setAudioError(
        "Please select a valid audio file (MP3, WAV, or AIFF) with a maximum size of 20MB."
      );
    }
  };

  const handleAudioPlay = (audioRef, id) => {
    // Mettre en pause toutes les autres références audio et mettre à jour leur état isPlaying
    Object.values(audioRefs).forEach((ref) => {
      if (ref && ref !== audioRef && !ref.paused) {
        ref.pause();
        setIsPlaying((prevState) => ({
          ...prevState,
          [ref.id]: false,
        }));
      }
    });

    setAudioRefs((prevRefs) => ({
      ...prevRefs,
      [id]: audioRef,
    }));

    audioRef.currentTime = currentTimes[id] || 0;
    audioRef.play();
    setIsPlaying((prevState) => ({
      ...prevState,
      [id]: true,
    }));
  };

  const handleTimeUpdate = (id) => {
    setCurrentTimes((prevTimes) => ({
      ...prevTimes,
      [id]: audioRefs[id].currentTime,
    }));
  };

  const handleLoadedMetadata = (id) => {
    setDurations((prevDurations) => ({
      ...prevDurations,
      [id]: audioRefs[id].duration,
    }));
  };

  const handleSeek = (e, id) => {
    const seekTime = parseFloat(e.target.value);
    const audioRef = audioRefs[id];

    if (audioRef.paused) {
      handleAudioPlay(audioRef, id);
      setIsPlaying((prevState) => ({
        ...prevState,
        [id]: true,
      }));
      setCurrentlyPlayingId(id); // Ajout de cette ligne
    } else {
      audioRef.currentTime = seekTime;
      setCurrentTimes((prevTimes) => ({
        ...prevTimes,
        [id]: seekTime,
      }));
      setCurrentlyPlayingId(id); // Ajout de cette ligne
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const togglePlayPause = (id) => {
    const audioRef = audioRefs[id];

    if (audioRef) {
      Object.values(audioRefs).forEach((ref) => {
        if (ref && ref !== audioRef && !ref.paused) {
          ref.pause();
        }
      });

      if (audioRef.paused) {
        audioRef.play();
        setCurrentlyPlayingId(id);
      } else {
        audioRef.pause();
        setCurrentlyPlayingId(null);
      }
    }
  };

  useEffect(() => {
    monService
      .get(`/${localStorage.getItem("id")}`)
      .then((response) => {
        setProducts(response.instrumentales);
        console.log(response.instrumentales);
      })
      .catch((error) => {
        alert(error.message);
      })
      .finally(() => console.log("Get terminé"));

    monServiceCatalogue
      .get()
      .then((response) => {
        setCatalogues(response.content);
        console.log(response.content);
      })
      .catch((error) => {
        alert(error.message);
      })
      .finally(() => console.log("Get terminé"));
  }, []);

  useEffect(() => {
    if (newProduct.name !== "") {
      console.log(newProduct);
      monServiceInstrumentale
        .post("/save", newProduct)
        .then((data) => {
          setProducts((prevProducts) => [...prevProducts, data]);
        })
        .catch((error) => alert(error.message))
        .finally(() => console.log("Post terminé"));
    }
  }, [newProduct]);

  ReactModal.setAppElement("#root");

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let sendData = new FormData();
    const instrumentale = `{
      "name": "${formData.get("name")}",
      "catalogueId": ${formData.get("catalogue-select")},
      "userId": ${localStorage.getItem("id")}
    }`;

    sendData.append("instrumentale", instrumentale);
    sendData.append("file", formData.get("file"));
    sendData.append("cover", formData.get("cover"));
    console.log(...sendData);
    monServiceInstrumentale
      .post("http://localhost:8080/instrumentales/save", sendData)
      .then((response) => {
        console.log(response);
        setProducts((prevProducts) => [...prevProducts, response]);
        resetForm();
      })
      .catch((err) => console.log(err));

    console.log(typeof newProduct);
    closeModal();
  };

  const deleteProduct = (productId) => {
    monServiceInstrumentale
      .delete("/" + productId)
      .then(() => {
        console.log(`Produit avec ID ${productId} supprimé`);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );

        // Vérifier si la page actuelle est devenue vide après la suppression
        const updatedProducts = products.filter(
          (product) => product.id !== productId
        );
        const totalPages = Math.ceil(updatedProducts.length / 4);
        if (currentPage > totalPages) {
          setCurrentPage(totalPages);
        }
      })
      .catch((error) => alert(error.message));
  };

  return (
    <>
      <div className="hero min-h-screen">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <h1
              className="text-4xl mb-8 text-center text-black"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Mes instrumentales à moi
            </h1>
            <div className="mb-8 text-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="btn btn-primary btn-circle btn-lg"
                onClick={openModal}
              >
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
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </motion.button>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="overflow-x-auto rounded-lg"
            >
              {products.length > 0 ? (
                <table className="table w-full sm:table-fixed">
                  <thead>
                    <tr className="h-16">
                      <th className="w-1/4">Nom</th>
                      <th className="w-1/4">Cover</th>
                      <th className="w-2/5">Fichier audio</th>
                      <th className="w-1/5 text-center">Supprimer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProducts
                      ? currentProducts.map((product) => (
                          <tr key={product.id} className="h-40 sm:h-auto">
                            <td
                              className="overflow-hidden overflow-ellipsis sm:w-1/4"
                              style={{ fontFamily: "Montserrat, sans-serif" }}
                            >
                              {product.name}
                            </td>
                            <td className="sm:w-1/4">
                              <div className="avatar">
                                <div className="w-24 rounded-lg">
                                  <img
                                    key={product.id}
                                    src={`ressources-beat-genius/cover/${product.cover}`}
                                    alt={product.name}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="sm:w-1/2">
                              <div className="flex items-center space-x-4">
                                <audio
                                  ref={(ref) => (audioRefs[product.id] = ref)}
                                  src={`ressources-beat-genius/instrumentale/${product.file}`}
                                  onTimeUpdate={() =>
                                    handleTimeUpdate(product.id)
                                  }
                                  onLoadedMetadata={() =>
                                    handleLoadedMetadata(product.id)
                                  }
                                />
                                <button
                                  className="btn btn-ghost btn-circle"
                                  onClick={() => togglePlayPause(product.id)}
                                >
                                  {currentlyPlayingId === product.id ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-8 w-8"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-8 w-8"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                  )}
                                </button>
                                <div className="w-full">
                                  <input
                                    type="range"
                                    min="0"
                                    max={durations[product.id] || 0}
                                    value={currentTimes[product.id] || 0}
                                    onChange={(e) => handleSeek(e, product.id)}
                                    className="range range-primary"
                                  />
                                  <div className="flex justify-between text-xs px-2">
                                    <span>
                                      {formatTime(
                                        currentTimes[product.id] || 0
                                      )}
                                    </span>
                                    <span>
                                      {formatTime(durations[product.id] || 0)}
                                    </span>
                                  </div>
                                </div>
                                <a
                                  href={`ressources-beat-genius/instrumentale/${product.file}`}
                                  download
                                  className="btn btn-ghost btn-circle"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                    />
                                  </svg>
                                </a>
                              </div>
                            </td>
                            <td className="text-center">
                              <button
                                onClick={() => {
                                  setDeleteProductId(product.id);
                                  setIsConfirmDeleteOpen(true);
                                }}
                                className="btn btn-error btn-outline btn-sm"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                                Supprimer
                              </button>
                            </td>
                          </tr>
                        ))
                      : null}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center h-20">
                  <p className="text-xl text-gray-500">
                    Aucune instrumentale publiée.
                  </p>
                </div>
              )}
              <div className="flex justify-center">
                {products.length > 4 && (
                  <div className="btn-group">
                    <button
                      className="btn"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </button>
                    {Array.from(
                      { length: Math.ceil(products.length / 4) },
                      (_, i) => (
                        <button
                          key={i + 1}
                          className={`btn ${
                            currentPage === i + 1 ? "btn-active" : ""
                          }`}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      )
                    )}
                    <button
                      className="btn"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === Math.ceil(products.length / 4)}
                    >
                      Suivant
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <ReactModal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            className="modal modal-open"
            overlayClassName="modal-overlay"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="modal-box relative bg-white p-8 rounded-lg shadow-xl max-w-md"
            >
              <button
                className="btn btn-sm btn-circle absolute right-4 top-4"
                onClick={closeModal}
              >
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
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h3 className="text-2xl font-bold mb-8 text-center">
                Ajouter une instrumentale
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block mb-2 font-semibold">
                    Nom de l'instrumentale
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Entrez le nom"
                      className="input input-bordered pl-10 w-full"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block mb-2 font-semibold">
                    Sélectionner un catalogue
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </div>
                    <select
                      name="catalogue-select"
                      className="select select-bordered pl-10 w-full"
                      value={selectedCatalogue}
                      onChange={(e) => setSelectedCatalogue(e.target.value)}
                    >
                      <option value="" disabled>
                        Choisir un catalogue
                      </option>
                      {catalogues.map((catalogue) => (
                        <option key={catalogue.id} value={catalogue.id}>
                          {catalogue.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block mb-2 font-semibold">
                    Télécharger la cover
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-40 px-4 transition bg-white border-2 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {coverFile ? (
                        <div className="flex items-center space-x-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-sm text-gray-500">
                            {coverFile.name}
                          </span>
                        </div>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-10 h-10 mb-3 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Cliquez pour télécharger
                            </span>{" "}
                            ou glissez-déposez
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG ou GIF (max. 2MB)
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      name="cover"
                      id="cover"
                      className="hidden"
                      onChange={handleCoverChange}
                      accept="image/png, image/jpeg, image/gif"
                    />
                  </label>
                  {coverError && (
                    <p className="mt-2 text-sm text-red-600">{coverError}</p>
                  )}
                </div>
                <div className="mb-8">
                  <label className="block mb-2 font-semibold">
                    Télécharger le fichier audio
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-40 px-4 transition bg-white border-2 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {audioFile ? (
                        <div className="flex items-center space-x-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-sm text-gray-500">
                            {audioFile.name}
                          </span>
                        </div>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-10 h-10 mb-3 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Cliquez pour télécharger
                            </span>{" "}
                            ou glissez-déposez
                          </p>
                          <p className="text-xs text-gray-500">
                            MP3, WAV ou AIFF (max. 20MB)
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      name="file"
                      id="file"
                      className="hidden"
                      onChange={handleAudioChange}
                      accept="audio/mpeg, audio/wav, audio/aiff"
                    />
                  </label>
                  {audioError && (
                    <p className="mt-2 text-sm text-red-600">{audioError}</p>
                  )}
                </div>
                <div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="btn btn-primary rounded-md w-full text-white font-semibold py-3"
                  >
                    Ajouter le produit
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </ReactModal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isConfirmDeleteOpen && (
          <ReactModal
            isOpen={isConfirmDeleteOpen}
            onRequestClose={() => setIsConfirmDeleteOpen(false)}
            className="modal modal-open"
            overlayClassName="modal-overlay"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="modal-box"
            >
              <h3 className="font-bold text-lg">Confirmation de suppression</h3>
              <p className="py-4">
                Êtes-vous sûr de vouloir supprimer cette instrumentale ?
              </p>
              <div className="modal-action">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    deleteProduct(deleteProductId);
                    setIsConfirmDeleteOpen(false);
                  }}
                  className="btn btn-error"
                >
                  Oui, supprimer
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsConfirmDeleteOpen(false)}
                  className="btn btn-outline"
                >
                  Non, annuler
                </motion.button>
              </div>
            </motion.div>
          </ReactModal>
        )}
      </AnimatePresence>
    </>
  );
};
