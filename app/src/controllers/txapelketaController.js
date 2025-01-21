
import dbConnection from '../database/database.js';
export const getTxapelketak = async (req, res) => {
  try {
    
    const [results] = await dbConnection.query("SELECT * FROM txapelketa");
    res.status(200).json(results);  
  } catch (error) {
    //console.log(error); 
    res.status(500).json({ error: 'errorea txapelketak eskuratzean' });    }
};

export const getTxapelketa = async (req, res) => {
  const id = parseInt(req.params.idTxapelketa);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }
  
  const sqlQuery = `SELECT * FROM txapelketa WHERE idTxapelketa = ?`;
  
  try {
    const [results] = await dbConnection.query(sqlQuery, id);
    res.status(200).json(results);
  } catch (error) {
    //console.log(error);
    res.status(500).json({ error: 'errorea txapelketa eskuratzean' });
  }
};

export const getTxapelketarenFaseak = async (req, res) => {
  const id = parseInt(req.params.idTxapelketa);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }

  const sqlQuery = `SELECT * FROM fasea WHERE idTxapelketa = ?`;

  try {

    const [results] = await dbConnection.query(sqlQuery, [id]);
    
    if (results.length === 0) {
      res.status(404).json({ error: 'Txapelketa not found' });
    }

    else{
      res.status(200).json(results);}
  } catch (error) {
    //console.log(error);
    res.status(500).json({ error: 'Error retrieving data' });
  }
};

export const createNewTxapelketa = async (req, res) => {
  const txapelketa = req.body;

  
  if (!txapelketa.izena || !txapelketa.dataOrdua || !txapelketa.lekua) {
    return res.status(400).json({
      ErrorCode: 204,
      Message: 'Fields cannot be empty',
    });
  }

  const txapelketaObj = [
    txapelketa.izena,
    txapelketa.dataOrdua,
    txapelketa.lekua,
    txapelketa.egoera
    
  ];

  const sqlQuery = 'INSERT INTO txapelketa (izena, dataOrdua, lekua, egoera) VALUES (?, ?, ?, ?)';

  try {
    
    const [result] = await dbConnection.execute(sqlQuery, txapelketaObj);


    const idTxapelketa = result.insertId;

    res.status(201).json({ idTxapelketa });
  } catch (error) {
    //console.log(error);
    res.status(500).json({ error: 'Error creating txapelketa' });
  }
};



  
export const updateTxapelketa = async (req, res) => {
    const txapelketa = req.body;
    const idTxapelketa = parseInt(req.body.idTxapelketa);
    if(isNaN(idTxapelketa)){
      return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
    }
    try {
      const txapelketaObj = [
        txapelketa.izena,
        txapelketa.dataOrdua,
        txapelketa.lekua,
        idTxapelketa
      ];
      const sqlQuery = 'UPDATE txapelketa SET izena = ?, dataOrdua = ?, lekua = ? WHERE idTxapelketa = ?';
      await dbConnection.execute(sqlQuery, txapelketaObj);
      res.status(200).json({ message: 'txapelketa updated' });
    }

    catch(error){
      //console.log(error);
    }
  };

 export const deleteTxapelketa = async (req, res) =>{
   const idTxapelketa = parseInt(req.body.idTxapelketa);
   const sqlQuery = 'DELETE FROM txapelketa WHERE idTxapelketa = ?';
   await dbConnection.execute(sqlQuery, [idTxapelketa]);
   res.status(200).json({ message: 'txapelketa deleted' });
 };

export const getInfoGuztia = async (req, res) => {
  const sqlQuery = `SELECT 
    t.idTxapelketa,
    t.izena AS txapelketaIzena,
    t.dataOrdua AS txapelketaData,
    t.lekua AS txapelketaLekua,
    

    f.idFasea,
    f.izena AS faseIzena,
    f.egoera AS faseEgoera,
    f.hasiera AS faseHasiera,
    f.amaiera AS faseAmaiera,
    f.irizpidea AS faseIrizpidea,
  

    e.idEzaugarria,
    e.izena AS ezaugarriaIzena,
    e.puntuakMin as puntuakMin,
    e.puntuakMax as puntuakMax,
    e.ponderazioa AS ponderazioa,
    ep.idEpaimahaikidea,
    ep.username AS epaimahaikideaUsername
FROM txapelketa t
LEFT JOIN fasea f ON t.idTxapelketa = f.idTxapelketa
LEFT JOIN ezaugarria e ON f.idFasea = e.idFasea
LEFT JOIN epaimahaikidea ep ON f.idFasea = ep.idFasea
ORDER BY t.idTxapelketa, f.idFasea, e.idEzaugarria, ep.idEpaimahaikidea;
`
  try {
    const [results] = await dbConnection.query(sqlQuery);
    res.status(200).json(transformData(results));
  } catch (error) {
    //console.log(error);
    res.status(500).json({ error: 'Error retrieving data' });
  }

};


function transformData(data) {
  const txapelketakMap = new Map();

  data.forEach((row) => {
    
      if (!txapelketakMap.has(row.idTxapelketa)) {
          txapelketakMap.set(row.idTxapelketa, {
              idTxapelketa: row.idTxapelketa,
              txapelketaIzena: row.txapelketaIzena,
              txapelketaData: row.txapelketaData,
              txapelketaLekua: row.txapelketaLekua,
              faseak: []
          });
      }
      const txapelketa = txapelketakMap.get(row.idTxapelketa);

      
      if (!row.idFasea) return;

      let fase = txapelketa.faseak.find(f => f.idFasea === row.idFasea);
      if (!fase) {
          fase = {
              idFasea: row.idFasea,
              faseIzena: row.faseIzena,
              faseKodea: row.faseKodea,
              faseEgoera: row.faseEgoera,
              faseHasiera: row.faseHasiera,
              faseAmaiera: row.faseAmaiera,
              faseIrizpidea: row.faseIrizpidea,
              ezaugarriak: [],
              epaimahaikideak: []
          };
          txapelketa.faseak.push(fase);
      }

      
      if (row.idEzaugarria) {
          const ezaugarriaExists = fase.ezaugarriak.some(e => e.idEzaugarria === row.idEzaugarria);
          if (!ezaugarriaExists) {
              fase.ezaugarriak.push({
                  idEzaugarria: row.idEzaugarria,
                  ezaugarriaIzena: row.ezaugarriaIzena,
                  puntuakMin: row.puntuakMin,
                  puntuakMax: row.puntuakMax
                
              });
          }
      }

     
      if (row.idEpaimahaikidea) {
          const epaimahaikideaExists = fase.epaimahaikideak.some(ep => ep.idEpaimahaikidea === row.idEpaimahaikidea);
          if (!epaimahaikideaExists) {
              fase.epaimahaikideak.push({
                  idEpaimahaikidea: row.idEpaimahaikidea,
                  epaimahaikideaUsername: row.epaimahaikideaUsername
              });
          }
      }
  });

 
  return Array.from(txapelketakMap.values());
}

export async function getTxapelketarenInfoGuztia(req, res) {
  const idTxapelketa = parseInt(req.params.idTxapelketa);
  if (isNaN(idTxapelketa)) {
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }
  const sqlQuery = `SELECT 
    t.idTxapelketa, 
    t.izena AS txapelketaIzena, 
    t.dataOrdua AS txapelketaData, 
    t.lekua AS txapelketaLekua,
    f.idFasea, 
    f.izena AS faseIzena, 
    f.egoera AS faseEgoera, 
    f.hasiera AS faseHasiera, 
    f.amaiera AS faseAmaiera, 
    f.irizpidea AS faseIrizpidea,
    e.ponderazioa AS ponderazioa,
    e.idEzaugarria, 
    e.izena AS ezaugarriaIzena,
    em.idEpaimahaikidea, 
    em.username AS epaimahaikideaUsername
FROM txapelketa t
LEFT JOIN fasea f ON f.idTxapelketa = t.idTxapelketa
LEFT JOIN ezaugarria e ON e.idFasea = f.idFasea
LEFT JOIN epaimahaikidea em ON em.idFasea = f.idFasea
WHERE t.idTxapelketa = ?
ORDER BY f.idFasea, e.idEzaugarria, em.idEpaimahaikidea;

`
  try {
    const [results] = await dbConnection.query(sqlQuery, [idTxapelketa]);
    res.status(200).json(transformData(results));
  } catch (error) {
    //console.log(error);
    res.status(500).json({ error: 'Error retrieving data' });
  }

};


export const getTxapelketaAktiboa = async (req, res) => {
  
  const sqlQuery = `SELECT * FROM txapelketa_aktiboak WHERE idTxapelketa = 1`;

  try {
    const [results] = await dbConnection.query(sqlQuery);
    res.status(200).json(transformData(results));
  } catch (error) {
    //console.log(error);
    res.status(500).json({ error: 'Error retrieving data' });
  }

};

export const getTxapAktiboaFasEpaimahaikideakEzaugarriak = async (req, res) => {

  
  const sqlQuery = `SELECT 
  f.idFasea, 
  f.izena as faseIzena,
  f.irizpidea,
  f.egoera,
  f.hasiera,
  f.amaiera,
  
  e.idEzaugarria, 
  e.izena as ezaugarriIzena, 
  e.puntuakMin,
  e.puntuakMax,
  e.ponderazioa,
  ep.idEpaimahaikidea, 
  ep.username
FROM fasea f
LEFT JOIN ezaugarria e ON f.idFasea = e.idFasea
LEFT JOIN epaimahaikidea ep ON f.idFasea = ep.idFasea
LEFT JOIN txapelketa tx ON f.idTxapelketa = tx.idTxapelketa
WHERE tx.egoera = 1;
`;

  try {

    const [results] = await dbConnection.query(sqlQuery);
    
    if (results.length === 0) {
      res.status(404).json({ error: 'Epaimahaikideak ezaugarriak not found' });
    }

    else{
      res.status(200).json(results);}
  } catch (error) {
    //console.log(error);
    res.status(500).json({ error: 'Error retrieving data' });
  }

};
