import React, {useState, useEffect, Fragment} from 'react';

//Components 
import Header from '../../Partials/Header.js';
import Footer from '../../Partials/Footer.js';
import StaticAPI from '../../../api/static.js';
import OrderAPI from '../../../api/order.js';
import OrderAcceptRejectDialog from '../Components/OrderAcceptRejectDialog.js';

import {getDate} from '../../../common/moment.js';
import CallLoader from '../../../common/Loader.js';
import DeliveredReportTable from './OrderReportViewTables/DeliveredReportTable.js';
import NewOrderReportTable from './OrderReportViewTables/NewOrderReportTable.js';
import VerifiedReportTable from './OrderReportViewTables/VerifiedReportTable.js';

const RESET_VALUES = {
    toDate : new Date(),
    fromDate : new Date(),
    orderStatus : '1',
}


export default function ViewOrder() {

    const [inputs, setInputs] =  useState(RESET_VALUES);
    const [orderList, setOrderList] = useState([]);
    const [orderIdsArray, setOrderIdsArray] = useState([]);    
    const [orderStatusList, setOrderStatusList]  = useState([]);
    const [orderStatus, setOrderStatus] = useState(1);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [orderProps, setOrderProps] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=>{
		getOrderList();		
		getOrderStatusList();		
    },[]);


    
	const  handleInputChange = (e) => {
		setInputs({...inputs, [e.target.name]: e.target.value});
	}

    const getOrderList = async () => {
        setIsLoading(true);
        setOrderStatus(inputs.orderStatus);
        try{
            const result = await OrderAPI.getOrderList({
                order_status : Number(inputs.orderStatus),
                from_date : getDate(inputs.fromDate),
                to_date : getDate(inputs.toDate),
            });
            const orderIds = [...new Set(result.orderList.map(dist => dist.id))];
            setOrderList(result.orderList);
            setOrderIdsArray(orderIds);
            setIsLoading(false);
        }catch(e){
            console.log('Error...',e);
        }
    }


    const getOrderStatusList = async () => {
        try{
            const result = await StaticAPI.getOrderStatusList({});
            setOrderStatusList(result.orderStatusList);
        }catch(e){
            console.log('Error...',e);
        }
    }
      
    const handleOrderConfirmation = async (data) =>{
        setOrderProps({
            order_id: data[0].id,
            products: data
        });
        setDialogOpen(true);
    }


    return(
		<Fragment>
			<Header />
			<section className="ftco-section">
                <div class="container">
                <h3>View Order List</h3>
                <div class="row justify-content-center p-bottom-30">
                        <div class="col-xl-12 ftco-animate fadeInUp ftco-animated">
                            <div class="p-5 bg-light b-top-dark">
                                    <div class="row align-items-end">
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label for="fromDate">From * </label>
                                                <input id="fromDate" name="fromDate" type="date" value={getDate(inputs.fromDate)} class="form-control"  onChange={handleInputChange} />
                                            </div>
                                        </div>   
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label for="toDate">To * </label>
                                                <input id="toDate" name="toDate" type="date" value={getDate(inputs.toDate)} class="form-control" onChange={handleInputChange} />
                                            </div>
                                        </div>  
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label for="orderStatus">Status * </label>
                                                <select id="orderStatus" name="orderStatus" value={inputs.orderStatus} class="form-control" onChange={handleInputChange}>
                                                    {(orderStatusList.length > 0 ? orderStatusList : [] ).map((data, index)=>{
                                                        return(
                                                            (data.id !== 4 ) ?  <option id={data.id} value={data.id} >{data.order_status}</option> : null
                                                        )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div> 
                                        <div class="col-md-12 m-bottom-20">
                                            <div class="form-group">
                                                <div class="d-flex f-right">
                                                <button class="btn btn-primary px-4" onClick={getOrderList}> Click to view</button>
                                                </div>
                                            </div>
                                        </div> 
                                        <div class="w-100 table-div">
                                            {(orderStatus == 1) && <NewOrderReportTable orderIdsArray={orderIdsArray} orderList = {orderList} />}
                                            {(orderStatus == 2) && <DeliveredReportTable orderIdsArray={orderIdsArray} orderList = {orderList} />}
                                            {(orderStatus == 3) && <VerifiedReportTable orderIdsArray={orderIdsArray} orderList = {orderList} 
                                                                    handleOrderConfirmation={handleOrderConfirmation} />}
                                        </div>
									</div>
								</div>
							</div>
						</div>
                    
                </div>
    </section>
		<Footer />
        { dialogOpen ? 
            <OrderAcceptRejectDialog 
                open={dialogOpen} 
                setDialogOpen = {setDialogOpen} 
                props = {orderProps}
                isUpdatable = {0}
            /> 
            : null 
        }
        {isLoading ?   <CallLoader />   : null  }
	</Fragment>
    )
}