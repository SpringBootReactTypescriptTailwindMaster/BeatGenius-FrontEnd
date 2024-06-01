import axios from "axios"

class ApiService {

    constructor(baseURL) {
        this.api = axios.create({
            baseURL
        });
    }

    header = {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('authToken')
        }
      }

    // Méthode GET
    async get(endpoint = '') {
        try {
            const response = await this.api.get(endpoint, this.header);
            return response.data
        } catch (error) {
            // Ajouter le traitement à effectuer pour le traitement des erreurs
            console.error('Erreur lors du GET: ', error);
            // window.location.href = "/logout";
            throw error;
        }
    }

    async getWithoutHeader(endpoint = '') {
        try {
            const response = await this.api.get(endpoint);
            return response.data
        } catch (error) {
            // Ajouter le traitement à effectuer pour le traitement des erreurs
            console.error('Erreur lors du GET: ', error);
            // window.location.href = "/logout";
            throw error;
        }
    }

    // Méthode POST
    async post(endpoint = '', objectToSave) {
        try{
            const response = await this.api.post(endpoint, objectToSave, this.header);
            return response.data;
        } catch (error){
            console.error('Erreur lors du POST !: ' ,error)
            // window.location.href = "/logout";
            throw error;
        }
    }

    async postMultipart(endpoint = '', objectToSave) {
        const header = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }};

        try{
            const response = await this.api.post(endpoint, objectToSave, header);
            return response.data;
        } catch (error){
            console.error('Erreur lors du POST !: ' ,error)
            // window.location.href = "/logout";
            throw error;
        }
    }

    // Méthode PUT
    async put (endpoint = '', objectToSave) {
        try{
            const response = await this.api.put(endpoint, objectToSave);
            return response.data;
        } catch (error){
            console.error('Erreur lors du PUT !: ' ,error)
            // window.location.href = "/logout";
            throw error;
        }
    }

    // Méthode pour effectuer une requête DELETE
    async delete(endpoint=''){
        try{
            const response = await this.api.delete(endpoint, this.header);
            return response.data;
        } catch (error){
            console.error('Erreur lors du DELETE !: ' ,error)
            // window.location.href = "/logout";
            throw error;
            
        }
    }
}

export default ApiService;