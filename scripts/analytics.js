// Google Analytics (GA4) tracking setup
(function() {
  // Load the gtag.js library
  var script = document.createElement('script');
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-FD9E0CDMTS";
  document.head.appendChild(script);

  // Initialize the dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;

  // Configure Google Analytics
  gtag('js', new Date());
  gtag('config', 'G-FD9E0CDMTS');
})();

