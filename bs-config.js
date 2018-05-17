// install all tools locally run 'npm install'
// then in Stellar folder run 'npm run php' and keep it running open another terminal and run 'npm run dev'
// in package.json scripts section I added this "php": "php -S 0.0.0.0:8181 -t public"
// Note: change the api proxy to ur php server in "target: 'http://127.0.0.1:8181', "
var proxyMiddleware = require('http-proxy-middleware');
var fallbackMiddleware = require('connect-history-api-fallback');

module.exports = {
    injectChanges: true,
    // port: 8000,
    watchOptions: { ignored: 'node_modules' },
    files: ['./public/**/*.{html,htm,css,js}'],
    server: {
        baseDir: './public',
        middleware: {
            1: proxyMiddleware('/api', {
                target: 'http://127.0.0.1:8181',
                changeOrigin: true   // for vhosted sites, changes host header to match to target's host
            }),

            2: fallbackMiddleware({
                index: '/index.html', verbose: true
            })
        }
    }
};
