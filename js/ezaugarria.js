import {API_URL, MAC, sendOptionsRequest} from './konstanteak.js'
import * as konstanteak from './konstanteak.js';
export function getEzaugarriakArray(){
    const idFasea = document.getElementById('idFasea').value;
    const ezaugarriak = [];
    const ezaugarriaIzena = document.getElementsByName('ezaugarriaIzena');
    const eMin = document.getElementsByName('ezaugarriaMin');
    const eMax = document.getElementsByName('ezaugarriaMax');
    const ponderazioa = document.getElementsByName('ponderazioa');
    var b = 0;
    for (var i = 0; i < ezaugarriaIzena.length; i = i+1) {
        if(ponderazioa[i].value !== ""){
        b += parseFloat(ponderazioa[i].value);
        }
        //console.log(b);
        if (ezaugarriaIzena[i].value !== "" && eMin[i].value !== "" && eMax[i].value !== "") {
            ezaugarriak.push(new konstanteak.Ezaugarria(0,ezaugarriaIzena[i].value, eMax[i].value, eMin[i].value, idFasea, ponderazioa[i].value));
        }
    }
    if(parseInt(b) !== 1){
    return false;
    }
    return ezaugarriak;
}


export const getEzaugarria = async () => {
  
    try {
      
        const idEzaugarri  =   document.getElementsByName("ezaugarria")[0].getAttribute('data-idEzaugarria');
        
        if (!idEzaugarri) {
            //console.log("Error: Missing idEzaugarri "+idEzaugarri);
            return null;
        }
        await(sendOptionsRequest(`${API_URL}/ezaugarria/get/${idEzaugarri}`));
        const response = await fetch(`${API_URL}/ezaugarria/get/${idEzaugarri}`, {
            method: 'GET',
              

cache: 'no-cache',
targetAddressSpace: 'private',
mode: 'cors',headers: {
  'Content-Type': 'application/json',

            },
        });

        if (!response.ok) {
            //console.log(`Error: Received status ${response.status} from API`);
            return null;
        }

        const data = await response.json();
        //console.log(data);
        return new konstanteak.Ezaugarria(data[0].idEzaugarria, data[0].izena, data[0].puntuakMax, data[0].puntuakMin, data[0].idFasea, data[0].ponderazioa);
        
    } catch (err) {
        //console.log("Network or parsing error:", err);
        return null;
    }
};
export const getEzaugarria2 = async () => {
    const id = document.getElementById('faseakTaula');
    const idEzaugarria = id.getAttribute('data').split('-')[1];
    try {
        await(sendOptionsRequest(`${API_URL}/ezaugarria/${idEzaugarria}`));
        const response = await fetch(`${API_URL}/ezaugarria/${idEzaugarria}`, {
            method: 'GET',
              

cache: 'no-cache',
targetAddressSpace: 'private',
mode: 'cors',headers: {
       'Content-Type': 'application/json',

            },
            
        });
        if (response.ok) {
            const data = await response.json();
            //console.log(data);
           return new konstanteak.Ezaugarria(data[0].idEzaugarria, data[0].izena, data[0].puntuakMax, data[0].puntuakMin, data[0].ponderazioa);


        }
      
    
    } catch (err) {
        //console.log(err);
    }
};
        
export const createNewEzaugarria = async () => {
    var i = 0;
    if(!getEzaugarriakArray() ) return false;
    while (i < getEzaugarriakArray().length) {
        if (getEzaugarriakArray()[i].idEzaugarria === null) {
            break;
        }
        
        const data = {
            idEzaugarria: null,
            izena: getEzaugarriakArray()[i].izena,
            puntuakMin: getEzaugarriakArray()[i].puntuakMin,
            puntuakMax: getEzaugarriakArray()[i].puntuakMax,
            idFasea: document.getElementById('idFasea').value,
            ponderazioa: getEzaugarriakArray()[i].ponderazioa 
        };
        try {
            await(sendOptionsRequest(`${API_URL}/ezaugarria/add`));
            const response = await fetch(`${API_URL}/ezaugarria/add`, {
             method: 'POST',     
  
cache: 'no-cache',
targetAddressSpace: 'private',
mode: 'cors',headers: {
                       'Content-Type': 'application/json',

                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                
                const responseData = await response.json();
                //const idEzaugarria= responseData.idEzaugarria;
            
                //console.log("ezaugarria ondo sortu da");
            } else {
                const error = await response.json();
                //console.log(`Error: ${error.error}`);
            }
        } catch (err) {
            alert('Errorea');
            //console.log(err);
        }
        i = i + 1;
    }
return true;
};