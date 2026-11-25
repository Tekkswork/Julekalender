require('dotenv').config();
const mongoose = require("mongoose");
const express = require('express');
const Svar = require('./models/svar');
const Luke = require('./models/luke');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();

const User = require('./models/Bruker')

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


mongoose.connect("mongodb://localhost:27017/JULEKALENDER");

// prøver å få Hei "navn" melding

app.get('/', (req, res) => {
  const dato = new Date();
  const dagensLuke = 5;
//   dato.getMonth() === 11 ? dato.getDate() : null;
  const token = req.cookies.jwt;

  if (!token) {
    return res.render('index', { navn: null, dagensLuke: dagensLuke });
  }

  const bruker = jwt.verify(token, process.env.SECRET_JWT);
  res.render('index', { navn: bruker.fornavn, dagensLuke: dagensLuke });
});

app.get('/login', (req, res) => {
    res.render('login');
});


app.get('/admin', async (req, res) => {
  const svar = await Svar.find().populate('bruker');
  const luker = await Luke.find();

  res.render('admin', { svar: svar, luker: luker});
});

// vise hva er riktig og galt
app.post('/admin/svar/:id', async (req, res) => {
  const riktig = req.body.riktig === 'true';

  await Svar.findByIdAndUpdate(req.params.id, {
    riktig: riktig
  });

  res.redirect('/admin');
});

// k så her måtte jeg søke litt, hater matte

app.post('/admin/vinner', async (req, res) => {
  const dag = Number(req.body.dag);
  const luke = await Luke.findOne({ id: dag });

  if (!luke) {
    return res.status(404).send('Luka finnes ikke');
  }

  const svar = await Svar.find({ dag: dag, riktig: true }).populate('bruker');
  const kvalifiserte = svar.filter(innsendt => innsendt.bruker);

  if (kvalifiserte.length === 0) {
    return res.send('Ingen riktige svar med kjent bruker på denne luka.');
  }

  const vinner = kvalifiserte[Math.floor(Math.random() * kvalifiserte.length)];
  luke.vinner = vinner.bruker._id;
  await luke.save();

  res.send(`Vinneren er ${vinner.bruker.fornavn}!`);
});



// remember: henter luke nummeret fra nettaddressen og sender det til luke.ejs.
//  så bruker man nummeret til å finne riktig spørsmål, slik at luke3 viser spørsmål 3-
//  basically connecting seed.js. 
app.get('/luke/:dag', async (req, res) => {
  const dag = Number(req.params.dag);

//   ikke åpne luker

  const today = new Date('2026-12-24');

if (today.getMonth() !== 11 || today.getDate() < dag) {
  return res.status(403).send('Denne luken er ikke åpen enda');
}

  const sporsmal = await Luke.findOne({ id: dag }).populate('vinner');

  if (!sporsmal) {
    return res.status(404).send('Luka finnes ikke');
  }

  res.render('luke', {
    dag: dag,
    question: sporsmal.question,
    options: sporsmal.options,
    vinner: sporsmal.vinner
  });
});

// ^ som jeg har skjønt- options sender svaralternativene fra seed til luke, sånn at det
// vises på siden. 

app.post('/luke/:dag', async (req, res) => {
  const dag = Number(req.params.dag);

  const today = new Date('2026-12-24');

if (today.getMonth() !== 11 || today.getDate() < dag) {
  return res.status(403).send('Denne luken er ikke åpen enda');
}
  
  const svar = req.body.answer;

  const token = req.cookies.jwt;

if (!token) {
  return res.redirect('/login');
}

const bruker = jwt.verify(token, process.env.SECRET_JWT);

  await Svar.create({ dag: dag, svar: svar, bruker: bruker.userId});

  res.send('Takk for svaret!');
});


app.post('/login', async (req, res) => {
    const {name, surname, email} = req.body;

    console.log("req, rebody", name, surname, email)


    const user = await User.findOne({epost: email});

    console.log(user);

    if(!user) {
        console.log("why does this run")

        
        
        if(email.includes("@afk")) {
            console.log("true")
            const user = await User.insertOne({fornavn: name, etternavn: surname, epost: email});
            console.log("user", user)
            
            const token = jwt.sign({userId:user._id, fornavn: name}, process.env.SECRET_JWT)
            console.log("token", token);
            
            res.cookie("jwt", token);
            res.redirect("/")
        } else {
            res.send("du må bruke afk")
        }
    }   else {
          const token = jwt.sign({userId:user._id, fornavn: name}, process.env.SECRET_JWT)
               res.cookie("jwt", token);
            res.redirect("/")
    }
        


})


const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server kjører på http://localhost:${port}`);
});