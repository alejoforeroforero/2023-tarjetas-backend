const express = require('express');

const app = express();

app.get('/', (req, res, next)=>{

    res.send('Hola mis mejores amigazos');
})

app.listen(process.env.PORT || 3400);