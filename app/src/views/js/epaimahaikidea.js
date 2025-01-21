import { API_URL } from "./konstanteak.js";
import * as konstanteak from "./konstanteak.js";


function getEpaimahaikideakArray(){
   const epaimahaikideakCheck = document.getElementsByName('checkbox');
   const epaimahaikideak = [];
   const idFasea = document.getElementById('idFasea').value;
   epaimahaikideakCheck.forEach(e => {
       if (e.checked) {
           epaimahaikideak.push(new konstanteak.Epaimahaikidea(0, e.value, idFasea));
       }
   });
   return epaimahaikideak;
}

export const createNewEpaimahaikidea = async () => {
    var i = 0;
    while (i < getEpaimahaikideakArray().length) {
        if (getEpaimahaikideakArray()[i].idEpaimahaikidea === null) {
            break;
        }
        const data = {
           
            username: getEpaimahaikideakArray()[i].username,
            idFasea: document.getElementById('idFasea').value
        };
        try {
            const response = await fetch(`${API_URL}/epaimahaikidea/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                
                const responseData = await response.json();
                const idEpaimahaikidea= responseData.idEpaimahaikidea;
            
                //console.log("epaimahaikidea ondo sortu da");
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
};

