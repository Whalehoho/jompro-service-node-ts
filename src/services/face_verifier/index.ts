import type { Config } from '~/api';

import https from 'https';
import fs from 'fs';
import cors from 'cors';
import config from 'config';
import logger from 'logger';
import express from 'express';
import cookieParser from 'cookie-parser';
import listEndpoints from 'express-list-endpoints';
import axios from 'axios';
import { request } from 'http';
import { success, failure } from '@/api/util';


import type * as API from '~/api/event';

const options = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.cert')
};

const pythonConfig = config.get<Config>('face_verifier_engine');

// const log = logger('RECOMMENDER', 'PYTHON API');

// const app = express();

// app.set('trust proxy', true);

// app.use(cors({ origin: "*" }));
// app.use(cookieParser());
// app.use(express.json());

export const verifyFace = async (event: any) => {
    try {
      console.log(event);
      const response = await axios.post(`http://${pythonConfig.host}:${pythonConfig.port}/verify_face`, event);
      console.log('response',response.data);
      return response.data;
    } catch (error) {
      return { error: error.message };
    }
};




