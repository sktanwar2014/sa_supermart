import React, {useState, useEffect, Fragment} from 'react';
import {Link} from  'react-router-dom';
import pdfmake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

//Components 
import Header from '../Partials/Header.js';
import Footer from '../Partials/Footer.js';
import OrderAPI from '../../api/order.js';
import StaticAPI from '../../api/static.js';
import OrderAcceptRejectDialog from './Components/OrderAcceptRejectDialog.js';
import CallLoader from '../../common/Loader.js';


import {getDate} from '../../common/moment.js';
import NewOrderTable from './OrderViewTables/NewOrderTable.js';
import DeliveredOrderTable from './OrderViewTables/DeliveredOrderTable.js';
import VerifiedOrderTable from './OrderViewTables/VerifiedOrderTable.js';

const RESET_VALUES = {
    date : new Date(),
    orderStatus : '1',
}


export default function ViewOrder(props) {

    const [inputs, setInputs] =  useState(RESET_VALUES);
    const [orderList, setOrderList] = useState([]);
    const [orderIdsArray, setOrderIdsArray] = useState([]);
    
    const [orderStatusList, setOrderStatusList]  = useState([]);
    const [orderStatus, setOrderStatus] = useState(1);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [orderProps, setOrderProps] = useState({});
    const [isLoading, setIsLoading] = useState(false);


    useEffect(()=>{
        getOrderListOfSingleDay();
        getOrderStatusList();
    },[]);


    
	const  handleInputChange = (e) => {
		setInputs({...inputs, [e.target.name]: e.target.value});
	}

    const getOrderListOfSingleDay = async () => {
        setOrderStatus(inputs.orderStatus);
        setIsLoading(true);

        try{
            const result = await OrderAPI.getOrderListOfSingleDay({
                order_status : Number(inputs.orderStatus),
                date : getDate(inputs.date),
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


    const handleGenerateInvoice = async (id) =>{
        setIsLoading(true);
        pdfmake.vfs = pdfFonts.pdfMake.vfs;
        try{
            const result = await OrderAPI.generateInvoice({orderId : id});
            pdfmake.createPdf(result).open();
            setIsLoading(false);

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
                <h3>Daily Orders</h3>
                <div class="row justify-content-center p-bottom-30">
                        <div class="col-xl-12 ftco-animate fadeInUp ftco-animated">
                            <div class="p-5 bg-light b-top-dark">
                                    <div class="row align-items-end">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="date">Date * </label>
                                                <input id="date" name="date" type="date" value={getDate(inputs.date)} class="form-control"  onChange={handleInputChange} />
                                            </div>
                                        </div>   
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="orderStatus">Status * </label>
                                                <select id="orderStatus" name="orderStatus" value={inputs.orderStatus} class="form-control" onChange={handleInputChange}>
                                                    {(orderStatusList.length > 0 ? orderStatusList : [] ).map((data, index)=>{
                                                        return(
                                                          (data.id !== 4 ) ?  <option id={data.id} value={data.id} >{data.order_status}</option>: null
                                                        )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div> 
                                        <div class="col-md-12 m-bottom-20">
                                            <div class="form-group">
                                                <div class="d-flex f-right">
                                                <button class="btn btn-primary px-4" onClick={getOrderListOfSingleDay}> Click to view</button>
                                                </div>
                                            </div>
                                        </div> 
                                        <div class="w-100 table-div">
                                            {(orderStatus == 1) && <NewOrderTable orderIdsArray={orderIdsArray} orderList = {orderList} />}
                                            {(orderStatus == 2) && <DeliveredOrderTable orderIdsArray={orderIdsArray} orderList = {orderList} />}
                                            {(orderStatus == 3) && <VerifiedOrderTable orderIdsArray={orderIdsArray} orderList = {orderList} 
                                                                    handleOrderConfirmation={handleOrderConfirmation} handleGenerateInvoice={handleGenerateInvoice} />}
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
                    getOrderListOfSingleDay = {getOrderListOfSingleDay}
                    isUpdatable = {1}
                /> 
                : null 
            }
            {isLoading ?   <CallLoader />   : null  }
	</Fragment>
    )
}