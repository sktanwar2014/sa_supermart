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


import {getDateInDDMMYYYY, getDate} from '../../common/moment.js';

const RESET_VALUES = {
    date : new Date(),
    orderStatus : '1',
}


export default function ViewOrder(props) {

    const [inputs, setInputs] =  useState(RESET_VALUES);
	const [orderList, setOrderList] = useState([]);
    const [orderedProductList, setOrderedProductList] = useState([]);
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
                order_status : inputs.orderStatus,
                date : getDate(inputs.date),
            });
            setOrderList(result.orderList);            
            setOrderedProductList(result.orderedProducts); 
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

    
    const handleOrderConfirmation = async (data, products) =>{
        setOrderProps({
            order_id: data.id,
            order_date : getDate(inputs.date),
            products: products
        });
        setDialogOpen(true);
    }

    return(
		<Fragment>
			<Header />
			<section className="ftco-section">
                <div class="container">
                <h3>Modify Orders</h3>
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
                                        <div class="w-100">
                                            <table className="unit-array-table">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Order Date</th>
                                                        <th>Order Id</th>
                                                        <th>Customer</th>
                                                        {(orderStatus == 2 || orderStatus  == 1) && <th>Product</th> }
                                                        {(orderStatus == 2 || orderStatus  == 1) && <th>Quantity</th> }
                                                        {orderStatus == 2 && <th>Price</th> }
                                                        <th>Address</th>
                                                        {orderStatus != 1 && <th>Delivery Date</th> }
                                                        {orderStatus != 2 && <th>Action</th> }
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
                                                                    {(orderStatus == 2 || orderStatus  == 1) && <td>{product.product_name}</td> }
                                                                    {(orderStatus == 2 || orderStatus  == 1) && <td>{`${product.quantity}  ${product.ordered_unit_name}`}</td> }
                                                                    {orderStatus == 2 &&  <td>{`${product.price}`}</td>}
                                                                    {totalProduct !== 0 &&
                                                                        <Fragment>
                                                                            <td rowspan={totalProduct}>{`${order.flat_add}, ${order.street_add}, ${order.city}`}</td>
                                                                            {orderStatus != 1 && <td rowspan={totalProduct}>{getDateInDDMMYYYY(order.delivery_date)}</td> }
                                                                            <td rowspan={totalProduct}>
                                                                                {orderStatus  == 1 ? <Link to={{pathname :'/delivery-form', state : {order: order, products: products}}}>Click to delivered</Link> :
                                                                                 orderStatus  == 3 ?
                                                                                    order.status == 3 ?
                                                                                    <button class={ "alter-purchase-record"} type="submit" onClick={()=>{handleOrderConfirmation(order, products)}}> See Info </button>
                                                                                   :
                                                                                    (order.status  == 4) ?
                                                                                    <button class="alter-purchase-record" type="submit" onClick={()=>{handleGenerateInvoice(order)}}> See Invoice </button> : ''
                                                                                   :''
                                                                                }
                                                                            </td>
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
                                            </table>
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
                    setOrderList = {setOrderList}
                    setOrderedProductList = {setOrderedProductList}
                    isUpdatable = {1}
                /> 
                : null 
            }
            {isLoading ?   <CallLoader />   : null  }
	</Fragment>
    )
}