function uploadFile() {
  let fileInput = document.getElementById('fileInput').files[0];
  let formData = new FormData();
  formData.append('inputFile', fileInput);

  fetch('/upload', {
    method: 'POST',
    body: formData,
  }).then(response => response.json())
    .then(data => renderChart(data))
    .catch(error => console.error('Error:', error));
}

// Chart.js를 사용하여 데이터를 시각화
function renderChart(data) {
  let ctx = document.getElementById('myChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['MIN', 'MAX', 'AVG', 'STDDEV'],
      datasets: [{
        label: 'Statistics',
        data: [data.min, data.max, data.avg, data.stddev],
        backgroundColor: ['red', 'green', 'blue', 'orange'],
      }]
    }
  });
}
