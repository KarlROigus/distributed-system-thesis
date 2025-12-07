// Connect to Socket.IO server
const socket = io();

// Chart.js configuration
const ctx = document.getElementById('dataChart').getContext('2d');
let dataChart = null;

// Initialize chart
function initChart(initialData = { values: [], timestamps: [] }) {
    if (dataChart) {
        dataChart.destroy();
    }

    dataChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: initialData.timestamps.map(ts => new Date(ts).toLocaleTimeString()),
            datasets: [{
                label: 'Data Value',
                data: initialData.values,
                borderColor: 'rgb(102, 126, 234)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            },
            animation: {
                duration: 750
            }
        }
    });
}

// Update chart with new data
function updateChart(value, timestamp) {
    if (!dataChart) {
        initChart();
    }

    const timeLabel = new Date(timestamp).toLocaleTimeString();
    
    // Add new data point
    dataChart.data.labels.push(timeLabel);
    dataChart.data.datasets[0].data.push(value);

    // Keep only last 50 points for performance
    if (dataChart.data.labels.length > 50) {
        dataChart.data.labels.shift();
        dataChart.data.datasets[0].data.shift();
    }

    dataChart.update('none'); // 'none' mode for smooth updates
}

// Update statistics display
function updateStats(metrics) {
    document.getElementById('currentValue').textContent = metrics.lastValue !== null ? metrics.lastValue : '-';
    document.getElementById('totalReceived').textContent = metrics.totalReceived || 0;
    document.getElementById('average').textContent = metrics.average ? metrics.average.toFixed(2) : '-';
    
    const minMax = document.getElementById('minMax');
    if (metrics.min !== null && metrics.max !== null) {
        minMax.textContent = `${metrics.min} / ${metrics.max}`;
    } else {
        minMax.textContent = '- / -';
    }
}

// Update client list
function updateClientList(clientCounts) {
    const clientList = document.getElementById('clientList');
    
    if (!clientCounts || Object.keys(clientCounts).length === 0) {
        clientList.innerHTML = '<p style="color: #666;">No client data yet...</p>';
        return;
    }

    clientList.innerHTML = Object.entries(clientCounts)
        .map(([clientId, count]) => `
            <div class="client-item">
                <div class="client-id">${clientId}</div>
                <div class="client-count">${count}</div>
            </div>
        `)
        .join('');
}

// Socket.IO event handlers
socket.on('connect', () => {
    console.log('Connected to visualizer server');
    document.getElementById('status').textContent = 'Connected';
    document.getElementById('status').className = 'status connected';
});

socket.on('disconnect', () => {
    console.log('Disconnected from visualizer server');
    document.getElementById('status').textContent = 'Disconnected';
    document.getElementById('status').className = 'status disconnected';
});

// Receive initial metrics
socket.on('metrics', (data) => {
    console.log('Received initial metrics:', data);
    if (data.history) {
        initChart(data.history);
    }
    updateStats(data);
    updateClientList(data.clientCounts);
});

// Receive real-time data updates
socket.on('data', (data) => {
    console.log('Received data:', data);
    updateChart(data.value, data.timestamp);
    if (data.metrics) {
        updateStats(data.metrics);
        updateClientList(data.metrics.clientCounts);
    }
});

// Handle connection errors
socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
    document.getElementById('status').textContent = 'Connection Error';
    document.getElementById('status').className = 'status disconnected';
});


