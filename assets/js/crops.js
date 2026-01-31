let cropToDelete = null;

function loadCropsTable(cropsData = getCrops()) {
    const tbody = document.getElementById('cropsTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (cropsData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4">
                    <div class="text-muted">
                        <i class="fas fa-seedling fa-2x mb-3"></i>
                        <p>No crops found. Add your first crop!</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    cropsData.forEach(crop => {
        const row = document.createElement('tr');
        
        // Status badge color
        let statusClass = 'badge ';
        switch(crop.status) {
            case 'Planted': statusClass += 'bg-info'; break;
            case 'Growing': statusClass += 'bg-primary'; break;
            case 'Ready': statusClass += 'bg-warning'; break;
            case 'Harvested': statusClass += 'bg-success'; break;
            default: statusClass += 'bg-secondary';
        }
        
        row.innerHTML = `
            <td>${crop.id}</td>
            <td><strong>${crop.name}</strong></td>
            <td>${crop.type}</td>
            <td>${formatDate(crop.plantingDate)}</td>
            <td>${crop.area} acres</td>
            <td><span class="${statusClass}">${crop.status}</span></td>
            <td>
                <button class="btn btn-sm btn-warning btn-action" onclick="editCrop(${crop.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger btn-action" onclick="showDeleteModal(${crop.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

function saveCrop() {
    // Get form values
    const name = document.getElementById('cropName').value.trim();
    const type = document.getElementById('cropType').value;
    const date = document.getElementById('plantingDate').value;
    const area = document.getElementById('area').value;
    const status = document.getElementById('status').value;
    
    // Simple validation
    if (!name || !type || !date || !area) {
        alert('Please fill all required fields');
        return;
    }
    
    const cropData = {
        name: name,
        type: type,
        plantingDate: date,
        area: parseInt(area),
        status: status
    };
    
    addCrop(cropData);
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('addCropModal'));
    modal.hide();
    
    loadCropsTable();
    
    alert('Crop added successfully!');
}

function editCrop(id) {
    const crop = getCrops().find(c => c.id === id);
    if (!crop) return;
    
    document.querySelector('#addCropModal .modal-title').textContent = 'Edit Crop';
    document.getElementById('cropName').value = crop.name;
    document.getElementById('cropType').value = crop.type;
    document.getElementById('plantingDate').value = crop.plantingDate;
    document.getElementById('area').value = crop.area;
    document.getElementById('status').value = crop.status;
    
    const modal = new bootstrap.Modal(document.getElementById('addCropModal'));
    modal.show();
}

function showDeleteModal(id) {
    cropToDelete = id;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

function confirmDelete() {
    if (cropToDelete && deleteCrop(cropToDelete)) {
        loadCropsTable();
        alert('Crop deleted successfully!');
    }
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
    modal.hide();
    cropToDelete = null;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}