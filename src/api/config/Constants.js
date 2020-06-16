// export const API_URL = 'http://ordernow.a1abilities.co.nz/'; // Config[KEY].API_URL;
// export const AUTH_URL = 'http://ordernow.a1abilities.co.nz/'; // Config[KEY].AUTH_URL;
// export const API_CONSUMER = 'http://ordernow.a1abilities.co.nz/'; // Config[KEY].API_URL;

export const API_URL = 'http://localhost:5000';         // Config[KEY].API_URL;
export const AUTH_URL = 'http://localhost:5000';        // Config[KEY].AUTH_URL;
export const API_CONSUMER = 'http://localhost:5000';   // Config[KEY].API_URL;

export const APP_TOKEN = {
    set: ({user_id, name, token, account_id, id, role_id}) => {
        sessionStorage.setItem('userId', id);
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user_id', user_id);
        sessionStorage.setItem('role_id', role_id);
        sessionStorage.setItem('name', name);
        // sessionStorage.setItem('account_id', account_id);
    },
    get: () => ({
        userId: sessionStorage.getItem('userId'),
        token: sessionStorage.getItem('token'),
        user_id : sessionStorage.getItem('user_id'),
        role_id : sessionStorage.getItem('role_id'),
        name : sessionStorage.getItem('name'),
        // account_id: sessionStorage.getItem('account_id'),
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
            
            let userCart = obj.filter(ele =>  Number(ele.user_id) === Number(APP_TOKEN.get().userId));
            if(userCart){
                let index = obj.findIndex(ele => ele.id === product.id && ele.user_id == APP_TOKEN.get().userId);
                if(index >= 0){
                    const updatedCart = Object.assign([], obj, {[index]: product});
                    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
                }else{
                    obj.push(product);
                    sessionStorage.setItem('cart', JSON.stringify(obj));
                }
            }else{
                obj.push(product);
                sessionStorage.setItem('cart', JSON.stringify(obj));
            }
        }else{
            sessionStorage.setItem('cart', JSON.stringify([product]));            
        }
    },
    get: () => ({
        cartTotal:
                    sessionStorage.getItem('cart') !== null 
                &&  sessionStorage.getItem('cart') !== "" 
                ?   JSON.parse(sessionStorage.getItem('cart')).filter(ele => Number(ele.user_id) === Number(APP_TOKEN.get().userId)).length
                : 0,
        cart:
                    sessionStorage.getItem('cart') !== null 
                &&  sessionStorage.getItem('cart') !== "" 
                ?   JSON.parse(sessionStorage.getItem('cart')).filter(ele => Number(ele.user_id) === Number(APP_TOKEN.get().userId))
                : [],
    }),

    removeProduct:({productId}) => {
        let prev = sessionStorage.getItem('cart');
        if(prev !== null && prev !== ""){
            let obj = JSON.parse(prev);            
            let index = obj.findIndex(ele => ele.id == productId && ele.user_id == APP_TOKEN.get().userId);
            obj.splice(index,1);            
            sessionStorage.setItem('cart', JSON.stringify(obj));
        }
    },
    removeCart: () =>{
        // sessionStorage.removeItem('cart');
        let prev = sessionStorage.getItem('cart');
        if(prev !== null && prev !== ""){
            let obj = JSON.parse(prev);            
            let filtered = obj.filter(ele => ele.user_id != APP_TOKEN.get().userId);
            sessionStorage.setItem('cart', JSON.stringify(filtered));
        }
    }
}