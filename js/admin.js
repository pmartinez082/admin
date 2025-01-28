
import * as f from "./fasea.js";
import * as u from "./user.js";
import * as tx from "./txapelketa.js";
import * as ep from "./epaimahaikidea.js";
import * as ez from "./ezaugarria.js";
import * as eb from "./ebaluazioa.js";
import * as ta from "./taldea.js"
import * as konstanteak from "./konstanteak.js";


//txapelketaBerria.html, txapelketaEzabatu eta txapelketaView.html
//***********************************************
async function txapelketaEzabatu(event){
    event.preventDefault();
    await tx.deleteTxapelketa(event);
    txapelketaBistaratu(2);
}
 export async function txapelketaSortu(event){
    event.preventDefault();
    const h1 = document.getElementById("abisua");
    if(h1) document.body.removeChild(h1);
    
    const e = await tx.createNewTxapelketa(event);
    if(!e){

        const abisua = document.createElement('h1');
        abisua.id = "abisua";
        abisua.innerHTML = "Parametro guztiak bete behar dituzu";
        abisua.style.textAlign = "center";
        abisua.style.padding = "40px";
        document.body.appendChild(abisua);
        return;
    }
    document.getElementById('txapForm').hidden = true;
    document.getElementById('sortu').hidden = true;
    faseakForm(1);

}


export async function faseakForm() {
    const epaileak = await u.getEpaileak();
    const l_ = await tx.getTxapelketa();

    if (l_ === null) {
        const abisua = document.createElement('h1');
        abisua.innerHTML = "Editatzen ari zaren txapelketa ezabatu da";
        return;
    }

    const taulaContainer = document.getElementById('faseenTaula');

    const taula = document.getElementById('faseakTaula');
    taula.innerHTML = "";
   
    const row1 = taula.insertRow();
    const id  = row1.insertCell()
    id.innerHTML = "<input type='hidden' id='idFasea'></input>";
    id.hidden = true;
  
    row1.insertCell().textContent = "Fase izena";
    row1.insertCell().textContent = "Irizpidea";
    row1.insertCell().textContent = "Ezaugarria";
    row1.insertCell().textContent = "Epaimahaikideak";

    const row2 = taula.insertRow();
    row2.insertCell().innerHTML = "<input type='text' id='faseIzena' placeholder='Fase izena'></input>";
    row2.insertCell().innerHTML = "<input type='text' id='faseIrizpidea' placeholder='Fase irizpidea'></input>";

   
    
    const ezaugarriakDiv = document.createElement('div');
    const ezaugarriakTable = document.createElement('table');
    ezaugarriakTable.classList.add('taula');
    const ezaugarriakHeaderRow = ezaugarriakTable.insertRow();
    ezaugarriakHeaderRow.insertCell().textContent = "Izena";
    ezaugarriakHeaderRow.insertCell().textContent = "Puntuazio minimoa";
    ezaugarriakHeaderRow.insertCell().textContent = "Puntuazio maximoa";
    ezaugarriakHeaderRow.insertCell().textContent = "Ponderazioa";
    const ezaugButton = document.createElement('button');
    ezaugButton.id = "ezaugButton"
    ezaugButton.textContent = "Gehitu Ezaugarria";
    ezaugButton.type = "button";
    const ezaugrow22 = ezaugarriakTable.insertRow();
    ezaugrow22.insertCell().innerHTML = "<input type='text' name='ezaugarriaIzena' placeholder='Ezaugarriaren izena'></input>";
    ezaugrow22.insertCell().innerHTML = "<input type='number' name='ezaugarriaMin' placeholder='Puntuak Min'></input>";
    ezaugrow22.insertCell().innerHTML = "<input type='number' name='ezaugarriaMax' placeholder='Puntuak Max'></input>";
    ezaugrow22.insertCell().innerHTML = "<input type='number' name='ponderazioa' placeholder='0-1 arteko balioa'></input>";
    ezaugrow22.insertCell().appendChild(ezaugButton);
 
    ezaugButton.onclick = () => {
        const ezIz = document.getElementsByName('ezaugarriaIzena');
        const eMin = document.getElementsByName('ezaugarriaMin');
        const eMax = document.getElementsByName('ezaugarriaMax');
        const ponderazioa = document.getElementsByName('ponderazioa');
        ponderazioa.disabled = true;
        ezIz.disabled = true;
        eMin.disabled = true;
        eMax.disabled = true;
    
        
    const ezaugrow2 = ezaugarriakTable.insertRow();
    ezaugrow2.insertCell().innerHTML = "<input type='text' name='ezaugarriaIzena' placeholder='Ezaugarriaren izena' value = ''></input>";
    ezaugrow2.insertCell().innerHTML = "<input type='number' name='ezaugarriaMin' placeholder='Puntuak Min' value = ''></input>";
    ezaugrow2.insertCell().innerHTML = "<input type='number' name='ezaugarriaMax' placeholder='Puntuak Max' value = ''></input>";
    ezaugrow2.insertCell().innerHTML = "<input type='number' name='ponderazioa' placeholder='0-1 arteko balioa' value = ''></input>";
    ezaugrow2.insertCell().appendChild(ezaugButton);
        
     
    };

    ezaugarriakDiv.appendChild(ezaugarriakTable);
    ezaugarriakDiv.appendChild(ezaugButton);
    row2.insertCell().appendChild(ezaugarriakDiv);
    
    row2.insertCell().innerHTML = epaileakCheckbox(epaileak);
    taula.classList.add("taula");
    taulaContainer.appendChild(taula);

    const button = document.createElement('button');
    button.setAttribute('type', 'click');
    button.textContent = 'Gorde eta hurrengo fasea konfiguratu';
    const button2 = document.createElement('button');
    button2.setAttribute('type', 'click');
    button2.textContent = 'Gorde eta amaitu';
    button2.addEventListener('click', async (event) => faseaSortu(event,0));
    button.addEventListener('click', async (event) => faseaSortu(event,1));
    
    taulaContainer.appendChild(button);
    taulaContainer.appendChild(button2);


    txapelketaBistaratu(0);
}

function epaileakCheckbox(epaileak) {
    let htmlString = "<table style='border-collapse: collapse;'>";
    epaileak.forEach((epaile, index) => {
        if (index % 2 === 0) {
            htmlString += "<tr style='border: none;'>";
        }
        const checkbox = `<input type="checkbox" id="epaile-${epaile.username}" name="checkbox" value="${epaile.username}">`;
        const label = `<label for="epaile-${epaile.username}">${epaile.username}</label>`;
        htmlString += `<td style='border: none;'>${checkbox}${label}</td>`;
        if (index % 2 !== 0) {
            htmlString += "</tr>";
        }
    });
    if (epaileak.length % 2 !== 0) {
        htmlString += "<td style='border: none;'></td></tr>";
    }
    htmlString += "</table>";
    return htmlString;
} 

export async function faseaSortu(event, i){
  

    const taulaContainer = document.getElementById('faseenTaula');
    const taula = document.getElementById('faseakTaula');
    event.preventDefault();
    const epaileakCheck = document.getElementsByName('checkbox');

    if(!checkCheckbox(epaileakCheck)||!(document.getElementById('faseIzena').value)||!(document.getElementById('faseIrizpidea').value)){
        const mezua = document.createElement('h1');
        taula.innerHTML = "";
           const ezabatu = taulaContainer.querySelectorAll(":not(table)"); 
    ezabatu.forEach(e => {
        e.remove();
    });
        mezua.textContent = "Atal guztiak bete behar dituzu";
        taulaContainer.appendChild(mezua);
       
        faseakForm();
        return;
    }
  
    let epaimahakideak = [];
    await f.createNewFasea();
    const eza =await ez.createNewEzaugarria();
    if(!eza){
        const abisua = document.createElement('h1');
        abisua.innerHTML = "Ezaugarrien ponderazioek bat gehitu behar dute";
        document.body.appendChild(abisua);
        return;
    }
    const checkEpaileak = document.getElementsByName('checkbox');
    checkEpaileak.forEach(cE => {
        if (cE.checked) {
            epaimahakideak.push(new konstanteak.Epaimahaikidea(0, cE.value,0));
        }
    });
 
    await ep.createNewEpaimahaikidea();
    
    if(i === 0){
        window.location.href = 'txapelketakView.html';
    }
    document.getElementById("faseakTaula").innerHTML = "";  
    

    
    faseakForm();
   

    

}



export function checkCheckbox(epaileak){
    for (const epaile of epaileak) {
        if(epaile.checked){
            return true;}
        }
        return false;
}


export async function txapelketaBistaratu(i) {
    if(!u.autentifikatu()) return;
    try {
       const info = await tx.getInfoGuztia();
       const txapelketa = await tx.getTxapelketarenInfoGuztia();
       var txapelketak;
       if(i === 0) txapelketak = txapelketa;
       else txapelketak = info;
        //console.log(txapelketak);

        if (!txapelketak || txapelketak.length === 0) {
            const hutsik = document.createElement('h1');
            hutsik.textContent = "Ez dago txapelketarik";
            document.body.appendChild(hutsik);
            return;
        }

        const txapelketakDiv = document.getElementById("txapelketakDiv");
        txapelketakDiv.innerHTML = "";
        const taula = document.createElement('table');
        taula.id = "txapelketak";
        taula.classList.add('taula');
        const row1 = taula.insertRow();
        const id = row1.insertCell();
        id.id = "idFasea";
        id.hidden = true;
        row1.insertCell().textContent = "Txapelketa Izena";
        row1.insertCell().textContent = "Data";
        row1.insertCell().textContent = "Lekua";
        row1.insertCell().textContent = "Faseak";
        if(i === 2) row1.insertCell().textContent = "Ekintza";
        txapelketak.forEach((txapelketa) => {
            const row2 = taula.insertRow();
            row2.insertCell().textContent = txapelketa.izena || "-";
            row2.insertCell().textContent = txapelketa.dataOrdua || "-";
          
            row2.insertCell().textContent = txapelketa.lekua || "-";

            const fasCell = row2.insertCell();
            const ftaula = document.createElement('table');
            ftaula.classList.add('taula');
            if(txapelketa.faseak.length >0){
            const frow1 = ftaula.insertRow();
            frow1.insertCell().textContent = "Fase Izena";
            frow1.insertCell().textContent = "Egoera";
            frow1.insertCell().textContent = "Hasiera";
            frow1.insertCell().textContent = "Amaiera";
            frow1.insertCell().textContent = "Ezaugarriak";
            frow1.insertCell().textContent = "Epaimahaikideak";

            }

            (txapelketa.faseak || []).forEach((fase) => {
                const faseRow = ftaula.insertRow();
                faseRow.insertCell().textContent = fase.izena || "-";
                //console.log(fase.egoera);
                faseRow.insertCell().textContent =
            
                    parseInt(fase.egoera) === 0
                        ? "Hasigabea"
                        : parseInt(fase.egoera) === 1
                        ? "Martxan"
                        : "Amaituta";
                faseRow.insertCell().textContent = fase.hasiera || "-";
                faseRow.insertCell().textContent = fase.amaiera || "-";
                faseRow.insertCell().textContent =
                    (fase.ezaugarriak || [])
                        .map((eza) => eza.izena)
                        .join(", ") || "-";

                faseRow.insertCell().textContent =
                    (fase.epaimahaikideak || [])
                        .map((ep) => ep.username)
                        .join(", ") || "-";
            });

            fasCell.appendChild(ftaula);
           if(i ==2) row2.insertCell().innerHTML = "<button name = 'ezabatuButton' id = 'ezabatu-"+txapelketa.idTxapelketa+"'>Ezabatu</button>";
        });

        txapelketakDiv.appendChild(taula);
        document.getElementsByName('ezabatuButton').forEach(e => {
            e.addEventListener('click', (event) => {
                txapelketaEzabatu(event);
            });
        });
    } catch (error) {
        //console.log("Errorea txapelketak bistaratzean:", error);
    }
}       



export async function faseakBistaratu() {
    if(!u.autentifikatu()) return;
    
    const faseakTaula = document.getElementById("faseakTaula");
    faseakTaula.classList.add("taula");
    const faseak = await tx.getTxapelketaAktiboarenInfo();
    if(faseak.length === 0){
        const mezua = document.createElement('h1');
        mezua.textContent = 'Ez dago txapelketa aktiborik';
        document.body.appendChild(mezua);
        return false;
    }
    //console.log(faseak);
    const row1 = faseakTaula.insertRow();
    row1.insertCell().textContent = "Fase Izena";
    row1.insertCell().textContent = "Hasiera";
    row1.insertCell().textContent = "Amaiera";
    row1.insertCell().textContent = "Egoera";
    row1.insertCell().textContent = "Irizpidea";
    row1.insertCell().innerHTML = "<div class = 'ezaugContainer'><table ><tr><td>Ezaugarria</td><td>Puntuazio minimoa</td><td>Puntuazio maximoa</td><td>Ponderazioa</td></tr></table></div>";
    row1.insertCell().textContent = "Parte hartzen duten epaileak";
    row1.insertCell().innerHTML = "Fasearen ebaluazioak";
    faseak.forEach((fase) => {
  
        const eza = fase.ezaugarriak || [];
        //console.log(eza);
        const ep = fase.epaimahaikideak || [];
        const row = faseakTaula.insertRow();
        row.insertCell().textContent = fase.izena || "";
        row.insertCell().textContent = fase.hasiera  || "";
        row.insertCell().textContent = fase.amaiera || "";
        const buttonEgoera = document.createElement('button');
        buttonEgoera.id = `buttonEgoera-${fase.idFasea}`;
        //console.log(fase.egoera);
        if (parseInt(fase.egoera) === 0) {
            buttonEgoera.textContent = "Hasi";
        } else if (parseInt(fase.egoera) === 1) {
            buttonEgoera.textContent = "Bukatu";
        } else {
            buttonEgoera.hidden = true;
        }
        row.insertCell().innerHTML = fase.egoera ===0 ?  buttonEgoera.outerHTML : fase.egoera ===1 ? buttonEgoera.outerHTML : "<div>Amaituta</div>";
        row.insertCell().textContent = fase.irizpidea || "-";
        row.insertCell().innerHTML = eza.map(item => `<div class = 'ezaugContainer' ><table id ="ezaugarria-${item.idEzaugarria}"><tr><td>${item.izena || "-"}</td></tr></table></div>`).join('\n');
        row.insertCell().innerHTML = ep.map(item => `<div class = 'epaimahaikideaContainer'><table id = "epaimahaikidea-${item.idEpaimahaikidea}"><tr><td>${item.username || ""}</td></tr></table></div>`).join('\n');
        row.insertCell().innerHTML = "<button id = 'fasearenEbaluazioak-"+fase.idFasea+"'>ikusi</button>";
        const buttonEg = document.getElementById(`buttonEgoera-${fase.idFasea}`);
        const buttonEb = document.getElementById(`fasearenEbaluazioak-${fase.idFasea}`);
        if(buttonEb !== null){
            buttonEb.addEventListener('click', (event) => fasearenEbaluazioakBistaratu(event));
        }
        if(buttonEg !== null){
            buttonEg.addEventListener('click', (event) => aldatuEgoera(event));
        }
        if(eza.length >0){
        eza.forEach(ezaugarria => {
            ezaugarriaBistaratu(ezaugarria);
        });
    }
    if(ep.length >0){   
        ep.forEach(epaimahaikidea => {
           epaimahaikideaBistaratu(epaimahaikidea);
            
        });
    }
    });
}

async function ezaugarriaBistaratu(ezaugarria) {
  
    const taula = document.getElementById("ezaugarria-"+ezaugarria.idEzaugarria);
    taula.innerHTML = "";
    const row2 = taula.insertRow();
    row2.insertCell().textContent = ezaugarria.izena;
    row2.insertCell().textContent = ezaugarria.puntuakMin;
    row2.insertCell().textContent = ezaugarria.puntuakMax || "";
    row2.insertCell().textContent = "% "+100* parseFloat(ezaugarria.ponderazioa) || "";
    taula.removeAttribute("data-idEzaugarria");
}


async function epaimahaikideaBistaratu(epaimahaikidea){

    const taula = document.getElementById("epaimahaikidea-"+epaimahaikidea.idEpaimahaikidea);
    taula.innerHTML = "";
    const row1 = taula.insertRow();
    row1.insertCell().textContent = epaimahaikidea.username;
    row1.insertCell().innerHTML = "<button id = 'buttonEbaluazioak-"+epaimahaikidea.idEpaimahaikidea+"'>Egindako ebaluazioak</button>";
    row1.insertCell().innerHTML = "<button id = 'buttonTaldeak-"+epaimahaikidea.idEpaimahaikidea+"'>Baloratzeke</button>";
    const button1 = document.getElementById('buttonEbaluazioak-'+epaimahaikidea.idEpaimahaikidea);
    const button2 = document.getElementById('buttonTaldeak-'+epaimahaikidea.idEpaimahaikidea);
   
    if (button2) {
        button2.addEventListener('click', (event) => taldeakBistaratu(event, epaimahaikidea)); 
    }
    if (button1) {
        button1.addEventListener('click', (event) => ebaluazioakBistaratu(event, epaimahaikidea)); 
    }
    }


    async function taldeakBistaratu(event, epaimahaikidea) {
        event.preventDefault();
        const taldeak = await ta.getBaloratuGabekoTaldeak(event);
    
        taldeak.sort((a, b) => {
            if (a.egoera < b.egoera) return -1;
            if (a.egoera > b.egoera) return 1;
            return 0;
        });
    
        const modal = document.createElement("div");
        const modalContent = document.createElement("div");
        const overlay = document.createElement("div");
       
        
        const titulua = document.createElement('h1');
        titulua.textContent = epaimahaikidea.username+ " epaileari baloratzeko geratzen zaizkion taldeak"
        overlay.id = "modalOverlay";
        modal.id = "modal";
        modalContent.id = "modalContent";
       
        if(taldeak.length === 0){
            
            titulua.textContent = 'Talde guztiak baloratu dira';
            modalContent.appendChild(titulua);
        }
        else{
       
       
      
       
        modalContent.appendChild(titulua);
        taldeenTaula(modalContent, taldeak,0);
       
        }
        const closeButton = document.createElement("button");
        closeButton.textContent = "Itxi";
        closeButton.style.marginTop = "20px";
        closeButton.addEventListener("click", () => {
            document.body.removeChild(overlay);
            document.body.removeChild(modal);
            document.getElementById("content").classList.remove("blur");
        });
    
        modalContent.appendChild(closeButton);
        modal.appendChild(modalContent);
    
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
        document.getElementById("content").classList.add("blur");
    }
    


async function ebaluazioakBistaratu(event, epaimahaikidea) {
    event.preventDefault(); 
    const modal = document.createElement("div");
    const modalContent = document.createElement("div");
    const overlay = document.createElement("div");
    const ebaluazioakTaula = document.createElement("table");
    ebaluazioakTaula.classList.add('taula');
    const faseakTaula = document.getElementById('faseakTaula');
    overlay.id = "modalOverlay";
    modal.id = "modal";
    modalContent.id = "modalContent";
    const titulua = document.createElement('h1');
    const ebaluazioak = await eb.getEpailearenEbaluazioakFaseka(event);
    if (ebaluazioak.length === 0) {
        modalContent.textContent = "Ez dago ebaluaziorik";
    } else {
        titulua.textContent = epaimahaikidea.username+" epailearen ebaluazioak";
        const headerRow = ebaluazioakTaula.insertRow();
        headerRow.insertCell().textContent = "Puntuazioa";
        headerRow.insertCell().textContent = "Data";
        headerRow.insertCell().textContent = "Ezaugarria";
        headerRow.insertCell().textContent = "Taldea";

        for (const ebaluazioa of ebaluazioak) {
            const row = ebaluazioakTaula.insertRow();
            faseakTaula.setAttribute('data', ebaluazioa.idTaldea + "-" + ebaluazioa.idEzaugarria);
            const ezaugarria = await ez.getEzaugarria2();
            const taldea = await ta.getTaldea();
            //console.log(ezaugarria);
            //console.log(taldea);
            row.insertCell().textContent = ebaluazioa.puntuak;
            row.insertCell().textContent = ebaluazioa.noiz;
            row.insertCell().textContent = ezaugarria.izena;
            row.insertCell().textContent = taldea.izena;
        }
        
        modalContent.appendChild(titulua);
        modalContent.appendChild(ebaluazioakTaula);
    }

    const closeButton = document.createElement("button");
    closeButton.textContent = "Itxi";
    closeButton.style.marginTop = "20px";
    closeButton.addEventListener("click", () => {
        document.body.removeChild(overlay);
        document.body.removeChild(modal);
        document.getElementById("content").classList.remove("blur");
    });

    modalContent.appendChild(closeButton);
    modal.appendChild(modalContent);

    document.body.appendChild(overlay);
    document.body.appendChild(modal);
    document.getElementById("content").classList.add("blur");
}
//****************************************

//faseakView.html
//***********************************************
async function aldatuEgoera(event) {
    event.preventDefault();
    await f.egoeraAldatu(event);
    const egoeraButton = document.getElementById(`buttonEgoera-${event.target.id.split('buttonEgoera-')[1]}`);
    if (egoeraButton) {
        if(event.target.textContent === 'Hasi'){
            egoeraButton.textContent = 'Bukatu';
        }
        else{
            egoeraButton.textContent = 'Bukatuta';
            egoeraButton.disabled = true;
        }
    }


}


export async function faseAktiboarenEbaluazioakBistaratu(){
    const ebaluazioak = await eb.getFaseAktiboarenEbaluazioak();
    const taula = document.createElement('table');
    const headerRow = taula.insertRow();
    headerRow.insertCell().textContent = "Epailea";
    headerRow.insertCell().textContent = "Ezaugarria";
    headerRow.insertCell().textContent = "Taldea";
    headerRow.insertCell().textContent = "Puntuazioa";
    headerRow.insertCell().textContent = "Data";
    ebaluazioak.forEach(ebaluazioa => {
        const row = taula.insertRow();
        row.insertCell().textContent = ebaluazioa.username;
        row.insertCell().textContent = ebaluazioa.ezaugarriaIzena;
        row.insertCell().textContent = ebaluazioa.taldeaIzena;
        row.insertCell().textContent = ebaluazioa.puntuak;
        row.insertCell().textContent = ebaluazioa.noiz;
    });

    document.body.appendChild(taula);
   
}

export async function fasearenEbaluazioakBistaratu(event){
    event.preventDefault();
    const modal = document.createElement("div");
    const modalContent = document.createElement("div");
    const overlay = document.createElement("div");
    overlay.id = "modalOverlay";
    modal.id = "modal";
    modalContent.id = "modalContent";
    const ebaluazioak = await eb.getFasearenEbaluazioak(event);
    if (ebaluazioak.length === 0) {
        modalContent.textContent = "Ez dago ebaluaziorik";
        modal.appendChild(modalContent);
       
    }
    
    else{
    const taula = document.createElement('table');
    taula.classList.add('taula');
    const headerRow = taula.insertRow();
    headerRow.insertCell().textContent = "Epailea";
    headerRow.insertCell().textContent = "Ezaugarria";
    headerRow.insertCell().textContent = "Taldea";
    headerRow.insertCell().textContent = "Puntuazioa";
    headerRow.insertCell().textContent = "Data";
    ebaluazioak.forEach(ebaluazioa => {
        const row = taula.insertRow();
        row.insertCell().textContent = ebaluazioa.username;
        row.insertCell().textContent = ebaluazioa.ezaugarriaIzena;
        row.insertCell().textContent = ebaluazioa.taldeaIzena;
        row.insertCell().textContent = ebaluazioa.puntuak;
        row.insertCell().textContent = ebaluazioa.noiz;
    });

   modalContent.appendChild(taula);
}
   const closeButton = document.createElement("button");
    closeButton.textContent = "Itxi";
    closeButton.style.marginTop = "20px";
    modalContent.appendChild(closeButton);
    modal.appendChild(modalContent);
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
    document.getElementById("content").classList.add("blur");


    closeButton.addEventListener("click", () => {
        document.body.removeChild(overlay);
        document.body.removeChild(modal);
        document.getElementById("content").classList.remove("blur");
    
});
   
    

   }


   //kalkuluak.html
export async function kalkuluakBistaratu(){
    if(!u.autentifikatu()) return;
    const taulaDiv = document.createElement('div');
    taulaDiv.classList.add('taulaDiv');

    const taula = document.createElement('table');
    taula.classList.add('taula');
    const taldeak = await ta.getTaldeak();
    //console.log(taldeak);
    taldeak.sort((a, b) => {
       
        if ((a.egoera === 0 || a.egoera === 1) && b.egoera === 2) return -1;
        if (a.egoera === 2 && (b.egoera === 0 || b.egoera === 1)) return 1;
    
     
        return b.puntuakGuztira - a.puntuakGuztira;
    });
    
    const row1 = taula.insertRow();
    row1.insertCell().textContent = "Posizioa";
    row1.insertCell().textContent = "Taldea";
    row1.insertCell().textContent = "Puntuazioa";
    row1.insertCell().textContent = "Egoera";
    let i = 1;
    taldeak.forEach(taldea => {
        const row = taula.insertRow();
        row.insertCell().textContent = i;
        i++;
        row.insertCell().textContent = taldea.izena;
        row.insertCell().textContent = taldea.puntuakGuztira;
        const cell = row.insertCell();
        cell.textContent = parseInt(taldea.egoera) === 2 ? "Deskalifikatuta" : "Txapelketan";
        cell.style.color = parseInt(taldea.egoera) === 2 ? "red" : "green";
    });

    taulaDiv.appendChild(taula);
    document.body.appendChild(taulaDiv);




}

//taldeaBerria.html eta taldeaEzabatu.html
 export async function  taldeaSortu(event){
    const  taulaDiv = document.getElementById('taulaDiv');
  
    event.preventDefault();
    const idTaldea = await ta.createNewTaldea(event);
    taulaDiv.innerHTML = "";
    
    if(idTaldea){
      
        const mezua = document.createElement('h1');
        mezua.textContent = 'Taldea ondo sortu da';
        document.body.appendChild(mezua);
       
        
    }
    else{
    
        const mezua = document.createElement('h1');
        mezua.textContent = 'Errorea, saiatu berriro';
        document.body.appendChild(mezua);
    }
    taldeaForm();
 }

 export async function taldeaForm(i){
    if(!u.autentifikatu()) return;
    const taulaDiv = document.getElementById('taulaDiv');
    const titulua = document.createElement('h1');
    titulua.textContent = "Taldea berria sortu ezazu";
    taulaDiv.appendChild(titulua);
    const taula = document.createElement('table');
    const row1 = taula.insertRow();
    row1.insertCell().textContent = "Taldearen izena";
    row1.insertCell().innerHTML = "<input type='text' id='izena' placeholder='Taldearen izena'></input>";
    const row2 = taula.insertRow();
    row2.insertCell().textContent = "Eposta kontua";
    row2.insertCell().innerHTML = "<input type='email' id='email' placeholder='Eposta kontua'></input>";
    const row3 = taula.insertRow();
    row3.insertCell().textContent = "Telefono zenbakia";
    row3.insertCell().innerHTML = "<input type='number' id='telefonoa' placeholder='Telefono zenbakia'></input>";

    taulaDiv.appendChild(taula);
    const button = document.createElement('button');
    button.setAttribute('type', 'click');
    button.textContent = 'Taldea sortu';
    button.addEventListener('click', async (event) => taldeaSortu(event));
    
    taulaDiv.appendChild(button);
    taldeakBistaratu2(i);
 }


 function taldeenTaula(div, taldeak, i) {
    const taldeakTaula = document.createElement("table");
    if(i == 1|| i == 2)
        taldeakTaula.classList.add('taulaInput');
    else taldeakTaula.classList.add('taula');
    const headerRow = taldeakTaula.insertRow();
    headerRow.insertCell().textContent = "Taldea";
    headerRow.insertCell().textContent = "Datuak";
    headerRow.insertCell().textContent = "Egoera";
    headerRow.insertCell().textContent = "Puntuak Guztira";
    if(i === 1){headerRow.insertCell().textContent = "Ekintza";}
    for (const taldea of taldeak) {
        const row = taldeakTaula.insertRow();
        row.insertCell().textContent = taldea.izena || "-";
        row.insertCell().textContent = (taldea.email || "-") + ", " + (taldea.telefonoa || "-");
        const cell =  row.insertCell();
        cell.textContent = parseInt(taldea.egoera) === 2 ? "Deskalifikatuta" : "Txapelketan";                                     
        cell.style.color = parseInt(taldea.egoera) === 2 ? "red" : "green";
        row.insertCell().textContent = taldea.puntuakGuztira || "0";
        if(i === 1){
            row.insertCell().innerHTML = "<button name = 'ezabatuButton'id = 'taldeak-"+taldea.idTaldea+"'> Ezabatu</button>";
            
        }
    }
    div.appendChild(taldeakTaula);
    if(i ===  1){   
    document.getElementsByName('ezabatuButton').forEach(e => {
        e.addEventListener('click', (event) => {
            taldeaEzabatu(event);
        });
    });
 }
}

 export async function taldeakBistaratu2(i){
    if(!u.autentifikatu()) return;
    const taldeak = await ta.getTaldeak();
    taldeak.sort((a, b) => {
        if (a.egoera < b.egoera) return -1;
        if (a.egoera > b.egoera) return 1;
        return 0;
    });
    const taulaDiv = document.getElementById('taldeenTaula');
    taulaDiv.innerHTML = "";
    taldeenTaula(taulaDiv, taldeak,i);

   
 }

 async function taldeaEzabatu(event){
    event.preventDefault();
    await ta.deleteTaldea(event);
    taldeakBistaratu2();
}

