import React, {useState, useEffect} from 'react';

//Components 
import CategoriesAPI from '../../api/categories.js';
import StaticAPI from '../../api/static.js';
import CartAPI from '../../api/cart.js';

export default function BrowseProduct() {

	const [categories, setCategories] = useState([]);
	const [productsList, setProductsList] = useState([]);
	const [staticRecordList, setStaticRecordList] = useState([]);
	const [productCart, setProductCart] = useState([]);


	const getRequiredStaticRecordList = async () => {
        try{
            const result = await StaticAPI.getRequiredStaticRecordList();
            setStaticRecordList(result);            
        }catch(e){
            console.log('Error...',e);
        }
    }

    const getAllCategoryTableRecords = async () => {
        try{
            const result = await CategoriesAPI.getAllCategoryTableRecords();            
            setCategories(result.allCategoryTableRecords);
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
			setProductsList(result.totalProductList);	
        }catch(e){
            console.log('Error...',e);
        }
	}

	const getProductUnderMiddleCategory = async (id) => {
		try{
			const result = await CategoriesAPI.getProductUnderMiddleCategory({middleCategoryId: id});
			setProductsList(result.totalProductList);
		}catch(e){
			console.log('Error...',e);
		}
	}
	 
	const getProductUnderSubCategory = async (id) => {
		try{
			const result = await CategoriesAPI.getProductUnderSubCategory({subCategoryId: id});
			setProductsList(result.totalProductList);
		}catch(e){
			console.log('Error...',e);
		}
	}

	const addProductInCart =async (productId) => {
		let tempCart = [...productCart];
		
		// tempCart.productId = productId
		// productCart = tempCa
		document.getElementById('addincart'+productId).style.color = '#82ae46';
		// try{
        //     const result = await CartAPI.addProduct({productId: productId});
        //     // setCategories(result.allCategoryTableRecords);
        // }catch(e){
        //     console.log('Error...',e);
        // }
	}

    useEffect(()=>{
		getAllCategoryTableRecords();
		getTotalProductList();
		getRequiredStaticRecordList();
    },[]);


	const handleValueChange = (data, e) =>{
		let quantity = Number(e.target.value);
		document.getElementById(`productTotal-${data.id}`).value = (data.price * quantity);
	}


    return(
        <section className="cat_product_area section_gap">
		<div className="container-fluid">
            <div className="row">
             <div className="col-lg-3">
			 		<div className="left_sidebar_area">
			 			<aside className="left_widgets cat_widgets">
			 				<div className="l_w_title">
			 					<h3>Browse Categories</h3>
			 				</div>
			 				<div className="widgets_inner">
			 					<ul className="list">
                                     {(categories.length > 0 ? categories : []).map((top) => {
                                         if(top.type === 1 && top.parent_id === 0){
                                            return(
                                            <li > 
												<a href="#"  onClick={()=>{getProductUnderMainCategory(top.id)}}>{top.category_name}</a>
                                                {(categories.length > 0 ? categories : []).map((middle) => {
                                                    if(middle.type === 2 && middle.parent_id === top.id){
                                                        return(
                                                            <ul className="list" style={{display: 'block'}} id={`categories_${top.id}`} >
                                                                <li><a href="#" onClick={()=>{getProductUnderMiddleCategory(middle.id)}}>{middle.category_name}</a>
                                                                    {(categories.length > 0 ? categories : []).map((sub) => {
                                                                        if(sub.type === 3 && sub.parent_id === middle.id){
                                                                            return(
                                                                                <ul className="list" style={{display: 'block'}}>
                                                                                    <li><a href="#" onClick={()=>{getProductUnderSubCategory(sub.id)}}>{sub.category_name}</a></li>
                                                                                </ul>
                                                                                )
                                                                        }
                                                                    })}
                                                                </li>
                                                            </ul>
                                                        )
                                                    }
                                                })}
                                            </li>
                                            )
                                         }
                                     })}
			 					</ul>
			 				</div>
			 			</aside>
						
			 		</div>
			 	</div>
				 <div className="col-lg-9">
				 	<div className="product_top_bar">
				 		<div className="left_dorp" style={{display:'flex'}}>
				 			<select className="sorting" style={{display: 'block'}}>
				 				<option value="1">Default sorting</option>
				 				<option value="2">Default sorting 01</option>
				 				<option value="4">Default sorting 02</option>
                             </select>
                             {/* <div className="nice-select sorting" tabindex="0">
                                 <span className="current">Default sorting</span>
                                     <ul className="list">
                                         <li data-value="1" className="option selected">Default sorting</li>
                                         <li data-value="2" className="option">Default sorting 01</li>
                                         <li data-value="4" className="option">Default sorting 02</li>
                                     </ul>
                             </div> */}
				 			<select className="show" style={{display: 'block'}}>
				 				<option value="1">Show 12</option>
				 				<option value="2">Show 14</option>
				 				<option value="4">Show 16</option>
                             </select>
                             {/* <div className="nice-select show" tabindex="0">
                                 <span className="current">Show 12</span>
                                     <ul className="list">
                                         <li data-value="1" className="option selected">Show 12</li>
                                         <li data-value="2" className="option">Show 14</li>
                                         <li data-value="4" className="option">Show 16</li>
                                     </ul>
                             </div> */}
				 		</div>
				 		<div className="right_page ml-auto">
				 			<nav className="cat_page" aria-label="Page navigation example">
				 				<ul className="pagination">
				 					<li className="page-item">
				 						<a className="page-link" href="#">
				 							<i className="fa fa-long-arrow-left" aria-hidden="true"></i>
				 						</a>
				 					</li>
				 					<li className="page-item active">
				 						<a className="page-link" href="#">1</a>
				 					</li>
				 					<li className="page-item">
				 						<a className="page-link" href="#">2</a>
				 					</li>
				 					<li className="page-item">
				 						<a className="page-link" href="#">3</a>
				 					</li>
				 					<li className="page-item blank">
				 						<a className="page-link" href="#">...</a>
				 					</li>
				 					<li className="page-item">
				 						<a className="page-link" href="#">6</a>
				 					</li>
				 					<li className="page-item">
				 						<a className="page-link" href="#">
				 							<i className="fa fa-long-arrow-right" aria-hidden="true"></i>
				 						</a>
				 					</li>
				 				</ul>
				 			</nav>
				 		</div>
				 	</div>				 
					<section className="ftco-section ftco-cart">
						<div className="container">
							<div className="row">
								<div className="col-md-12 ftco-animate fadeInUp ftco-animated">
									<div className="">
										<table className="table">
											<thead className="thead-primary">
											<tr className="text-center">
												<th>Product List</th>
												<th>Unit</th>
												<th>Price</th>
												<th>Quantity</th>
												<th>Total</th>
												<th>&nbsp;</th>
											</tr>
											</thead>
											<tbody>
												{(productsList.length > 0 ? productsList : []).map((data, index) => {

													return(
														<tr className="text-center">
															<td className="product-name">
																<h3>{data.product_name + '  :  ' + data.model_no }</h3>
																<p>{data.description}</p>
															</td>
															<td>
																<div className="input-group mb-3">
																	<select className="form-control"  name='product_unit' defaultValue={String(data.unit_id)} >
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
															<td className="price">${data.price}</td>
															<td className="quantity">
																<div className="input-group mb-3">
																	<input type="text" className="quantity form-control input-number" defaultValue="1"  min="1" max="100" onChange={(e)=>{handleValueChange(data, e)}} />
																</div>
															</td>
															<td className="total">
																<div className="input-group mb-3">
																	<input type="text" id={'productTotal-'+data.id} className="quantity form-control input-number" defaultValue={data.price} disabled/>
																</div>
															</td>
															<td className="product-remove">
																<a 
																	className="buy-now d-flex justify-content-center align-items-center mx-1"
																	onClick={()=>{addProductInCart(data.id)}} id={'addincart' + data.id}
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
									{/* <div className= "cart-detail p-3 p-md-4">
										<p><a onClick={placeOrder} class="btn btn-primary py-3 px-4">Place an order</a></p>
									</div> */}
								</div>
							</div>
						</div>	
					</div>	
				</section>	
			</div>
		</div>
	</div>
	</section>
    )
}