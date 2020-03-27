import axios from 'axios';
import * as c from './config/Constants';
import checkError from './config/HttpClient';
import {authHeader} from './config/AuthHeader.js';

const PARAMS = ({ methodType = 'GET' }) => ({
  method: methodType,
  headers: authHeader(),
});

export default {

  getRequiredStaticRecordList:async () => {
    const URL = `${c.API_CONSUMER}/staticrecords/getRequiredStaticRecordList`;
    try {
      const { data } = await axios(URL, Object.assign({}, PARAMS({ methodType: 'GET' })));
      return data;
    } catch (error) {
      checkError(error);
      throw error;
    }
  },


};