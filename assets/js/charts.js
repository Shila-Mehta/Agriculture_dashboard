// Simple Chart Functions
function drawBarChart() {
    const canvas = document.getElementById('barChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const data = dashboardData.monthlyYield;
    const max = Math.max(...data);
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear
    ctx.clearRect(0, 0, width, height);
    
    // Draw bars
    const barWidth = (width - 80) / data.length;
    
    for (let i = 0; i < data.length; i++) {
        const barHeight = (data[i] / max) * (height - 60);
        const x = 40 + i * barWidth;
        const y = height - barHeight - 20;
        
        // Bar
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(x, y, barWidth - 10, barHeight);
        
        // Label
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        ctx.fillText(months[i], x + (barWidth - 10) / 2, height - 5);
    }
}

function drawPieChart() {
    const canvas = document.getElementById('pieChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const data = dashboardData.cropDistribution;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let startAngle = 0;
    
    // Draw slices
    for (let i = 0; i < data.length; i++) {
        const sliceAngle = (data[i].percentage / 100) * 2 * Math.PI;
        const endAngle = startAngle + sliceAngle;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = data[i].color;
        ctx.fill();
        
        startAngle = endAngle;
    }
}

function drawLineChart() {
    const canvas = document.getElementById('lineChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const data = dashboardData.monthlyYield;
    const max = Math.max(...data);
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#eee';
    for (let i = 0; i <= 5; i++) {
        const y = height - (i * height / 5);
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 3;
    
    for (let i = 0; i < data.length; i++) {
        const x = 40 + i * ((width - 60) / (data.length - 1));
        const y = height - 20 - (data[i] / max) * (height - 60);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    
    // Draw points
    for (let i = 0; i < data.length; i++) {
        const x = 40 + i * ((width - 60) / (data.length - 1));
        const y = height - 20 - (data[i] / max) * (height - 60);
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}