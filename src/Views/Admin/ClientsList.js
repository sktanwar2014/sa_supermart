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
import YesNoDialog from '../../common/YesNoDialog.js';
import {SimpleAlert} from '../../common/Alert.js'


const RESET_VALUES = {
    date : new Date(),
}


export default function ClientsList() {

    const [clientList, setClientList] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [openYesNoDialog, setOpenYesNoDialog] = useState(false);
    const [yesNoDialogParams, setYesNoDialogParams] = useState({title: '', body: '', data: {}});
    const [alertParams, setAlertParams] = useState({message:'', variant: 'success', style: {}});
    const [showAlert, setShowAlert] = useState(false);


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

    
    const handleClientActivation = async (data) => {
        setIsLoading(true);
        try{
            const result = await AuthAPI.handleClientActivation({
                user_id : data.id,
                status : data.status,
            });
            if(result === true){
                setAlertParams({...alertParams, ['message'] : 'Update successfully'});
            }else {
                setAlertParams({...alertParams, ['message'] : 'Updation Failed.'});
            }            
            getClientList(pageNo);
            setShowAlert(true);
            window.scrollTo(0,0);
            setIsLoading(false);
        }catch(e){
            console.log('Error...',e);
        }
    }

    const handleYesNoOpen = (params) => {
        if(params.status === 0){
            setYesNoDialogParams({title: 'User Activation', body: 'Do you want to active this user ?', data: params});
        }else{
            setYesNoDialogParams({title: 'User Activation', body: 'Do you want to deactive this user ?', data: params});
        }
        setOpenYesNoDialog(true);
    }

    const handleYesNoDialogClose = (selectedOption, data) => {
        setOpenYesNoDialog(false);
        if(selectedOption === 1){
            handleClientActivation(data);
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
                            {showAlert ? <SimpleAlert message={alertParams.message} variant={alertParams.variant} style = {{padding:'0px', paddingLeft:'10px', marginTop:'10px'}}/> : ""}
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
                                                        <th style={{minWidth : '120px'}}>Status</th>
                                                        <th style={{minWidth : '150px'}}>Registered At</th>
                                                        <th style={{minWidth : '150px'}}>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(clientList.length>0 ? clientList :[]).map((data, index) => {
                                                    return(
                                                        <tr>
                                                            <td>{(pageNo * 20) - 20 + index + 1}</td>
                                                            <td>{data.name}</td>
                                                            <td>{data.user_id}</td>
                                                            <td>{data.email}
                                                                {(data.is_mail_verified === 1)
                                                                    ?   <span class="ion-ios-checkmark-circle" style={{color: '#82ae46', fontSize: '17px', margin: '5px'}}></span>
                                                                    :   <span class="ion-ios-close-circle" style={{color: 'red', fontSize: '17px', margin: '5px'}}></span>
                                                                }
                                                            </td>
                                                            <td>{data.mobile}</td>
                                                            <td>
                                                                {data.status === 1 ?
                                                                    <p style={{color: '#82ae46'}}>Active</p>
                                                                :   <p style={{color: 'red'}}>Inactive</p>
                                                                }
                                                            </td>
                                                            <td>{getDateInDDMMYYYY(data.created_at)}</td>
                                                            <td>                                                                
                                                                <ul class="navbar-nav ml-auto">
                                                                   <li class="nav-item dropdown">
                                                                       <a class="nav-link dropdown-toggle" href="#"  id="dropdown04" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Options</a>
                                                                            <div class="dropdown-menu" aria-labelledby="dropdown04">
                                                                                <a class="dropdown-item"  onClick={() => {handleYesNoOpen(data)}} style={{cursor: 'pointer'}}>
                                                                                    {data.status === 0 ? "Active" : "Deactive"}
                                                                                </a>
                                                                                <a class="dropdown-item"  style={{cursor: 'pointer'}}>
                                                                                    Resend Verification E-mail
                                                                                </a>
                                                                            </div>
                                                                    </li>
                                                                </ul>
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
        {openYesNoDialog ? <YesNoDialog open={openYesNoDialog} handleClose = {handleYesNoDialogClose} props = {yesNoDialogParams} /> : null }
	</Fragment>
    )
}