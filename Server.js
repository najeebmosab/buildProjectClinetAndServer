const express = require('express');
const { errorHandler } = require('./Middeleware/errorHandler');
const app = express();//to server and router build
const dotenv = require("dotenv").config();
const port = process.env.PORT || 3000;
const cors = require('cors');
const jwt = require
const cookieParser = require('cookie-parser');
// server.use(cookieParser());
app.use(cors({
    origin: 'http://127.0.0.1:5173',
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));//know body in sending requst
app.use(express.json());
app.use(cookieParser());
app.use("/Users", require("./Routes/UsersRoute"));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server Run On Port ${port}`);
});
