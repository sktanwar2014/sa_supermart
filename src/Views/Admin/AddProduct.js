import React, {useState, useEffect, Fragment} from 'react';

//Components 
import CategoriesAPI from '../../api/categories.js';
import {APP_TOKEN} from '../../api/config/Constants.js';
import StaticAPI from '../../api/static.js';
import Header from '../Partials/Header.js';
import Footer from '../Partials/Footer.js';


export default function AddProduct(props) {

    // const [mainCategory, setMainCategory] = useState([]);
    // const [middleCategory, setMiddleCategory] = useState([]);
    // const [subCategory, setSubCategory] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [staticRecordList, setStaticRecordList] = useState([]);
    
    useEffect(()=>{
        getCategoryList();
        getRequiredStaticRecordList();
    },[]);

    const getRequiredStaticRecordList = async () => {
        try{
            const result = await StaticAPI.getRequiredStaticRecordList();
            setStaticRecordList(result);            
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

    // const getMainCategoryList = async () => {
    //     // document.getElementById('middleCategoryDropDown').value = "";
    //     // setMiddleCategory([]);
    //     try{
    //         const result = await CategoriesAPI.getMainCategoryList();
    //         setMainCategory(result.mainCategoriesList);
    //     }catch(e){
    //         console.log('Error...',e);
    //     }
    // }

    // const getMiddleCategoryList = async () => {
    //     // document.getElementById('subCategoryDropDown').value = "";
    //     // setSubCategory([]);
        
    //     let id = document.getElementById('mainCategoryDropDown').value;        

    //     if(id !== '' && id !== undefined && id !== null){
    //         try{
    //             const result = await CategoriesAPI.getMiddleCategoryList({mainCategoryId: id});
    //             setMiddleCategory(result.middleCategoriesList);
    //         }catch(e){
    //             console.log('Error...',e);
    //         }
    //     }        
    // }

    // const getSubCategoryList = async () => {
    //     let id = document.getElementById('middleCategoryDropDown').value;
    //     if(id !== '' && id !== undefined && id !== null){
    //         try{
    //             const result = await CategoriesAPI.getSubCategoryList({middleCategoryId: id});
    //             setSubCategory(result.subCategoriesList);
    //         }catch(e){
    //             console.log('Error...',e);
    //         }
    //     }
    // }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const formData = {
                // mainCategoryId : document.getElementById('mainCategoryDropDown').value,
                // middleCategoryId : document.getElementById('middleCategoryDropDown').value,
                // subCategoryId : document.getElementById('subCategoryDropDown').value,
                mainCategoryId : document.getElementById('categoryDropDown').value,
                productName : document.getElementById('productName').value,
                // brandId : document.getElementById('productBrand').value,
                // colorId : document.getElementById('productColor').value,
                // modelNo : document.getElementById('modelNo').value,
                sellerId : APP_TOKEN.get().userId,
                price : document.getElementById('productPrice').value,
                unitId : document.getElementById('unit_measurement').value,
                description : document.getElementById('productDescription').value,
                createdBy :  APP_TOKEN.get().userId,
            };
            const result = await CategoriesAPI.insertNewProduct(formData);
            if(result === true){    // true = inserted
                props.history.push('/');
            }else{
                alert('Failed Insertion');
            }            
        }catch(e){
            console.log('Error...', e);
        }
    }

    return(
    <Fragment>
        <Header />
            <section class="ftco-section">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-xl-12 ftco-animate fadeInUp ftco-animated">
                            <h3 class="mb-4 billing-heading">Add New Product</h3>
                            <form onSubmit={handleSubmit} class="p-5 bg-light">
                                    <div class="row align-items-end">
                                        {/* <div class="col-md-4">
                                            <div class="form-group">
                                                <label for="country">Main Category *</label>
                                                <div class="select-wrap">
                                                    <select id="mainCategoryDropDown" class="form-control" onChange={getMiddleCategoryList} required >                                                        
                                                        <option  value = "">Select any one</option>
                                                        {(mainCategory !== undefined && mainCategory !== null && mainCategory !== "") && 
                                                         (mainCategory.length > 0 ?mainCategory : [] ).map((data, index)=>{
                                                            return(
                                                                <option id={data.id} value={data.id} >{data.category_name}</option>
                                                            )
                                                         })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                            <label for="country">Middle Category *</label>
                                                <div class="select-wrap">
                                                    <select id="middleCategoryDropDown" class="form-control" onChange={getSubCategoryList} required>
                                                        <option  value = "">Select any one</option>
                                                        {(middleCategory !== undefined && middleCategory !== null && middleCategory !== "") && 
                                                         (middleCategory.length > 0 ? middleCategory : [] ).map((data, index)=>{
                                                            return(
                                                                <option id={data.id} value={data.id}>{data.category_name}</option>
                                                            )
                                                         })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label for="country">Sub Category * </label>
                                                <div class="select-wrap">
                                                    <select id="subCategoryDropDown" class="form-control" required>
                                                        <option  value = "">Select any one</option>
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
                                        </div> */}
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label for="country">Category * </label>
                                                <div class="select-wrap">
                                                    <select id="categoryDropDown" class="form-control" required>
                                                        <option  value = "">Select any one</option>
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
                                        <div class="col-md-8">
                                            <div class="form-group">
                                                <label for="productName">product Name *</label>
                                                <input id="productName" type="text" class="form-control" placeholder="" required/>
                                            </div>
                                        </div>
                                        <div class="w-100"></div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="unit_measurement">Unit/Measurement *</label>
                                                <div class="select-wrap">                                                
                                                    <select id="unit_measurement" class="form-control" required>
                                                        <option  value = "">Select any one</option>
                                                        {(staticRecordList.productUnitList !== undefined && staticRecordList.productUnitList !== null && staticRecordList.productUnitList !== "") && 
                                                        (staticRecordList.productUnitList.length > 0 ? staticRecordList.productUnitList : [] ).map((data, index)=>{
                                                            return(
                                                                <option id={data.id} value={data.id} >{data.value}</option>
                                                            )
                                                        })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="modelNo">Model No *</label>
                                                <input id="modelNo" type="text" class="form-control" placeholder="" required/>
                                            </div>
                                        </div> */}
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="productPrice">Price (In $)*</label>
                                                <input id="productPrice" type="text" class="form-control" placeholder="" required/>
                                            </div>
                                        </div>
                                        <div class="w-100"></div>
                                        {/* <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="brand">Brand *</label>
                                                <div class="select-wrap">
                                                    <select id="productBrand" class="form-control" required>
                                                        <option  value = "">Select any one</option>
                                                        {(staticRecordList.brandList !== undefined && staticRecordList.brandList !== null && staticRecordList.brandList !== "") && 
                                                        (staticRecordList.brandList.length > 0 ? staticRecordList.brandList : [] ).map((data, index)=>{
                                                            return(
                                                                <option id={data.id} value={data.id} >{data.value}</option>
                                                            )
                                                        })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>                                
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="color">Color *</label>
                                                <div class="select-wrap">
                                                    <select id="productColor" class="form-control" required>
                                                        <option  value = "">Select any one</option>
                                                        {(staticRecordList.colorList !== undefined && staticRecordList.colorList !== null && staticRecordList.colorList !== "") && 
                                                        (staticRecordList.colorList.length > 0 ? staticRecordList.colorList : [] ).map((data, index)=>{
                                                            return(
                                                                <option id={data.id} value={data.id} >{data.value}</option>
                                                            )
                                                        })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>   
                                        <div class="w-100"></div> */}
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label for="description">Description *</label>
                                                <textarea name="" id="productDescription" cols="30" rows="10" class="form-control" required></textarea>
                                            </div>
                                        </div>
                                        <div class="w-100"></div>
                                        <div class="form-group p-4">
                                            <input type="submit" value="Submit" class="btn  px-4 btn-primary" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
        <Footer />
    </Fragment>
    )
}