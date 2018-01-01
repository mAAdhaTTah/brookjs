import https from 'https';
import path from 'path';
import { Kefir } from 'brookjs';
import fs from 'fs-extra';
import express from 'express';
import favicon from 'serve-favicon';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { selectWebpackConfig } from '../selectors';
import WebpackService from './WebpackService';

export const listen = (app, router, state) => Kefir.stream(emitter => {
    app.use(router);

    let server = app;

    if (state.storybook.https.enabled) {
        const sslOptions = {
            ca: (state.storybook.https.ca || []).map(ca => fs.readFileSync(ca, 'utf-8')),
            cert: fs.readFileSync(state.storybook.https.cert, 'utf-8'),
            key: fs.readFileSync(state.storybook.https.key, 'utf-8'),
        };

        server = https.createServer(sslOptions, app);
    }

    const listenAddr = [state.storybook.port];

    if (state.storybook.host) {
        listenAddr.push(state.storybook.host);
    }

    server.listen(...listenAddr, error => {
        if (error) {
            emitter.error(error);
        } else {
            const proto = state.storybook.https.enabled ? 'https' : 'http';
            emitter.value({
                server,
                address: `${proto}://${state.storybook.host || 'localhost'}:${state.storybook.port}/`
            });
        }

        emitter.end();
    });
});

export const createRouter = (state) => {
    const config = selectWebpackConfig(state);

    return WebpackService.create(config).flatMap(instance => instance.compiler())
        .flatMap(compiler => Kefir.stream(emitter => {
            const devMiddlewareOptions = {
                noInfo: true,
                publicPath: config.output.publicPath,
                watchOptions: config.watchOptions || {},
                serverSideRender: true,
                logLevel: 'silent',
                ...state.storybook.devServer,
            };

            const router = new express.Router();

            const webpackDevMiddlewareInstance = webpackDevMiddleware(compiler, devMiddlewareOptions);
            router.use(webpackDevMiddlewareInstance);
            router.use(webpackHotMiddleware(compiler));

            state.storybook.middleware(router, state);

            webpackDevMiddlewareInstance.waitUntilValid(stats => {
                router.get('/', (req, res) => {
                    const { assetsByChunkName } = res.locals.webpackStats.toJson();

                    res.set('Content-Type', 'text/html');
                    res.send(`<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="storybook-version" content="${ /* @todo */ '1.0.0'}">
    <meta content="IE=edge" http-equiv="X-UA-Compatible" />
    <title>Storybook</title>
    <style>
        /*
          When resizing panels, the drag event breaks if the cursor
          moves over the iframe. Add the 'dragging' class to the body
          at drag start and remove it when the drag ends.
         */
        .dragging iframe {
            pointer-events: none;
        }

        /* Styling the fuzzy search box placeholders */
        .searchBox::-webkit-input-placeholder { /* Chrome/Opera/Safari */
            color: #ddd;
            font-size: 16px;
        }

        .searchBox::-moz-placeholder { /* Firefox 19+ */
            color: #ddd;
            font-size: 16px;
        }

        .searchBox:focus{
            border-color: #EEE !important;
        }

        .btn:hover{
            background-color: #eee
        }
    </style>
</head>
<body style="margin: 0;">
    <div id="root"></div>
    <script src="${config.output.publicPath + assetsByChunkName.manager}"></script>
</body>
</html>`);
                });

                router.get('/iframe.html', (req, res) => {
                    const { assetsByChunkName } = res.locals.webpackStats.toJson();

                    res.set('Content-Type', 'text/html');
                    res.send(`<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <base target="_parent">
    <title>Storybook</title>
</head>
<body>
<div id="root"></div>
<script src="${config.output.publicPath + assetsByChunkName.preview}"></script>
</body>
</html>`);
                });

                if (stats.toJson().errors.length) {
                    emitter.error(new Error(stats.toString({ colors: true })));
                } else {
                    emitter.value(router);
                }

                emitter.end();
            });
        }));
};

export const createApp = state => Kefir.fromCallback(callback => {
    const app = express();
    let hasCustomFavicon = false;

    if (state.storybook.staticDirs.length) {
        state.storybook.staticDirs.forEach(dir => {
            const staticPath = path.resolve(state.env.cwd, dir);
            app.use(express.static(staticPath, { index: false }));

            const faviconPath = path.resolve(staticPath, 'favicon.ico');
            if (fs.existsSync(faviconPath)) {
                hasCustomFavicon = true;
                app.use(favicon(faviconPath));
            }
        });
    }

    if (!hasCustomFavicon) {
        app.use(favicon(path.resolve(__dirname, 'favicon.ico')));
    }

    callback(app);
});
