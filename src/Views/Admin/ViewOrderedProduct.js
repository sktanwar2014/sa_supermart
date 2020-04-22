import React, {useState, useEffect, Fragment} from 'react';

//Components 
import Header from '../Partials/Header.js';
import Footer from '../Partials/Footer.js';
import OrderAPI from '../../api/order.js';
import {APP_TOKEN} from '../../api/config/Constants.js';

import {getDateInDDMMYYYY, getDate} from '../../common/moment.js';


const RESET_VALUES = {
    date : new Date(),
}


export default function ViewOrderedProduct() {

    const [inputs, setInputs] =  useState(RESET_VALUES);
    const [orderedProductList, setOrderedProductList] = useState([]);
    const userId = APP_TOKEN.get().userId;

    useEffect(()=>{
		getOrderedProductListSingleDay();		
    },[]);


    
	const  handleInputChange = (e) => {
		setInputs({...inputs, [e.target.name]: e.target.value});
	}

    const getOrderedProductListSingleDay = async () => {
        try{
            const result = await OrderAPI.getOrderedProductListSingleDay({
                date : getDate(inputs.date),
            });
            setOrderedProductList(result.orderedProductListSingleDay);   
        }catch(e){
            console.log('Error...',e);
        }
    }

    const handlePurchasedRecord = async (data) => {
        let purchasedQuantity  = document.getElementById('purchasedQuantity-'+data.id).value;
        let productCost  = document.getElementById('productCost-'+data.id).value;

        if(purchasedQuantity !== "" && productCost!== ""){
            try{
                const result = await OrderAPI.handlePurchasedRecord({
                    product_id : data.id,
                    purchase_date : getDate(inputs.date),
                    required_quantity : data.weight,
                    required_unit_id : data.main_unit_id,
                    purchased_quantity : purchasedQuantity,
                    purchased_unit_id : data.main_unit_id,
                    cost : productCost,
                    created_by : userId,
                });
                if(result !== "" && result !== null && result !== undefined){
                    alert('Data update successfully.');
                }
            }catch(e){
                console.log(e);
            }
        }else{
            alert('fill the fields');
        }
    }

    return(
		<Fragment>
			<Header />
			<section className="ftco-section">
                <div class="container">
                <h3>Ordered Products </h3>
                <div class="row justify-content-center p-bottom-30">
                        <div class="col-xl-12 ftco-animate fadeInUp ftco-animated">
                            <div class="p-5 bg-light b-top-dark">
                                    <div class="row align-items-end">
                                        {/* <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="fromDate">From * </label>
                                                <input id="fromDate" name="fromDate" type="date" value={getDate(inputs.fromDate)} class="form-control"  onChange={handleInputChange} />
                                            </div>
                                        </div>    */}
                                        {/* <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="toDate">To * </label>
                                                <input id="toDate" name="toDate" type="date" value={getDate(inputs.toDate)} class="form-control" onChange={handleInputChange} />
                                            </div>
                                        </div>   */}
                                        <div class="col-md-9">
                                            <div class="form-group">
                                                <label for="date">Date * </label>
                                                <input id="date" name="date" type="date" value={getDate(inputs.date)} class="form-control" onChange={handleInputChange} />
                                            </div>
                                        </div>  
                                        <div class="col-md-3 m-bottom-20">
                                            <div class="form-group">
                                                <div class="d-flex f-right">
                                                <button class="btn btn-primary px-4" onClick={getOrderedProductListSingleDay}> Click to view</button>
                                                </div>
                                            </div>
                                        </div> 
                                        <div class="w-100">
                                            <table className="unit-array-table table-min-width">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Products</th>
                                                        <th>Ordered Quantity</th>
                                                        <th>Purchased Quantity</th>
                                                        <th>Cost</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(orderedProductList.length>0 ? orderedProductList :[]).map((data, index) => {                                                    
                                                    return(
                                                        <tr>
                                                            <td>{index + 1}</td>
                                                            <td>{data.product_name}</td>
                                                            <td>{data.weight+ ' ' + data.unit_name}</td>
                                                            <td>
                                                                <div class="d-flex justify-content-center">
                                                                    <input type="number" name={"purchasedQuantity-"+data.id} class="cost-input" id={"purchasedQuantity-"+data.id} defaultValue={data.purchased_quantity}  min="1" disabled={data.purchased_status === 3} />
                                                                    <p class="cost-input-adoptment"> {data.unit_name} </p>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div class="d-flex justify-content-center">
                                                                    <p class="cost-input-adoptment"> $ </p>
                                                                    <input type="number" name={"productCost-"+data.id} class="cost-input" id={"productCost-"+data.id} defaultValue={data.cost} min="1"  disabled={data.purchased_status === 3} />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div>
                                                                    <button class={data.purchased_status === 3 ?  "alter-purchase-record btn-disabled" : "alter-purchase-record" }type="submit" onClick={()=>{handlePurchasedRecord(data)}} disabled={data.purchased_status === 3}> Update</button>
                                                                </div>
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
							</div>
						</div>
                    
                </div>
    </section>
		<Footer />
	</Fragment>
    )
}