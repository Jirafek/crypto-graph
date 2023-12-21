const dataArray = [];

for (let i = 0; i < 100; i++) {
    const lastY = i > 0 ? dataArray[i - 1].y : 0;
    const yLimit = 10;
    const newY = lastY + Math.floor(Math.random() * (2 * yLimit + 1)) - yLimit;

    dataArray.push({ x: i, y: Math.max(0, Math.min(150, newY)) });
}

console.log(dataArray);

const ctx = document.getElementById('candlestickChart').getContext('2d');

const gradient = ctx.createLinearGradient(0, 0, 0, 360);
gradient.addColorStop(0.0933, '#32AA78');
gradient.addColorStop(0.6296, 'rgba(50, 170, 120, 0)');

const lineChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: 'Quantex',
            data: dataArray,
            fill: true,
            backgroundColor: gradient,
            borderColor: '#C2D67EE5',
            borderWidth: 3,
        }],
    },
    options: {
        transitions: {
            show: {
                animations: {
                    x: {
                        from: 900
                    },
                    y: {
                        from: 900
                    }
                }
            },
        },
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                grid: {
                    display: false,
                },
                display: false,
            },
            y: {
                grid: {
                    display: false,
                },
                ticks: {
                    display: false,
                },
                display: false,
            },
        },
        elements: {
            point: {
                radius: 0,
            },
        },
        animation: false,
    },
});

const updateChart = () => {
    const currentData = lineChart.data.datasets[0].data;

    currentData.shift();

    const lastX = currentData[currentData.length - 1].x;
    const lastY = currentData[currentData.length - 1].y;

    const yLimit = 10;
    const newY = lastY + Math.floor(Math.random() * (2 * yLimit + 1)) - yLimit;

    currentData.push({
        x: lastX + 1,
        y: Math.max(0, Math.min(150, newY)),
    });

    lineChart.data.datasets[0].data = currentData;
    lineChart.update();
};

updateChart();

setInterval(updateChart, 2000);
