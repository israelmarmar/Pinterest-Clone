module.exports = {
	mode: 'development',
    entry: './app.js',
    output: {
    	
        filename: 'app.js'
    },

    module: {
    rules: [{
        test: /\.js/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
            presets: ['es2015','react']
        }
    }]
	}
}