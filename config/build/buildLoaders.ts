import webpack from "webpack";
import {BuildOptions} from "./types/config";
import {cssLoader} from "./loaders/cssLoader";
import {babelLoader} from "./loaders/babelLoader";
import {svgLoader} from "./loaders/svgLoader";



export function buildLoaders({isDev}:BuildOptions): webpack.RuleSetRule[] {
    const svgLoaders = svgLoader()
    const babelLoaders = babelLoader()

    const [cssLoaders,sassLoaders]= cssLoader(isDev);

    const typescriptLoader = {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
    }

    return  [
        babelLoaders,
        typescriptLoader,
        cssLoaders,
        sassLoaders,
        svgLoaders

    ]
}

