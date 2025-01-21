
import dbConnection from '../database/database.js';
export const getEbaluazioak = async (req, res) => {
  try {
    
    const [results] = await dbConnection.query("SELECT * FROM ebaluazioa");
    res.status(200).json(results);  
  } catch (error) {
    //console.log(error); 
    res.status(500).json({ error: 'errorea ebaluazioak eskuratzean' });    }
};

export const getEbaluazioa = async (req, res) => {
  const id = parseInt(req.params.idEbaluazioa);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }

  const sqlQuery = `SELECT * FROM ebaluazioa WHERE idEbaluazioa = ?`;

  try {

    const [results] = await dbConnection.query(sqlQuery, [id]);
    
    if (results.length === 0) {
      res.status(404).json({ error: 'Ebaluazioa not found' });
    }

    else{
      res.status(200).json(results);}
  } catch (error) {
    //console.log(error);
    res.status(500).json({ error: 'Error retrieving data' });
  }
};


export const createNewEbaluazioa = async (req, res) => {
    const ebaluazioa = req.body;
    ebaluazioa.noiz = new Date();
   
    if (!ebaluazioa.idEpaimahaikidea || !ebaluazioa.idEzaugarria || !ebaluazioa.idTaldea || !ebaluazioa.puntuak ||!ebaluazioa.noiz) {
      return res.status(400).json({
        ErrorCode: 204,
        Message: 'Fields cannot be empty'
      });
    }
  
    const ebaluazioaObj = [
      ebaluazioa.idEpaimahaikidea,
      ebaluazioa.idEzaugarria,
      ebaluazioa.idTaldea,
      ebaluazioa.puntuak,
      ebaluazioa.noiz
    ];
  
    try {
      

         
        const sqlQuery = 'INSERT INTO ebaluazioa (idEpaimahaikidea, idEzaugarria, idTaldea, puntuak, noiz) VALUES (?, ?, ?, ?, ?)';
        const [result] = await dbConnection.execute(sqlQuery, ebaluazioaObj);
        const idEbaluazioa = result.insertId;
        res.status(201).json({ idEbaluazioa });
    } catch (error) {
      //console.log(error);
      res.status(500).json({ error: 'Error creating ebaluazioa' });
    }
  };
  
  
  
  
  export const getEpailearenEbaluazioakFaseka = async (req, res) => {
    const idEpaimahaikidea = parseInt(req.params.idEpaimahaikidea);
    if(!idEpaimahaikidea){
      res.status(400).json({
        error: 'Fields cannot be empty'
        }); 

    }

    
    
    if (isNaN(idEpaimahaikidea)) {
      return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
    }
  
    const sqlQuery = `SELECT * FROM ebaluazioa WHERE idEpaimahaikidea = ?`;
  
    try {
  
      const [results] = await dbConnection.query(sqlQuery, [idEpaimahaikidea]);
      
      if (results.length === 0) {
        res.status(200).json([]);
      }
  
      else{
        res.status(200).json(results);}
    } catch (error) {
      //console.log(error);
      res.status(500).json({ error: 'Error retrieving data' });
    }
  
  };
  


  export const updateEbaluazioa = async (req, res) => {
    const idEbaluazioa = parseInt(req.body.idEbaluazioa);
    const ebaluazioa = req.body;
    const ebaluazioaObj = [
      ebaluazioa.idEpaimahaikidea,
      ebaluazioa.idEzaugarria,
      ebaluazioa.idTaldea,
      ebaluazioa.puntuak,
      ebaluazioa.noiz,
      idEbaluazioa
    ];
    if(isNaN(idEbaluazioa)){
      return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
    }
    try {
      const sqlQuery = `UPDATE ebaluazioa SET idEpaimahaikidea = ?, idEzaugarria = ?, idTaldea = ?, puntuak = ?, noiz = ? WHERE idEbaluazioa = ?`;
      await dbConnection.execute(sqlQuery, ebaluazioaObj);
      res.status(200).json({ message: 'ebaluazioa updated' });
    } catch (error) {
      //console.log(error);
      res.status(500).json({ error: 'Error updating ebaluazioa' });
    }
  };

  export const deleteEbaluazioa = async (req, res) => {
    const idEbaluazioa = parseInt(req.body.idEbaluazioa);
    if (isNaN(idEbaluazioa)) {
      return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
    }
    try {
      const sqlQuery = 'DELETE FROM ebaluazioa WHERE idEbaluazioa = ?';
      await dbConnection.execute(sqlQuery, [idEbaluazioa]);
      res.status(200).json({ message: 'ebaluazioa deleted' });
    } catch (error) {
      //console.log(error);
    }
  };

  
  export const EbaluazioaExists = async (req, res) => {
    const data = req.body;
    const sqlQuery = `SELECT * FROM ebaluazioa WHERE idEpaimahaikidea = ? and idEzaugarria = ? and idTaldea = ?`;
    try {
      const [results] = await dbConnection.query(sqlQuery, [data.idEpaimahaikidea, data.idEzaugarria, data.idTaldea]);
      if(results.length > 0)
        res.status(200).json(true);
      else
        res.status(200).json(false);
  

    } catch (error) {
      //console.log(error); 
      res.status(500).json({ error: 'errorea' });    }
  };


  export const getFaseAktiboarenEbaluazioak = async (req, res) => {
    const sqlQuery = `SELECT 
    eb.*, 
    t.izena AS taldeaIzena, 
    e.izena AS ezaugarriaIzena,
    f.izena AS faseaIzena,
    ep.username
FROM 
    ebaluazioa eb
JOIN 
    epaimahaikidea ep ON eb.idEpaimahaikidea = ep.idEpaimahaikidea
JOIN 
    fasea f ON ep.idFasea = f.idFasea
LEFT JOIN 
    taldea t ON eb.idTaldea = t.idTaldea
LEFT JOIN 
    ezaugarria e ON eb.idEzaugarria = e.idEzaugarria
WHERE 
    f.egoera = 1;
`;
    try{
      const [results] = await dbConnection.query(sqlQuery);
      if(results.length > 0)
        res.status(200).json(results);
      else
        res.status(200).json([]);
  
        }
        catch(err){
          res.status(500).json({message: err.message})
        }
  
  
  
  };


  export const getFasearenEbaluazioak = async (req, res) => {
    const idFasea = req.params.idFasea;
    const sqlQuery = `SELECT 
    eb.*, 
    t.izena AS taldeaIzena, 
    e.izena AS ezaugarriaIzena,
    f.izena AS faseaIzena,
    ep.username
FROM 
    ebaluazioa eb
JOIN 
    epaimahaikidea ep ON eb.idEpaimahaikidea = ep.idEpaimahaikidea
JOIN 
    fasea f ON ep.idFasea = f.idFasea
LEFT JOIN 
    taldea t ON eb.idTaldea = t.idTaldea
LEFT JOIN 
    ezaugarria e ON eb.idEzaugarria = e.idEzaugarria
WHERE 
    f.idFasea = ?
ORDER BY
e.idEzaugarria, t.idTaldea, eb.idEpaimahaikidea;
`;
    try{
      const [results] = await dbConnection.query(sqlQuery, idFasea);
      if(results.length > 0)
        res.status(200).json(results);
      else
        res.status(200).json([]);
  
        }
        catch(err){
          res.status(500).json({message: err.message})
        }

  }