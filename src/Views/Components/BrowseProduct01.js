import React, {useState, useEffect, Fragment} from 'react';

//Components 
import CategoriesAPI from '../../api/categories.js';
import {CART_TOKEN} from '../../api/config/Constants.js';

export default function BrowseProduct() {

	const [categoryList, setCategoryList] = useState([]);
    const [productsList, setProductsList] = useState([]);
    
    useEffect(()=>{
		getCategoryList();
		getTotalProductList();
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

	const addToCart = (data) => {
		console.log(data)
		CART_TOKEN.set(data.id);
	}

    return(
		<Fragment>
			<section className="ftco-section">
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
						{(productsList.length > 0 ? productsList : []).map((data, index) => {
							return(
								<div className="col-md-6 col-lg-3 ftco-animate fadeInUp ftco-animated">
									<div className="product">
										<p href="" className="img-prod"><img className="img-fluid" src="images/product-1.jpg" alt="Colorlib Template" />
											{/* <span className="status">30%</span> */}
											<div className="overlay"></div>
										</p>
										<div className="text py-3 pb-4 px-3 text-center">
											<h3><a href="#">{data.product_name}</a></h3>
											{/* <div className="d-flex"> */}
												{/* <div className="pricing"> */}
													<p className="price">
														<span>{`$${data.price} / ${data.unit_name}`}</span>
														{/* <span className="mr-2 price-dc">{`$${data.price}`}</span>
														<span className="price-sale">$80.00</span>*/}
													</p> 
													<h4><a href="#5" onClick={()=>{addToCart(data)}} class="buy-now d-flex justify-content-center align-items-center mx-1">
														<span><i class="ion-ios-cart"></i></span>
													</a>
													</h4>
												{/* </div> */}
											{/* </div> */}
											{/* <div className="bottom-area d-flex px-3">
												<div className="m-auto d-flex">
													{/* <a href="#" className="add-to-cart d-flex justify-content-center align-items-center text-center">
														<span><i className="ion-ios-menu"></i></span>
													</a> */}
													{/* <a href="#" class="buy-now d-flex justify-content-center align-items-center mx-1">
														<span><i class="ion-ios-cart"></i></span>
													</a>
												</div> */}
											{/* </div> */}
										</div>
									</div>
								</div>
							)
						})
					}
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
				</div>
    </section>
	</Fragment>
    )
}