// Main Application Initialization

class AgricultureDashboard {
    constructor() {
        this.initializeApp();
    }

    initializeApp() {
        // Check if all required elements exist
        if (!this.checkRequiredElements()) {
            console.error('Required elements not found. Please check your HTML structure.');
            return;
        }

        // Initialize managers
        this.sidebarManager = initializeSidebarManager();
        this.cropsManager = initializeCropsManager();
        
        // Set initial page
        this.loadInitialPage();
        
        // Initialize charts
        initializeCharts();
        
        // Set up global event listeners
        this.setupGlobalListeners();
        
        // Update notification badge
        this.updateNotificationBadge();
        
        console.log('Agriculture Dashboard initialized successfully!');
    }

    checkRequiredElements() {
        const requiredIds = ['sidebar', 'pageTitle', 'pageContent'];
        return requiredIds.every(id => document.getElementById(id));
    }

    loadInitialPage() {
        // Load dashboard by default
        this.sidebarManager.navigateTo('dashboard');
    }

    setupGlobalListeners() {
        // Add any global event listeners here
        
        // Example: Update stats when crops are modified
        document.addEventListener('cropsUpdated', () => {
            this.updateDashboardStats();
        });
    }

    updateDashboardStats() {
        // Update statistics on dashboard
        const stats = {
            totalCrops: getCrops().length,
            totalFarms: dashboardData.statistics.totalFarms,
            totalFarmers: dashboardData.statistics.totalFarmers,
            totalYield: getCrops().reduce((sum, crop) => sum + (crop.yield || 0), 0)
        };
        
        // Update DOM if on dashboard
        if (document.getElementById('pageTitle').textContent === 'Dashboard') {
            document.getElementById('totalCrops').textContent = stats.totalCrops;
            document.getElementById('totalYield').textContent = stats.totalYield.toLocaleString() + ' tons';
        }
    }

    updateNotificationBadge() {
        const unreadCount = dashboardData.notifications.filter(n => !n.read).length;
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }

    // Utility function to show loading
    showLoading(show = true) {
        const loader = document.getElementById('loadingOverlay');
        if (show && !loader) {
            const overlay = document.createElement('div');
            overlay.id = 'loadingOverlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255,255,255,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            `;
            overlay.innerHTML = '<div class="spinner"></div>';
            document.body.appendChild(overlay);
        } else if (!show && loader) {
            loader.remove();
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.agricultureDashboard = new AgricultureDashboard();
});

// Export for debugging
window.app = {
    dashboard: null,
    cropsManager: null,
    sidebarManager: null,
    data: dashboardData
};