'use strict';

var prometheus = require('prom-client');

function miscRouters(opts, controllers, router, authenticateToken){
      // Expose metrics endpoint for Prometheus to scrape
    router.get('/metrics', (req, res) => {
        res.set('Content-Type', prometheus.register.contentType);
        opts.monitor.registry.metrics()
            .then(function(data){
              res.set('Content-Type', opts.monitor.registry.contentType);
              res.end(data);
            }).catch(function(err){
              res.status(500)
                .json({
                  message: 'some error'
                })
            })
    });
}

module.exports = miscRouters;
