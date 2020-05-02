import React, {useState, useEffect, Fragment} from 'react';

//Components 
import Header from '../../Partials/Header.js';
import Footer from '../../Partials/Footer.js';
import OrderAPI from '../../../api/order.js';
import {getDate} from '../../../common/moment.js';
import CallLoader from '../../../common/Loader.js';



const RESET_VALUES = {
    toDate : new Date(),
    fromDate : new Date(),
}


export default function ViewOrderedProduct() {

    const [inputs, setInputs] =  useState(RESET_VALUES);
    const [orderedProductList, setOrderedProductList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    

    useEffect(()=>{
		getOrderedProductList();		
    },[]);


    
	const  handleInputChange = (e) => {
		setInputs({...inputs, [e.target.name]: e.target.value});
	}

    const getOrderedProductList = async () => {
        setIsLoading(true);
        try{
            const result = await OrderAPI.getOrderedProductList({
                from_date : getDate(inputs.fromDate),
                to_date : getDate(inputs.toDate),
            });
            setOrderedProductList(result.orderedProductList);            
        }catch(e){
            console.log('Error...',e);
        }
        setIsLoading(false);
    }


    return(
		<Fragment>
			<Header />
			<section className="ftco-section">
                <div class="container">
                <h3>View Total Required Products List </h3>
                <div class="row justify-content-center p-bottom-30">
                        <div class="col-xl-12 ftco-animate fadeInUp ftco-animated">
                            <div class="p-5 bg-light b-top-dark">
                                    <div class="row align-items-end">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="fromDate">From * </label>
                                                <input id="fromDate" name="fromDate" type="date" value={getDate(inputs.fromDate)} class="form-control"  onChange={handleInputChange} />
                                            </div>
                                        </div>   
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="toDate">To * </label>
                                                <input id="toDate" name="toDate" type="date" value={getDate(inputs.toDate)} class="form-control" onChange={handleInputChange} />
                                            </div>
                                        </div>  
                                        <div class="col-md-12 m-bottom-20">
                                            <div class="form-group">
                                                <div class="d-flex f-right">
                                                <button class="btn btn-primary px-4" onClick={getOrderedProductList}> Click to view</button>
                                                </div>
                                            </div>
                                        </div> 
                                        <div class="w-100">
                                            <table className="unit-array-table">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Products</th>
                                                        <th>Total Quantity</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(orderedProductList.length>0 ? orderedProductList :[]).map((data, index) => {                                                    
                                                    return(
                                                        <tr>
                                                            <td>{index + 1}</td>
                                                            <td>{data.product_name}</td>
                                                            <td>{data.weight+ ' ' + data.unit_name}</td>
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
        {isLoading ?   <CallLoader />   : null  }
	</Fragment>
    )
}