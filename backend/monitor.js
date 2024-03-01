const prometheus = require('prom-client');

var monitoring = {
     registry : new prometheus.Registry()
}

// Define a custom counter metric for the number of books fetched
monitoring.booksFetchedCounter = new prometheus.Counter({
  name: 'books_fetched_total',
  help: 'Total number of books fetched from the API',
  registers: [monitoring.registry]
});

monitoring.apiLatencyHistogram = new prometheus.Histogram({
  name: 'api_request_latency_seconds',
  help: 'API request latency in seconds',
  labelNames: ['route', 'method'],
  registers: [monitoring.registry],
  buckets: [5, 10, 25, 50, 100, 250, 500, 1000]
});

module.exports = monitoring; 
