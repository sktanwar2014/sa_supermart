import React, {useState, useEffect, Fragment} from 'react';
import Table from 'react-bootstrap/Table';

//Components 
import CategoriesAPI from '../../api/categories.js';
import {APP_TOKEN} from '../../api/config/Constants.js';
import StaticAPI from '../../api/static.js';
import Header from '../Partials/Header.js';
import Footer from '../Partials/Footer.js';
import AddUpdateCategoriesDialog from './Components/AddUpdateCategoriesDialog.js';


export default function AddProduct(props) {

    const [subCategory, setSubCategory] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [productUnitList, setProductUnitList] = useState([]);
    const [filteredUnitList, setFilteredUnitList] = useState([]);
    const [singleUnitList, setSingleUnitList] = useState([]);
    
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const [categoryDialogProps, setCategoryDialogProps] = useState({});
    const [defaultCategoryId, setDefaultCategoryId] = useState("");
    const [defaultSubCategoryId, setDefaultSubCategoryId] = useState("");
    const [showWeightFields, setShowWeightFields] = useState(0);
    const [productUnitBio, setProductUnitBio] = useState([]);


    useEffect(()=>{
        getCategoryList();
        getProductUnitList();
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


    const addUpdateCategoriesDialog = (type) => {
        if (type === 2 && (document.getElementById('categoryDropDown').value === "")) {
            alert('Select Category !');
        }else{
            setCategoryDialogProps({type: type, operation: 'add', id: document.getElementById('categoryDropDown').value })
            setCategoryDialogOpen(true);
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
        }
    }

    const getMainUnitRelateRecords = async (e) => {
        if(e.target.value === ""){
            setFilteredUnitList([]);
            setSingleUnitList([]);
        }else {
            let unitId = e.target.value;
            const selectedUnit = productUnitList.find(ele => {return ele.id == e.target.value});
            let is_bundle = selectedUnit.is_bundle;
            try{
                const result = await StaticAPI.getMainUnitRelateRecords({id: unitId, is_bundle: is_bundle});
                setFilteredUnitList(result.productUnitList);
                const singleUnitList = result.productUnitList.filter(ele => {return ele.is_bundle == 0});
                setSingleUnitList(singleUnitList);
            } catch(e){
                console.log(e)
            }
        }
        setProductUnitBio([]);
    }
    
    const handleMeasurementSelection = (e) => {        
        const selectedUnit = productUnitList.find(ele => {return ele.id == e.target.value});
        if(selectedUnit){
            setShowWeightFields(selectedUnit.is_bundle);
            document.getElementById('productUnitValue').value = selectedUnit.default_weight;            
        }else{
            setShowWeightFields(0);
            document.getElementById('productUnitValue').value = 1;
        }
    }

    const handleAddProductUnit = (e) => {
        e.preventDefault();
        if(e.target.name === "innerForm"){
            let tempUnitArray = [...productUnitBio];
            
            let packetWeight =  document.getElementById("packetWeight") ? document.getElementById("packetWeight").value : '';
            let packetUnitId =  document.getElementById("packetUnitId") ? document.getElementById("packetUnitId").value :'';
            let unitInName = productUnitList.find(ele => { return ele.id == document.getElementById("productUnitIn").value});
            let packetUnitIdName = productUnitList.find(ele => {return ele.id ==  packetUnitId});

            let unitData = {
                unitValue : document.getElementById("productUnitValue").value,
                unitIn : document.getElementById("productUnitIn").value,
                price : document.getElementById("productPrice").value,
                isPacket : packetUnitId ? 1 : 0,
                packetWeight : packetWeight,
                packetUnitId : packetUnitId,
                unitInName : unitInName.unit_name,
                packetUnitIdName :  packetUnitIdName ?  packetUnitIdName.unit_name : '',
            }
            tempUnitArray.push(unitData);
            setProductUnitBio(tempUnitArray);

            let temp = [...filteredUnitList];
            temp.map((data, index) => {
                if(data.id == unitData.unitIn){
                    filteredUnitList.splice(index,1);
                }
            });
            document.getElementById("productUnitIn").value = "";
        }
    }

    const handleDeleteProductUnit = (index) => {
        let tempUnitArray = [...productUnitBio];
        let temp = [...filteredUnitList];


        const unit_id = tempUnitArray[index].unitIn;
        const found = productUnitList.find(ele => {return ele.id == unit_id})
        temp.push(found);
        setFilteredUnitList(temp);

        tempUnitArray.splice(index,1);
        setProductUnitBio(tempUnitArray);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{            
            if(e.target.name === "mainForm"){
                if(productUnitBio.length > 0){
                    const formData = {
                        categoryId : document.getElementById('categoryDropDown').value,
                        subCategoryId : document.getElementById('subCategoryDropDown').value,
                        productName : document.getElementById('productName').value,
                        description : document.getElementById('productDescription').value,
                        createdBy :  APP_TOKEN.get().userId,
                        productUnits : productUnitBio,
                        mainUnitId : document.getElementById('productMainUnit').value,
                    };
                    const result = await CategoriesAPI.insertNewProduct(formData);
                    if(result === true){    // true = inserted
                        props.history.push('/');
                    }else{
                        alert('Failed Insertion');
                    }
                }else{
                    alert('Add atleast one unit for product..');
                }
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
                            <form onSubmit={handleSubmit} name="mainForm" class="p-5 bg-light">
                                    <div class="row align-items-end">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="country">Category * </label>
                                                <div class="d-flex">
                                                    <select id="categoryDropDown" class="form-control" defaultValue={defaultCategoryId} onChange={getSubCategoryList} required>
                                                        <option  value = "">Select any one</option>
                                                        {(categoryList !== undefined && categoryList !== null && categoryList !== "") && 
                                                         (categoryList.length > 0 ? categoryList : [] ).map((data, index)=>{
                                                            return(
                                                                <option id={data.id} value={data.id} >{data.category_name}</option>
                                                            )
                                                         })
                                                        }
                                                    </select>
                                                    <input type="button" class="btn btn-primary br-none" onClick={()=>{addUpdateCategoriesDialog(1)}} value="Add New" />
                                                </div>
                                            </div>
                                        </div>   
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="country">Sub Category * </label>
                                                <div class="d-flex">
                                                    <select id="subCategoryDropDown" class="form-control"  defaultValue={defaultSubCategoryId}  required>
                                                        <option  value = "">Select any one</option>
                                                        {(subCategory !== undefined && subCategory !== null && subCategory !== "") && 
                                                         (subCategory.length > 0 ? subCategory : [] ).map((data, index)=>{
                                                            return(
                                                                <option id={data.id} value={data.id} >{data.category_name}</option>
                                                            )
                                                         })
                                                        }
                                                    </select>
                                                    <input type="button" class="btn btn-primary br-none" onClick={()=>{addUpdateCategoriesDialog(2)}} value="Add New" />
                                                </div>
                                            </div>
                                        </div>    
                                        <div class="w-100"></div>
                                        <div class="col-md-8">
                                            <div class="form-group">
                                                <label for="productName">Product Name *</label>
                                                <input id="productName" type="text" class="form-control" placeholder="" required/>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label for="productMainUnit">Measure Main Unit *</label>
                                                    <select id="productMainUnit" class="form-control" required onChange={getMainUnitRelateRecords}>
                                                        <option  value = "">Select any one</option>
                                                        {(productUnitList !== undefined && productUnitList !== null && productUnitList !== "") && 
                                                        (productUnitList.length > 0 ? productUnitList : [] ).map((data, index)=>{
                                                            return(
                                                            data.is_bundle ===0 ?    <option id={data.id} value={data.id} >{data.unit_name}</option> :null
                                                            )
                                                        })
                                                        }
                                                    </select>
                                            </div>
                                        </div>
                                        {filteredUnitList.length > 0 && 
                                        <form onSubmit={handleAddProductUnit} name="innerForm" class="inner-form">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="productUnitIn">Unit/Measurement *</label>
                                                <div class="d-flex">  
                                                    <input id="productUnitValue" type="text" class="form-control" defaultValue="1" disabled required/>                                         
                                                    <select id="productUnitIn" class="form-control" required defaultValue=""  onChange={handleMeasurementSelection}>
                                                        <option  value = "">Select any one</option>
                                                        {(filteredUnitList !== undefined && filteredUnitList !== null && filteredUnitList !== "") && 
                                                        (filteredUnitList.length > 0 ? filteredUnitList : [] ).map((data, index)=>{
                                                            return(
                                                                <option id={data.id} value={data.id} >{data.unit_name}</option>
                                                            )
                                                        })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        {showWeightFields  === 1 &&
                                            <div class="col-md-4">
                                                <div class="form-group">                                                
                                                    <label for="productWeight">Weight *</label>
                                                    <div class="d-flex">  
                                                        <input id="packetWeight" type="text" class="form-control" placeholder="" required/>
                                                        <select id="packetUnitId" class="form-control" required>
                                                            <option  value = "">Select any one</option>
                                                            {(singleUnitList !== undefined && singleUnitList !== null && singleUnitList !== "") && 
                                                            (singleUnitList.length > 0 ? singleUnitList : [] ).map((data, index)=>{
                                                                return(
                                                                    <option id={data.id} value={data.id} >{data.unit_name}</option > 
                                                                )
                                                            })
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        <div class={showWeightFields  === 0 ? "col-md-6" : "col-md-2"}>
                                            <div class="form-group">
                                                <label for="productPrice">Price (In $)</label>
                                                <input id="productPrice" type="text" class="form-control" placeholder=""/>
                                            </div>
                                        </div>
                                        <div class="add-unit">
                                            <button type="submit"> Add</button>
                                        </div>
                                        </form>
                                        }
                                        <div class="w-100">
                                        {productUnitBio.length > 0 &&
                                        <table className="unit-array-table">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Units</th>
                                                    <th>Price</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(productUnitBio.length > 0 ? productUnitBio : []).map((data, index) => {
                                                    return(
                                                        <tr>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                {data.unitValue + ' ' + data.unitInName}
                                                                {(data.packetWeight && data.packetUnitId) ? `(${data.packetWeight} ${data.packetUnitIdName} per  ${data.unitInName})` : ``}
                                                            </td>
                                                            <td>{data.price}</td>
                                                            <td>
                                                                <button type="button" className="delete-button" onClick={()=>{handleDeleteProductUnit(index)}}>Delete</button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                            </table>
                                        }
                                        </div>
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label for="description">Description </label>
                                                <textarea name="" id="productDescription" cols="30" rows="10" class="form-control"></textarea>
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
            { categoryDialogOpen ? 
                <AddUpdateCategoriesDialog 
                    open={categoryDialogOpen} 
                    setCategoryDialogOpen = {setCategoryDialogOpen} 
                    props = {categoryDialogProps} 
                    setCategoryList = {setCategoryList}
                    setSubCategory = {setSubCategory}
                    setDefaultCategoryId = {setDefaultCategoryId}
                    setDefaultSubCategoryId = {setDefaultSubCategoryId}
                /> 
                : null 
            }
    </Fragment>
    )
}