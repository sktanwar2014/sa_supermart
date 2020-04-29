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
	
    const [productUnitList, setProductUnitList] = useState([]);
	const [categoryList, setCategoryList] = useState([]);
	const [productsList, setProductsList] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
	
	const [cartTotal, setCartTotal] = useState(CART_TOKEN.get().cartTotal);

    useEffect(()=>{		
		getCategoryList();
		getProductList();
		getProductUnitList();
	},[]);
	
	// useEffect(() => {
	// 	$(document).ready(function () {
    //     	$('.product-category li a').click(function(e) {
	// 			$('.product-category li a').removeClass('active');
	// 			var $parent = $(this);
	// 			$parent.addClass('active');
	// 			e.preventDefault();
    //     	});
	// 	});
	// })
	

    const getCategoryList = async () => {
        try{
            const result = await CategoriesAPI.getCategoryList();
            setCategoryList(result.categoryList);            
        }catch(e){
            console.log('Error...',e);
        }
    }
	
	const getProductList = async (categoryId = 0, subCategoryId=0) => {
        try{
            const result = await CategoriesAPI.getProductList({categoryId: categoryId, subCategoryId: subCategoryId});
			setProductsList(result.productList);
        }catch(e){
            console.log('Error...',e);
        }
	}

	const getProductUnitList = async () => {
        try{
            const result = await StaticAPI.getProductUnitList();
            setProductUnitList(result.productUnitList);            
        }catch(e){
            console.log('Error...',e);
        }
    }

	const getSubCategoryList = async () => {
        let id = document.getElementById('categoryDropDown').value;
        if(id !== '' && id !== undefined && id !== null){
            try{
                const result = await CategoriesAPI.getSubCategoryList({categoryId: id});
                setSubCategory(result.subCategoriesList);
            }catch(e){
                console.log('Error...',e);
			}
			getProductList(id, 0);
        }else{
			setSubCategory([]);
			getProductList();
		}
	}
	
	const getProductUnderSubCategoryList = async (id) => {
        let categoryId = document.getElementById('categoryDropDown').value;
		let subCategoryId = document.getElementById('subCategoryDropDown').value;
        if(subCategoryId !== '' && subCategoryId !== undefined && subCategoryId !== null){
			getProductList(categoryId, subCategoryId);
		}
	}

	const addProductInCart =async (prod) => {
		const product = prod;
		const quantity = document.getElementById(`productQuantity-${product.id}`).value;
		const unit_id  = document.getElementById(`productUnit-${product.id}`).value;
		let ordered_unit_name = '';
		productUnitList.map((ele)=>{
			if(ele.id == unit_id){
				ordered_unit_name = ele.unit_name
			}
		})
		product.ordered_unit_name = ordered_unit_name;
		product.user_id = userId;
		product.quantity = quantity;
		product.unit_id = unit_id;
		CART_TOKEN.set({product : product});
		setCartTotal(CART_TOKEN.get().cartTotal)
	}

	const handleUnitChange = async (e) => {
		let unitId = document.getElementById(e.target.name).value;
		let productId = String(e.target.name).split('-')[1];		
		let isPacket = productUnitList.find(ele => {return ele.id == unitId && ele.is_bundle == 1});

		if(isPacket){
			const result = await getProductPacketInfo(unitId,  productId);
				let pTag = document.createElement("p")
				pTag.className= "packet-unit-text";

				if(result.length>0){
					let values = result[0];
					pTag.textContent  = values.packet_weight + " " + values.packet_unit_name + ' in ' + values.unit_value + " " +values.unit_name;
				}else{
					pTag.textContent  = 'Weight not defined';
				}
				

				if(document.getElementById('productUnitTd-'+productId).childElementCount ==  2){
					document.getElementById('productUnitTd-'+productId).removeChild(document.getElementById('productUnitTd-'+productId).lastChild)
					document.getElementById('productUnitTd-'+productId).appendChild(pTag);
					document.getElementById('productUnitDiv-'+productId).classList.add('packet-unit');
				}else{
					document.getElementById('productUnitTd-'+productId).appendChild(pTag);
					document.getElementById('productUnitDiv-'+productId).classList.add('packet-unit');
				}				
		}else{
			if(document.getElementById('productUnitTd-'+productId).childElementCount ==  2){
				document.getElementById('productUnitTd-'+productId).removeChild(document.getElementById('productUnitTd-'+productId).lastChild)
				document.getElementById('productUnitDiv-'+productId).classList.remove('packet-unit');
			}
		}
	}


	const getProductPacketInfo = async(unitId,  productId) => {
		try{
			const result = await CategoriesAPI.getProductPacketInfo({unitId: unitId,  productId: productId});
			return result.productPacketInfo;
		}catch(e){
			console.log('error...', e);
		}
	}
	// const handleCheckLastActivity = () => {
	// 	let body =  document.getElementById('productTableBody');
	// 	console.log(body)
	// 	// if(document.getElementById('productUnitTd-'+productId)){
	// 	// 	if(document.getElementById('productUnitTd-'+productId).childElementCount ==  2){
	// 	// 		document.getElementById('productUnitTd-'+productId).removeChild(document.getElementById('productUnitTd-'+productId).lastChild)
	// 	// 		document.getElementById('productUnitDiv-'+productId).classList.remove('packet-unit');
	// 	// 	}
	// 	// }
	// 	// if(document.getElementById('productQuantity-'+productId)){
	// 	// 	document.getElementById('productQuantity-'+productId).value = "1";
	// 	// 	CART_TOKEN.get().cart.map(data => {
	// 	// 		if(data.id == productId && data.user_id == userId){
	// 	// 			document.getElementById('productQuantity-'+productId).value = String(data.quantity);
	// 	// 		}
	// 	// 	})
	// 	// }
	// 	// if(document.getElementById('productUnit-'+productId)){
	// 	// 	// document.getElementById('productUnit-'+productId).value = "1";
	// 	// 	CART_TOKEN.get().cart.map(data => {
	// 	// 		if(data.id == productId && data.user_id == userId){
	// 	// 			document.getElementById('productUnit-'+productId).defaultValue = data.unit_id;
	// 	// 		}
	// 	// 	})
	// 	// }
	// }


	// const clearBody = () => {
	// 	let body =  document.getElementById('productTableBody');
	// 	if(body !== null){
	// 		let child = body.firstElementChild;
	// 		while (child !== null) {
	// 		    body.removeChild(child);
	// 		    child = body.firstElementChild; 
	// 		}
	// 	}
	// } 

	// useEffect(() => {
	// 	clearBody();
	// },[productsList]);
	// const handleValueChange = (data, e) =>{
	// 	let quantity = Number(e.target.value);
	// 	document.getElementById(`productTotal-${data.id}`).value = (data.price * quantity);
	// }

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
            <a className="navbar-brand" href="/">SA SUPERMART</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="oi oi-menu"></span> Menu
            </button>

            <div className="collapse navbar-collapse" id="ftco-nav">
                {/* <li className="nav-item active"><a href="/" className="nav-link">Home</a></li> */}
                {(userId == 1 && roleId == 1) ?
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item"><a href="/" className="nav-link">Home</a></li> 
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
                        <li className="nav-item"><a href="/" className="nav-link">Home</a></li> 

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
				{/* <div className="row justify-content-center">
					<div className="col-md-10 mb-5 text-center">
						<ul className="product-category">
							<li><a href="#"  onClick={getProductList} className = "active">All</a></li>

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
				</div>*/}
				<div class="row justify-content-center p-bottom-30">
					<div class="col-xl-12 ftco-animate fadeInUp ftco-animated">
						<div class="p-5 bg-light b-top-dark">
								<div class="row align-items-end">
									<div class="col-md-6">
										<div class="form-group">
											<label for="country">Category * </label>
											<div class="d-flex">
												<select id="categoryDropDown" class="form-control" onChange={getSubCategoryList}>
													<option  value = "">All</option>
													{(categoryList !== undefined && categoryList !== null && categoryList !== "") &&
														(categoryList.length > 0 ? categoryList : [] ).map((data, index)=>{
														return(
															<option id={data.id} value={data.id} >{data.category_name}</option>
														)
														})
													}
												</select>
											</div>
										</div>
									</div>   
									<div class="col-md-6">
										<div class="form-group">
											<label for="country">Sub Category * </label>
											<div class="d-flex">
												<select id="subCategoryDropDown" class="form-control"  onChange={getProductUnderSubCategoryList}>
													<option  value = "">Select Any One</option>
													{(subCategory !== undefined && subCategory !== null && subCategory !== "") && 
														(subCategory.length > 0 ? subCategory : [] ).map((data, index)=>{
														return(
															<option id={data.id} value={data.id} >{data.category_name}</option>
														)
														})
													}
												</select>
											</div>
										</div>
									</div>  
									<div className="col-md-12 ftco-animate fadeInUp ftco-animated">
						<div className="">
							<table className="table">
								<thead className="thead-primary">
								<tr className="text-center">
									<th>Product List</th>
									{/* <th>Price</th> */}
									<th>Quantity</th>
									<th>Unit</th>
									{/* <th>Total</th> */}
									<th>&nbsp;</th>
								</tr>
								</thead>
								<tbody id="productTableBody">
									{(productsList.length > 0 ? productsList : []).map((data, index) => {
										// handleCheckLastActivity(data.id);
										return(
											<tr className="text-center">
												<td className="product-name"> <h3>{data.product_name }</h3></td>
												{/* <td className="price">{`$${data.price}/${data.unit_name}`}</td>*/}
												<td className="quantity">
													<div className="input-group">
														<input type="text" id={'productQuantity-'+data.id}  className="quantity form-control input-number"  defaultValue="1"  min="1" />
														{/* onChange={(e)=>{handleValueChange(data, e)}} */}
													</div>
												</td>
												<td id={'productUnitTd-'+data.id}>
													<div id={'productUnitDiv-'+data.id} className="input-group">
														<select className="form-control"  name={'productUnit-'+data.id} id={'productUnit-'+data.id}  onChange={handleUnitChange}>
															{(productUnitList.length > 0 ? productUnitList : [] ).map((unit)=>{
																	return(
																		Object.values(data.unit_id).map(unit_id => {
																			return(
																				unit_id == unit.id  ? <option id={unit.id}  value={unit.id} >{unit.unit_name}</option>  : null
																			)
																		})
																	)
																})
															}
														</select>														
													</div>
												</td>
												{/* <td className="total">
													<div className="input-group mb-3">
														<input type="text" id={'productTotal-'+data.id} className="quantity form-control input-number" defaultValue={data.price} disabled/>
													</div>
												</td> */}
												<td className="product-remove">
													<a className="buy-now d-flex justify-content-center align-items-center mx-1"
														onClick={()=>{addProductInCart(data)}} id={'addincart' + data.id}
													>
														<span><i className="ion-ios-cart"></i></span>
													</a>    
												</td>
											</tr>
										);
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
					
		</div>
	</section>
	<Footer />
	</Fragment>
    )
}