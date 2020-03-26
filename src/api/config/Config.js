export default {
  'config-development': {
    API_URL : 'http://localhost:5000',
    AUTH_URL : 'http://localhost:5000',
  },
  'config-dev': {
    API_URL: '',
    AUTH_URL: '',
  },
  'config-uat': {
    API_URL: '',
    AUTH_URL: '',
  },
  'config-prod': {
    API_URL: '',
    AUTH_URL: '',
  },
  get 'development-local-stag'() {
    return this['config-development'];
  },
  get 'production-production-dev'() {
    return this['config-dev'];
  },
  get 'production-production-uat'() {
    return this['config-uat'];
  },
  get 'production-production-prod'() {
    return this['config-prod'];
  },
};
