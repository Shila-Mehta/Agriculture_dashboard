// Crops Management Module

class CropsManager {
    constructor() {
        this.currentCropId = null;
        this.deleteCropId = null;
        this.initEventListeners();
    }

    initEventListeners() {
        // Save Crop Button
        document.getElementById('saveCropBtn').addEventListener('click', () => this.saveCrop());
        
        // Confirm Delete Button
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => this.confirmDelete());
        
        // Search functionality
        const searchInput = document.getElementById('cropSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchCrops(e.target.value));
        }
    }

    renderCropsTable(crops = getCrops()) {
        const tableBody = document.querySelector('#cropsTable tbody');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        if (crops.length === 0) {
            tableBody.innerHTML = `
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

        crops.forEach(crop => {
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
                <td>${this.formatDate(crop.plantingDate)}</td>
                <td>${this.formatDate(crop.harvestDate)}</td>
                <td><span class="${statusClass}">${crop.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary btn-action edit-crop" data-id="${crop.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger btn-action delete-crop" data-id="${crop.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Add event listeners to action buttons
        this.addTableEventListeners();
    }

    addTableEventListeners() {
        // Edit buttons
        document.querySelectorAll('.edit-crop').forEach(button => {
            button.addEventListener('click', (e) => {
                const cropId = parseInt(e.target.closest('button').dataset.id);
                this.editCrop(cropId);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-crop').forEach(button => {
            button.addEventListener('click', (e) => {
                const cropId = parseInt(e.target.closest('button').dataset.id);
                this.showDeleteModal(cropId);
            });
        });
    }

    showAddModal() {
        this.currentCropId = null;
        document.getElementById('modalTitle').textContent = 'Add New Crop';
        document.getElementById('cropForm').reset();
        
        // Clear validation classes
        document.querySelectorAll('#cropForm .form-control').forEach(input => {
            input.classList.remove('is-invalid');
        });
        
        // Set today's date as default for planting date
        document.getElementById('plantingDate').valueAsDate = new Date();
        
        // Set harvest date to 6 months from now
        const harvestDate = new Date();
        harvestDate.setMonth(harvestDate.getMonth() + 6);
        document.getElementById('harvestDate').valueAsDate = harvestDate;
        
        const modal = new bootstrap.Modal(document.getElementById('cropModal'));
        modal.show();
    }

    editCrop(id) {
        const crop = getCrops().find(c => c.id === id);
        if (!crop) return;

        this.currentCropId = id;
        document.getElementById('modalTitle').textContent = 'Edit Crop';
        
        // Fill form with crop data
        document.getElementById('cropId').value = crop.id;
        document.getElementById('cropName').value = crop.name;
        document.getElementById('cropType').value = crop.type;
        document.getElementById('plantingDate').value = crop.plantingDate;
        document.getElementById('harvestDate').value = crop.harvestDate;
        document.getElementById('area').value = crop.area;
        document.getElementById('status').value = crop.status;
        
        // Clear validation classes
        document.querySelectorAll('#cropForm .form-control').forEach(input => {
            input.classList.remove('is-invalid');
        });
        
        const modal = new bootstrap.Modal(document.getElementById('cropModal'));
        modal.show();
    }

    saveCrop() {
        const form = document.getElementById('cropForm');
        const inputs = form.querySelectorAll('input, select');
        let isValid = true;

        // Validate form
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                input.classList.remove('is-invalid');
            }
        });

        if (!isValid) return;

        // Get form data
        const cropData = {
            id: this.currentCropId || 0,
            name: document.getElementById('cropName').value,
            type: document.getElementById('cropType').value,
            plantingDate: document.getElementById('plantingDate').value,
            harvestDate: document.getElementById('harvestDate').value,
            area: parseInt(document.getElementById('area').value),
            status: document.getElementById('status').value,
            yield: Math.floor(Math.random() * 1000) + 500 // Random yield for demo
        };

        // Save crop
        if (this.currentCropId) {
            // Update existing crop
            updateCrop(cropData);
            this.showNotification('Crop updated successfully!', 'success');
        } else {
            // Add new crop
            addCrop(cropData);
            this.showNotification('Crop added successfully!', 'success');
        }

        // Close modal and refresh table
        bootstrap.Modal.getInstance(document.getElementById('cropModal')).hide();
        this.renderCropsTable();
        
        // Update dashboard stats if on dashboard
        if (document.getElementById('pageTitle').textContent === 'Dashboard') {
            updateDashboardStats();
        }
    }

    showDeleteModal(id) {
        this.deleteCropId = id;
        const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    }

    confirmDelete() {
        if (this.deleteCropId && deleteCrop(this.deleteCropId)) {
            this.showNotification('Crop deleted successfully!', 'success');
            this.renderCropsTable();
            
            // Update dashboard stats
            if (document.getElementById('pageTitle').textContent === 'Dashboard') {
                updateDashboardStats();
            }
        }
        
        bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
        this.deleteCropId = null;
    }

    searchCrops(query) {
        if (query.trim() === '') {
            this.renderCropsTable();
        } else {
            const results = searchCrops(query);
            this.renderCropsTable(results);
        }
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 1100;
            min-width: 300px;
        `;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// Initialize crops manager
let cropsManager;

function initializeCropsManager() {
    cropsManager = new CropsManager();
    return cropsManager;
}