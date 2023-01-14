import mascleta from './mascleta.js'
console.log(mascleta)

const ctx = document.getElementById('graficaFinal1');
const ctx2 = document.getElementById('graficaFinal2');

/* const data = JSON.parse(window.localStorage.getItem('chartJSArrayValues'));*/
let labels = [] 
let labels2 = [] 
let data1 = []
let data2 = []
let maxValue = {x: 0, y: 0}
let maxValue2 = {x: 0, y: 0}


const rawData = JSON.parse(window.localStorage.getItem('arrayValues'));
const rawData2 = mascleta
rawData.forEach(el => {
  /* data2.push(el.y)
  labels2.push(el.x) */
  if (el.y >= maxValue.y) {
    maxValue2.x = el.x
    maxValue2.y = el.y
  }
  if(el.x % 1 == 0) {
    data1.push(el.y)
    labels.push(el.x)
    if (el.y >= maxValue.y) {
      maxValue.x = el.x
      maxValue.y = el.y
    }
  }
})
rawData2.forEach(el => {
  data2.push(el.y)
  labels2.push(el.x)
})
console.log(rawData.length)
console.log(data1.length)
console.log(maxValue)
console.log(maxValue2)
/* let labelsindex = 0
data.forEach(el => {
  labels.push(labelsindex + "db")
  labelsindex ++
}) */

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: data1.length,
        data: data1,
        borderWidth: 1,
        fill: {
          target: 'origin',
          above: 'rgb(0, 192, 0)',
        },
        pointRadius: 0,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        showLine: 0,
        cubicInterpolationMode: 'monotone',
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          // display: true,
          title: "db"
        },
        x: {
          display: false
        }
      },
        aspectRatio: 5,
        plugins: {
          legend: {
              display: true,
          }
        }

    }
  });
  new Chart(ctx2, {
    type: 'line',
    data: {
      labels: labels2,
      datasets: [{
        label: rawData2.length,
        data: data2,
        borderWidth: 1,
        fill: {
          target: 'origin',
          above: 'rgb(0, 192, 0)',
        },
        pointRadius: 0,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0,
        showLine: 0,
        cubicInterpolationMode: 'monotone',
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          // display: true,
          title: "db"
        },
        x: {
          display: false
        }
      },
        aspectRatio: 5,
        plugins: {
          legend: {
              display: true,
          }
        }

    }
  });


window.onload = function () {
 
  var data = [];
  var dataSeries = { type: "area" };
  var dataPoints = [];

  dataPoints = JSON.parse(window.localStorage.getItem('arrayValues'));
  console.log(dataPoints)
  dataSeries.dataPoints = dataPoints;
  dataSeries.color = "red"
  data.push(dataSeries);
  
  //Better to construct options first and then pass it as a parameter
  var options = {
    zoomEnabled: true,
    animationEnabled: true,
    backgroundColor: "#F5DEB3",
    title: {
      text: "Gráfica 1"
    },
    axisY: {
      lineThickness: 1
    },
    
    data: data  // random data
  };
  
  var chart = new CanvasJS.Chart("graficaFinal", options);
  var startTime = new Date();
  chart.render();
  var endTime = new Date();
  // document.getElementById("graficaFinal").innerHTML = "Time to Render: " + (endTime - startTime) + "ms";
  
  }