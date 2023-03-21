const express = require('express');
const { errorHandler } = require('./Middeleware/errorHandler');
const app = express();//to server and router build
const dotenv = require("dotenv").config();
const port = process.env.PORT || 2000;
app.use(express.json());
app.use("/Users", require("./Routes/UsersRoute"));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server Run On Port ${port}`);
});
