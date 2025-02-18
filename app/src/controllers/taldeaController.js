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

export const getTaldeak = async (req, res) => {
  try {
    const [results] = await dbConnection.query("SELECT * FROM taldea");
    //addPrivateeNetworkHeaders(res);
    res.status(200).json(results);  
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'errorea taldeak eskuratzean' });
  }
};

export const createNewTaldea = async (req, res) => {
  const taldea = req.body;

  if (!taldea.izena || !taldea.email) {
    //addPrivateeNetworkHeaders(res);
    return res.status(400).json({
      ErrorCode: 204,
      Message: 'Fields cannot be empty'
    });
  }

  if (!taldea.telefonoa)
    taldea.telefonoa = null;

  if (!taldea.puntuakGuztira)
    taldea.puntuakGuztira = 0;

  const taldeaObj = [
    taldea.izena,
    taldea.email,
    taldea.telefonoa,
    taldea.puntuakGuztira,
    taldea.egoera
  ];

  const sqlQuery = 'INSERT INTO taldea (izena, email, telefonoa, puntuakGuztira, egoera) VALUES (?, ?, ?, ?, ?)';

  try {
    const [result] = await dbConnection.execute(sqlQuery, taldeaObj);
    const idTaldea = result.insertId;
    //addPrivateeNetworkHeaders(res);
    res.status(201).json({ idTaldea });
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'Error creating taldea' });
  }
};

export const getTaldea = async (req, res) => {
  const id = parseInt(req.params.idTaldea);
  
  if (isNaN(id)) {
    //addPrivateeNetworkHeaders(res);
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }

  const sqlQuery = `SELECT * FROM taldea WHERE idTaldea = ?`;

  try {
    const [results] = await dbConnection.query(sqlQuery, [id]);
    //addPrivateeNetworkHeaders(res);
    if (results.length === 0) {
      return res.status(404).json({ error: 'taldea not found' });
    }
    res.status(200).json(results);
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'Error retrieving data' });
  }
};

export const updateTaldea = async (req, res) => {
  const id = parseInt(req.body.idTaldea);
  const taldea = req.body;

  if (isNaN(id)) {
    //addPrivateeNetworkHeaders(res);
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }

  try {
    const taldeaObj = [
      taldea.izena,
      taldea.email,
      taldea.telefonoa,
      taldea.puntuakGuztira,
      taldea.egoera,
      id
    ];
    const sqlQuery = 'UPDATE taldea SET izena = ?, email = ?, telefonoa = ?, puntuakGuztira = ?, egoera = ? WHERE idTaldea = ?';
    await dbConnection.execute(sqlQuery, taldeaObj);
    //addPrivateeNetworkHeaders(res);
    res.status(200).json({ message: 'taldea updated' });
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'Error updating taldea' });
  }
};

export async function deleteTaldea(req, res) {
  const idTaldea = parseInt(req.body.idTaldea);
  if (isNaN(idTaldea)) {
    //addPrivateeNetworkHeaders(res);
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }
  const sqlQuery = 'DELETE FROM taldea WHERE idTaldea = ?';
  try {
    await dbConnection.execute(sqlQuery, [idTaldea]);
    //addPrivateeNetworkHeaders(res);
    res.status(200).json({ message: 'taldea deleted' });
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'Error deleting taldea' });
  }
}

export const getTaldearenEbaluazioak = async (req, res) => {
  const id = parseInt(req.params.idTaldea);
  
  if (isNaN(id)) {
    //addPrivateeNetworkHeaders(res);
    return res.status(400).json({ error: 'You must enter a valid id as a parameter' });
  }

  const sqlQuery = `SELECT * FROM ebaluazioa WHERE idTaldea = ?`;

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

// egoera = 0 baloratu gabe, =1, baloratuta, =2 deskalifikatuta
export const getBaloratuGabekoTaldeak = async (req, res) => {
  const idEpaimahaikidea = parseInt(req.params.idEpaimahaikidea);
  const sqlQuery = `SELECT t.*
FROM taldea t
LEFT JOIN ebaluazioa e 
    ON t.idTaldea = e.idTaldea AND e.idEpaimahaikidea = ?
WHERE t.egoera = 0
  AND e.idEbaluazioa IS NULL;
`;

  try {
    const [results] = await dbConnection.query(sqlQuery, idEpaimahaikidea);
    //addPrivateeNetworkHeaders(res);
    if (results.length === 0) {
      res.status(404).json({ error: 'Taldeak ez daude baloratu gabeko' });
    } else {
      res.status(200).json(results);
    }
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'Error retrieving data' });
  }
};

export const setTaldeenEgoera = async (req, res) => {
  const sqlQuery = `UPDATE taldea SET egoera = 0 WHERE egoera = 1;`;
  try {
    const [results] = await dbConnection.query(sqlQuery);
    //addPrivateeNetworkHeaders(res);
    if (results.length === 0) {
      res.status(404).json({ error: 'Talde guztiak deskalifikatuak izan dira' });
    } else {
      res.status(200).json(results);
    }
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'Error retrieving data' });
  }
};

export const getTaldeAktiboak = async (req, res) => {
  const sqlQuery = `SELECT t.* FROM taldea t WHERE t.egoera = 0 OR t.egoera = 1;`;
  try {
    const [results] = await dbConnection.query(sqlQuery);
    //addPrivateeNetworkHeaders(res);
    res.status(200).json(results);
  } catch (error) {
    //addPrivateeNetworkHeaders(res);
    res.status(500).json({ error: 'Error retrieving data' });
  }
};