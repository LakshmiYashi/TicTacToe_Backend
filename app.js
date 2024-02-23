const express = require("express");


const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");

const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const verifyToken = require("./routes/validate-token");



app.use(express.json());
app.use(cors());
// mongoose.connect("process.env.DB_CONNECT",{
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   },
//   ()=> console.log("connected to db"));
mongoose.connect("mongodb://localhost:27017/ticTacToeDB",{useNewUrlParser: true, useUnifiedTopology: true},()=>{console.log("connected to db")});


app.use("/api/user",authRoutes);

app.use("/api/dashboard", verifyToken, dashboardRoutes);

app.listen(3001,()=> console.log("server is running...."));