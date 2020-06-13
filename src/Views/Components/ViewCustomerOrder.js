import React, {useState, useEffect, Fragment} from 'react';
import {Link} from 'react-router-dom';
import pdfmake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

//Components 
import Header from '../Partials/Header.js';
import Footer from '../Partials/Footer.js';
import StaticAPI from '../../api/static.js';
import OrderAPI from '../../api/order.js';
import {APP_TOKEN} from  '../../api/config/Constants.js'
import {getDateInDDMMYYYY, getDate} from '../../common/moment.js';
import CallLoader from '../../common/Loader.js';
import NewOrderTable from './ViewOrderTable/NewOrderTable.js';
import DeliveredOrderTable from './ViewOrderTable/DeliveredOrderTable.js';
import VerifiedOrderTable from './ViewOrderTable/VerifiedOrderTable.js';

const RESET_VALUES = {
    toDate : new Date(),
    fromDate : new Date(),
    orderStatus : '1',
}


export default function ViewCustomerOrder() {

    const [inputs, setInputs] =  useState(RESET_VALUES);
	const [orderList, setOrderList] = useState([]);
    const [orderStatusList, setOrderStatusList]  = useState([]);
    const [orderStatus, setOrderStatus] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [orderIdsArray, setOrderIdsArray] = useState([]);

    useEffect(()=>{
		getCustomerOrderList();		
		getOrderStatusList();		
    },[]);


    
	const  handleInputChange = (e) => {
		setInputs({...inputs, [e.target.name]: e.target.value});
	}

    const getCustomerOrderList = async () => {
        setIsLoading(true);
        setOrderStatus(inputs.orderStatus);
        try{
            const result = await OrderAPI.getCustomerOrderList({
                order_status : Number(inputs.orderStatus),
                from_date : getDate(inputs.fromDate),
                to_date : getDate(inputs.toDate),
                createdBy : APP_TOKEN.get().userId,
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

    
    const handleGenerateInvoice = async (data) =>{
        setIsLoading(true);

        pdfmake.vfs = pdfFonts.pdfMake.vfs;
        try{
            const result = await OrderAPI.generateInvoice({orderId : data.id});
            pdfmake.createPdf(result).open();
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
                <h3>My Orders</h3>
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
                                                            (data.id !== 4 ) ?   <option id={data.id} value={data.id} >{data.order_status}</option> : null
                                                        )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div> 
                                        <div class="col-md-12 m-bottom-20">
                                            <div class="form-group">
                                                <div class="d-flex f-right">
                                                <button class="btn btn-primary px-4" onClick={getCustomerOrderList}> Click to view</button>
                                                </div>
                                            </div>
                                        </div> 
                                        <div class="w-100 table-div">
                                            {(orderStatus == 1) && <NewOrderTable orderIdsArray={orderIdsArray} orderList = {orderList} />}
                                            {(orderStatus == 2) && <DeliveredOrderTable orderIdsArray={orderIdsArray} orderList = {orderList} />}
                                            {(orderStatus == 3) && <VerifiedOrderTable orderIdsArray={orderIdsArray} orderList = {orderList}  handleGenerateInvoice={handleGenerateInvoice} />}
                                            {/* <table className="unit-array-table">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Order Date</th>
                                                        <th>Order Id</th>
                                                        <th>Customer</th>
                                                        <th>Product</th>
                                                        {orderStatus == 1 && <th>Quantity</th> }
                                                        <th>Address</th>
                                                        {orderStatus != 1 && <th>Delivery Date</th> }
                                                        {(orderStatus == 2 || orderStatus ==  3) && <th>Action</th> }
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(orderList.length>0 ? orderList :[]).map((order, index) => {                                                    
                                                    let products = orderedProductList.filter(pro => pro.order_id === order.id);
                                                    let totalProduct = products.length;
                                                    return(
                                                        (products.length >0 ? products :[]).map((product) =>  {
                                                            return(
                                                                <tr class="text-center">
                                                                    {totalProduct !== 0 &&                                                                    
                                                                        <Fragment>                                                                            
                                                                            <td rowspan={totalProduct}>{index + 1}</td>
                                                                            <td rowspan={totalProduct}>{getDateInDDMMYYYY(order.order_date)}</td>
                                                                            <td rowspan={totalProduct}>{order.order_id}</td>
                                                                            <td rowspan={totalProduct}>{order.full_name}</td>
                                                                        </Fragment>
                                                                    }
                                                                    <td>{product.product_name}</td>
                                                                    {orderStatus == 1 &&  <td>{`${product.quantity}  ${product.ordered_unit_name}`}</td> }
                                                                    {totalProduct !== 0 &&
                                                                        <Fragment>
                                                                            <td rowspan={totalProduct}>{`${order.flat_add}, ${order.street_add}, ${order.city}`}</td>
                                                                            {orderStatus != 1 && <td rowspan={totalProduct}>{getDateInDDMMYYYY(order.delivery_date)}</td> }
                                                                            {(orderStatus == 2 || orderStatus == 3) && <td rowspan={totalProduct}>
                                                                                {orderStatus == 2 && <Link to={{pathname :'/verify-delivered-product', state : {order: order, product: products}}}>Click to verify</Link>}
                                                                                {(orderStatus == 3 && order.status  == 4) && 
                                                                                    <button class="alter-purchase-record" type="submit" onClick={()=>{handleGenerateInvoice(order)}}> See Invoice </button>
                                                                                }
                                                                                </td>
                                                                            }
                                                                        </Fragment>
                                                                    }
                                                                    <div style={{display:'none'}}>{totalProduct = 0}</div>
                                                                </tr>
                                                                )
                                                            })
                                                        )
                                                    })
                                                }	
                                                </tbody>
                                            </table> */}
                                        </div>
									</div>
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