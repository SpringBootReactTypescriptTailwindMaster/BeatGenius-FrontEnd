/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import ApiService from "../../service/ApiService";
import ReactModal from "react-modal";

function ApiWithService () {

    const monService = new ApiService("http://localhost:3001/products")
    const [products, setProducts] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false)

    const [newProduct, setNewProduct] = useState({
        category: "",
        name: "",
        number: 0,
        price: 0
    });

    useEffect( () => {
        monService.get()
            .then((response) =>{
                setProducts(response)
            })
            .catch((error) =>{
                // Ici: Ajustez en fonction de comment on souhaite traîter notre erreur
                alert(error.message)
            })
            // finally: s'exécutera après avoir reçu la réponse ou un retour d'erreur. Dans tous les cas,
            // il s'exécutera
            .finally( () => console.log('Get terminé', products))
    },[]);

    useEffect( () => {
        if(newProduct.name !== ""){
            monService.post(undefined, newProduct)
            .then( (data) => {
                setProducts( (prevProducts) => [...prevProducts, data]);
            })
            .catch((error) => alert(error.message))
            .finally(()  => console.log('Post terminé'))
        } 
    }, [newProduct])

    // Config. React-modal

    // indispensable pour configurer mon pop-up. 
    // Sera généralement exactement la mm ligne (sans rien modifier) sur tous les projets React
    // 'root' est l'id de la div sur laquelle on se 'branchera' ___ ce sera 'root' sauf si modifier après création du projet / Voir le index.html
    ReactModal.setAppElement('#root');

    const openModal = () => {
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
    }

    const handleSubmit = (e) => {
        // A mettre si je veux éviter que le composant se recharge
        e.preventDefault()

        const formData = new FormData(e.target)

        setNewProduct({
            category: formData.get('category'),
            name: formData.get('name'),
            number: formData.get('number'),
            price: formData.get('price')
        })
        closeModal();
    }

    const deleteProduct = (productId) => {
        monService.delete(productId)
            .then(() => {
                console.log(`Produit avec ID ${productId} supprimé`)
                setProducts((prevProducts) => 
                    prevProducts.filter((product) => product.id !== productId)
                );
            })
            .catch(error => alert(error.message));
    }

    return(
        <>
            <h1>Les produits récupérés en passant par mon service: </h1>
            <div className="m-10 w-4/6 m-auto">
                <div className="flex justify-end mb-5">
                    <button className="btn btn-outline btn-inf" onClick={openModal}>Ajouter un nouveau produit</button>
                </div>
                <table className="table table-zebra border">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prix</th>
                            <th>Quantité</th>
                            <th>Catégorie</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        { products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.number}</td>
                                <td>{product.category}</td>
                                <td>
                                    <button
                                        onClick={() => {deleteProduct(product.id)}}
                                        className="btn btn-error m-auto"
                                    >Supprimer</button>
                                </td>
                            </tr>
                        )                        
                        )}
                    </tbody>
                </table>
            </div>


            {/*  CI-dessous, le pop-up. Avec React-modal, tout le pop-up est dans les balise 
            <ReactModal>
                 CONTENU DE MON POP-UP ICI               
            </ReactModal>
               */}
            
            <ReactModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="w-fit h-fit border p-10 mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-50"
            >
            <p className="font-semibold"> Ajouter votre produit: </p>

               <form onSubmit={handleSubmit}>

                <div className="grid grid-cols-2 gap-4 mb-5">
                    <input 
                        placeholder="Nom du produit: "
                        className="flex input input-bordered"
                        type="text" 
                        name="name"
                    />
                    <input 
                        placeholder="Quantité"
                        className="flex input input-bordered"
                        type="number" 
                        name="number"
                    />
                    <input 
                        placeholder="Prix"
                        className="flex input input-bordered"
                        type="text" 
                        name="price"
                    />
                    <select className="flex input input-bordered" name="category">
                        <option value="">Sélectionnez une catégorie</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Vegetables">Légumes</option>
                    </select>
                </div>
                <div className="m-auto w-fit">
                    <button
                        type = 'submit'
                        className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"  
                    >Ajouter le porduit</button>
                </div>

               </form>

            </ReactModal>


        </>
    )
}

export default ApiWithService;