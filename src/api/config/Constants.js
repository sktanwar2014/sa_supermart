// export const API_URL = 'http://newgc.sargatechnology.com'; // Config[KEY].API_URL;
// export const AUTH_URL = 'http://newgc.sargatechnology.com'; // Config[KEY].AUTH_URL;
// export const API_CONSUMER = 'http://newgc.sargatechnology.com'; // Config[KEY].API_URL;

export const API_URL = 'http://localhost:5000'; // Config[KEY].API_URL;
export const AUTH_URL = 'http://localhost:5000'; // Config[KEY].AUTH_URL;
 export const API_CONSUMER = 'http://localhost:5000'; // Config[KEY].API_URL;

export const APP_TOKEN = {
    set: ({user_id, name, token, account_id}) => {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user_id', user_id);
        sessionStorage.setItem('name', name);
        sessionStorage.setItem('account_id', account_id);
    },
    get: () => ({
        token: sessionStorage.getItem('token'),
        user_id : sessionStorage.getItem('user_id'),
        name : sessionStorage.getItem('name'),
        account_id: sessionStorage.getItem('account_id'),
    }),
    remove: () => {
        sessionStorage.clear();
    },
    get notEmpty() {
        const cond1 = this.get().token !== null;
        const cond2 = this.get().token !== '';
        return cond1 && cond2;
    }
}