/**
 * Online Donation Management System - Global Client Utilities
 * Shared helper functions for currency formatting, API calls, and toasts
 */

window.DonationApp = {
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(Number(amount) || 0);
  },

  async api(url, options = {}) {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || 'Request failed.');
    return data;
  },

  showToast(message, type = 'info') {
    let box = document.getElementById('toastBox');
    if (!box) {
      box = document.createElement('div');
      box.id = 'toastBox';
      box.className = 'toast-box';
      document.body.appendChild(box);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;
    box.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  }
};
