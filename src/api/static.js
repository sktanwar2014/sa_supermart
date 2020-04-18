import axios from 'axios';
import * as c from './config/Constants';
import checkError from './config/HttpClient';
import {authHeader} from './config/AuthHeader.js';

const PARAMS = ({ methodType = 'GET' }) => ({
  method: methodType,
  headers: authHeader(),
});

export default {

  getProductUnitList:async () => {
    const URL = `${c.API_CONSUMER}/staticrecords/getProductUnitList`;
    try {
      const { data } = await axios(URL, Object.assign({}, PARAMS({ methodType: 'GET' })));
      return data;
    } catch (error) {
      checkError(error);
      throw error;
    }
  },

  getMainUnitRelateRecords:async ({...payload }) => {
    const URL = `${c.API_CONSUMER}/staticrecords/getMainUnitRelateRecords`;
    try {
      const { data } = await axios(URL, Object.assign({}, PARAMS({ methodType: 'POST' }), {
        data: payload,
      }),
    );
      return data;
    } catch (error) {
      checkError(error);
      throw error;
    }
  },

  getOrderStatusList:async () => {
    const URL = `${c.API_CONSUMER}/staticrecords/getOrderStatusList`;
    try {
      const { data } = await axios(URL, Object.assign({}, PARAMS({ methodType: 'GET' })));
      return data;
    } catch (error) {
      checkError(error);
      throw error;
    }
  },

};