export const API_URL = 'http://ordernow.a1abilities.co.nz/'; // Config[KEY].API_URL;
export const AUTH_URL = 'http://ordernow.a1abilities.co.nz/'; // Config[KEY].AUTH_URL;
export const API_CONSUMER = 'http://ordernow.a1abilities.co.nz/'; // Config[KEY].API_URL;

// export const API_URL = 'http://localhost:5000';         // Config[KEY].API_URL;
// export const AUTH_URL = 'http://localhost:5000';        // Config[KEY].AUTH_URL;
// export const API_CONSUMER = 'http://localhost:5000';   // Config[KEY].API_URL;

export const APP_TOKEN = {
    set: ({user_id, name, token, account_id, id, role_id}) => {
        sessionStorage.setItem('userId', id);
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user_id', user_id);
        sessionStorage.setItem('role_id', role_id);
        sessionStorage.setItem('name', name);
        sessionStorage.setItem('account_id', account_id);
    },
    get: () => ({
        userId: sessionStorage.getItem('userId'),
        token: sessionStorage.getItem('token'),
        user_id : sessionStorage.getItem('user_id'),
        role_id : sessionStorage.getItem('role_id'),
        name : sessionStorage.getItem('name'),
        account_id: sessionStorage.getItem('account_id'),
    }),
    remove: () => {
        // sessionStorage.clear();
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user_id');
        sessionStorage.removeItem('role_id');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('account_id');
    },    
    get notEmpty() {
        const cond1 = this.get().token !== null;
        const cond2 = this.get().token !== '';
        return cond1 && cond2;
    },
    get isAdmin() {
        const cond1 = this.get().user_id == 'admin';
        const cond2 = this.get().userId == 1;
        const cond3 = this.get().role_id == 1;
        return cond1 && cond2 && cond3;
    }
}



export const CART_TOKEN = {
    set: ({product}) => {
        let prev = sessionStorage.getItem('cart');
        if(prev !== null && prev !== ""){
            let obj = JSON.parse(prev);
            let filtered = obj.filter(ele => ele.id !== product.id)            
            filtered.push(product);
            sessionStorage.setItem('cart', JSON.stringify(filtered));
        }else{
            sessionStorage.setItem('cart', JSON.stringify([product]));            
        }
            
    },
    get: () => ({
        cartTotal: sessionStorage.getItem('cart') !== null && sessionStorage.getItem('cart') !== "" ? JSON.parse(sessionStorage.getItem('cart')).length : 0,
        cart: sessionStorage.getItem('cart') !== null && sessionStorage.getItem('cart') !== "" ? JSON.parse(sessionStorage.getItem('cart')) : [],
    }),
    removeProduct:({productId}) => {
        let prev = sessionStorage.getItem('cart');
        if(prev !== null && prev !== ""){
            let obj = JSON.parse(prev);
            let filtered = obj.filter(ele => ele.id !== productId)            
            sessionStorage.setItem('cart', JSON.stringify(filtered));
        }
    },
    removeCart: () =>{
        sessionStorage.removeItem('cart');
    }
}