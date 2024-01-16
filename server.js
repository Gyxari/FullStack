const express = require('express') 
const app = express()
const port = 3000
app.use(express.json())
const mongoose = require('mongoose')
const cors = require('cors')
app.use(cors())


// määritetään yhteys
const mongoDB = 'mongodb+srv://ossiekoivisto:Oggeogge1@saa-asema.qwbrqu6.mongodb.net/weather-station?retryWrites=true&w=majority'

// yhdistetään mongoon
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection

// tarkistetaan yhteys
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log("Database test connected")
})




// uusi schema
const saaSchema = new mongoose.Schema({
    payload: String,
    humidity: String,
    topic: String
});

const Station = mongoose.model('Station', saaSchema)



//lähetetään get /all jossa suoritetaan query
app.get('/all', async (request, response) => {
    const all = await Station.find({}).select('humidity payload date')//kaikki
    response.json(all)   
})

//lähetetään get /max jossa suoritetaan query joka etsii suurimman lämpötilan
app.get('/max', async (request, response) => {
  const all = await Station.find({}).sort({payload:-1}).limit(1);
  response.json(all)
})

//lähetetään get /min jossa suoritetaan query joka etsii pienimmän
app.get('/min', async (request, response) => {
  const all = await Station.find({}).sort({payload:+1}).limit(1)//kaikkien aikojen minimi
  response.json(all)
  })

//lähetetään get /recent jossa suoritetaan query joka etsii uusimmat 20 tietoa
app.get('/recent', async (request, response) => {
  const all = await Station.find({}).sort({date:+1}).limit(20) //uusimmat 20 tietoa
 
response.json(all)
  
})

//delete pyyntö joka toimii ideellä
app.delete('/all/:id', async (request, response) => {
  const deletedinfo = await Station.findByIdAndRemove(request.params.id) //postaa /all/objektinId
  if (deletedinfo) response.json(deletedinfo)
  else response.status(404).end()
})

//ilmoitus
app.listen(port, () => {
  console.log('Example app listening on port 3000')
})