let selectedCurrency = "BTC";
let selectedInterval = "1M";

const currencySelect = document.getElementById('currencySelect');

currencySelect.addEventListener('change', async function () {
    selectedCurrency = currencySelect.value;
    await updateChart();
});

    const buttons = document.querySelectorAll('.button');

    buttons.forEach(button => {
        button.addEventListener('click', async function () {
            buttons.forEach(btn => btn.classList.remove('active-btn'));
            this.classList.add('active-btn');

            selectedInterval = this.getAttribute('data-int');

            await updateChart();
        });
    });

async function fetchData() {
    const apiUrl = `https://api2-1.bybit.com/spot/api/quote/v2/klines?symbol=301.${selectedCurrency}USDT&interval=${selectedInterval}&limit=1000&r=1703048575924`;

    const headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');

    const response = await fetch(apiUrl, { headers });
    const data = await response.json();
    return data.result;
}

const ctx = document.getElementById('candlestickChart').getContext('2d');



const gradient = ctx.createLinearGradient(0, 0, 0, 650);
gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
gradient.addColorStop(0, '#76bca7');

const lineChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            data: [],
            fill: true,
            backgroundColor: gradient,
            borderColor: '#56AB91',
            borderWidth: 2,
        }],
    },
    options: {
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
                    tickBorderDash: []
                },
            },
        },
        elements: {
            point: {
                radius: 0,
            },
        },
    },
});

async function updateChart() {

    const data = await fetchData();

    const startMonthDate = new Date(data[data.length - 1].t);

    startMonthDate.setMonth(startMonthDate.getMonth() - 2);

    let monthesData = [];

    const spans = document.querySelectorAll('.canvas-container-item_span');

    if (selectedInterval === '1M') {
        monthesData.push(startMonthDate.toLocaleString('en-US', { month: 'long' }));
        startMonthDate.setMonth(startMonthDate.getMonth() + 1)

        monthesData.push(startMonthDate.toLocaleString('en-US', { month: 'long' }));
        startMonthDate.setMonth(startMonthDate.getMonth() + 1)

        monthesData.push(startMonthDate.toLocaleString('en-US', { month: 'long' }));
    } else {
        startMonthDate.setMonth(startMonthDate.getMonth() + 2);

        monthesData = ['', startMonthDate.toLocaleString('en-US', { month: 'long' }), ''];
    }

    console.log(monthesData, selectedInterval);

    spans.forEach((span, index) => {
        span.innerText = monthesData[index] || '';
    });


    let number = 0;

    const lineChartData = data.map(entry => {
        number++;

        return ({
        x: number,
        y: parseFloat(entry.c),
    })});
    lineChart.data.datasets[0].label = `${selectedCurrency}/USDT`;
    lineChart.data.datasets[0].data = lineChartData;
    lineChart.update();
}

updateChart();

setInterval(updateChart, 5000);
