const dashboardData = {
    statistics: {
        totalCrops: 24,
        totalFarms: 8,
        totalFarmers: 15,
        totalYield: 2450
    },
    
    crops: [
        {
            id: 1,
            name: "Wheat",
            type: "Grain",
            plantingDate: "2024-10-15",
            area: 120,
            status: "Growing"
        },
        {
            id: 2,
            name: "Corn",
            type: "Grain",
            plantingDate: "2024-11-01",
            area: 85,
            status: "Growing"
        },
        {
            id: 3,
            name: "Tomatoes",
            type: "Vegetable",
            plantingDate: "2024-12-10",
            area: 15,
            status: "Ready"
        },
        {
            id: 4,
            name: "Potatoes",
            type: "Vegetable",
            plantingDate: "2024-10-30",
            area: 25,
            status: "Harvested"
        }
    ],
    
    monthlyYield: [1200, 1800, 2200, 2500, 3200, 3800],
    
    cropDistribution: [
        { crop: "Wheat", percentage: 35, color: "#4CAF50" },
        { crop: "Corn", percentage: 25, color: "#2196F3" },
        { crop: "Vegetables", percentage: 20, color: "#FF9800" },
        { crop: "Cash Crops", percentage: 15, color: "#9C27B0" },
        { crop: "Fruits", percentage: 5, color: "#00BCD4" }
    ]
};

let crops = [...dashboardData.crops];

function getCrops() {
    return crops;
}

function addCrop(crop) {
    crop.id = crops.length > 0 ? Math.max(...crops.map(c => c.id)) + 1 : 1;
    crops.push(crop);
    dashboardData.statistics.totalCrops = crops.length;
    return crop;
}

function updateCrop(id, updatedCrop) {
    const index = crops.findIndex(c => c.id === id);
    if (index !== -1) {
        crops[index] = { ...crops[index], ...updatedCrop };
        return true;
    }
    return false;
}

function deleteCrop(id) {
    const index = crops.findIndex(c => c.id === id);
    if (index !== -1) {
        crops.splice(index, 1);
        dashboardData.statistics.totalCrops = crops.length;
        return true;
    }
    return false;
}

function searchCrops(query) {
    return crops.filter(crop => 
        crop.name.toLowerCase().includes(query.toLowerCase()) ||
        crop.type.toLowerCase().includes(query.toLowerCase())
    );
}