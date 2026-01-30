// Chart Drawing Functions (Pure JavaScript - No Libraries)

class ChartRenderer {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.options = {
            padding: 40,
            gridColor: '#e0e0e0',
            textColor: '#666',
            ...options
        };
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    drawGrid(xSteps, ySteps, data) {
        const { padding } = this.options;
        const chartWidth = this.width - 2 * padding;
        const chartHeight = this.height - 2 * padding;

        // Vertical grid lines
        for (let i = 0; i <= xSteps; i++) {
            const x = padding + (i * chartWidth) / xSteps;
            this.ctx.beginPath();
            this.ctx.moveTo(x, padding);
            this.ctx.lineTo(x, padding + chartHeight);
            this.ctx.strokeStyle = this.options.gridColor;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();
        }

        // Horizontal grid lines
        const maxValue = Math.max(...data.map(d => d.value));
        const yStepValue = Math.ceil(maxValue / ySteps);
        
        for (let i = 0; i <= ySteps; i++) {
            const y = padding + (i * chartHeight) / ySteps;
            this.ctx.beginPath();
            this.ctx.moveTo(padding, y);
            this.ctx.lineTo(padding + chartWidth, y);
            this.ctx.strokeStyle = this.options.gridColor;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();

            // Y-axis labels
            this.ctx.fillStyle = this.options.textColor;
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'right';
            this.ctx.fillText(yStepValue * (ySteps - i), padding - 10, y + 4);
        }
    }
}

class BarChart extends ChartRenderer {
    constructor(canvasId, data, labels, colors) {
        super(canvasId);
        this.data = data;
        this.labels = labels;
        this.colors = colors || ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'];
    }

    draw() {
        this.clear();
        this.drawGrid(this.labels.length, 5, this.data.map((d, i) => ({ value: d })));

        const { padding } = this.options;
        const chartWidth = this.width - 2 * padding;
        const chartHeight = this.height - 2 * padding;
        const maxValue = Math.max(...this.data);
        const barWidth = (chartWidth / this.data.length) * 0.7;
        const barSpacing = (chartWidth / this.data.length) * 0.3;

        // Draw bars
        for (let i = 0; i < this.data.length; i++) {
            const barHeight = (this.data[i] / maxValue) * chartHeight;
            const x = padding + i * (barWidth + barSpacing) + barSpacing / 2;
            const y = padding + chartHeight - barHeight;

            // Bar
            this.ctx.fillStyle = this.colors[i % this.colors.length];
            this.ctx.fillRect(x, y, barWidth, barHeight);

            // Bar value
            this.ctx.fillStyle = '#333';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(this.data[i], x + barWidth / 2, y - 5);

            // X-axis label
            this.ctx.fillText(this.labels[i], x + barWidth / 2, this.height - padding + 20);
        }

        // Chart title
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Monthly Crop Yield (tons)', this.width / 2, 25);
    }
}

class PieChart extends ChartRenderer {
    constructor(canvasId, data) {
        super(canvasId);
        this.data = data;
    }

    draw() {
        this.clear();

        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = Math.min(centerX, centerY) - 30;

        let startAngle = 0;
        const total = this.data.reduce((sum, item) => sum + item.percentage, 0);

        // Draw pie slices
        for (let i = 0; i < this.data.length; i++) {
            const sliceAngle = (this.data[i].percentage / total) * 2 * Math.PI;
            const endAngle = startAngle + sliceAngle;

            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            this.ctx.closePath();
            this.ctx.fillStyle = this.data[i].color;
            this.ctx.fill();

            // Draw slice border
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Draw label
            const midAngle = startAngle + sliceAngle / 2;
            const labelRadius = radius * 0.7;
            const labelX = centerX + Math.cos(midAngle) * labelRadius;
            const labelY = centerY + Math.sin(midAngle) * labelRadius;

            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${this.data[i].percentage}%`, labelX, labelY);

            startAngle = endAngle;
        }

        // Draw legend
        const legendX = this.width - 150;
        const legendY = 50;

        this.data.forEach((item, i) => {
            this.ctx.fillStyle = item.color;
            this.ctx.fillRect(legendX, legendY + i * 25, 15, 15);
            
            this.ctx.fillStyle = '#333';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`${item.crop} (${item.percentage}%)`, legendX + 20, legendY + i * 25 + 12);
        });

        // Chart title
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Crop Distribution', this.width / 2, 25);
    }
}

class LineChart extends ChartRenderer {
    constructor(canvasId, data, labels, color = '#4CAF50') {
        super(canvasId);
        this.data = data;
        this.labels = labels;
        this.color = color;
    }

    draw() {
        this.clear();
        this.drawGrid(this.labels.length, 5, this.data.map((d, i) => ({ value: d })));

        const { padding } = this.options;
        const chartWidth = this.width - 2 * padding;
        const chartHeight = this.height - 2 * padding;
        const maxValue = Math.max(...this.data);

        // Calculate points
        const points = this.data.map((value, i) => {
            const x = padding + (i * chartWidth) / (this.data.length - 1);
            const y = padding + chartHeight - (value / maxValue) * chartHeight;
            return { x, y };
        });

        // Draw line
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        // Draw points
        points.forEach(point => {
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
            this.ctx.fillStyle = '#fff';
            this.ctx.fill();
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });

        // Draw labels
        this.labels.forEach((label, i) => {
            const x = padding + (i * chartWidth) / (this.labels.length - 1);
            this.ctx.fillStyle = this.options.textColor;
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(label, x, this.height - padding + 20);
        });

        // Chart title
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Annual Yield Trend', this.width / 2, 25);
    }
}

// Initialize charts when page loads
function initializeCharts() {
    // Wait for DOM to be ready
    setTimeout(() => {
        // Bar Chart - Monthly Yield
        const monthlyYield = dashboardData.monthlyYield.map(m => m.yield);
        const months = dashboardData.monthlyYield.map(m => m.month);
        const barChart = new BarChart('barChart', monthlyYield.slice(0, 6), months.slice(0, 6));
        barChart.draw();

        // Pie Chart - Crop Distribution
        const pieChart = new PieChart('pieChart', dashboardData.cropDistribution);
        pieChart.draw();

        // Line Chart - Annual Trend
        const lineChart = new LineChart('lineChart', monthlyYield, months, '#FF9800');
        lineChart.draw();
    }, 100);
}

// Redraw charts when window resizes
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initializeCharts, 250);
});