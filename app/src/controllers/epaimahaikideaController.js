import dbConnection from '../database/database.js';

const addPrivateeeNetworkHeaders = (res) => {
          res.setHeader('Access-Control-Allow-Origin', 'https://pmartinez082.github.io'); // Allow only frontend
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Private-Network', 'true'); // Required for private network access
        res.setHeader('Private-Network-Access-Name', 'zerbitzaria');
        res.setHeader('Private-Network-Access-ID', '9A:BD:80:BE:EF:01');
        res.setHeader('Access-Control-Allow-Private-Network', 'true');
};

export const getEpaimahaikideak = async (req, res) => {
  try {
    const [results] = await dbConnection.query("SELECT * FROM epaimahaikidea");
    //addPrivateeNetworkHeaders(res);
    res.status(200).json(results);  
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'errorea epaimahaikidea eskuratzean' });
  }
};

export const getEpaimahaikidea = async (req, res) => {
  const id = parseInt(req.params.idEpaimahaikidea);
  
  if (isNaN(id)) {
    //addPrivateeNetworkHeaders(res);
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }

  const sqlQuery = `SELECT * FROM epaimahaikidea WHERE idEpaimahaikidea = ?`;

  try {
    const [results] = await dbConnection.query(sqlQuery, [id]);
    //addPrivateeNetworkHeaders(res);
    if (results.length === 0) {
      res.status(404).json({ error: 'Epaimahaikidea not found' });
    } else {
      res.status(200).json(results);
    }
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'Error retrieving data' });
  }
};

export const createNewEpaimahaikidea = async (req, res) => {
  const idFasea = req.body.idFasea;
  const username = req.body.username;

  if (!idFasea || !username) {
    //addPrivateeNetworkHeaders(res);
    return res.status(400).json({
      ErrorCode: 204,
      Message: 'Fields idFasea and username cannot be empty'
    });
  }

  try {
    const sqlQuery = `INSERT INTO epaimahaikidea (idFasea, username) VALUES (?, ?)`;
    const [result] = await dbConnection.execute(sqlQuery, [idFasea, username]);
    const idEpaimahaikidea = result.insertId;
    //addPrivateeNetworkHeaders(res);
    res.status(201).json({ idEpaimahaikidea });
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'Error creating epaimahaikidea' });
  }
};

export const booleanEzaugarriaExists = async (req) => {
  const idFasea = parseInt(req.body.idFasea);
  const idEzaugarria = parseInt(req.body.idEzaugarria);
  
  try {
    const [results] = await dbConnection.query("SELECT * FROM ezaugarria WHERE idEzaugarria = ? and idFasea = ?", [idEzaugarria, idFasea]);
    return results.length > 0;
  } catch (error) {
    //console.log(error);
    return false;
  }
};

export const booleanFaseaExists = async (req) => {
  const idTxapelketa = parseInt(req.body.idTxapelketa);
  const idFasea = parseInt(req.body.idFasea);
  
  try {
    const [results] = await dbConnection.query("SELECT * FROM fasea WHERE idFasea = ? and idTxapelketa = ?", [idFasea, idTxapelketa]);
    return results.length > 0;
  } catch (error) {
    //console.log(error);
    return false;
  }
};

export const booleanEpaimahaikideaExists = async (req) => {
  const idFasea = parseInt(req.body.idFasea);
  const idEpaimahaikidea = parseInt(req.body.idEpaimahaikidea);
  
  try {
    const [results] = await dbConnection.query("SELECT * FROM epaimahaikidea WHERE idFasea = ? and idEpaimahaikidea = ?", [idFasea, idEpaimahaikidea]);
    return results.length > 0;
  } catch (error) {
    //console.log(error);
    return false;
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
  
  if (isNaN(idEpaimahaikidea)) {
    //addPrivateeNetworkHeaders(res);
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }

  try {
    const sqlQuery = `UPDATE epaimahaikidea SET username = ?, idFasea = ? WHERE idEpaimahaikidea = ?`;
    await dbConnection.execute(sqlQuery, epaimahaikideaObj);
    //addPrivateeNetworkHeaders(res);
    res.status(200).json({ message: 'epaimahaikidea updated' });
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'Error updating epaimahaikidea' });
  }
};

export const deleteEpaimahaikidea = async (req, res) => {
  const idEpaimahaikidea = parseInt(req.body.idEpaimahaikidea);
  
  if (isNaN(idEpaimahaikidea)) {
    //addPrivateeNetworkHeaders(res);
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }

  try {
    const sqlQuery = 'DELETE FROM epaimahaikidea WHERE idEpaimahaikidea = ?';
    await dbConnection.execute(sqlQuery, [idEpaimahaikidea]);
    //addPrivateeNetworkHeaders(res);
    res.status(200).json({ message: 'epaimahaikidea deleted' });
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'Error deleting epaimahaikidea' });
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
    //addPrivateeNetworkHeaders(res);
    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      res.status(200).json([{ idEpaimahaikidea: 0 }]); // Respuesta consistente
    }
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'Error retrieving data' });
  }
};