

let vumetro_grafica;
let frameRate = 0;
let newDataPoints = []
let recording = false
let dataValue = 0
let arrayValues = []
let localCounter = 0
let chartjsArray = []
let chartjscounter = 0
// let average = 0
let factorVolumen = 1
let websocket_status = null
let tiempo = 0




window.onload = function(){
  vumetro_grafica = document.getElementById('vumetro_grafica');
  vumeter(vumetro_grafica, {
    "boxCount": 15,
    "boxGapFraction": 0.25,
    "max": 100,
  });
  // generateChart();
  newChart();
  conectarWS();
  
};


const conectarWS = () => {

  // Crea una nueva conexión.
  const socket = new WebSocket('ws://localhost:8080');
  let state = document.querySelector(".websocketOff")
  
  // Abre la conexión
  socket.addEventListener('open', function (event) {
    let stateValue = event.currentTarget.readyState
    if(stateValue = 1) {
      state.classList.remove("websocketOff")
      state.classList.add("websocketOn")
    }
    socket.send('Hello Server!');
    })
    socket.addEventListener('close', function(event) {
      console.log(event)
      incializar_vumetro(0)
      state.classList.remove("websocketOn")
      state.classList.add("websocketOff")
    })
    socket.addEventListener('error', function (event) {
      incializar_vumetro(0)
      socket.close()
    })
    
    // Escucha por mensajes
    socket.addEventListener('message', function (event) {
      incializar_vumetro(event.data)
    
    });
  }

const incializar_vumetro = (valor => {

  let demoInput = document.getElementById('demoInput');
  let valorVumetroEl = document.getElementById('valorVumetro');
  let factorVolumen = 0.7;
  demoInput.oninput = function(e){
      console.log(valor);
      factorVolumen = this.value
      let factorVolumeText = document.getElementById("valor_range")
      factorVolumeText.innerHTML = factorVolumen
  };

  let valorVumetro = 0;
  let average = parseFloat(valor)
  vumetro_grafica.setAttribute('data-val', average*factorVolumen); // AÑADIR VALORES PARA PINTAR RECUADROS DEL VOLUMEN


  valorVumetro = average*factorVolumen;
  dataValue = parseInt(Math.floor(valorVumetro * factorVolumen))
  if (recording) {
    chartjsArray.push(dataValue)
    arrayValues.push({x:Date.now(), y: dataValue})
    localCounter++
  }
  window.localStorage.setItem('arrayValues', JSON.stringify(arrayValues));
  window.localStorage.setItem('chartJSArrayValues', JSON.stringify(chartjsArray));
  
  
  if (frameRate % 10 == 0) {
    valorVumetroEl.innerHTML =(valorVumetro * factorVolumen).toFixed(2)
  }
  frameRate ++
  
  if (frameRate == 299) {
    frameRate = 0;
  };
})


function vumeter(elem, config){

    // Settings
    let max             = config.max || 100;
    let boxCount        = config.boxCount || 10;
    let boxCountRed     = config.boxCountRed || 2;
    let boxCountYellow  = config.boxCountYellow || 3;
    let boxGapFraction  = config.boxGapFraction || 0.2;
    let jitter          = config.jitter || 0.02;

    // Colours
    let redOn     = 'rgba(255,47,30,0.9)';
    let redOff    = 'rgba(64,12,8,0.9)';
    let yellowOn  = 'rgba(255,215,5,0.9)';
    let yellowOff = 'rgba(64,53,0,0.9)';
    let greenOn   = 'rgba(53,255,30,0.9)';
    let greenOff  = 'rgba(13,64,8,0.9)';

    // Derived and starting values
    let width = elem.width;
    let height = elem.height;
    let curVal = 0;

    // Gap between boxes and box height
    let boxHeight = height / (boxCount + (boxCount+1)*boxGapFraction);
    let boxGapY = boxHeight * boxGapFraction;

    let boxWidth = width / 2 - (boxGapY*2);
    let boxGapX = (width / 2 - boxWidth) / 2;

    // Canvas starting state
    let c = elem.getContext('2d');

    // Main draw loop
    let draw = function(){

        let targetVal = parseInt(elem.dataset.val, 10);

        // Gradual approach
        if (curVal <= targetVal){
            curVal += (targetVal - curVal) / 5;
        } else {
            curVal -= (curVal - targetVal) / 5;
        }

        // Apply jitter
        if (jitter > 0 && curVal > 0){
            let amount = (Math.random()*jitter*max);
            if (Math.random() > 0.5){
                amount = -amount;
            }
            curVal += amount;
        }
        if (curVal < 0) {
            curVal = 0;
        }
        
        c.save();
        c.beginPath();
        c.rect(0, 0, width, height);
        c.fillStyle = 'rgb(32,32,32)';
        c.fill();
        c.restore();
        drawBoxesLeft(c, curVal);
        // drawBoxesRight(c, curVal);
        // c.fillText("TEST2")

        requestAnimationFrame(draw);
    };

    // Draw the boxes
    let anchoOffset = 5;

    function drawBoxesLeft(c, val){
        c.save(); 
        c.translate((boxGapX *1.5) + anchoOffset + boxWidth / 2, boxGapY);
        for (let i = 0; i < boxCount; i++){
            let id = getId(i);

            c.beginPath();
            if (isOn(id, val)){
                c.shadowBlur = 10;
                c.shadowColor = getBoxColor(id, val);
            }
            c.rect(0, 0, boxWidth , boxHeight);
            c.fillStyle = getBoxColor(id, val);
            c.fill();
            c.translate(0, boxHeight + boxGapY);
        }
        c.restore();
    }
    function drawBoxesRight(c, val){
        c.save(); 
        c.translate(boxGapX - boxGapX / 2 + anchoOffset / 2 + width/2, boxGapY);
        for (let i = 0; i < boxCount; i++){
            let id = getId(i);

            c.beginPath();
            if (isOn(id, val)){
                c.shadowBlur = 10;
                c.shadowColor = getBoxColor(id, val);
            }
            c.rect(0, 0, boxWidth - anchoOffset, boxHeight);
            c.fillStyle = getBoxColor(id, val);
            c.fill();
            c.translate(0, boxHeight + boxGapY);
        }
        c.restore();
    }

    // Get the color of a box given it's ID and the current value
    function getBoxColor(id, val){
        // on colours
        if (id > boxCount - boxCountRed){
            return isOn(id, val)? redOn : redOff;
        }
        if (id > boxCount - boxCountRed - boxCountYellow){
            return isOn(id, val)? yellowOn : yellowOff;
        }
        return isOn(id, val)? greenOn : greenOff;
    }

    function getId(index){
        // The ids are flipped, so zero is at the top and
        // boxCount-1 is at the bottom. The values work
        // the other way around, so align them first to
        // make things easier to think about.
        return Math.abs(index - (boxCount - 1)) + 1;
    }

    function isOn(id, val){
        // We need to scale the input value (0-max)
        // so that it fits into the number of boxes
        let maxOn = Math.ceil((val/max) * boxCount);
        return (id <= maxOn);
    }

    // Trigger the animation
    draw();
}

const generateChart = () => {
  let chartStart = document.getElementById('chartStart');
  let chartStop = document.getElementById('chartStop');

  newDataPoints = [{ y: 450 },
    { y: 414},
    { y: 520, indexLabel: "\u2191 highest",markerColor: "red", markerType: "triangle" },
    { y: 460 },
    { y: 450 },
    { y: 500 },
    { y: 480 },
    { y: 480 },
    { y: 410 , indexLabel: "\u2193 lowest",markerColor: "DarkSlateGrey", markerType: "cross" },
    { y: 500 },
    { y: 480 },
    { y: 510 }]

  let options = {
    animationEnabled: true,
    theme: "light2",
    title:{
      text: "Simple Line Chart"
    },
    data: [{        
      type: "line",
          // indexLabelFontSize: 16,
      dataPoints: []
    }]
  }
  /* console.log(dataOptions)
  dataOptions.data.dataPoints = [...chart, newDataPoints];

  console.log(dataOptions) */
  
  // console.log(dataOptions.data.dataPoints)
  options.data.dataPoints = newDataPoints;

  var chart = new CanvasJS.Chart("chartContainer", options);
  
  /* console.log(Object.keys(chart))
  chart.render();
  chart.options.data.dataPoints.push({y: 800})
  chart.render(); */
  const renderChart = () => {
    recording = false
    // console.log(chart)
    chart.render()
  }
  const stopRendeChart = () => {
    newDataPoints = []
    // console.log(newDataPoints)
    recording = true
  }
  chartStart.addEventListener("click", renderChart);
  chartStop.addEventListener("click", stopRendeChart);
}



let count = 1
const newChart = () => {
  var dataPoints = [];

  var chart = new CanvasJS.Chart("chartContainer", {
    theme: "light2",
    title: {
      text: "Live Data"
    },
    data: [{
      type: "line",
      dataPoints: dataPoints
    }]
  });
  updateData();

  // Initial Values
  var xValue = 0;
  var yValue = dataValue;
  var newDataCount = 1;


  function addData(data) {
    if(recording) {
      if(newDataCount != 1) {
        $.each(data, function(key, value) {
          dataPoints.push({x: value[0], y: parseInt(value[1])});
          xValue++;
          yValue = parseInt(value[1]);
        });
      } else {
        //dataPoints.shift();
        dataPoints.push({x: data[0][0], y: parseInt(data[0][1])});
        xValue++;
        yValue = parseInt(data[0][1]);
      }
      let chartTimer 
      newDataCount = 1;
      chart.render();

    } else {
      dataPoints = []
    }
    
  }


  function updateData() {
    if (recording) {
      

      const data = [[count,dataValue]]
      addData(data)
      count ++
    }
    // console.log("https://canvasjs.com/services/data/datapoints.php?xstart="+xValue+"&ystart="+yValue+"&length="+newDataCount+"type=json")
    // $.getJSON("https://canvasjs.com/services/data/datapoints.php?xstart="+xValue+"&ystart="+yValue+"&length="+newDataCount+"type=json", addData);
    }
    var chartTimer
    var timer 
    
    chartStart.addEventListener("click", function() {
      // console.log(chart.options)
      // chart.options.data[0].dataPoints = []
      recording = true
      /* chartTimer = setTimeout(updateData, 500); */
      chartTimer = setInterval((updateData), 150);
      timer = setInterval(() => {
        // tiempo += 1
        tiempo = Date.now()
        console.log(tiempo)
      }, 1000)
      // console.log(chart.options)
      
    });
    chartStop.addEventListener("click", function () {
      // console.log(chart.options)
      recording = false
      
      clearInterval(chartTimer)
      clearInterval(timer)
      count = 0
      // chart.options.data[0].dataPoints = []
      // console.log(chart.options)
      
    
  });
}

