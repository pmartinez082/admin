

import dbConnection from '../database/database.js';
export const getEzaugarriak = async (req, res) => {
  try {
    
    const [results] = await dbConnection.query("SELECT * FROM ezaugarria");
    res.status(200).json(results);  
  } catch (error) {
    //console.log(error); 
    res.status(500).json({ error: 'errorea ezaugarria eskuratzean' });    }
};

export const getEzaugarria = async (req, res) => {
  const id = parseInt(req.params.idEzaugarria);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }

  const sqlQuery = `SELECT * FROM ezaugarria WHERE idEzaugarria = ?`;

  try {

    const [results] = await dbConnection.query(sqlQuery, id);
    
    if (results.length === 0) {
      res.status(404).json({ error: 'Ezaugarria not found' });
    }

    else{
      res.status(200).json(results);}
  } catch (error) {
    //console.log(error);
    res.status(500).json({ error: 'Error retrieving data' });
  }
};


export const createNewEzaugarria = async (req, res) => {
  const ezaugarria = req.body;

 
  if (!ezaugarria.izena || !ezaugarria.puntuakMax || !ezaugarria.puntuakMin || !ezaugarria.idFasea) {
    return res.status(400).json({
      ErrorCode: 204,
      Message: 'Fields cannot be empty'
    });
  }

  const ezaugarriaObj = [
   ezaugarria.izena,
   ezaugarria.puntuakMin,
   ezaugarria.puntuakMax,
   ezaugarria.idFasea,
   ezaugarria.ponderazioa
   
   
  ];

  const sqlQuery = 'INSERT INTO ezaugarria (izena, puntuakMin, puntuakMax, idFasea, ponderazioa) VALUES (?, ?, ?, ?, ?)';

  try {

    const [result] = await dbConnection.execute(sqlQuery, ezaugarriaObj);
    
    const idEzaugarria = result.insertId;
    res.status(201).json({idEzaugarria});
  } catch (error) {
    //console.log(error);
    res.status(500).json({ error: 'Error creating ezaugarria' });
  }
};

export const updateEzaugarria = async (req, res) => {
  const idEzaugarria = parseInt(req.body.idEzaugarria);
  const ezaugarria = req.body;
  const ezaugarriaObj = [
    ezaugarria.izena,
    ezaugarria.puntuakMin,
    ezaugarria.puntuakMax,
    ezaugarria.ponderazioa,
    idEzaugarria
  ];
  if(isNaN(idEzaugarria)){
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }
  try {
    const sqlQuery = `UPDATE ezaugarria SET izena = ?, puntuakMin = ?, puntuakMax = ?, ponderazioa = ? WHERE idEzaugarria = ?`;
    await dbConnection.execute(sqlQuery, ezaugarriaObj);
    res.status(200).json({ message: 'ezaugarria updated' });
  } catch (error) {
    //console.log(error);
    res.status(500).json({ error: 'Error updating ezaugarria' });
  }
};

export const deleteEzaugarria = async (req, res) => {
  const idEzaugarria = parseInt(req.body.idEzaugarria);
  if (isNaN(idEzaugarria)) {
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }
  try {
    const sqlQuery = 'DELETE FROM ezaugarria WHERE idEzaugarria = ?';
    await dbConnection.execute(sqlQuery, [idEzaugarria]);
    res.status(200).json({ message: 'ezaugarria deleted' });
  } catch (error) {
    //console.log(error);
  }
};
