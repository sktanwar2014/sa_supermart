import React, {useState, useEffect, Fragment} from 'react';

//Components 
import Header from '../Partials/Header.js';
import Footer from '../Partials/Footer.js';
import OrderAPI from '../../api/order.js';
import {getDateInDDMMYYYY} from '../../common/moment.js';

export default function BrowseProduct() {

	const [orderList, setOrderList] = useState([]);
    const [orderedProductList, setOrderedProductList] = useState([]);
    const [tabValue, setTabValue] = useState(1);

    useEffect(()=>{
		getOrderList();		
    },[tabValue]);

    const getOrderList = async () => {
        try{
            const result = await OrderAPI.getOrderList({
                order_status : tabValue,
            });
            setOrderList(result.orderList);            
            setOrderedProductList(result.orderedProducts);            
        }catch(e){
            console.log('Error...',e);
        }
    }

    const proceedToDelivered = async (orderId) => {
        try{
            const result = await OrderAPI.proceedToDelivered({
                orderId : orderId,
                order_status : tabValue,
            });
            setOrderList(result.orderList);
            setOrderedProductList(result.orderedProducts);            
        }catch(e){
            console.log('Error...',e);
        }
    }

    
    const handleTabChange = (index) =>{
        setTabValue(index)        
    }


    return(
		<Fragment>
			<Header />
			<section className="ftco-section">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-xl-12 ftco-animate fadeInUp ftco-animated">
                            <h3 class="mb-4 billing-heading">Order List</h3>
                                <div id="exTab2" class="container">	
                                    <ul class="tab-panel tab-panel-tabs">
                                        <li class="active">
                                            <a onClick={() => {handleTabChange(1)}} href="" data-toggle="tab">Undelivered</a>
                                        </li>
                                        <li>
                                            <a onClick={() => {handleTabChange(2)}} href="" data-toggle="tab">Delivered</a>
                                        </li>                                        
                                    </ul>
                                    <div class="tab-content p-5 bg-light">
                                        <div class="tab-pane active">
                                        <table className="order-list-table">
						                    <thead>
						                        <tr class="text-center">
                                                    <th>#</th>
                                                    <th>Order Date</th>
                                                    <th>Order Id</th>
                                                    <th>Customer</th>
                                                    <th>Product</th>
                                                    <th>Price</th>
                                                    <th>Quantity</th>
                                                    <th>Total</th>
                                                    <th>Address</th>
                                                    <th>Total</th>
                                                    {tabValue === 1 && <th>Action</th>}
                    					        </tr>
						                    </thead>
						                    <tbody>
                                                {(orderList.length>0 ? orderList :[]).map((order, index) => {                                                    
                                                    let totalProduct = orderedProductList.filter(pro => pro.order_id === order.id).length;                                                    
                                                    return(
                                                        (orderedProductList.length >0 ? orderedProductList :[]).map((product) =>  {
                                                            if(product.order_id === order.id){
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
                                                                    <td>{`$${product.price}/${product.unit_name}`}</td>
                                                                    <td>{`${product.quantity}/${product.ordered_unit_name}`}</td>
                                                                    <td>{product.total}</td>
                                                                    {totalProduct !== 0 &&
                                                                        <Fragment>
                                                                            <td rowspan={totalProduct}>{`${order.flat_add}, ${order.street_add}, ${order.city}`}</td>
                                                                            <td rowspan={totalProduct}>{order.total}</td>
                                                                            {tabValue === 1 && <td rowspan={totalProduct}><a href="" onClick={()=>{proceedToDelivered(order.id)}}>Click to delivered</a></td>}
                                                                        </Fragment>
                                                                    }   
                                                                    <div style={{display:'none'}}>{totalProduct = 0}</div>
                                                                </tr>
                                                                )
                                                            }
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
					{/* <div className="row mt-5">
						<div className="col text-center">
							<div className="block-27">
							<ul>
								<li><a href="#">&lt;</a></li>
								<li className="active"><span>1</span></li>
								<li><a href="#">2</a></li>
								<li><a href="#">3</a></li>
								<li><a href="#">4</a></li>
								<li><a href="#">5</a></li>
								<li><a href="#">&gt;</a></li>
							</ul>
							</div>
						</div>
					</div> */}
    </section>
		<Footer />
	</Fragment>
    )
}