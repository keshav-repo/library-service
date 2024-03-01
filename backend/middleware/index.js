let latencyMiddleware = require('./latency');

function middleware(app, opts){
    let self = this;
    let middleware = {};
    self.latency = new latencyMiddleware(app, opts);
}

module.exports = middleware;
