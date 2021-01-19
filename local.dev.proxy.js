module.exports = {
    proxy: {
        "/api": {
            "target": "http://localhost:8090",
            "changeOrigin": true
        }
    }
}