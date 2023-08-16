const express = require("express")
const router = require("./routes/routes");
require('dotenv').config();

const app = express()

app.use("/api", router)
app.listen(3001, err => {
    if (err) {
        throw err
    }
    console.log(`server started at: http://localhost:3001`)
})