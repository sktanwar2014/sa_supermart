import axios from 'axios';
import * as c from './config/Constants';
import checkError from './config/HttpClient';
import {authHeader} from './config/AuthHeader.js';

const PARAMS = ({ methodType = 'GET' }) => ({
  method: methodType,
  headers: authHeader(),
});

export default {

  getCategoryList:async () => {
    const URL = `${c.API_CONSUMER}/categories/getCategoryList`;
    try {
      const { data } = await axios(URL, Object.assign({}, PARAMS({ methodType: 'GET' })));
      return data;
    } catch (error) {
      checkError(error);
      throw error;
    }
  },

  
  // getAllCategoryTableRecords:async () => {
  //   const URL = `${c.API_CONSUMER}/categories/getAllCategoryTableRecords`;
  //   try {
  //     const { data } = await axios(URL, Object.assign({}, PARAMS({ methodType: 'GET' })));
  //     return data;
  //   } catch (error) {
  //     checkError(error);
  //     throw error;
  //   }
  // },

  getTotalProductList:async () => {
    const URL = `${c.API_CONSUMER}/categories/getTotalProductList`;
    try {
      const { data } = await axios(URL, Object.assign({}, PARAMS({ methodType: 'GET' })));
      return data;
    } catch (error) {
      checkError(error);
      throw error;
    }
  },

 
  getProductUnderMainCategory:async ({...payload }) => {
    const URL = `${c.API_CONSUMER}/categories/getProductUnderMainCategory`;
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

  getProductUnderMiddleCategory:async ({...payload }) => {
    const URL = `${c.API_CONSUMER}/categories/getProductUnderMiddleCategory`;
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

  getProductUnderSubCategory:async ({...payload }) => {
    const URL = `${c.API_CONSUMER}/categories/getProductUnderSubCategory`;
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

  getMainCategoryList:async () => {
    const URL = `${c.API_CONSUMER}/categories/getMainCategoryList`;
    try {
      const { data } = await axios(URL, Object.assign({}, PARAMS({ methodType: 'GET' })));
      return data;
    } catch (error) {
      checkError(error);
      throw error;
    }
  },

  getMiddleCategoryList:async ({...payload }) => {
    const URL = `${c.API_CONSUMER}/categories/getMiddleCategoryList`;
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

  getSubCategoryList:async ({...payload }) => {
    const URL = `${c.API_CONSUMER}/categories/getSubCategoryList`;
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

  insertNewProduct:async ({...payload }) => {
    const URL = `${c.API_CONSUMER}/categories/insertNewProduct`;
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