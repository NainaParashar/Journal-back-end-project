const pool = require('../database/index')


const feedController = {
    getAll: async (req,res) => {
        user_id = req.user.user_id
        try{
            if(req.user.user_role=="student"){
                const [journal_ids] = await pool.query('SELECT journal_id FROM journal_students WHERE student_id = ?',user_id);
                const journals = journal_ids.map((row) => row.journal_id);
                const selectQuery = 'SELECT * FROM journals WHERE journal_id IN (?)';
                const result = await pool.query(selectQuery, [journals]);
                res.json({
                    data: result[0]
                })
            }else{
                const [users] = await pool.query('SELECT * FROM journals WHERE teacher_id = ?',user_id);
                res.json({
                    data: users
                })
            }
            
        }catch(error){
            console.log(error)
            res.json({
                status: "error"
            })
        }
    }
}

module.exports = {feedController};