const express = require('express');
const mongoose = require('mongoose');
const authroute = require('./routes/auth')
const post_rout = require('./routes/get');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

mongoose.connect(process.env.Db_CONNECT).then(
    () => {
        console.log('database connected');
    }, (error) => {
        console.log('database can not connecte' + error);
    }
)

app.use(express.json());
app.use('/api/user', authroute);
app.use('/api/posts' , post_rout);



var port = process.env.port || 4000;
app.listen(port, function () {
    console.log('you are listning to port ===>' + port);
})
