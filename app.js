const express = require('express');
const PORT = 3000;// сделать env файл
const app = express();

app.get('/', (req, res) => {
    res.send('немного текста');
    res.send('<p>немного html</p>');
    res.send({ some: 'json' }); 
  }); 

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`App listening ons port ${PORT}`);
  });