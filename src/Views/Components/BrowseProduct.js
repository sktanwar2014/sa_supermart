import React, {useState, useEffect, Fragment} from 'react';
import $ from "jquery";

//Components 
import CategoriesAPI from '../../api/categories.js';
import StaticAPI from '../../api/static.js';
import CartAPI from '../../api/cart.js';
import {CART_TOKEN, APP_TOKEN} from '../../api/config/Constants.js';
import Footer from '../Partials/Footer.js';
import Header from '../Partials/Header.js';

export default function BrowseProduct(props) {
	const userId = APP_TOKEN.get().userId;
    const roleId = APP_TOKEN.get().role_id;
	
	const [staticRecordList, setStaticRecordList] = useState([]);
	const [categoryList, setCategoryList] = useState([]);
    const [productsList, setProductsList] = useState([]);
	const [cartTotal, setCartTotal] = useState(CART_TOKEN.get().cartTotal);

    useEffect(()=>{		
		getCategoryList();
		getTotalProductList();
		getRequiredStaticRecordList();	
	},[]);
	
	useEffect(() => {
		$(document).ready(function () {
        	$('.product-category li a').click(function(e) {
				$('.product-category li a').removeClass('active');
				var $parent = $(this);
				$parent.addClass('active');
				e.preventDefault();
        	});
		});
	})
	

    const getCategoryList = async () => {
        try{
            const result = await CategoriesAPI.getCategoryList();
            setCategoryList(result.categoryList);            
        }catch(e){
            console.log('Error...',e);
        }
    }
	
	const getTotalProductList = async () => {		
        try{
            const result = await CategoriesAPI.getTotalProductList();            
			setProductsList(result.totalProductList);			
        }catch(e){
            console.log('Error...',e);
        }
	}

	const getProductUnderMainCategory = async (id) => {
		try{
            const result = await CategoriesAPI.getProductUnderMainCategory({mainCategoryId: id});
			setProductsList(result.productList);	
        }catch(e){
            console.log('Error...',e);
        }
	}

	const getRequiredStaticRecordList = async () => {
        try{
            const result = await StaticAPI.getRequiredStaticRecordList();
            setStaticRecordList(result);            
        }catch(e){
            console.log('Error...',e);
        }
    }

    // const getAllCategoryTableRecords = async () => {
    //     try{
    //         const result = await CategoriesAPI.getAllCategoryTableRecords();            
    //         setCategories(result.allCategoryTableRecords);
    //     }catch(e){
    //         console.log('Error...',e);
    //     }
	// }    

	// const getProductUnderMiddleCategory = async (id) => {
	// 	try{
	// 		const result = await CategoriesAPI.getProductUnderMiddleCategory({middleCategoryId: id});
	// 		setProductsList(result.totalProductList);
	// 	}catch(e){
	// 		console.log('Error...',e);
	// 	}
	// }
	 
	// const getProductUnderSubCategory = async (id) => {
	// 	try{
	// 		const result = await CategoriesAPI.getProductUnderSubCategory({subCategoryId: id});
	// 		setProductsList(result.totalProductList);
	// 	}catch(e){
	// 		console.log('Error...',e);
	// 	}
	// }

	const addProductInCart =async (product) => {
		const quantity = document.getElementById(`productQuantity-${product.id}`).value;
		const unit_id  = document.getElementById(`productUnit-${product.id}`).value;
		const total  = document.getElementById(`productTotal-${product.id}`).value;
		let ordered_unit_name = '';
		staticRecordList.productUnitList.map((ele)=>{
			if(ele.id == unit_id){
				ordered_unit_name = ele.value
			}
		})

		product.quantity = quantity;
		product.unit_id = unit_id;
		product.total = total;
		product.ordered_unit_name = ordered_unit_name;
		CART_TOKEN.set({product : product});
		setCartTotal(CART_TOKEN.get().cartTotal)
	}

    


	const handleValueChange = (data, e) =>{
		let quantity = Number(e.target.value);
		document.getElementById(`productTotal-${data.id}`).value = (data.price * quantity);
	}

    return(
		<Fragment>
			<div className="py-1 bg-primary">
            <div className="container">
                <div className="row no-gutters d-flex align-items-start align-items-center px-md-0">
                    <div className="col-lg-12 d-block">
                        <div className="row d-flex" style={{padding:'10px'}}>
                            {/* <div className="col-md pr-4 d-flex topper align-items-center">
                                <div className="icon mr-2 d-flex justify-content-center align-items-center"><span className="icon-phone2"></span></div>
                                <span className="text">+ 1235 2355 98</span>
                            </div>
                            <div className="col-md pr-4 d-flex topper align-items-center">
                                <div className="icon mr-2 d-flex justify-content-center align-items-center"><span className="icon-paper-plane"></span></div>
                                <span className="text">youremail@email.com</span>
                            </div>
                            <div className="col-md-5 pr-4 d-flex topper align-items-center text-lg-right">
                                <span className="text">3-5 Business days delivery &amp; Free Returns</span>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <nav className="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
            <div className="container">
            <a className="navbar-brand" href="/">Vegefoods</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="oi oi-menu"></span> Menu
            </button>

            <div className="collapse navbar-collapse" id="ftco-nav">
                {/* <li className="nav-item active"><a href="/" className="nav-link">Home</a></li> */}
                {(userId == 1 && roleId == 1) ?
                    <ul className="navbar-nav ml-auto">    
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="dropdown04" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Products</a>
                            <div className="dropdown-menu" aria-labelledby="dropdown04">
                                <a className="dropdown-item" href="/add-new-product">Add New</a>
                                <a className="dropdown-item" href="/view-added-product">View List</a>                    
                            </div>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="dropdown04" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Orders</a>
                            <div className="dropdown-menu" aria-labelledby="dropdown04">
                                <a className="dropdown-item" href="/view-order-list">View</a>
                            </div>
                        </li>
                        <li className="nav-item"><a href="/logout" className="nav-link">Logout</a></li> 
                    </ul>
                    :
                    <ul className="navbar-nav ml-auto">    
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="dropdown04" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Orders</a>
                            <div className="dropdown-menu" aria-labelledby="dropdown04">
                                <a className="dropdown-item" href="/view-user-order-list">View</a>
                            </div>
                        </li>
                        <li className="nav-item cta cta-colored"><a href="/cart-list" className="nav-link"><span className="icon-shopping_cart"></span>[{cartTotal}]</a></li>
                        <li className="nav-item"><a href="/logout" className="nav-link">Logout</a></li> 
                    </ul>
                }
                
                {/* <li className="nav-item"><a href="#" className="nav-link">About</a></li>
                <li className="nav-item"><a href="#" className="nav-link">Blog</a></li>
                <li className="nav-item"><a href="#" className="nav-link">Contact</a></li> */}
            </div>
            </div>
        </nav>


        <section className="cat_product_area section_gap">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-md-10 mb-5 text-center">
						<ul className="product-category">
							<li><a href="#"  onClick={getTotalProductList} className = "active">All</a></li>

							{(categoryList.length > 0 ? categoryList : []).map((data, index) => {
								return(
									<li > 
										<a  href="#" onClick={()=>{getProductUnderMainCategory(data.id)}}>{data.category_name}</a>														
									</li>
									)
								}
							)}
						</ul>
					</div>
				</div>			
				<div className="row">
					<div className="col-md-12 ftco-animate fadeInUp ftco-animated">
						<div className="">
							<table className="table">
								<thead className="thead-primary">
								<tr className="text-center">
									<th>Product List</th>
									<th>Price</th>
									<th>Quantity</th>
									<th>Unit</th>
									<th>Total</th>
									<th>&nbsp;</th>
								</tr>
								</thead>
								<tbody>
									{(productsList.length > 0 ? productsList : []).map((data, index) => {
										return(
											<tr className="text-center">
												<td className="product-name"> <h3>{data.product_name }</h3></td>
												<td className="price">{`$${data.price}/${data.unit_name}`}</td>												
												<td className="quantity">
													<div className="input-group mb-3">
														<input type="text" id={'productQuantity-'+data.id}  className="quantity form-control input-number"  defaultValue="1"  min="1" max="100" onChange={(e)=>{handleValueChange(data, e)}} />
													</div>
												</td>
												<td>
													<div className="input-group mb-3">
														<select className="form-control"  name='productUnit' id={'productUnit-'+data.id}  defaultValue={data.unit_id} >
															{(staticRecordList.productUnitList !== undefined && staticRecordList.productUnitList !== null && staticRecordList.productUnitList !== "") && 
																(staticRecordList.productUnitList.length > 0 ? staticRecordList.productUnitList : [] ).map((unit, index)=>{
																	return(
																		<option id={unit.id}  value={unit.id} >{unit.value}</option>
																	)
																})
															}																		
														</select>
													</div>
												</td>												
												<td className="total">
													<div className="input-group mb-3">
														<input type="text" id={'productTotal-'+data.id} className="quantity form-control input-number" defaultValue={data.price} disabled/>
													</div>
												</td>
												<td className="product-remove">
													<a className="buy-now d-flex justify-content-center align-items-center mx-1"
														onClick={()=>{addProductInCart(data)}} id={'addincart' + data.id} 
													>
														<span><i className="ion-ios-cart"></i></span>
													</a>    
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
	</section>
	<Footer />
	</Fragment>
    )
}