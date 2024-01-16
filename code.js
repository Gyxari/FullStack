// init() funktio kutsutaan sivun avaamisen yhteydessä, josta kutsumme fetchaus funktiot loadAll, loadMax, loadMin ja loadrecent.

function init() {
  let info = document.getElementById('info')
  info.innerHTML = 'Ladataan tietoja palvelimelta, odota...'
  loadAll()
  loadMax()
  loadMin()
  loadrecent()
}


// Funktiolla fetchataan jsonit /all'ista ja asetetaan muuttujaan "all"
async function loadAll() {
  let response = await fetch('http://127.0.0.1:3000/all')
  let all = await response.json()
  JSON.stringify(all.date)
  showAll(all)
}

// loadMax fetchaa /max ja -||-
async function loadMax() {
  let response = await fetch('http://127.0.0.1:3000/max')
  let max = await response.json()
  let suurin = document.getElementById('suurin')
  suurin.innerHTML = max[0].payload+ ' C° ' + max[0].date
}

// loadMin fetchaa /min ja -||-
async function loadMin() {
  let response = await fetch('http://127.0.0.1:3000/min')
  let min = await response.json()
  let pienin = document.getElementById('pienin')
  pienin.innerHTML = min[0].payload+' C° ' + min[0].date
}

// loadrecent fetchaa /recent ja -||- 
async function loadrecent() {
  let response = await fetch('http://127.0.0.1:3000/recent')
  let recent_week = await response.json()
  forward_recent(recent_week)
}

// tehdään tempdatalle muuttujat, jotka asetetaan arrayksi.
tempdata_week = []
tempkeys_week = []

// funktio hakee recentit ja puskee ne edellä tehtyihin array'hin loopilla, jonka jälkeen puskee ne chart.js'ään
function forward_recent(recent_week){
  recent_week.forEach(element => {
    var kontsa = parseFloat(element.payload)
    var kantsa = element.date
    tempdata_week.push(kontsa);
    tempkeys_week.push(kantsa)
    return tempdata_week,tempkeys_week
  });
  drawchart2(tempdata_week,tempkeys_week)
  
}

// createList luo lista elementtejä, joihin printtaamme kaikki tietokannan lämpötilat, ja option poistaa tietoa.
function createList(all){
  let li = document.createElement('li')
  let li_attr = document.createAttribute('id')
  li_attr.value=all._id
  li.setAttributeNode(li_attr)
  let text = document.createTextNode('Temperature: '+all.payload+' C° Humidity: ' + all.humidity + ' date: ' + all.date)
  li.appendChild(text)
  let span = document.createElement('span')
  let span_attr = document.createAttribute('class')
  span_attr.value = 'delete'
  span.setAttributeNode(span_attr)
  let x = document.createTextNode('x')
  span.appendChild(x)
  span.onclick = function(){ remove(all._id)}
  li.appendChild(span)
  return li
}

// luomme kaksi arraytä, josta kutsumme tietoa charttiin.
var tempdata = [];
var tempkeys = [];


// showAll tuo koko tietokannan esille keskelle sivua.
function showAll(all) {
  let info = document.getElementById('info')
  let recent = document.getElementById('recent')
  if (all.length === 0) {
      recent.innerHTML = 'Ei tietoja'
  } else {    
    all.forEach(all => {
        var kont = parseFloat(all.payload)
        var kant = all.date
        tempdata.push(kont);
        tempkeys.push(kant)
        let li = createList(all)
        recent.appendChild(li)
        return tempdata,tempkeys
    })
    info.innerHTML = ''
    
    drawchart(tempdata,tempkeys)
  }
}

// remove(id):tä kutsutaan onclick eventillä sivulla, joka poistaa kyseisen tiedon tietokannasta.

async function remove(id) {
  const response = await fetch('http://localhost:3000/all/'+id, {
    method: 'DELETE'
  })
  let li = document.getElementById(id)
  li.parentNode.removeChild(li)
  let todosList = document.getElementById('todosList')
  if (!todosList.hasChildNodes()) {
    let infoText = document.getElementById('infoText')
    infoText.innerHTML = 'Ei tietoja.'
  }
}

// Drawchart funktiot printtaavat visuaalisen näytön tietokannasta ja sen fluktuoinnista.
function drawchart(tempdata,tempkeys) {
ctx = document.getElementById("myChart").getContext('2d');
ctx.clearRect(0, 0, 400, 400);
chart = new Chart(document.getElementById("myChart"), {
    type: 'line',
    data: {
      labels: tempkeys,
      datasets: [
        {
          label: "lämpötila",
          data: tempdata 
        }
      ]
    },
  
    options: {
      legend: { display: false },
      responsive: false,
      title: {
        display: true,
        text: 'kokoaikainen lämpötila fluktuaatio'
      },
      }
});
}

function drawchart2(tempdata_week,tempkeys_week) {
  ctx = document.getElementById("myChart2").getContext('2d');
  ctx.clearRect(0, 0, 400, 400);
  chart2 = new Chart(document.getElementById("myChart2"), {
      type: 'line',
      data: {
        labels: tempkeys_week,
        datasets: [
          {
            label: "lämpötila",
            data: tempdata_week 
          }
        ]
      },
    
      options: {
        legend: { display: false },
        responsive: false,
        title: {
          display: true,
          text: 'uusimmat tiedot'
        },
        }
  });
  }