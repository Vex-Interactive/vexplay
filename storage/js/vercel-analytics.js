// Vercel Analytics and Speed Insights - inline script for all pages
(function() {
  // Inject Vercel Analytics
  const analyticsScript = document.createElement('script');
  analyticsScript.defer = true;
  analyticsScript.src = '/_vercel/insights/script.js';
  document.head.appendChild(analyticsScript);
  
  // Inject Vercel Speed Insights
  const speedInsightsScript = document.createElement('script');
  speedInsightsScript.defer = true;
  speedInsightsScript.src = '/_vercel/speed-insights/script.js';
  document.head.appendChild(speedInsightsScript);
  
  console.log('Vercel Analytics and Speed Insights loaded');
})(); 