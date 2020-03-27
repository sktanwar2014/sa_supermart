import axios from 'axios';
import * as c from './config/Constants';
import checkError from './config/HttpClient';
import {authHeader} from './config/AuthHeader.js';

const PARAMS = ({ methodType = 'GET' }) => ({
  method: methodType,
  headers: authHeader(),
});

export default {

  
  login:async ({...payload }) => {

    const URL = `${c.API_CONSUMER}/auth/login`;
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

  addUpdateFormContent:async ({...payload }) => {
    const URL = `${c.API_CONSUMER}/api/addUpdateFormContent`;
    try {
      const { data } = await axios(URL, Object.assign({}, PARAMS({ methodType: 'POST' }), {
        data: payload.formData,
      }),
    );
      return data;
    } catch (error) {
      checkError(error);
      throw error;
    }
  },

  getTabRelatedList:async ({...payload }) => {
    const URL = `${c.API_CONSUMER}/api/getTabRelatedList`;
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

  getContactList:async ({...payload }) => {
    const URL = `${c.API_CONSUMER}/api/getContactList`;
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

  changeState:async ({...payload }) => {
    const URL = `${c.API_CONSUMER}/api/changeState`;
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
  


  // submitContact:async ({...payload }) => {

  //   const URL = `${c.API_CONSUMER}/api/submitContact`;
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

  
  // getServicesList:async ({...payload }) => {
  //   const URL = `${c.API_CONSUMER}/api/getServicesList`;
  //   try {
  //     const { data } = await axios(URL, Object.assign({}, PARAMS({ methodType: 'GET' }), {
  //       data: payload,
  //     }),
  //   );
  //     return data;
  //   } catch (error) {
  //     checkError(error);
  //     throw error;
  //   }
  // },

//   getWyusList:async ({...payload }) => {
//   const URL = `${c.API_CONSUMER}/api/getWhyusList`;
//   try {
//     const { data } = await axios(URL, Object.assign({}, PARAMS({ methodType: 'GET' }), {
//       data: payload,
//     }),
//   );
//     return data;
//   } catch (error) {
//     checkError(error);
//     throw error;
//   }
// },

// getAboutList:async ({...payload }) => {
//   const URL = `${c.API_CONSUMER}/api/getAboutList`;
//   try {
//     const { data } = await axios(URL, Object.assign({}, PARAMS({ methodType: 'GET' }), {
//       data: payload,
//     }),
//   );
//     return data;
//   } catch (error) {
//     checkError(error);
//     throw error;
//   }
// },



// getGoalsList:async ({...payload }) => {
//   const URL = `${c.API_CONSUMER}/api/getGoalsList`;
//   try {
//     const { data } = await axios(URL, Object.assign({}, PARAMS({ methodType: 'GET' }), {
//       data: payload,
//     }),
//   );
//     return data;
//   } catch (error) {
//     checkError(error);
//     throw error;
//   }
// },

// getTechnologyList:async ({...payload }) => {
//   const URL = `${c.API_CONSUMER}/api/getTechnologyList`;
//   try {
//     const { data } = await axios(URL, Object.assign({}, PARAMS({ methodType: 'GET' }), {
//       data: payload,
//     }),
//   );
//     return data;
//   } catch (error) {
//     checkError(error);
//     throw error;
//   }
// },

// getPartnersList:async ({...payload }) => {
//   const URL = `${c.API_CONSUMER}/api/getPartnersList`;
//   try {
//     const { data } = await axios(URL, Object.assign({}, PARAMS({ methodType: 'GET' }), {
//       data: payload,
//     }),
//   );
//     return data;
//   } catch (error) {
//     checkError(error);
//     throw error;
//   }
// },

// getPortfolioList:async ({...payload }) => {
//   const URL = `${c.API_CONSUMER}/api/getPortfolioList`;
//   try {
//     const { data } = await axios(URL, Object.assign({}, PARAMS({ methodType: 'GET' }), {
//       data: payload,
//     }),
//   );
//     return data;
//   } catch (error) {
//     checkError(error);
//     throw error;
//   }
// },

};