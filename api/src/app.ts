import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';

import logger from './common/logger';

import router from './router';

const app: express.Express = express();
app.use(helmet());
app.use(bodyParser.json());

app.use('/api/', router);

app.use((_, res) => (res.status(404).json({ message: 'Not Found' })));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    logger.error({ err }, 'An unexpected error occured.');
    return res.status(501).json({
        error: {
            code: 'Unknown',
            message: 'Unknown error occured',
        },
    });
});

export default app;
