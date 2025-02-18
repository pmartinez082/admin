import dbConnection from '../database/database.js';

const addPrivateNetworkHeaders = (res) => {
        res.setHeader('Access-Control-Allow-Origin', 'https://pmartinez082.github.io'); // Allow only frontend
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Private-Network', 'true'); // Required for private network access
        res.setHeader('Private-Network-Access-Name', 'zerbitzaria');
        res.setHeader('Private-Network-Access-ID', '9A:BD:80:BE:EF:01');
        res.setHeader('Access-Control-Allow-Private-Network', 'true');
};

export const getEzaugarriak = async (req, res) => {
  try {
    const [results] = await dbConnection.query("SELECT * FROM ezaugarria");
    //addPrivateeNetworkHeaders(res);
    res.status(200).json(results);  
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'errorea ezaugarria eskuratzean' });
  }
};

export const getEzaugarria = async (req, res) => {
  const id = parseInt(req.params.idEzaugarria);
  
  if (isNaN(id)) {
    //addPrivateeNetworkHeaders(res);
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }

  const sqlQuery = `SELECT * FROM ezaugarria WHERE idEzaugarria = ?`;

  try {
    const [results] = await dbConnection.query(sqlQuery, id);
    //addPrivateeNetworkHeaders(res);
    if (results.length === 0) {
      res.status(404).json({ error: 'Ezaugarria not found' });
    } else {
      res.status(200).json(results);
    }
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'Error retrieving data' });
  }
};

export const createNewEzaugarria = async (req, res) => {
  const ezaugarria = req.body;

  if (!ezaugarria.izena || !ezaugarria.puntuakMax || !ezaugarria.puntuakMin || !ezaugarria.idFasea) {
    //addPrivateeNetworkHeaders(res);
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
    //addPrivateeNetworkHeaders(res);
    res.status(201).json({ idEzaugarria });
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
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
  if (isNaN(idEzaugarria)) {
    //addPrivateeNetworkHeaders(res);
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }
  try {
    const sqlQuery = `UPDATE ezaugarria SET izena = ?, puntuakMin = ?, puntuakMax = ?, ponderazioa = ? WHERE idEzaugarria = ?`;
    await dbConnection.execute(sqlQuery, ezaugarriaObj);
    //addPrivateeNetworkHeaders(res);
    res.status(200).json({ message: 'ezaugarria updated' });
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'Error updating ezaugarria' });
  }
};

export const deleteEzaugarria = async (req, res) => {
  const idEzaugarria = parseInt(req.body.idEzaugarria);
  if (isNaN(idEzaugarria)) {
    //addPrivateeNetworkHeaders(res);
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }
  try {
    const sqlQuery = 'DELETE FROM ezaugarria WHERE idEzaugarria = ?';
    await dbConnection.execute(sqlQuery, [idEzaugarria]);
    //addPrivateeNetworkHeaders(res);
    res.status(200).json({ message: 'ezaugarria deleted' });
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'Error deleting ezaugarria' });
  }
};