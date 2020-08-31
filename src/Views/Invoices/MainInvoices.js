import React, {useState, useEffect, Fragment} from 'react';

//Components 

import Header from '../Partials/Header.js';
import Footer from '../Partials/Footer.js';
// import CallLoader from '../../common/Loader.js';
import {APP_TOKEN} from  '../../api/config/Constants.js';
import FranchiseInvoices from './Franchise/InvoicesList.js';
import AdminInvoices from './Admin/InvoicesList.js';



// APIs
import StaticAPI from '../../api/static.js';



export default function MainInvoices(props) {    
    const [stateList, setStateList] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        getInvoiceStateList();
    },[]);

    const getInvoiceStateList = async () => {
        try{
            const result = await StaticAPI.getInvoiceStateList();
            setStateList(result.invoiceStateList);
        }catch(e){
            console.log(e);
        }
    }
    
    return(
    <Fragment>
        <Header />
            {(APP_TOKEN.isAdmin)
                ? <AdminInvoices stateList={stateList} />
                : <FranchiseInvoices  stateList={stateList} />
            }
        <Footer />
            {/* {isLoading ?   <CallLoader />   : null  } */}
    </Fragment>
    )
}
