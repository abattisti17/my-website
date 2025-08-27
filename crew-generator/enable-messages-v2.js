// Quick script to enable Messages UI v2 in the browser
// Run this in the browser console or add it as a bookmark

console.log('🚩 Enabling Messages UI v2...');

// Set feature flag in localStorage
localStorage.setItem('feature_flag_MESSAGES_UI', 'true');

console.log('✅ Messages UI v2 enabled!');
console.log('📍 Visit: http://localhost:5173/examples/messages');
console.log('🔄 Refresh the page to see the new UI');

// Auto-navigate to examples page if on localhost
if (window.location.hostname === 'localhost') {
    const currentPath = window.location.pathname;
    if (currentPath !== '/examples/messages') {
        console.log('🚀 Navigating to examples page...');
        window.location.href = '/examples/messages';
    } else {
        console.log('🔄 Refreshing to apply feature flag...');
        window.location.reload();
    }
}
