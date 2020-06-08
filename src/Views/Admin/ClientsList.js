import React, {useState, useEffect, Fragment} from 'react';
import Pagination from '@material-ui/lab/Pagination';

//Components 
import Header from '../Partials/Header.js';
import Footer from '../Partials/Footer.js';
import OrderAPI from '../../api/order.js';
import AuthAPI from '../../api/auth.js';
import {APP_TOKEN} from '../../api/config/Constants.js';
import CallLoader from '../../common/Loader.js';


import {getDateInDDMMYYYY, getDate} from '../../common/moment.js';
import {SimpleAlert} from '../../common/Alert.js'

const RESET_VALUES = {
    date : new Date(),
}


export default function ClientsList() {

    const [clientList, setClientList] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=>{
		getClientList();
    },[]);

	const handlePagination = (event, page) => {
        setPageNo(page);
        getClientList(page);
	}

    const getClientList = async (page = 1) => {
        setIsLoading(true);
        setClientList([]);
        try{
            const result = await AuthAPI.getClientList({pageNo: page});            
            setClientList(result.clientList);   
            setPageCount(result.totalCount);   
            setIsLoading(false);
        }catch(e){
            console.log('Error...',e);
        }
    }

    return(
		<Fragment>
			<Header />
			<section className="ftco-section">
                <div class="container">
                <h3> Clients </h3>
                <div class="row justify-content-center p-bottom-30">
                        <div class="col-xl-12 ftco-animate fadeInUp ftco-animated">
                            <div class="p-5 bg-light b-top-dark">
                                    <div class="row align-items-end">
                                        <div class="w-100 table-div">
                                            <table className="table table-td">
                                                <thead class="thead-primary">
                                                    <tr class="text-center">
                                                        <th style={{minWidth : '50px'}}>#</th>
                                                        <th style={{minWidth : '200px'}}>Name</th>
                                                        <th style={{minWidth : '200px'}}>User Id</th>
                                                        <th style={{minWidth : '300px'}}>Email</th>
                                                        <th style={{minWidth : '180px'}}>Mobile</th>
                                                        <th style={{minWidth : '150px'}}>Registered At</th>
                                                        <th>Action</th>
                                                        
                                                        
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(clientList.length>0 ? clientList :[]).map((data, index) => {                                                    
                                                    return(
                                                        <tr>
                                                            <td>{(pageNo * 20) - 20 + index + 1}</td>
                                                            <td>{data.name}</td>
                                                            <td>{data.user_id}</td>
                                                            <td>{data.email}</td>
                                                            <td>{data.mobile}</td>
                                                            <td>{getDateInDDMMYYYY(data.created_at)}</td>
                                                            <td>
                                                            </td>
                                                        </tr>
                                                        )
                                                    })
                                                }
                                                </tbody>
                                            </table>
                                        </div>                                        
									</div>
								</div>
                                <div  className="row" style={{ justifyContent: 'center', marginTop: '5px'}}>
                                    <Pagination count={Math.ceil(pageCount/20)} page={pageNo} showFirstButton showLastButton onChange={handlePagination} />
                                </div>
							</div>                            
						</div>
                </div>
            </section>
		<Footer />
        {isLoading ?   <CallLoader />   : null  }
	</Fragment>
    )
}