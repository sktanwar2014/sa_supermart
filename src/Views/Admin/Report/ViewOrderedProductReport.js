import React, {useState, useEffect, Fragment} from 'react';

//Components 
import Header from '../../Partials/Header.js';
import Footer from '../../Partials/Footer.js';
import OrderAPI from '../../../api/order.js';
import AuthAPI from '../../../api/auth.js';
import {getDate} from '../../../common/moment.js';
import CallLoader from '../../../common/Loader.js';
import UserList from './Components/UserList.js';


const RESET_VALUES = {
    toDate : new Date(),
    fromDate : new Date(),
    companies : 'All',
    user_ids : '',
}


export default function ViewOrderedProduct() {

    const [inputs, setInputs] =  useState(RESET_VALUES);
    const [orderedProductList, setOrderedProductList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userIdList, setUserIdList] = useState([]);
    const [subCategoryIdList, setSubCategoryIdList] = useState([]);
    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [userList, setUserList] = useState([]);
    const [isCheckedAll, setIsCheckedAll] = useState(true);
    const [userIdsToFetch, setUserIdsToFetch] = useState('');
    
    useEffect(()=>{
        getOrderedProductList();
        getUserList();
    },[]);


    
	const  handleInputChange = (e) => {
		setInputs({...inputs, [e.target.name]: e.target.value});
    }
    
    const handleUserDialogOpen = () => {
        setUserDialogOpen(true);
    }

    const handleUserDialogClose = (userList) => {
      setUserList(userList);
      setUserDialogOpen(false);
        let usersName = [];
        let userIds = [];
        Object.values(userList).map(data => {
            if(data.checked === true){ usersName.push(data.name); userIds.push(data.id)}
        })
        if(usersName.length === 0){ setIsCheckedAll(true); }
        setUserIdsToFetch(userIds.join())
        setInputs({...inputs, ['companies']: usersName.join(', ')});
    }

    const getUserList = async () => {
        try{
            setIsLoading(true);
            const result = await AuthAPI.getUserList({});
            setUserList(result.userList);
        }catch(e){
            console.log('Error...',e);
        }
        setIsLoading(false);
    }


    const getOrderedProductList = async () => {
        setIsLoading(true);
        try{
            const result = await OrderAPI.getOrderedProductList({
                from_date : getDate(inputs.fromDate),
                to_date : getDate(inputs.toDate),
                user_ids : isCheckedAll === true ? 0 : userIdsToFetch,
            });
            setOrderedProductList(result.orderedProductList);
            setUserIdList(result.userIdList);
            setSubCategoryIdList(result.subCategoryIdList);
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
                                                <label for="companies">Companies * </label>
                                                <div class="d-flex">
                                                    <input id="companies" name="companies" type="text" value={isCheckedAll === true ? 'All' : inputs.companies}  class="form-control" onChange={handleInputChange} title={isCheckedAll === true ? 'All' : inputs.companies} disabled />
                                                    <input type="button" class="btn btn-primary br-none"  value="Change" onClick={handleUserDialogOpen} />
                                                </div>
                                            </div>
                                        </div>  
                                        <div class="col-md-12 m-bottom-20">
                                            <div class="form-group">
                                                <div class="d-flex f-right">
                                                <button class="btn btn-primary px-4" onClick={getOrderedProductList}> Click to view</button>
                                                </div>
                                            </div>
                                        </div> 
                                        <div class="w-100 table-div">
                                            <table class="table table-td" >
                                                <thead class="thead-primary">
                                                    <tr class="text-center">
                                                        <th colSpan={2} style={{minWidth:'350px'}}> Product List</th>
                                                        <th style={{minWidth:'140px'}}>Total Quantity</th>
                                                        {(userIdList.length > 0 ? userIdList : []).map(userId => {
                                                            let userName = orderedProductList.find(ele => {return ele.user_id === userId})
                                                            return(
                                                                userName !== undefined && <th style={{minWidth:'140px'}}>{userName.user_name}</th>
                                                            )
                                                        })}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(subCategoryIdList.length > 0 ? subCategoryIdList : []).map((subCategory) => {
                                                        const sameCategoryProducts = (orderedProductList.length >0 ? orderedProductList :[]).filter(ele => {return subCategory === ele.sub_category_id});
                                                        const prodIds = [...new Set(sameCategoryProducts.map(dist => dist.product_id))];
                                                        let rowSpanNo = prodIds.length;
                                                            return(
                                                                (prodIds.length > 0 ? prodIds : []).map((prodId, index) => {
                                                                    let totalQuantity = 0;
                                                                    let productRecord = (sameCategoryProducts.length > 0 ? sameCategoryProducts :[]).filter(ele => {if(prodId === ele.product_id){totalQuantity = totalQuantity + ele.quantity; return ele;}});
                                                                        return(
                                                                            <tr>
                                                                                {rowSpanNo !== 0 && <td rowSpan={rowSpanNo}>{sameCategoryProducts[0].sub_category_name}</td>}
                                                                                <td>{productRecord[0].product_name}</td>
                                                                                <td>{Number(totalQuantity).toFixed(3) + ' ' + productRecord[0].unit_name}</td>
                                                                                    {(userIdList.length > 0 ? userIdList : []).map((userId) => {
                                                                                        const returnValue = (productRecord.length > 0 ? productRecord :[]).find((data) => { return userId === data.user_id });
                                                                                            return(
                                                                                                returnValue !== undefined ? 
                                                                                                    <td>{returnValue.quantity + ' ' + returnValue.unit_name}</td>
                                                                                                :   <td>0</td> 
                                                                                            )
                                                                                    })}
                                                                                    {<p style={{display:'none'}}> {rowSpanNo = 0}</p>}
                                                                            </tr>
                                                                            )                                                                
                                                                })
                                                            )
                                                    })}
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
        {userDialogOpen ? 
            <UserList 
                open={userDialogOpen}  
                setUserDialogOpen={setUserDialogOpen} 
                userList={userList} 
                handleUserDialogClose = {handleUserDialogClose}
                isCheckedAll={isCheckedAll} 
                setIsCheckedAll={setIsCheckedAll} 
            /> 
        : null}
	</Fragment>
    )
}