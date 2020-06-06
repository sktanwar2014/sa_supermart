import React, {useState, useEffect, Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

//Components 
import CategoriesAPI from '../../api/categories.js';
import StaticAPI from '../../api/static.js';

import {CART_TOKEN, APP_TOKEN} from '../../api/config/Constants.js';
import Footer from '../Partials/Footer.js';
import Header from '../Partials/Header.js';
import CallLoader from '../../common/Loader.js';
import {API_URL} from '../../api/config/Constants.js';
import { Link } from 'react-router-dom';



const useStyles = makeStyles((theme) => ({
	root: {
	  '& > *': {
		marginTop: theme.spacing(2),
	  },
	},
  }));


export default function BrowseProduct(props) {

	const classes = useStyles();

	const userId = APP_TOKEN.get().userId;
	
	const [categoryList, setCategoryList] = useState([]);
	const [productsList, setProductsList] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
	const [cartList, setCartList] = useState([]);
	const [productUnitList, setProductUnitList] = useState([]);

	const [isLoading, setIsLoading] = useState(false);
	const [pageCount, setPageCount] = useState(0);
	const [pageNo, setPageNo] = useState(1);

    useEffect(()=>{
		setCartList(CART_TOKEN.get().cart);
		getProductUnitList();
		getCategoryList();
		getProductList();
	},[]);
	
	
	const getProductUnitList = async () => {
        try{
            const result = await StaticAPI.getProductUnitList();
            setProductUnitList(result.productUnitList);            
        }catch(e){
            console.log('Error...',e);
        }
	}

    const getCategoryList = async () => {
        try{
            const result = await CategoriesAPI.getCategoryList();
            setCategoryList(result.categoryList);            
        }catch(e){
            console.log('Error...',e);
        }
    }
	
	const getProductList = async (categoryId = 0, subCategoryId=0, page=1, isActive=1) => {
		setProductsList([]);
        setIsLoading(true);

        try{
            const result = await CategoriesAPI.getProductList({
				categoryId: categoryId, 
				subCategoryId: subCategoryId, 
				pageNo: page,
				is_active: isActive,
			});
			setProductsList(result.productList);
			setPageCount(result.productListCount);
      		setIsLoading(false);
	}catch(e){
            console.log('Error...',e);
        }
	}


	const getSubCategoryList = async () => {
		setIsLoading(true);
		setPageNo(1);
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
			setPageNo(1);	
			getProductList(categoryId, subCategoryId);
		}
	}

	const handlePagination = (event, page) => {
		let categoryId = document.getElementById('categoryDropDown').value;
		let subCategoryId = document.getElementById('subCategoryDropDown').value;
		setPageNo(page);
		getProductList(categoryId, subCategoryId, page);
	}


	const addProductInCart =async (prod) => {
		const product = prod;
		const quantity = document.getElementById(`productQuantity-${product.id}`).value;
		const selected_unit_id  = document.getElementById(`productUnit-${product.id}`).value;

		product.user_id = userId;
		product.quantity = quantity;
		product.selected_unit_id = selected_unit_id;

			
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
								let cart = cartList.find(ele => { return ele.id === data.id}); 
								cart = (cart !== undefined && cart !== null && cart !== "") ? cart : "";
								return(
									<div className="col-md-6 col-lg-3 ftco-animate fadeInUp ftco-animated">
										<div className="product">
											<Link to={{pathname: '/product-details', state:{productDetails: data}}}>
												<a className="img-prod"><img className="product-img-fluid" src={API_URL + "/api/images?path=productImages/" + data.image_name}  alt={data.image_name} />
													<div className="overlay"></div>
												</a>
											</Link>
											<div className="text py-3 pb-4 px-3 text-center">
												<h3><a>{data.product_name}</a></h3>
												<hr />
												<div class="row">
													<div class="col-md-12 col-lg-6 b-right-light">
														<input type="number" id={"productQuantity-"+data.id} name="quantity" class="product-cart-control" defaultValue={cart.quantity ? cart.quantity : 1}  min="0" step="0.1" required  disabled={cart !== "" ? true : false}  />
													</div>
													<div class="col-md-12 col-lg-6 ">
														<select className="product-cart-control"  name={'productUnit-'+data.id} id={'productUnit-'+data.id} required disabled={cart !== "" ? true : false} >
																{(productUnitList.length > 0 ? productUnitList : [] ).map((unit)=>{
																		return(
																			Object.values((data.unit_id).split(',')).map(unit_id => {
																				return(
																					unit_id == unit.id  ? <option id={unit.id}  value={unit.id} selected={cart.selected_unit_id == unit.id }>{unit.unit_name}</option>  : null
																				)
																			})
																		)
																	})
																}
															</select>
													</div>
													<div class="col-md-12 col-lg-12 ">
														<div class="category-menu">
															{(cartList.find(ele => {return ele.id === data.id})) ?
																<button type="button" style={{cursor: 'default', color: '#000000'}}>Added in Cart</button>
															: <button type="button" onClick={()=>{addProductInCart(data)}}>Add to Cart</button>
															}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								)
							})}
						</div>
						<div  className="row" style={{ justifyContent: 'center'}}>
							<Pagination count={Math.ceil(pageCount/20)} page={pageNo} showFirstButton showLastButton onChange={handlePagination} />
						</div>
					</div>
				</section>
			<Footer />
		{isLoading ?   <CallLoader />   : null  }
	</Fragment>
    )
}