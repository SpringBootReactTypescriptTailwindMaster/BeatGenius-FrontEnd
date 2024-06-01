import { useEffect, useRef, useState, useContext } from "react";
import ApiService from "../../service/ApiService";
import { motion, AnimatePresence } from "framer-motion";
import SidemenuContext from "./SidemenuContext";

function ApiCatalogue() {
  const monServiceCatalogue = new ApiService(
    "http://localhost:8080/catalogues"
  );
  const [products, setProducts] = useState([]);
  const [isSliderOpen, setSliderOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [coverFile, setCoverFile] = useState(null);
  const { isOpen } = useContext(SidemenuContext);
  const [coverError, setCoverError] = useState("");
  console.log("isOpen:", isOpen); // Ajoutez cette ligne

  useEffect(() => {
    monServiceCatalogue
      .get()
      .then((response) => {
        setProducts(response.content);
      })
      .catch((error) => {
        alert(error.message);
      });
  }, []);

  const openSlider = () => {
    setSliderOpen(true);
  };

  const closeSlider = () => {
    setSliderOpen(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    let sendData = new FormData();
    const catalogue = `{
      "name": "${formData.get("name")}",
      "userId": "${localStorage.getItem("id")}",
      "instrumentales": []
    }`;
    sendData.append("catalogue", catalogue);
    sendData.append("name", formData.get("name"));
    sendData.append("cover", coverFile);

    monServiceCatalogue
      .post("http://localhost:8080/catalogues/save", sendData)
      .then((response) => {
        setProducts((prevProducts) => [...prevProducts, response]);
        setCoverFile(null); // Réinitialiser la valeur de coverFile
      })
      .catch((err) => console.log(err));

    closeSlider();
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const deleteCatalogue = (catalogueId) => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce catalogue ?"
    );

    if (confirmDelete) {
      monServiceCatalogue
        .delete(`/${catalogueId}`)
        .then(() => {
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== catalogueId)
          );
        })
        .catch((error) => {
          if (error.response) {
            switch (error.response.status) {
              case 404:
                alert(
                  "Le catalogue que vous essayez de supprimer n'existe pas."
                );
                break;
              case 400:
                alert(
                  "Requête invalide. Veuillez vérifier les données envoyées."
                );
                break;
              default:
                alert(`Une erreur s'est produite : ${error.message}`);
            }
          } else {
            alert(`Une erreur s'est produite : ${error.message}`);
          }
        });
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  /*const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };                                            
  */

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const filteredProducts = products.filter((product) => {
    const nameMatch =
      product.name &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch =
      selectedCategory === "" || product.category === selectedCategory;
    return nameMatch && categoryMatch;
  });

  const sortedProducts = filteredProducts.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (sortOrder === "asc") {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });

  return (
    <div className="flex">
      <div
        className={`flex-1 p-8 transition-all duration-300 ${
          isOpen ? "ml-72" : ""
        }`}
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-semibold mb-8 text-gray-800"
        >
          Catalogue de produits
        </motion.h1>

        <div className="flex justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative"
          >
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-600"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-3 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            onClick={openSlider}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-violet-700 hover:to-indigo-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 inline-block"
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
            Ajouter un produit
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {sortedProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md p-6 relative"
              >
                <img
                  key={product.id}
                  src={`ressources-beat-genius/coverCatalogue/${product.cover}`}
                  alt={product.name}
                  className="h-40 w-full object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  {product.name}
                </h2>
                <p className="text-gray-600">{product.description}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => deleteCatalogue(product.id)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
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
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="flex items-center justify-between mt-8">
          <span className="text-sm text-gray-700">
            Affichage de {sortedProducts.length} produits
          </span>
          <button
            onClick={toggleSortOrder}
            className="text-sm text-gray-700 hover:text-violet-600 flex items-center"
          >
            Trier par nom
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 ${
                sortOrder === "asc" ? "transform rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isSliderOpen && (
          <>
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Ajouter un produit
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeSlider}
                  className="text-gray-500 hover:text-gray-800"
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
                </motion.button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block mb-2 font-semibold text-gray-700"
                  >
                    Nom du produit
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block mb-2 font-semibold text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
                    rows="3"
                  ></textarea>
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

                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-violet-700 hover:to-indigo-700"
                  >
                    Ajouter le produit
                  </motion.button>
                </div>
              </form>
            </motion.div>
            {console.log("isSliderOpen:", isSliderOpen)}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
export default ApiCatalogue;
