/**
 * Just Shapes & Beats Clone - Backend Server
 * Handles static file serving and implements security best practices.
 */
const express = require('express');
const path = require('path');
const helmet = require('helmet'); // Security headers
const rateLimit = require('express-rate-limit'); // Abuse prevention

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware: Protects against common web vulnerabilities
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for development flexibility with external assets
}));
app.disable('x-powered-by'); // Hide server technology for security

// Rate Limiting: Prevents brute-force/DoS by limiting requests per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per window
});
app.use(limiter);

// Serve static files from the root and assets directories
app.use(express.static(path.join(__dirname, '.')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

/**
 * Catch-all route: Redirects all non-file requests to index.html
 * This supports Single Page Application (SPA) routing.
 */
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
