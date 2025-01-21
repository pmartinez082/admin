


import dbConnection from '../database/database.js';
import jwt from 'jsonwebtoken';

export const getUsers = async (req, res) => {
    try {
      
      const [results] = await dbConnection.query("SELECT * FROM user");
      res.status(200).json(results);  
    } catch (error) {
      //console.log(error); 
      res.status(500).json({ error: 'errorea erabiltzaileak eskuratzean' });    }
  };

export const getUser = async (req, res) => {
  const username = req.params.username;
  
  try {
    const [results] = await dbConnection.query("SELECT * FROM user WHERE username = ?", [username]);
    if(results.length === 0)
      res.status(404).json({ error: 'User not found' });
    else
      res.status(200).json(results);
  } catch (error) {
    //console.log(error);
    res.status(500).json({ error: 'Error retrieving data' });
  }
};


export const getReferees = async (req, res) => {
    try {
      
        const [results] = await dbConnection.query("SELECT * FROM user WHERE role = ?", ['referee']);
        res.status(200).json(results);  
      } catch (error) {
        //console.log(error); 
        res.status(500).json({ error: 'errorea epaileak eskuratzean' });    }
    };
  
export const createNewUser = async (req, res) => {
        const user = req.body;
      
       
        if (!user.username || !user.email || !user.password || !user.role) {
          return res.status(400).json({
            ErrorCode: 204,
            Message: 'Fields cannot be empty'
          });
        }
      
        const userObj = [
         user.username,
         user.email,
         user.password,
         user.role
        ];
      
        const sqlQuery = 'INSERT INTO user (username, email, password, role) VALUES (?, ?, ?, ?)';
      
        try {

          const [result] = await dbConnection.execute(sqlQuery, userObj);
          
          const token = jwt.sign({ username: user.username }, 'token', { expiresIn: '1h' });
          res.json({ success: true, token });
        } catch (error) {
          //console.log(error);
          res.status(500).json({ error: 'Error creating user' });
        }
      };

export const updateUser = async (req, res) => {
;
  const user = req.body;
  const userObj = [
   
    user.email,
    user.password,
    user.role,
   user.username,
  ];

  try {
    const sqlQuery = `UPDATE user SET  email = ?, password = ?, role = ? WHERE username = ?`;
    await dbConnection.execute(sqlQuery, userObj);
    res.status(200).json({ message: 'user updated' });
  } catch (error) {
    //console.log(error);
    res.status(500).json({ error: 'Error updating user' });
  }
};  

export const deleteUser = async (req, res) => {

  const username = req.body.username;
  try {
    const sqlQuery = 'DELETE FROM user WHERE username = ?';
    await dbConnection.execute(sqlQuery, [username]);
    
    res.status(200).json({ message: 'user deleted' });

  } catch (error) {
    //console.log(error);  
     }
};

export const verifyUser = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const sqlQuery = 'SELECT * FROM user WHERE username = ? AND password = ?';
    const [results] = await dbConnection.query(sqlQuery, [username, password]);
    if (results.length === 0) {
      res.status(401).json({ error: 'Invalid username or password' });
    } else {
      const token = jwt.sign({ username }, 'token', { expiresIn: '1h' });
      res.json({ success: true, token });
    }
  } catch (error) {
    //console.log(error);
    res.status(500).json(false);
  }
};

export const findUser = async (req, res) => {
  const username = req.body.username;

  try {
    const sqlQuery = 'SELECT * FROM user WHERE username = ?';
    const [results] = await dbConnection.query(sqlQuery, [username]);
    if (results.length === 0) {
      res.status(401).json(true);
    } else {
      res.status(200).json(false);
    }
  } catch (error) {
    //console.log(error);
    res.status(500).json({ error: 'Error verifying user' });
  }
};

export const getRole = async (req, res) => {
  const username = req.body.username;

  try {
    const sqlQuery = 'SELECT * FROM user WHERE username = ?';
    const [results] = await dbConnection.query(sqlQuery, [username]);
    if (results.length === 0) {
      res.status(401).json(false);
    } else {
      res.status(200).json(results[0].role);
    }
  } catch (error) {
    //console.log(error);
    res.status(500).json({ error: 'Error verifying user' });
  }
};