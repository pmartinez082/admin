
import {API_URL} from './konstanteak.js'
import * as konstanteak from "./konstanteak.js";

export const getEpailearenEbaluazioakFaseka = async (event) => {
    event.preventDefault();
    const idEpaimahaikidea = event.target.id.split('buttonEbaluazioak-')[1];   
    try {
        const response = await fetch(`${API_URL}/ebaluazioa/get/EpailearenEbaluazioakFaseka/${idEpaimahaikidea}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
           
        });
        if (response.ok) {
            const ebaluazioak = await response.json();
            //console.log(ebaluazioak);
            if (ebaluazioak.length === 0) {
                return [];
            }
            
            const ebaluazioakArray = [];
            ebaluazioak.forEach(ebaluazioa => {
                
                ebaluazioakArray.push(new konstanteak.Ebaluazioa(ebaluazioa.idEbaluazioa, ebaluazioa.idEpaimahaikidea, ebaluazioa.idTaldea, ebaluazioa.idEzaugarria, ebaluazioa.puntuak, ebaluazioa.noiz));
            });
            //console.log(ebaluazioakArray);
            return ebaluazioakArray;
        } else {
            const error = await response.json();
            //console.log(`Error: ${error.error}`);
        }
    }
    catch (err) {
        alert('Errorea');
        //console.log(err);
    }
};

export const getFasearenEbaluazioak = async (event) => {
    event.preventDefault();
    const idFasea = event.target.id.split('-')[1];
    try {
        const response = await fetch(`http://192.168.137.1:3000/ebaluazioa/get/fasearenEbaluazioak/${idFasea}`);
        if (response.ok) {
            const data = await response.json();
            //console.log(data);
            const d = [];
            data.forEach(ebaluazioa => {
                d.push(ebaluazioa);
            });
            //console.log(d);
            return d;
        }
        else {
            const error = await response.json();
            //console.log(`Error: ${error.error}`);
        }
    }
    catch (err) {
        alert('Errorea');
        //console.log(err);
    }

}

export const getFaseAktiboarenEbaluazioak = async () => {
    try {
        const response = await fetch(`${API_URL}/ebaluazioa/get/faseAktiboarenEbaluazioak`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            
        });
        if (response.ok) {
            const data = await response.json();
            //console.log(data);
            return data;
        }
    } catch (err) {
        //console.log(err);
    }
};