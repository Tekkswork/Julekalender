require('dotenv').config();
const mongoose = require("mongoose");
const express = require('express');
const questions = require('./seed');
const app = express();

const User = require('./models/Bruker')

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


mongoose.connect("mongodb://localhost:27017/julekalender");
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

// remember: henter luke nummeret fra nettaddressen og sender det til luke.ejs.
//  så bruker man nummeret til å finne riktig spørsmål, slik at luke3 viser spørsmål 3-
//  basically connecting seed.js. 
app.get('/luke/:dag', (req, res) => {
  const dag = Number(req.params.dag);
  const sporsmal = questions.find(q => q.id === dag);

  if (!sporsmal) {
    return res.status(404).send('Luka finnes ikke');
  }

  res.render('luke', {
    dag: dag,
    question: sporsmal.question
  });
});


app.post('/login', async (req, res) => {
    const {name, surname, email} = req.body;

    console.log("req, rebody", name, surname, email)


    if(email.includes("@afk")) {
        console.log("true")
        const user = await User.insertOne({fornavn: name, etternavn: surname, epost: email});
        console.log("user", user)

                const token = jwt.sign({userId:user._id, fornavn: fornavn}, process.env.SECRET_JWT)
        console.log("token", token);

        res.cookie("jwt", token);
        res.redirect("/")
    } else {
        res.send("du må bruke afk")
    }



})


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server kjører på http://localhost:${port}`);
});