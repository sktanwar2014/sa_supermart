import axios from 'axios';
import * as c from './config/Constants';
import checkError from './config/HttpClient';
import {authHeader} from './config/AuthHeader.js';

const PARAMS = ({ methodType = 'GET' }) => ({
  method: methodType,
  headers: authHeader(),
});

export default {

  // getTotalProductList:async () => {
  //   const URL = `${c.API_CONSUMER}/categories/getTotalProductList`;
  //   try {
  //     const { data } = await axios(URL, Object.assign({}, PARAMS({ methodType: 'GET' })));
  //     return data;
  //   } catch (error) {
  //     checkError(error);
  //     throw error;
  //   }
  // },

 
  getOrderList:async ({...payload }) => {
    const URL = `${c.API_CONSUMER}/order/getOrderList`;
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

  proceedToDelivered:async ({...payload }) => {
    const URL = `${c.API_CONSUMER}/order/proceedToDelivered`;
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

  addNewOrder:async ({...payload }) => {
    const URL = `${c.API_CONSUMER}/order/addNewOrder`;
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