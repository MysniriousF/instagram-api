const express = require('express')
const mongoose = require('mongoose');
const routes = require('./config/routes')
const env = require('./config/env/index')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(routes);


mongoose.connect(env.mongoUrl)
    .then(Listen)
    .catch(err => console.error(err));

    function Listen() {
        app.listen(port, () => {
            console.log(`App listening at http://localhost:${port}`)
          });
    }

    