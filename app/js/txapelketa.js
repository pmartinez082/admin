import * as konstanteak from './konstanteak.js';
import {createClassesFromDataF} from './fasea.js' ;
import {API_URL} from './konstanteak.js'




//TXAPELKETAK LORTU
export const getTxapelketak = async () => {
    
    try {
        const response = await fetch(`${API_URL}/txapelketa/`, {    
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            
        });
        if (response.ok) {
            const data = await response.json();
            const txapelketak = [];
            data.forEach(txapelketa => {
                txapelketak.push(new konstanteak.Txapelketa(txapelketa.idTxapelketa, txapelketa.lekua, txapelketa.izena, txapelketa.dataOrdua));  
            
        });
        return txapelketak;
    }}
        catch (err) {
        //console.log(err);
    }
};

//TXAPELKETA SORTU
export const createNewTxapelketa = async (event) => { 
    const data = {
        idTxapelketa: null,
        lekua: document.getElementById('lekua').value,
        dataOrdua: document.getElementById('dataOrdua').value,
        izena: document.getElementById('txapelketaIzena').value,
        egoera: 1
    };
    event.preventDefault();

    try {
        if(!data.lekua||!data.dataOrdua||!data.izena) return false;
        const response = await fetch(`${API_URL}/txapelketa/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {

            const responseData = await response.json();
            const idTxapelketa = responseData.idTxapelketa;
            document.getElementById('idTxapelketa').value = idTxapelketa;

            //console.log("Txapelketa ondo sortu da");
        } else {
            const error = await response.json();
            alert(`Error: ${error.error}`);
        }
    } catch (err) {
        //console.log(err);
    }
};


//TXAPELKETA EGUNERATU
export const updateTxapelketa = async (event) => {  
    event.preventDefault();
    const data = {
        idTxapelketa: document.getElementById('idTxapelketa').value,
        lekua: document.getElementById('lekua').value,
        dataOrdua: document.getElementById('dataOrdua').value,
        izena: document.getElementById('txapelketaIzena').value,
    };
    try {
        const response = await fetch(`${API_URL}/txapelketa/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            //console.log("txapelketa eguneratua");
        } else {
            const error = await response.json();
            //console.log(`Error: ${error.error}`);
        }
    } catch (err) {
        //console.log(err);
    }
};




//TXAPELKETA LORTU
export const getTxapelketa = async () => {             
    
    const idTxapelketa = document.getElementById('idTxapelketa').value;
    try {
        const response = await fetch(`${API_URL}/txapelketa/${idTxapelketa}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            
        });
        if (response.ok) {
            const data = await response.json();
           return new konstanteak.Txapelketa(data.idTxapelketa, data.lekua, data.izena, data.dataOrdua);

        }
        
} catch (err) {
    //console.log(err);
}

};

//TXAPELKETA EZABATU
export const deleteTxapelketa = async (event) => {

event.preventDefault();
const idTxapelketa = event.target.id.split('-')[1];
  try {
    const response = await fetch(`${API_URL}/txapelketa/delete/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({idTxapelketa:idTxapelketa}),
    });

    if (response.ok) {
      //console.log('txapelketa ezabatu da');
    } else {
      const error = await response.json();
      alert(`Error: ${error.error}`);
    }
  } catch (err) {
    alert('Error en la conexión con el servidor.');
    //console.log(err);
  }
};

//TXAPELKETAREN FASEAK LORTU
export const getTxapelketarenFaseak = async () => {
    
    const idTxapelketa = document.getElementById('idTxapelketa').value;
    try {
        const response = await fetch(`${API_URL}/txapelketa/${idTxapelketa}/faseak`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            
        });
        if (response.ok) {
            const data = await response.json();
            const faseak = [];
            data.forEach(fase => {
                faseak.push(new konstanteak.Fasea(fase.idFasea, fase.idTxapelketa, fase.izena, fase.egoera, fase.hasiera, fase.amaiera, fase.irizpidea));
            });
            return faseak;
        }
    } catch (err) {
        //console.log(err);
    }
};

export const getInfoGuztia = async () => {
    
    try {
        const response = await fetch(`${API_URL}/txapelketa/lortu/info-guztia`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            
        });
        if (response.ok) {
            const data = await response.json();
           
            return createClassesFromData(data);
        }
    } catch (err) {
        //console.log(err);
    }
};

export const getTxapelketarenInfoGuztia = async () => {
    
    try {
        const idTxapelketa = document.getElementById('idTxapelketa').value;
        const response = await fetch(`${API_URL}/txapelketa/lortu/info-guztia/${idTxapelketa}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            
        });
        if (response.ok) {
            const data = await response.json();
           
            return createClassesFromData(data);
        }
    } catch (err) {
        //console.log(err);
    }
};
function createClassesFromData(data) {
    const txapelketak = data.map(txData => {
        const txapelketa = new konstanteak.Txapelketa(
            txData.idTxapelketa,
            txData.txapelketaLekua,
            txData.txapelketaIzena,
            txData.txapelketaData
            
            
        );

        txData.faseak.forEach(faseData => {
            const fase = new konstanteak.Fasea(
                faseData.idFasea,
                txData.idTxapelketa,
                faseData.faseIzena,
                faseData.faseEgoera,
                faseData.faseHasiera,
                faseData.faseAmaiera,
                faseData.faseIrizpidea,
                


            );

            faseData.ezaugarriak.forEach(ezaugarriaData => {
                const ezaugarria = new konstanteak.Ezaugarria(
                    ezaugarriaData.idEzaugarria,
                    ezaugarriaData.ezaugarriaIzena,
                    ezaugarriaData.puntuakMin,
                    ezaugarriaData.puntuakMax,
                    ezaugarriaData.ponderazioa
                );
                fase.ezaugarriak.push(ezaugarria);
            });

            faseData.epaimahaikideak.forEach(epaimahaikideaData => {
                const epaimahaikidea = new konstanteak.Epaimahaikidea(
                    epaimahaikideaData.idEpaimahaikidea,
                    epaimahaikideaData.epaimahaikideaUsername,
                    faseData.idFasea
                );
                fase.epaimahaikideak.push(epaimahaikidea);
            });

            txapelketa.faseak.push(fase);
        });

        return txapelketa;
    });

    return txapelketak;
}

export const getTxapelketaAktiboarenInfo = async (req, res) => {
    try {
        const response = await fetch(`${API_URL}/txapelketa/lortu/aktiboaren-info-guztia`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            
        });
        if (response.ok) {
            const data = await response.json();
            return createClassesFromDataF(data);
        }

        else{
            return [];
        }

    } catch (error) {
        //console.log(error);
    }
};