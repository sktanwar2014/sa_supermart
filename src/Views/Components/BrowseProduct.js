import React, {useState, useEffect, Fragment} from 'react';

//Components 
import CategoriesAPI from '../../api/categories.js';
import StaticAPI from '../../api/static.js';
import CartAPI from '../../api/cart.js';
import {CART_TOKEN} from '../../api/config/Constants.js';
import Footer from '../Partials/Footer.js';
import Header from '../Partials/Header.js';

export default function BrowseProduct() {
	
	const [staticRecordList, setStaticRecordList] = useState([]);
	const [categoryList, setCategoryList] = useState([]);
    const [productsList, setProductsList] = useState([]);
	const [totalInCart, setTotalInCart] = useState(CART_TOKEN.get().cartTotal);
	
    useEffect(()=>{		
		getCategoryList();
		getTotalProductList();
		getRequiredStaticRecordList();
    },[]);

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
		console.log(id, result)

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
		setTotalInCart(CART_TOKEN.get().cartTotal)

	}

    


	const handleValueChange = (data, e) =>{
		let quantity = Number(e.target.value);
		document.getElementById(`productTotal-${data.id}`).value = (data.price * quantity);
	}

    return(
		<Fragment>
		<Header totalInCart = {totalInCart} />
        <section className="cat_product_area section_gap">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-md-10 mb-5 text-center">
						<ul className="product-category">
							<li><a  onClick={getTotalProductList} className={"active"}>All</a></li>

							{(categoryList.length > 0 ? categoryList : []).map((data, index) => {
								return(
									<li > 
										<a   onClick={()=>{getProductUnderMainCategory(data.id)}}>{data.category_name}</a>														
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
														<select className="form-control"  name='productUnit' id={'productUnit-'+data.id}  defaultValue={String(data.unit_id)} >
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