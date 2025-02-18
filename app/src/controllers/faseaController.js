import dbConnection from '../database/database.js';

const addPrivateeNetworkHeaders = (res) => {
          res.setHeader('Access-Control-Allow-Origin', 'https://pmartinez082.github.io'); // Allow only frontend
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Private-Network', 'true'); // Required for private network access
        res.setHeader('Private-Network-Access-Name', 'zerbitzaria');
        res.setHeader('Private-Network-Access-ID', '9A:BD:80:BE:EF:01');
        res.setHeader('Access-Control-Allow-Private-Network', 'true');
};

export const getFaseak = async (req, res) => {
  try {
    const [results] = await dbConnection.query("SELECT * FROM fasea");
    //addPrivateeNetworkHeaders(res);
    res.status(200).json(results);  
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'errorea faseak eskuratzean' });
  }
};

export const getFasea = async (req, res) => {
  const idFasea = parseInt(req.params.idFasea);
  if (isNaN(idFasea)) {
    //addPrivateeNetworkHeaders(res);
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }
  try {
    const [results] = await dbConnection.query("SELECT * FROM fasea WHERE idFasea = ?", [idFasea]);
    //addPrivateeNetworkHeaders(res);
    if (results.length > 0)
      res.status(200).json(results);
    else
      res.status(200).json(false);
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'errorea' });
  }
};

export const faseaExists = async (req, res) => {
  const idTxapelketa = parseInt(req.params.idTxapelketa);
  const idFasea = parseInt(req.params.idFasea);
  if (isNaN(idTxapelketa) || isNaN(idFasea)) {
    //addPrivateeNetworkHeaders(res);
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }
  try {
    const [results] = await dbConnection.query("SELECT * FROM fasea WHERE idFasea = ? and idTxapelketa = ?", [idFasea, idTxapelketa]);
    //addPrivateeNetworkHeaders(res);
    if (results.length > 0)
      res.status(200).json(results);
    else
      res.status(200).json(false);
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'errorea' });
  }
};

export const createNewFasea = async (req, res) => {
  const fasea = req.body;
  if (!fasea.hasiera)
    fasea.hasiera = null;
  if (!fasea.amaiera)
    fasea.amaiera = null;

  if (!fasea.izena || !fasea.egoera || !fasea.irizpidea || !fasea.idTxapelketa) {
    //addPrivateeNetworkHeaders(res);
    return res.status(400).json({
      ErrorCode: 204,
      Message: 'Fields cannot be empty'
    });
  }

  const faseaObj = [
    fasea.idTxapelketa,
    fasea.izena,
    fasea.egoera,
    fasea.hasiera,
    fasea.amaiera,
    fasea.irizpidea
  ];

  const sqlQuery = 'INSERT INTO fasea (idTxapelketa, izena, egoera, hasiera, amaiera, irizpidea) VALUES (?, ?, ?, ?, ?, ?)';

  try {
    const [result] = await dbConnection.execute(sqlQuery, faseaObj);
    const idFasea = result.insertId;
    //addPrivateeNetworkHeaders(res);
    res.status(201).json({ idFasea });
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'Error creating fasea' });
  }
};

export const updateFasea = async (req, res) => {
  const fasea = req.body;
  const idFasea = parseInt(req.body.idFasea);
  if (isNaN(idFasea)) {
    //addPrivateeNetworkHeaders(res);
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }
  try {
    const faseaObj = [
      parseInt(fasea.idTxapelketa),
      fasea.izena,
      fasea.egoera,
      fasea.hasiera,
      fasea.amaiera,
      fasea.irizpidea,
      idFasea
    ];
    const sqlQuery = 'UPDATE fasea SET idTxapelketa = ?, izena = ?, egoera = ?, hasiera = ?, amaiera = ?, irizpidea = ? WHERE idFasea = ?';
    await dbConnection.execute(sqlQuery, faseaObj);
    //addPrivateeNetworkHeaders(res);
    res.status(200).json({ message: 'fasea updated' });
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'An internal server error occurred', details: error.message });
  }
};

export const deleteFasea = async (req, res) => {
  const idFasea = parseInt(req.body.idFasea);
  if (isNaN(idFasea)) {
    //addPrivateeNetworkHeaders(res);
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }
  try {
    const sqlQuery = 'DELETE FROM fasea WHERE idFasea = ?';
    await dbConnection.execute(sqlQuery, [idFasea]);
    //addPrivateeNetworkHeaders(res);
    res.status(200).json({ message: 'fasea deleted' });
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'Error deleting fasea' });
  }
};

export const getfasearenEbaluazioak = async (req, res) => {
  const id = parseInt(req.params.idFasea);
  
  if (isNaN(id)) {
    //addPrivateeNetworkHeaders(res);
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }

  const sqlQuery = `SELECT e.* FROM ebaluazioa e JOIN epaimahaikidea ep ON e.idEpaimahaikidea = ep.idEpaimahaikidea WHERE ep.idFasea = ?;`;

  try {
    const [results] = await dbConnection.query(sqlQuery, [id]);
    //addPrivateeNetworkHeaders(res);
    if (results.length === 0) {
      res.status(404).json({ error: 'Epailearen ebaluazioak not found' });
    } else {
      res.status(200).json(results);
    }
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'Error retrieving data' });
  }
};

export const getFasearenEzaugarriak = async (req, res) => {
  const id = parseInt(req.params.idFasea);
  
  if (isNaN(id)) {
    //addPrivateeNetworkHeaders(res);
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }

  const sqlQuery = `SELECT e.* FROM ezaugarria e JOIN fasea f ON e.idFasea = f.idFasea WHERE f.idFasea = ?;`;

  try {
    const [results] = await dbConnection.query(sqlQuery, [id]);
    //addPrivateeNetworkHeaders(res);
    if (results.length === 0) {
      res.status(404).json({ error: 'Fasearen ezaugarriak not found' });
    } else {
      res.status(200).json(results);
    }
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'Error retrieving data' });
  }
};

export const getFaseAktiboa = async (req, res) => {
  const sqlQuery = `SELECT * FROM fasea WHERE egoera = 1;`;

  try {
    const [results] = await dbConnection.query(sqlQuery);
    //addPrivateeNetworkHeaders(res);
    if (results.length === 0) {
      res.status(404).json({ error: 'Fasea not found' });
    } else {
      res.status(200).json(results);
    }
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'Error retrieving data' });
  }
};

export const getAmaituGabekoFaseak = async (req, res) => {
  const sqlQuery = `SELECT * FROM fasea WHERE egoera = 0 OR egoera = 1;`;

  try {
    const [results] = await dbConnection.query(sqlQuery);
    //addPrivateeNetworkHeaders(res);
    if (results.length === 0) {
      res.status(404).json({ error: 'Fasea not found' });
    } else {
      res.status(200).json(results);
    }
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'Error retrieving data' });
  }
};

export const egoeraAldatu = async (req, res) => {
  const fasea = req.body;
  if (isNaN(fasea.idFasea)) {
    //addPrivateeNetworkHeaders(res);
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }
  try {
    const faseaObj = [
      fasea.egoera,
      fasea.data,
      fasea.idFasea
    ];
    let sqlQuery = "";
    if (fasea.egoera === "1") {
      sqlQuery = 'UPDATE fasea SET egoera = ?, hasiera = ? WHERE idFasea = ?';
    } else {
      sqlQuery = 'UPDATE fasea SET egoera = ?, amaiera = ? WHERE idFasea = ?';
    }
    await dbConnection.execute(sqlQuery, faseaObj);
    //addPrivateeNetworkHeaders(res);
    res.status(200).json({ message: 'fasea updated' });
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'An internal server error occurred', details: error.message });
  }
};