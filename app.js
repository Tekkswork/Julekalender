require('dotenv').config();
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server kjører på http://localhost:${port}`);
});