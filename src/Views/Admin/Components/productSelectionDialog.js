import React, {useState, useEffect, Fragment} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

// API
import OrderAPI from '../../../api/order.js';
import CategoriesAPI from '../../../api/categories.js';


//Other Components
import {isNotEmpty} from '../../../utils/conditionChecker.js';

export default function ProductSelectionDialog({open, setProductSelectionDialog, handleProductSelection}) {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
	const [productsList, setProductsList] = useState([]);
    const [subCategory, setSubCategory] = useState([]);

    useEffect(()=>{
		getCategoryList();
	},[]);

    const getCategoryList = async () => {
        try{
            const result = await CategoriesAPI.getCategoryList();
            setCategoryList(result.categoryList);            
        }catch(e){
            console.log('Error...',e);
        }
    }

    
	const getSubCategoryList = async () => {
		setIsSubmitting(true);
		setSubCategory([]);
        let id = document.getElementById('categoryDropDown').value;        
		try{
            if(isNotEmpty(id)){
                const result = await CategoriesAPI.getSubCategoryList({categoryId: id});
                setSubCategory(result.subCategoriesList);                
            }
            setIsSubmitting(false);
		}catch(e){
			console.log('Error...',e);
		}		
	}
    
    const getProductUnderSubCategoryList = async () => {
        let categoryId = document.getElementById('categoryDropDown').value;
		let subCategoryId = document.getElementById('subCategoryDropDown').value;
        if(isNotEmpty(subCategoryId)){
			getProductList(categoryId, subCategoryId);
		}
    }
    
	const getProductList = async (categoryId = 0, subCategoryId=0, page=0, isActive=1) => {
		setProductsList([]);
        setIsSubmitting(true);
        try{
            const result = await CategoriesAPI.getProductList({
				categoryId: categoryId, 
                subCategoryId: subCategoryId,
                pageNo: page,
				is_active: isActive,
			});
			setProductsList(result.productList);
            setIsSubmitting(false);
	}catch(e){
            console.log('Error...',e);
        }
	}



  const handleSubmit = async (e) =>{
    e.preventDefault();
    setIsSubmitting(true);
    try{
        
        let productId = document.getElementById('products').value;
        if(isNotEmpty(productId)){
            const product = productsList.find(ele => ele.id == productId);
            handleProductSelection(product);            
        }
    setIsSubmitting(false);
    }catch(e){
        console.log('Error...',e);
    }
  }

    return (
      <Modal show = {open} onHide={()=>{setProductSelectionDialog(false)}} size="lg" centered >
        <Modal.Header closeButton >
          <Modal.Title id="contained-modal-title-vcenter">
              Product Selection Dialog
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
        <Modal.Body>
				<div className="container">
					<div class="row justify-content-center p-bottom-30">
                        <div class="col-xl-12 ftco-animate fadeInUp ftco-animated">
                            <div class="p-5 bg-light b-top-dark">
                                <div class="row align-items-end">										 
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="country">Category * </label>
                                                <div class="d-flex">
                                                    <select id="categoryDropDown" class="form-control" required onChange={getSubCategoryList}>
                                                        <option  value = "">Select Any One</option>
                                                        {(isNotEmpty(categoryList)) && 
                                                         (categoryList.length > 0 ? categoryList : [] ).map((data, index)=>{
                                                            return(
                                                                <option id={data.id} value={data.id} >{data.category_name}</option>
                                                            )
                                                         })}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>   
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label for="country">Sub Category * </label>
                                                <div class="d-flex">
                                                    <select id="subCategoryDropDown" class="form-control" required onChange={getProductUnderSubCategoryList}>
                                                        <option  value = "">Select Any One</option>
                                                        {(isNotEmpty(subCategory)) && 
                                                         (subCategory.length > 0 ? subCategory : [] ).map((data, index)=>{															
                                                            return(
                                                                <option id={data.id} value={data.id} >
																	{data.category_name}
																</option>
                                                            )
                                                         })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>  
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label for="country">Products * </label>
                                                <div class="d-flex">
                                                    <select id="products" class="form-control" required >
                                                        <option  value = "">Select Any One</option>                                                        
                                                        {(isNotEmpty(productsList)) && 
                                                         (productsList.length > 0 ? productsList : [] ).map((data, index)=>{															
                                                            return(
                                                                <option id={data.id} value={data.id}>
																	{data.product_name}
																</option>
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
                    </div>
        </Modal.Body>
        <Modal.Footer>
            <Button className="br-none" onClick={()=>{setProductSelectionDialog(false)}}>Close</Button>
            <Button type="submit" className="br-none" disabled={isSubmitting}>Submit</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
  