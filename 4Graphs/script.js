const currencys = ['BTC', 'ETH', 'LTE', 'DOGE'];

async function fetchData(selectedCurrency) {
    const apiUrl = `https://api2-1.bybit.com/spot/api/quote/v2/klines?symbol=301.${selectedCurrency}USDT&interval=1M&limit=1000&r=1703048575924`;

    const response = await fetch(apiUrl, {
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    });
    const data = await response.json();
    return data.result;
}

const defaultGraphStructure = {
    type: 'line',
    data: {
        datasets: [{
            data: [],
            borderColor: '#56AB91',
            borderWidth: 0.5,
        }],
    },
    options: {
        scales: {
            x: {
                grid: {
                    display: false,
                },
                type: 'linear',
                position: 'bottom',
                ticks: {
                    display: false,
                }
            },
            y: {
                grid: {
                    display: false,
                },
                ticks: {
                    display: false,
                }
            },
        },
        elements: {
            point: {
                radius: 0,
            },
        },
    },
}

const elements = document.getElementsByClassName('candlestickChart');

const ctxs = Array.from(elements).map(el => el.getContext('2d'));
const lineCharts = ctxs.map(ctx => new Chart(ctx, defaultGraphStructure));

const values = Array.from(document.getElementsByClassName('flex-group-item_footer-value'));
const percents = Array.from(document.getElementsByClassName('flex-group-item_footer-percent'));

async function fetchDataAndUpdateCharts() {

    for (let i = 0; i < lineCharts.length; i++) {
        const lineChart = lineCharts[i];

        const data = await fetchData(currencys[i]);

        let number = 0;

        const lineChartData = data.map(entry => {

            number++
            return ({
                x: number,
                y: parseFloat(entry.c),
            })
        });

        const lastElement = data[data.length - 1];
        const percent = (((lastElement.c - lastElement.o) / lastElement.o) * 100).toFixed(1);

        values[i].innerText = `$ ${lastElement.v.toFixed(1)}`;

        percents[i].innerText = percent >= 0 ? `+${percent}%` : `${percent}%`;
        percents[i].style.backgroundColor = percent >= 0 ? '#2EBE7B33' : '#DA5C5433';
        percents[i].style.color = percent >= 0 ? '#2EBE7B' : '#DA5C54';



        lineChart.data.datasets[0].label = `${currencys[i]}/USDT`;
        lineChart.data.datasets[0].data = lineChartData;
        lineChart.data.datasets[0].borderColor = percent >= 0 ? '#2EBE7B' : '#DA5C54';
        lineChart.update();
    }
}

async function updateChart() {

    await fetchDataAndUpdateCharts();
}

updateChart();

setInterval(updateChart, 5000);
