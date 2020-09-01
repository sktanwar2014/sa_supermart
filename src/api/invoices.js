import axios from 'axios';
import * as c from './config/Constants';
import checkError from './config/HttpClient';
import {authHeader} from './config/AuthHeader.js';

const PARAMS = ({ methodType = 'GET' }) => ({
  method: methodType,
  headers: authHeader(),
});

export default {

  getInvoiceList:async ({...payload }) => {
    const URL = `${c.API_CONSUMER}/invoices/getInvoiceList`;
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
  
  getItemsForUpdateRequest:async ({...payload }) => {
    const URL = `${c.API_CONSUMER}/invoices/getItemsForUpdateRequest`;
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
  
  postItemUpdateRequest:async ({...payload }) => {
    const URL = `${c.API_CONSUMER}/invoices/postItemUpdateRequest`;
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

  postInvoiceUpdateRequest:async ({...payload }) => {
    const URL = `${c.API_CONSUMER}/invoices/postInvoiceUpdateRequest`;
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

  payInvoiceBill:async ({...payload }) => {
    const URL = `${c.API_CONSUMER}/invoices/payInvoiceBill`;
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

  // getMeasuredUnitofProduct:async ({...payload }) => {
  //   const URL = `${c.API_CONSUMER}/staticrecords/getMeasuredUnitofProduct`;
  //   try {
  //     const { data } = await axios(URL, Object.assign({}, PARAMS({ methodType: 'POST' }), {
  //       data: payload,
  //     }),
  //   );
  //     return data;
  //   } catch (error) {
  //     checkError(error);
  //     throw error;
  //   }
  // },

  // getOrderStatusList:async () => {
  //   const URL = `${c.API_CONSUMER}/staticrecords/getOrderStatusList`;
  //   try {
  //     const { data } = await axios(URL, Object.assign({}, PARAMS({ methodType: 'GET' })));
  //     return data;
  //   } catch (error) {
  //     checkError(error);
  //     throw error;
  //   }
  // },

  // getInvoiceStateList:async () => {
  //   const URL = `${c.API_CONSUMER}/staticrecords/getInvoiceStateList`;
  //   try {
  //     const { data } = await axios(URL, Object.assign({}, PARAMS({ methodType: 'GET' })));
  //     return data;
  //   } catch (error) {
  //     checkError(error);
  //     throw error;
  //   }
  // },
};