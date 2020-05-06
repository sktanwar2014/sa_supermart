import React, {useState, useEffect, Fragment} from 'react';

//Components 
import CategoriesAPI from '../../api/categories.js';

import {CART_TOKEN, APP_TOKEN} from '../../api/config/Constants.js';
import Footer from '../Partials/Footer.js';
import Header from '../Partials/Header.js';
import CallLoader from '../../common/Loader.js';
import {API_URL} from '../../api/config/Constants.js';


export default function BrowseProduct(props) {
	const userId = APP_TOKEN.get().userId;
	
	const [categoryList, setCategoryList] = useState([]);
	const [productsList, setProductsList] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
	const [cartList, setCartList] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=>{
		setCartList(CART_TOKEN.get().cart);
		getCategoryList();
		getProductList();
	},[]);
	
	

    const getCategoryList = async () => {
        try{
            const result = await CategoriesAPI.getCategoryList();
            setCategoryList(result.categoryList);            
        }catch(e){
            console.log('Error...',e);
        }
    }
	
	const getProductList = async (categoryId = 0, subCategoryId=0) => {
        setIsLoading(true);

        try{
            const result = await CategoriesAPI.getProductList({categoryId: categoryId, subCategoryId: subCategoryId});
			setProductsList(result.productList);
      		setIsLoading(false);
	}catch(e){
            console.log('Error...',e);
        }
	}


	const getSubCategoryList = async () => {
		setIsLoading(true);
		
        let id = document.getElementById('categoryDropDown').value;
        if(id !== '' && id !== undefined && id !== null){
            try{
                const result = await CategoriesAPI.getSubCategoryList({categoryId: id});
				setSubCategory(result.subCategoriesList);
				setIsLoading(false);
				
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
		product.user_id = userId;
		CART_TOKEN.set({product : product});
		setCartList(CART_TOKEN.get().cart);
	}

    return(
		<Fragment>
			<Header />
				<div class="hero-wrap hero-bread" style={{backgroundImage: `url('images/bg_1.jpg')`}}>
					<div class="container">
						<div class="row no-gutters slider-text align-items-center justify-content-center">
						<div class="col-md-9 ftco-animate text-center fadeInUp ftco-animated">
							<p class="breadcrumbs"><span class="mr-2"><a href="index.html">Home</a></span> <span>Product</span></p>
							<h1 class="mb-0 bread">Products</h1>
						</div>
						</div>
					</div>
				</div>

				<section className="cat_product_area section_gap">
					<div className="container">
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
									</div>
								</div>
							</div>
						</div>
						<div className="row">
							{cartList && (productsList.length > 0 ? productsList : []).map((data, index) => {
								return(
									<div className="col-md-6 col-lg-3 ftco-animate fadeInUp ftco-animated">
										<div className="product">
											<a className="img-prod"><img className="product-img-fluid" src={API_URL + "/api/images?path=productImages/" + data.image_name}  alt={data.image_name} />
												<div className="overlay"></div>
											</a>
											<div className="text py-3 pb-4 px-3 text-center">
												<h3><a>{data.product_name}</a></h3>
												<hr />
												<div class="row">
													<div class="col-md-12 col-lg-6 b-right-light">
														<div class="category-menu">
															{(cartList.find(ele => {return ele.id === data.id})) ? 
																<button type="button" style={{cursor: 'default', color: '#000000'}}>Added</button>
															: <button type="button" onClick={()=>{addProductInCart(data)}}>Add to Cart</button>
															}
														</div>
													</div>
													<div class="col-md-12 col-lg-6">
														<div class="category-menu">
															<button type="button" >View Details</button>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				</section>
			<Footer />
		{isLoading ?   <CallLoader />   : null  }
	</Fragment>
    )
}