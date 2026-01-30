// Sidebar and Navigation Management

class SidebarManager {
    constructor() {
        this.initEventListeners();
        this.setupNavigation();
        this.updateActiveNav();
    }

    initEventListeners() {
        // Desktop sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Mobile sidebar toggle
        const sidebarToggleMobile = document.getElementById('sidebarToggleMobile');
        if (sidebarToggleMobile) {
            sidebarToggleMobile.addEventListener('click', () => this.toggleMobileSidebar());
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Close mobile sidebar when clicking on overlay
        document.addEventListener('click', (e) => {
            const overlay = document.querySelector('.sidebar-overlay');
            if (overlay && overlay.contains(e.target)) {
                this.closeMobileSidebar();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    setupNavigation() {
        // Navigation links
        document.querySelectorAll('#sidebar .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.closest('a').dataset.page;
                this.navigateTo(page);
                
                // Update active nav
                this.updateActiveNav(page);
                
                // Close mobile sidebar on mobile
                if (window.innerWidth < 768) {
                    this.closeMobileSidebar();
                }
            });
        });
    }

    navigateTo(page) {
        // Update page title
        const pageTitle = document.getElementById('pageTitle');
        const pageContent = document.getElementById('pageContent');
        
        // Show loading
        pageContent.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
        
        // Simulate loading delay
        setTimeout(() => {
            switch(page) {
                case 'dashboard':
                    pageTitle.textContent = 'Dashboard';
                    this.loadDashboard();
                    break;
                case 'crops':
                    pageTitle.textContent = 'Crops Management';
                    this.loadCropsPage();
                    break;
                case 'farmers':
                    pageTitle.textContent = 'Farmers';
                    this.loadFarmersPage();
                    break;
                case 'reports':
                    pageTitle.textContent = 'Reports';
                    this.loadReportsPage();
                    break;
                case 'settings':
                    pageTitle.textContent = 'Settings';
                    this.loadSettingsPage();
                    break;
            }
        }, 300);
    }

    loadDashboard() {
        const pageContent = document.getElementById('pageContent');
        const stats = dashboardData.statistics;
        
        pageContent.innerHTML = `
            <div class="container-fluid py-4">
                <!-- Statistics Cards -->
                <div class="row mb-4">
                    <div class="col-xl-3 col-md-6">
                        <div class="card stat-card">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="card-icon crops me-3">
                                        <i class="fas fa-seedling"></i>
                                    </div>
                                    <div>
                                        <h6 class="text-muted mb-1">Total Crops</h6>
                                        <h2 id="totalCrops">${stats.totalCrops}</h2>
                                        <p class="mb-0 text-success">
                                            <i class="fas fa-arrow-up me-1"></i> 12% from last month
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-xl-3 col-md-6">
                        <div class="card stat-card">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="card-icon farms me-3">
                                        <i class="fas fa-tractor"></i>
                                    </div>
                                    <div>
                                        <h6 class="text-muted mb-1">Total Farms</h6>
                                        <h2 id="totalFarms">${stats.totalFarms}</h2>
                                        <p class="mb-0 text-success">
                                            <i class="fas fa-arrow-up me-1"></i> 8% from last month
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-xl-3 col-md-6">
                        <div class="card stat-card">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="card-icon farmers me-3">
                                        <i class="fas fa-users"></i>
                                    </div>
                                    <div>
                                        <h6 class="text-muted mb-1">Total Farmers</h6>
                                        <h2 id="totalFarmers">${stats.totalFarmers}</h2>
                                        <p class="mb-0 text-success">
                                            <i class="fas fa-arrow-up me-1"></i> 5% from last month
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-xl-3 col-md-6">
                        <div class="card stat-card">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="card-icon yield me-3">
                                        <i class="fas fa-weight-hanging"></i>
                                    </div>
                                    <div>
                                        <h6 class="text-muted mb-1">Total Yield</h6>
                                        <h2 id="totalYield">${stats.totalYield.toLocaleString()} tons</h2>
                                        <p class="mb-0 text-success">
                                            <i class="fas fa-arrow-up me-1"></i> 15% from last month
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Charts Section -->
                <div class="row">
                    <div class="col-lg-8">
                        <div class="chart-container">
                            <h4><i class="fas fa-chart-bar me-2"></i>Monthly Yield Overview</h4>
                            <canvas id="barChart" width="400" height="250"></canvas>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="chart-container">
                            <h4><i class="fas fa-chart-pie me-2"></i>Crop Distribution</h4>
                            <canvas id="pieChart" width="300" height="250"></canvas>
                        </div>
                    </div>
                </div>
                
                <div class="row mt-4">
                    <div class="col-12">
                        <div class="chart-container">
                            <h4><i class="fas fa-chart-line me-2"></i>Annual Yield Trend</h4>
                            <canvas id="lineChart" width="800" height="300"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Initialize charts
        initializeCharts();
    }

    loadCropsPage() {
        const pageContent = document.getElementById('pageContent');
        
        pageContent.innerHTML = `
            <div class="container-fluid py-4">
                <!-- Page Header -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 class="mb-1">Crops Management</h3>
                        <p class="text-muted mb-0">Manage all crops across your farms</p>
                    </div>
                    <button class="btn btn-primary" id="addCropBtn">
                        <i class="fas fa-plus me-2"></i>Add New Crop
                    </button>
                </div>
                
                <!-- Search and Filter -->
                <div class="row mb-4">
                    <div class="col-md-6">
                        <div class="input-group search-box">
                            <span class="input-group-text">
                                <i class="fas fa-search"></i>
                            </span>
                            <input type="text" class="form-control" id="cropSearch" placeholder="Search crops by name, type, or status...">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="d-flex justify-content-end">
                            <div class="btn-group">
                                <button class="btn btn-outline-secondary active">All</button>
                                <button class="btn btn-outline-secondary">Active</button>
                                <button class="btn btn-outline-secondary">Harvested</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Crops Table -->
                <div class="table-container">
                    <div class="table-responsive">
                        <table class="table table-hover" id="cropsTable">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Crop Name</th>
                                    <th>Type</th>
                                    <th>Planting Date</th>
                                    <th>Harvest Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Crops will be loaded here -->
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Table Footer -->
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <div class="text-muted">
                            Showing <span id="showingCount">0</span> of <span id="totalCount">0</span> crops
                        </div>
                        <nav>
                            <ul class="pagination pagination-sm mb-0">
                                <li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>
                                <li class="page-item active"><a class="page-link" href="#">1</a></li>
                                <li class="page-item"><a class="page-link" href="#">2</a></li>
                                <li class="page-item"><a class="page-link" href="#">Next</a></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        `;
        
        // Initialize crops manager and render table
        if (!cropsManager) {
            initializeCropsManager();
        }
        cropsManager.renderCropsTable();
        
        // Add event listener for add crop button
        document.getElementById('addCropBtn').addEventListener('click', () => {
            cropsManager.showAddModal();
        });
        
        // Update counts
        this.updateCropCounts();
    }

    loadFarmersPage() {
        const pageContent = document.getElementById('pageContent');
        
        pageContent.innerHTML = `
            <div class="container-fluid py-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 class="mb-1">Farmers Management</h3>
                        <p class="text-muted mb-0">Manage farmer profiles and assignments</p>
                    </div>
                    <button class="btn btn-primary">
                        <i class="fas fa-plus me-2"></i>Add Farmer
                    </button>
                </div>
                
                <!-- Farmers Grid -->
                <div class="row">
                    ${dashboardData.farmers.map(farmer => `
                        <div class="col-md-6 col-lg-4 mb-4">
                            <div class="card farmer-card">
                                <div class="card-body text-center">
                                    <div class="mb-3">
                                        <div class="farmer-avatar mx-auto">
                                            <i class="fas fa-user-circle fa-3x text-primary"></i>
                                        </div>
                                    </div>
                                    <h5 class="card-title">${farmer.name}</h5>
                                    <p class="text-muted">
                                        <i class="fas fa-phone me-2"></i>${farmer.contact}
                                    </p>
                                    <div class="d-flex justify-content-between text-center mt-3">
                                        <div>
                                            <h6 class="text-muted mb-1">Farm Size</h6>
                                            <p class="mb-0 fw-bold">${farmer.farmSize} acres</p>
                                        </div>
                                        <div>
                                            <h6 class="text-muted mb-1">Crops</h6>
                                            <p class="mb-0 fw-bold">${farmer.crops.length}</p>
                                        </div>
                                    </div>
                                    <div class="mt-3">
                                        <button class="btn btn-outline-primary btn-sm me-2">View</button>
                                        <button class="btn btn-outline-secondary btn-sm">Message</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    loadReportsPage() {
        const pageContent = document.getElementById('pageContent');
        
        pageContent.innerHTML = `
            <div class="container-fluid py-4">
                <h3 class="mb-4">Reports & Analytics</h3>
                
                <div class="row">
                    <div class="col-lg-6 mb-4">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">Monthly Production Report</h5>
                            </div>
                            <div class="card-body">
                                <canvas id="reportChart1" height="200"></canvas>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-6 mb-4">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">Crop Performance</h5>
                            </div>
                            <div class="card-body">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Wheat
                                        <span class="badge bg-success rounded-pill">+15%</span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Corn
                                        <span class="badge bg-success rounded-pill">+8%</span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Rice
                                        <span class="badge bg-warning rounded-pill">-2%</span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Vegetables
                                        <span class="badge bg-success rounded-pill">+12%</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Export Reports</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <button class="btn btn-outline-primary w-100">
                                    <i class="fas fa-file-pdf me-2"></i>Export as PDF
                                </button>
                            </div>
                            <div class="col-md-4 mb-3">
                                <button class="btn btn-outline-success w-100">
                                    <i class="fas fa-file-excel me-2"></i>Export as Excel
                                </button>
                            </div>
                            <div class="col-md-4 mb-3">
                                <button class="btn btn-outline-secondary w-100">
                                    <i class="fas fa-print me-2"></i>Print Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadSettingsPage() {
        const pageContent = document.getElementById('pageContent');
        
        pageContent.innerHTML = `
            <div class="container-fluid py-4">
                <h3 class="mb-4">Settings</h3>
                
                <div class="row">
                    <div class="col-lg-8">
                        <div class="card mb-4">
                            <div class="card-header">
                                <h5 class="mb-0">Profile Settings</h5>
                            </div>
                            <div class="card-body">
                                <form>
                                    <div class="row mb-3">
                                        <div class="col-md-6">
                                            <label class="form-label">Full Name</label>
                                            <input type="text" class="form-control" value="John Farmer">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">Email</label>
                                            <input type="email" class="form-control" value="john@example.com">
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Role</label>
                                        <input type="text" class="form-control" value="Farm Manager" readonly>
                                    </div>
                                    <button type="submit" class="btn btn-primary">Update Profile</button>
                                </form>
                            </div>
                        </div>
                        
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">Notification Preferences</h5>
                            </div>
                            <div class="card-body">
                                <div class="form-check mb-3">
                                    <input class="form-check-input" type="checkbox" id="notif1" checked>
                                    <label class="form-check-label" for="notif1">
                                        Crop status updates
                                    </label>
                                </div>
                                <div class="form-check mb-3">
                                    <input class="form-check-input" type="checkbox" id="notif2" checked>
                                    <label class="form-check-label" for="notif2">
                                        Harvest alerts
                                    </label>
                                </div>
                                <div class="form-check mb-3">
                                    <input class="form-check-input" type="checkbox" id="notif3">
                                    <label class="form-check-label" for="notif3">
                                        Weather warnings
                                    </label>
                                </div>
                                <button class="btn btn-primary">Save Preferences</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-4">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">System Information</h5>
                            </div>
                            <div class="card-body">
                                <div class="mb-3">
                                    <small class="text-muted">Version</small>
                                    <p class="mb-0">v2.1.0</p>
                                </div>
                                <div class="mb-3">
                                    <small class="text-muted">Last Updated</small>
                                    <p class="mb-0">January 15, 2025</p>
                                </div>
                                <div class="mb-3">
                                    <small class="text-muted">Data Usage</small>
                                    <div class="progress mt-2" style="height: 10px;">
                                        <div class="progress-bar" role="progressbar" style="width: 65%"></div>
                                    </div>
                                </div>
                                <button class="btn btn-outline-danger w-100 mt-3">
                                    <i class="fas fa-trash me-2"></i>Clear All Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('collapsed');
        
        // Update toggle button icon
        const toggleBtn = document.getElementById('sidebarToggle');
        const icon = toggleBtn.querySelector('i');
        if (sidebar.classList.contains('collapsed')) {
            icon.className = 'fas fa-bars';
        } else {
            icon.className = 'fas fa-times';
        }
    }

    toggleMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('show');
        
        // Create or remove overlay
        let overlay = document.querySelector('.sidebar-overlay');
        if (sidebar.classList.contains('show')) {
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'sidebar-overlay';
                document.body.appendChild(overlay);
            }
            overlay.classList.add('show');
        } else if (overlay) {
            overlay.classList.remove('show');
        }
    }

    closeMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.remove('show');
        
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    }

    updateActiveNav(activePage = 'dashboard') {
        document.querySelectorAll('#sidebar .nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === activePage) {
                link.classList.add('active');
            }
        });
    }

    updateCropCounts() {
        const crops = getCrops();
        const showingCount = document.getElementById('showingCount');
        const totalCount = document.getElementById('totalCount');
        
        if (showingCount && totalCount) {
            showingCount.textContent = crops.length;
            totalCount.textContent = crops.length;
        }
    }

    handleResize() {
        // Auto-close mobile sidebar on resize to desktop
        if (window.innerWidth >= 768) {
            this.closeMobileSidebar();
            document.getElementById('sidebar').classList.remove('collapsed');
        }
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            // Show logout message
            const pageContent = document.getElementById('pageContent');
            pageContent.innerHTML = `
                <div class="container-fluid py-4">
                    <div class="row justify-content-center mt-5">
                        <div class="col-md-6 text-center">
                            <div class="card">
                                <div class="card-body py-5">
                                    <i class="fas fa-sign-out-alt fa-3x text-primary mb-4"></i>
                                    <h3 class="mb-3">Logged Out Successfully</h3>
                                    <p class="text-muted mb-4">You have been logged out of the system.</p>
                                    <button class="btn btn-primary" id="loginAgainBtn">
                                        <i class="fas fa-sign-in-alt me-2"></i>Login Again
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Add login again button event
            document.getElementById('loginAgainBtn').addEventListener('click', () => {
                location.reload();
            });
        }
    }
}

// Initialize sidebar manager
let sidebarManager;

function initializeSidebarManager() {
    sidebarManager = new SidebarManager();
    return sidebarManager;
}