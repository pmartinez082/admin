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

export const getEbaluazioak = async (req, res) => {
  try {
    const [results] = await dbConnection.query("SELECT * FROM ebaluazioa");
    //addPrivateeNetworkHeaders(res);
    res.status(200).json(results);  
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'errorea ebaluazioak eskuratzean' });
  }
};

export const getEbaluazioa = async (req, res) => {
  const id = parseInt(req.params.idEbaluazioa);
  
  if (isNaN(id)) {
    //addPrivateeNetworkHeaders(res);
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }

  const sqlQuery = `SELECT * FROM ebaluazioa WHERE idEbaluazioa = ?`;

  try {
    const [results] = await dbConnection.query(sqlQuery, [id]);
    //addPrivateeNetworkHeaders(res);
    if (results.length === 0) {
      res.status(404).json({ error: 'Ebaluazioa not found' });
    } else {
      res.status(200).json(results);
    }
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'Error retrieving data' });
  }
};

export const createNewEbaluazioa = async (req, res) => {
  const ebaluazioa = req.body;
  ebaluazioa.noiz = new Date();
   
  if (!ebaluazioa.idEpaimahaikidea || !ebaluazioa.idEzaugarria || !ebaluazioa.idTaldea || !ebaluazioa.puntuak || !ebaluazioa.noiz) {
    //addPrivateeNetworkHeaders(res);
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
    //addPrivateeNetworkHeaders(res);
    res.status(201).json({ idEbaluazioa });
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'Error creating ebaluazioa' });
  }
};

// Aplica cambios similares a las demás funciones exportadas en el archivo

export const getEpailearenEbaluazioakFaseka = async (req, res) => {
  const idEpaimahaikidea = parseInt(req.params.idEpaimahaikidea);
  if (!idEpaimahaikidea) {
    //addPrivateeNetworkHeaders(res);
    res.status(400).json({ error: 'Fields cannot be empty' });
  }

  if (isNaN(idEpaimahaikidea)) {
    //addPrivateeNetworkHeaders(res);
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }

  const sqlQuery = `SELECT * FROM ebaluazioa WHERE idEpaimahaikidea = ?`;

  try {
    const [results] = await dbConnection.query(sqlQuery, [idEpaimahaikidea]);
    //addPrivateeNetworkHeaders(res);
    if (results.length === 0) {
      res.status(200).json([]);
    } else {
      res.status(200).json(results);
    }
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
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
  if (isNaN(idEbaluazioa)) {
    //addPrivateeNetworkHeaders(res);
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }
  try {
    const sqlQuery = `UPDATE ebaluazioa SET idEpaimahaikidea = ?, idEzaugarria = ?, idTaldea = ?, puntuak = ?, noiz = ? WHERE idEbaluazioa = ?`;
    await dbConnection.execute(sqlQuery, ebaluazioaObj);
    //addPrivateeNetworkHeaders(res);
    res.status(200).json({ message: 'ebaluazioa updated' });
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'Error updating ebaluazioa' });
  }
};

export const deleteEbaluazioa = async (req, res) => {
  const idEbaluazioa = parseInt(req.body.idEbaluazioa);
  if (isNaN(idEbaluazioa)) {
    //addPrivateeNetworkHeaders(res);
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }
  try {
    const sqlQuery = 'DELETE FROM ebaluazioa WHERE idEbaluazioa = ?';
    await dbConnection.execute(sqlQuery, [idEbaluazioa]);
    //addPrivateeNetworkHeaders(res);
    res.status(200).json({ message: 'ebaluazioa deleted' });
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'Error deleting ebaluazioa' });
  }
};

export const EbaluazioaExists = async (req, res) => {
  const data = req.body;
  const sqlQuery = `SELECT * FROM ebaluazioa WHERE idEpaimahaikidea = ? and idEzaugarria = ? and idTaldea = ?`;
  try {
    const [results] = await dbConnection.query(sqlQuery, [data.idEpaimahaikidea, data.idEzaugarria, data.idTaldea]);
    //addPrivateeNetworkHeaders(res);
    if (results.length > 0)
      res.status(200).json(true);
    else
      res.status(200).json(false);
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'errorea' });
  }
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
  try {
    const [results] = await dbConnection.query(sqlQuery);
    //addPrivateeNetworkHeaders(res);
    if (results.length > 0)
      res.status(200).json(results);
    else
      res.status(200).json([]);
  } catch (err) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ message: err.message });
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
  try {
    const [results] = await dbConnection.query(sqlQuery, idFasea);
    //addPrivateeNetworkHeaders(res);
    if (results.length > 0)
      res.status(200).json(results);
    else
      res.status(200).json([]);
  } catch (err) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ message: err.message });
  }
};