
import dbConnection from '../database/database.js';
export const getEpaimahaikideak = async (req, res) => {
  try {
    
    const [results] = await dbConnection.query("SELECT * FROM epaimahaikidea");
    res.status(200).json(results);  
  } catch (error) {
    //console.log(error); 
    res.status(500).json({ error: 'errorea epaimahaikidea eskuratzean' });    }
};


export const getEpaimahaikidea = async (req, res) => {
  const id = parseInt(req.params.idEpaimahaikidea);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }

  const sqlQuery = `SELECT * FROM epaimahaikidea WHERE idEpaimahaikidea = ?`;

  try {

    const [results] = await dbConnection.query(sqlQuery, [id]);
    
    if (results.length === 0) {
      res.status(404).json({ error: 'Epaimahaikidea not found' });
    }

    else{
      res.status(200).json(results);}
  } catch (error) {
    //console.log(error);
    res.status(500).json({ error: 'Error retrieving data' });
  }
};

  
export const createNewEpaimahaikidea = async (req, res) => {
  const idFasea = req.body.idFasea;
  const username = req.body.username;


  if (!idFasea || !username) {
    return res.status(400).json({
      ErrorCode: 204,
      Message: 'Fields idFasea and username cannot be empty'
    });
  }

  try {
    
      const sqlQuery = `INSERT INTO epaimahaikidea (idFasea, username) VALUES (?, ?)`;
      const [result] = await dbConnection.execute(sqlQuery, [idFasea, username]);
      const idEpaimahaikidea = result.insertId;
      res.status(201).json({ idEpaimahaikidea });

  } catch (error) {

    res.status(500).json({ error: 'Error creating epaimahaikidea' });
  }
};


export const booleanEzaugarriaExists = async (req) => {

  const idFasea = parseInt(req.body.idFasea)
  const idEzaugarria = parseInt(req.body.idEzaugarria);
  
  try{
      const [results] = await dbConnection.query("SELECT * FROM ezaugarria WHERE idEzaugarria = ? and idFasea = ?", [idEzaugarria, idFasea]);
      if(results.length > 0){
       
        return true;}
      else{
        
        return false;
        }
  } catch (error) {
    //console.log(error);
    
  }
};



export const booleanFaseaExists = async (req) => {
  const idTxapelketa = parseInt(req.body.idTxapelketa);
  const idFasea = parseInt(req.body.idFasea);
  try{
      const [results] = await dbConnection.query("SELECT * FROM fasea WHERE idFasea = ? and idTxapelketa = ?", [idFasea, idTxapelketa]);
      if(results.length > 0)
        return true;
      else
        return false;
  } catch (error) {
    //console.log(error);
    
  }
};

export const booleanEpaimahaikideaExists = async (req) => {

  
  const idFasea = parseInt(req.body.idFasea);
  const idEpaimahaikidea = parseInt(req.body.idEpaimahaikidea);
  try{
      const [results] = await dbConnection.query("SELECT * FROM epaimahaikidea WHERE idFasea = ? and idEpaimahaikidea = ?", [idFasea, idEpaimahaikidea]);
      if(results.length > 0)
        return true;
      else
        return false;
  } catch (error) {
    //console.log(error);
    
  }
};

export const updateEpaimahaikidea = async (req, res) => {
  const idEpaimahaikidea = parseInt(req.body.idEpaimahaikidea);
  const epaimahaikidea = req.body;
  const epaimahaikideaObj = [
    epaimahaikidea.username,
    epaimahaikidea.idFasea,
    idEpaimahaikidea
  ];
  if(isNaN(idEpaimahaikidea)){
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }
  try {
    const sqlQuery = `UPDATE epaimahaikidea SET username = ?, idFasea = ? WHERE idEpaimahaikidea = ?`;
    await dbConnection.execute(sqlQuery, epaimahaikideaObj);
    res.status(200).json({ message: 'epaimahaikidea updated' });
  } catch (error) {
    //console.log(error);
    res.status(500).json({ error: 'Error updating epaimahaikidea' });
  }
};

export const deleteEpaimahaikidea = async (req, res) => {
  const idEpaimahaikidea = parseInt(req.body.idEpaimahaikidea);
  if (isNaN(idEpaimahaikidea)) {
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }
  try {
    const sqlQuery = 'DELETE FROM epaimahaikidea WHERE idEpaimahaikidea = ?';
    await dbConnection.execute(sqlQuery, [idEpaimahaikidea]);
    res.status(200).json({ message: 'epaimahaikidea deleted' });
  } catch (error) {
    //console.log(error);
  }
};

export const getEpailearenEpaimahaiak = async (req, res) => {
  const info = req.body;
  const infoObj = [
    info.username,
    parseInt(info.idFasea)
  ];
  try {
    const sqlQuery = `SELECT * FROM epaimahaikidea WHERE username = ? AND idFasea = ?`;
    const [results] = await dbConnection.query(sqlQuery, infoObj);
    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      res.status(200).json([{ idEpaimahaikidea: 0 }]); // Respuesta consistente
    }
  } catch (error) {
    //console.log(error);
    res.status(500).json({ error: 'Error retrieving data' });
  }
};
