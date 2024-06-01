import axios from "axios"
import { useState } from "react";

function  ApiTest(){
    /*const [objectToSend, setToSend] = useState([]);

     async function handleClick(){ 
        console.log(objectToSend);
        await axios.post('http://localhost:8080/instrumentales/save', objectToSend , {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }
      let sending = new FormData();
      */
    const testformData = new FormData()
    testformData.append("data", "valeurdudata");
    testformData.append("json", "{json:value}");
    console.log(...testformData);


      const instrumentale = `{
        "id": 0,
        "version": 0,
        "name": "YoungMe",
        "price": 175.95,
        "catalogueId": 1,
        "userId": 1
      }`
      

      const handleSubmit = (e) => {
        // A mettre si je veux éviter que le composant se recharge
        e.preventDefault()

        const formData = new FormData(e.target)
        formData.append('instrumentale', instrumentale)
        console.log(...formData);
        console.log(typeof(formData));
        axios.post('http://localhost:8080/instrumentales/save', formData)
          .then(res => console.log(res))
          .catch(err => console.log(err))

        /*setToSend({
            instrumentale: {
                "id": 0,
                "version": 0,
                "name": "YoungMe",
                "price": 175.95,
                "catalogueId": 1,
                "userId": 1
              },
            cover: formData.get('cover'),
            file: formData.get('file')
           // file: document.querySelector('#file')
          })
          sending.append('instrumentale', objectToSend['instrumentale'])
          sending.append('file', objectToSend['file'])
          sending.append('cover', objectToSend['cover'])*/
    }

      
    

    return(
        <>
        <h1>test</h1>
        

        <form onSubmit={handleSubmit}>
            <label >Cover
            <input type="file" name="cover" id="cover" />
            </label>
            <label >file
            <input type="file" name="file" id="file" />
            </label>
            <button className="btn" type="submit">Envoyer les files</button>

        </form>

        
        
        </>
    )
} 
export default ApiTest