import React, {useState, useEffect, Fragment} from 'react';
import {Link} from 'react-router-dom';
//Components 
import CategoriesAPI from '../../api/categories.js';
import Header from '../Partials/Header.js';
import Footer from '../Partials/Footer.js';
import AddUpdateCategoriesDialog from './Components/AddUpdateCategoriesDialog.js';

import CallLoader from '../../common/Loader.js';

export default function AlterCategories(props) {

    const [subCategory, setSubCategory] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const [categoryDialogProps, setCategoryDialogProps] = useState({});
    const [defaultCategoryId, setDefaultCategoryId] = useState("");
    const [defaultSubCategoryId, setDefaultSubCategoryId] = useState("");
 
    const [isLoading, setIsLoading] = useState(false);



    useEffect(()=>{
        getAllMainCategories();
    },[]);

    
    const getAllMainCategories = async () => {
        setIsLoading(true);
        try{
            const result = await CategoriesAPI.getAllMainCategories();
            setCategoryList(result.categoryList);
            setIsLoading(false);
        }catch(e){
            console.log('Error...',e);
        }
    }

    
    const handleCategoryActivation = async (data) => {
        setIsLoading(true);
        try{
            const result = await CategoriesAPI.handleCategoryActivation({categoryId: data.id, is_active: data.is_active});
            setCategoryList(result.categoryList);    
            setIsLoading(false);
        }catch(e){
            console.log('Error...',e);
        }
    }


    const addUpdateCategoriesDialog = (data, operation) => {            
            setCategoryDialogProps({type: 1, operation: operation, id: data.id, value: data.category_name, get: 'all'})
            setCategoryDialogOpen(true);
    }


    return(
    <Fragment>
        <Header />       
            <section class="ftco-section">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-xl-12 ftco-animate fadeInUp ftco-animated">
                            <div class="row">
                                <div class="col-md-6 col-lg-6">
                                    <h3 class="billing-heading">Categories</h3>
                                </div>
                                <div class="col-md-6 col-lg-6" >
                                    <input type="button" class="btn btn-primary br-none f-right" onClick={()=>{addUpdateCategoriesDialog({id:'', category_name:''}, 'add')}} value="Add New" />
                                </div>
                            </div>
                            <form class="p-5 bg-light b-top-dark">
                                <div class="row align-items-end">
                                    {(categoryList.length > 0 ? categoryList : []).map((data, index) => {
                                        return(
                                            <div class="col-md-6 col-lg-3 ftco-animate fadeInUp ftco-animated">
                                                <div class={ data.is_active === 1 ? "product b-active" : "product b-deactive" }>
                                                    <div class="text py-3 pb-4 px-3 text-center">
                                                    <span className="category-div-serial">{index + 1}</span>
                                                        <h3 class="category-name "><a>{data.category_name}</a></h3>
                                                            <hr />
                                                                <div class="row">
                                                                    <div class="col-md-12 col-lg-6">
                                                                        <div class="category-menu">
                                                                            <button type="button" onClick={()=>{addUpdateCategoriesDialog(data, 'update')}}>Edit</button>
                                                                        </div>
                                                                        <hr />
                                                                    </div>
                                                                    <div class="col-md-12 col-lg-6">
                                                                        <div class="category-menu">
                                                                            <button type="button" onClick={()=>{handleCategoryActivation(data)}}>
                                                                                { data.is_active === 1 ? 'Deactive' : 'Active' }
                                                                            </button>
                                                                        </div>
                                                                        <hr />
                                                                    </div>
                                                                    <div class="col-md-12 col-lg-12">
                                                                        <div class="category-menu">
                                                                        <Link to={{pathname :'/alter-categories/subcategory', state : {categoryId: data.id, categoryName: data.category_name}}}>
                                                                            <button type="button">Subcategories</button>
                                                                        </Link>
                                                                        </div>
                                                                        <hr />
                                                                    </div>
                                                                </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        <Footer />
            { categoryDialogOpen ? 
                <AddUpdateCategoriesDialog 
                    open={categoryDialogOpen} 
                    setCategoryDialogOpen = {(setCategoryDialogOpen)} 
                    props = {categoryDialogProps} 
                    setCategoryList = {setCategoryList}
                    setSubCategory = {setSubCategory}
                    setDefaultCategoryId = {setDefaultCategoryId}
                    setDefaultSubCategoryId = {setDefaultSubCategoryId}
                /> 
                : null 
            }
            {isLoading ?   <CallLoader />   : null  }
    </Fragment>
    )
}