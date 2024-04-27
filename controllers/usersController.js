const pool = require('../database/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userController = {
    getAll: async (req,res) => {
        try{
            const [rows,fields] = await pool.query("select * from users")
            res.json({
                data: rows
            })
        }catch(error){
            console.log(error)
            res.json({
                status: "error"
            })
        }
    },
    create: async (req,res) => {
        try{
            const {user,password,role} = req.body 
            if (!(user && password && role)) {
                res.status(400).send("All input is required");
              }
            const [users] = await pool.query('SELECT * FROM users WHERE user_name = ?',user);
            if (users.length > 0) {
                return res.status(409).send("User Already Exist. Please Login");
              }
            encryptedPassword = await bcrypt.hash(password, 10);

            const sql = "insert into users (user_name,user_password,user_role) values (?,?,?)"
            const [rows,fields] = await pool.query(sql,[user,encryptedPassword,role])
            const token = jwt.sign(
                {user_id: rows.insertId,user_role: role},
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
            const lastInsertId = rows.insertId
            pool.query('UPDATE users SET token = ? WHERE id = ?',[token, lastInsertId])
            res.json({
                data: rows
            })
        }catch(error){
            console.log(error)
            res.json({
                status: "error"
            })
        }
    },
    delete: async (req,res) => {
        try{
            const {id} = req.params
            const sql = "delete from users where id = ?"
            const [rows,fields] = await pool.query(sql,[id])
            res.json({
                data: rows
            })
        }catch(error){
            console.log(error)
            res.json({
                status: "error"
            })
        }
    }
}

const loginController = {
    login: async (req,res) => {
        try{
            const {user,password} = req.body
            if (!(user && password)) {
                res.status(400).send("All input is required");
            }
            const [users] = await pool.query('SELECT * FROM users WHERE user_name = ?',user);
            if (users.length && (await bcrypt.compare(password, users[0].user_password))) {
                // Create token
                const token = jwt.sign(
                  { user_id: users[0].id,user_role: users[0].user_role},
                  process.env.TOKEN_KEY,
                  {
                    expiresIn: "2h",
                  }
                );
          
                // save user token
                users[0].token = token;
          
                // user
                res.status(200).json(users[0]);
              }
              res.status(400).send("Invalid Credentials");

        }catch(error){
            console.log(error)
            res.json({
                status: "error"
            })
        }
    }
}


module.exports = {userController,loginController}