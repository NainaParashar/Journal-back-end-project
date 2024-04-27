const express = require('express')
const app= express()

require('dotenv').config()

const router=require('./routes/routes.js')

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use("/api/v1",router)


const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log("server is running..")
})