import axios from 'axios';
import * as c from './config/Constants';
import checkError from './config/HttpClient';
import {authHeader} from './config/AuthHeader.js';

const PARAMS = ({ methodType = 'GET' }) => ({
  method: methodType,
  headers: authHeader(),
});

export default {

  login:async ({cancelToken, ...payload }) => {

    const URL = `${c.API_CONSUMER}/auth/login`;
    try {
      const { data } = await axios(URL, Object.assign({}, PARAMS({ methodType: 'POST' }), {
        cancelToken,
        data: payload,
      }),
    );
      return data;
    } catch (error) {
      throw error;
    }
  },

  register:async ({...payload }) => {

    const URL = `${c.API_CONSUMER}/auth/register`;
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


  verifyEmail:async ({...payload }) => {
    const URL = `${c.API_CONSUMER}/auth/verifyEmail`;
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

  verifyUserId:async ({...payload }) => {
    const URL = `${c.API_CONSUMER}/auth/verifyUserId`;
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

  getUserList:async ({...payload }) => {
    const URL = `${c.API_CONSUMER}/auth/getUserList`;
    try {
      const { data } = await axios(URL, Object.assign({}, PARAMS({ methodType: 'GET' }), {
        data: payload,
      }),
    );
      return data;
    } catch (error) {
      checkError(error);
      throw error;
    }
  },

  getClientList:async ({...payload }) => {
    const URL = `${c.API_CONSUMER}/auth/getClientList`;
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


};