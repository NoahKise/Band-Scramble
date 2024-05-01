module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            // Add the necessary webpack configuration here
            webpackConfig.resolve.fallback = {
                "path": require.resolve("path-browserify")
            };
            return webpackConfig;
        }
    }
};