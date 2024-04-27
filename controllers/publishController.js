const pool = require('../database/index')


const publishController = {
    getAll: async (req,res) => {
        try{
            if(req.user.user_role=="student"){
                res.status(401).send("Not Authorized to perform this action")
            }
            const [rows,fields] = await pool.query("select * from journal_publish")
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
            if(req.user.user_role=="student"){
                res.status(401).send("Not Authorized to perform this action")
            }
            const [rows,fields] = await pool.query("delete from journal_publish where journal_id = ?",req.params.id)
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
    publish: async (req,res) => {
        try{
            const journal_id = req.params.id
            const {published_at} = req.body
            if(req.user.user_role=="student"){
                res.status(401).send("Not Authorized to perform this action")
            }
            sql = ("INSERT INTO journal_publish (published_at,journal_id) values (?,?)")
            const [rows,fields] = await pool.query(sql,[published_at,journal_id])
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

module.exports = {publishController};