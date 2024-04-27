const pool = require('../database/index')

const journalController = {
    getAll: async (req,res) => {
        try{
            const [rows,fields] = await pool.query("select * from journals")
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
    getAllJournalRealations: async (req,res) => {
        try{
            const [rows,fields] = await pool.query("select * from journal_students")
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
            if(req.user.user_role=="student"){
                res.status(401).send("Not Authorized to perform this action")
            }
            const teacherId = req.user.user_id
            const {description,students,attachment} = req.body
            let query = 'INSERT INTO journals (description,teacher_id';
            const queryParams = [description,teacherId];
            if (attachment) {
            query += ', attachment) VALUES (?, ?, ?, ?)';
            queryParams.push(attachment);
            } else {
            query += ') VALUES (?, ?)';
            }
            const [rows,fields]=await pool.query(query,queryParams)
            const studentIds = await getStudentIds(students);
            await insertStudentsIntoTable(studentIds, rows.insertId);
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
    update: async (req,res) => {
        try{
            if(req.user.user_role=="student"){
                res.status(401).send("Not Authorized to perform this action")
            }
            const journalId = parseInt(req.params.id);
            const updatedFields = req.body;
            await updateJournal(journalId, updatedFields);
            res.json({
                data: updatedFields
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
            const sql = "delete from journals where journal_id = ?"
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

async function getStudentIds(studentNames) {
    try {
      const query = 'SELECT id FROM users WHERE user_name IN (?)';
      const [rows] = await pool.query(query, [studentNames]);
      const studentIds = rows.map((row) => row.id);
      return studentIds;
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

async function insertStudentsIntoTable(studentIds, journalId) {

try {
    const query = 'INSERT INTO journal_students (student_id, journal_id) VALUES ?';
    const values = studentIds.map((id) => [id, journalId]);
    await pool.query(query, [values]);
    console.log('Students inserted into journal students successfully');
} catch (error) {
    console.error('Error occurred:', error);
}
}

async function updateJournal(journalId, updatedFields) {
    try {
      let updateQuery = 'UPDATE journals SET ';
      let updateValues = [];
      let fieldCount = 0;
  
      Object.keys(updatedFields).forEach((field) => {
        if (field === 'students') {
          // Handle students update separately
          return;
        }
  
        updateQuery += `${field} = ?`;
        updateValues.push(updatedFields[field]);
        fieldCount++;
  
        if (fieldCount < Object.keys(updatedFields).length - 1) {
          updateQuery += ', ';
        }
      });
  
      updateQuery += ' WHERE journal_id = ?';
      updateValues.push(journalId);
  
      await pool.query(updateQuery, updateValues);
  
      if (updatedFields.students) {
        await updateJournalStudents(journalId, updatedFields.students);
      }
  
      console.log('Journal and associated students updated successfully');
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }
  


async function updateJournalStudents(journalId, studentList) {
  try {
    // Delete existing entries for the journal
    await pool.query('DELETE FROM journal_students WHERE journal_id = ?', [journalId]);
    const query = 'SELECT id FROM users WHERE user_name IN (?)';
    const [rows] = await pool.query(query, [studentList]);
    const studentIds = rows.map((row) => row.id);
    // Insert new entries for the journal
    const insertQuery = 'INSERT INTO journal_students (journal_id, student_id) VALUES (?)';
    const insertValues = studentIds.map((studentId) => [journalId, studentId]);
    await pool.query(insertQuery, insertValues);

    console.log('Journal students updated successfully');
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

module.exports = {journalController}