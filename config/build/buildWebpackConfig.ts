import webpack from "webpack";
import {BuildOptions} from "./types/config";
import {buildPlugins} from "./buildPlugins";
import {buildLoaders} from "./buildLoaders";
import {buildResolve} from "./buildResolve";
import {buildDevServer} from "./buildDevServer";

export function buildWebpackConfig(options: BuildOptions): webpack.Configuration {

    const {mode,paths, isDev} = options



    return {
        mode,
        entry: paths.entry,
        output: {

            filename: "[name][contenthash].js",
            path: paths.build,
            clean: true,
        },
        plugins: buildPlugins(options),
        module: {
            rules: buildLoaders(options),
        },

        resolve: buildResolve(options),
        optimization: {
            splitChunks: {
                chunks: "all",
                minSize: 20000,
                maxSize: 244000,
                minChunks: 1,
                maxAsyncRequests: 30,
                maxInitialRequests: 30,
                automaticNameDelimiter: '~',
                cacheGroups: {
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                    },
                },
            },
        },
        devtool:  isDev ? 'inline-source-map' : undefined,
        devServer: isDev ? buildDevServer(options) : undefined,
    }
}

