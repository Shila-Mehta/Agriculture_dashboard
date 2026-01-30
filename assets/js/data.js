// Static Data for Agriculture Dashboard

const dashboardData = {
    statistics: {
        totalCrops: 124,
        totalFarms: 18,
        totalFarmers: 42,
        totalYield: 8450 // in tons
    },
    
    crops: [
        {
            id: 1,
            name: "Wheat",
            type: "Grain",
            plantingDate: "2024-10-15",
            harvestDate: "2025-06-20",
            area: 120,
            status: "Growing",
            yield: 4200
        },
        {
            id: 2,
            name: "Corn",
            type: "Grain",
            plantingDate: "2024-11-01",
            harvestDate: "2025-08-15",
            area: 85,
            status: "Growing",
            yield: 3800
        },
        {
            id: 3,
            name: "Rice",
            type: "Grain",
            plantingDate: "2024-09-20",
            harvestDate: "2025-04-30",
            area: 65,
            status: "Planted",
            yield: 2900
        },
        {
            id: 4,
            name: "Tomatoes",
            type: "Vegetable",
            plantingDate: "2024-12-10",
            harvestDate: "2025-03-25",
            area: 15,
            status: "Ready",
            yield: 450
        },
        {
            id: 5,
            name: "Potatoes",
            type: "Vegetable",
            plantingDate: "2024-10-30",
            harvestDate: "2025-02-28",
            area: 25,
            status: "Harvested",
            yield: 750
        },
        {
            id: 6,
            name: "Cotton",
            type: "Cash Crop",
            plantingDate: "2024-11-15",
            harvestDate: "2025-09-30",
            area: 45,
            status: "Growing",
            yield: 1200
        },
        {
            id: 7,
            name: "Sugarcane",
            type: "Cash Crop",
            plantingDate: "2024-09-01",
            harvestDate: "2025-11-30",
            area: 60,
            status: "Growing",
            yield: 4200
        },
        {
            id: 8,
            name: "Apples",
            type: "Fruit",
            plantingDate: "2023-03-15",
            harvestDate: "2025-09-15",
            area: 30,
            status: "Growing",
            yield: 900
        }
    ],
    
    farmers: [
        { id: 1, name: "John Smith", contact: "+1-555-0101", farmSize: 120, crops: ["Wheat", "Corn"] },
        { id: 2, name: "Maria Garcia", contact: "+1-555-0102", farmSize: 85, crops: ["Rice", "Vegetables"] },
        { id: 3, name: "Robert Johnson", contact: "+1-555-0103", farmSize: 150, crops: ["Cotton", "Sugarcane"] },
        { id: 4, name: "Sarah Williams", contact: "+1-555-0104", farmSize: 65, crops: ["Fruits", "Vegetables"] },
        { id: 5, name: "James Brown", contact: "+1-555-0105", farmSize: 95, crops: ["Corn", "Wheat"] },
        { id: 6, name: "Emma Davis", contact: "+1-555-0106", farmSize: 45, crops: ["Organic Vegetables"] }
    ],
    
    monthlyYield: [
        { month: "Jan", yield: 1200 },
        { month: "Feb", yield: 1800 },
        { month: "Mar", yield: 2200 },
        { month: "Apr", yield: 2500 },
        { month: "May", yield: 3200 },
        { month: "Jun", yield: 3800 },
        { month: "Jul", yield: 4200 },
        { month: "Aug", yield: 4500 },
        { month: "Sep", yield: 4800 },
        { month: "Oct", yield: 5200 },
        { month: "Nov", yield: 5800 },
        { month: "Dec", yield: 6200 }
    ],
    
    cropDistribution: [
        { crop: "Wheat", percentage: 35, color: "#4CAF50" },
        { crop: "Corn", percentage: 25, color: "#2196F3" },
        { crop: "Rice", percentage: 15, color: "#FF9800" },
        { crop: "Vegetables", percentage: 12, color: "#9C27B0" },
        { crop: "Cash Crops", percentage: 8, color: "#F44336" },
        { crop: "Fruits", percentage: 5, color: "#00BCD4" }
    ],
    
    notifications: [
        { id: 1, message: "New crop 'Wheat' added successfully", time: "2 hours ago", read: false },
        { id: 2, message: "Harvest scheduled for tomorrow", time: "1 day ago", read: false },
        { id: 3, message: "System update required", time: "2 days ago", read: true }
    ]
};

// Data management functions
let cropsData = [...dashboardData.crops];

function getCrops() {
    return cropsData;
}

function addCrop(crop) {
    crop.id = cropsData.length > 0 ? Math.max(...cropsData.map(c => c.id)) + 1 : 1;
    cropsData.push(crop);
    return crop;
}

function updateCrop(updatedCrop) {
    const index = cropsData.findIndex(crop => crop.id === updatedCrop.id);
    if (index !== -1) {
        cropsData[index] = updatedCrop;
        return true;
    }
    return false;
}

function deleteCrop(id) {
    const index = cropsData.findIndex(crop => crop.id === id);
    if (index !== -1) {
        cropsData.splice(index, 1);
        return true;
    }
    return false;
}

function searchCrops(query) {
    return cropsData.filter(crop => 
        crop.name.toLowerCase().includes(query.toLowerCase()) ||
        crop.type.toLowerCase().includes(query.toLowerCase()) ||
        crop.status.toLowerCase().includes(query.toLowerCase())
    );
}