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

const pythonConfig = config.get<Config>('event_recommender_engine');

// const log = logger('RECOMMENDER', 'PYTHON API');

// const app = express();

// app.set('trust proxy', true);

// app.use(cors({ origin: "*" }));
// app.use(cookieParser());
// app.use(express.json());

export const addEvent = async (event: any) => {
    try {
      console.log(event);
      const response = await axios.post(`http://${pythonConfig.host}:${pythonConfig.port}/add_event`, event);
      return response.data;
    } catch (error) {
      return { error: error.message };
    }
};

export const joinEvent = async (event: any) => {
    try {
      console.log(event);
      const response = await axios.post(`http://${pythonConfig.host}:${pythonConfig.port}/join_event`, event);
      return response.data;
    } catch (error) {
      return { error: error.message };
    }
};

export const getRecommendations: API.getRecommendations = async (request, response) => {
  try {
    console.log(request.body);
    const data = request.body;
    const axiosResponse = await axios.post(`http://${pythonConfig.host}:${pythonConfig.port}/recommend`, data);
    console.log(axiosResponse.data);
    success(response, { data: axiosResponse.data });
  } catch (error) {
    return { error: error.message };
  }
};




