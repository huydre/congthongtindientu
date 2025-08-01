
const express = require('express');
const router = express.Router();

// Import admin routes
const AuthRoute = require("./auth.route");
const newsRoutes = require('./news.route');
const usersRoutes = require('./users.route');

// Dashboard overview endpoint
router.get('/', (req, res) => {
  res.json({ 
    message: 'Admin API is working',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Admin routes
router.use('/news', newsRoutes);
router.use('/users', usersRoutes);

module.exports = (app) => {
    app.use("/auth", AuthRoute);
    app.use("/admin", router);
};