
function latency(app, opts) {
    // Middleware to measure API request latency
    app.use((req, res, next) => {
        if (req.path === '/metrics') {
            return next();
        }
        const startTime = process.hrtime();
        res.on('finish', () => {
            const elapsedTime = process.hrtime(startTime);
            const elapsedTimeInMs = elapsedTime[0] * 1000 + elapsedTime[1] / 1e6;
            opts.monitor.apiLatencyHistogram.observe({ route: req.path, method: req.method }, elapsedTimeInMs / 1000);
        });
        next();
    });
}

module.exports = latency;
