import React, {useState, useEffect, Fragment} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

// API
import StaticAPI from '../../../api/static.js';


//Other Components
import {isNotEmpty} from '../../../utils/conditionChecker.js';

export default function DialogChooseAdditionalUnit({open, setOpenAddUnitDialog, handleCloseAddUnitDialog, product, existUnit}) {

    const [unitList, setUnitList] = useState([]);

    useEffect(()=>{
		getUnitList();
	},[]);

    const getUnitList = async () => {
        try{
            const result = await StaticAPI.getMeasuredUnitofProduct({productId : product.id});
            setUnitList(result.productUnitList);            
        }catch(e){
            console.log('Error...',e);
        }
    }

    const onChangeHandler = (e) => {
        let name = (e.target.name);
        let value = e.target.value;

        let purchasedQuantity = document.getElementById('purchased_quantity');
        let productCostEach = document.getElementById('productCostEach');
        let productCost = document.getElementById('productCost');

        if(name === "purchased_quantity"){
            purchasedQuantity.value = value;
            if(value && value != 0){
                if(productCostEach.value){
                    productCost.value = (Number(productCostEach.value) * Number(value)).toFixed(2);
                }else if(productCost.value){
                    productCostEach.value = (Number(productCost.value) / Number(value)).toFixed(2);
                }else{
                    productCost.value = 0;
                    productCostEach.value = 0;
                }
            }else{
                productCost.value = 0;
                productCostEach.value = 0;
            }
        }else if(name === "productCostEach"){
            productCostEach.value = value;
            if(purchasedQuantity.value){
                productCost.value = (Number(value) * Number(purchasedQuantity.value)).toFixed(2);
            }else {
                productCost.value = 0;
            }
        }else if(name === "productCost"){
            productCost.value = value;
            if(purchasedQuantity.value){
                productCostEach.value = (Number(value) / Number(purchasedQuantity.value)).toFixed(2);
            }else{
                productCostEach.value = 0;
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let purchasedQuantity = Number(document.getElementById('purchased_quantity').value);
        let productCostEach = Number(document.getElementById('productCostEach').value);
        let productCost = Number(document.getElementById('productCost').value);
        let unitId =  Number(document.getElementById("unitSelection").value);
        let unit = (unitList.length > 0 ? unitList : []).find(u => u.id === unitId);

        let newUnit = {};
        newUnit.add_remove = 1;
        newUnit.break_here = 0;
        newUnit.category_id = product.category_id;
        newUnit.id = product.id;
        newUnit.is_extra = 1;
        newUnit.main_unit_id = product.main_unit_id;
        newUnit.main_unit_name = product.main_unit_name;
        newUnit.price = product.price;
        newUnit.cost = "";
        newUnit.cost_of_each = "";
        newUnit.product_name = product.product_name;
        newUnit.purchased_status = "";
        newUnit.purchased_unit_id = "";
        newUnit.sub_category_id = product.sub_category_id;
        newUnit.unit_id = unit.id;
        newUnit.unit_name = unit.unit_name;
        newUnit.quantity = 0;
        newUnit.purchased_quantity = purchasedQuantity;
        newUnit.productCostEach = productCostEach;
        newUnit.productCost = productCost;
        handleCloseAddUnitDialog(newUnit);
    }


    return (
      <Modal show = {open} onHide={()=>{setOpenAddUnitDialog(false)}} size="sm" centered >
        <Modal.Header closeButton >
          <Modal.Title id="contained-modal-title-vcenter">
                Additional Unit Selection Dialog
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
        <Modal.Body>
				<div className="container">
					<div class="row justify-content-center p-bottom-30">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="country">Unit * </label>
                                    <div class="d-flex">
                                        <select id="unitSelection" class="form-control" required  >
                                            <option  value = "">Select Any One</option>
                                            {(isNotEmpty(unitList)) && 
                                                (unitList.length > 0 ? unitList : [] ).map((data, index)=>{
                                                    let isExist = (existUnit.length > 0 ? existUnit : []).find(ele => ele === data.id);
                                                return(
                                                    <option id={data.id} value={data.id} disabled={isNotEmpty(isExist)}>{data.unit_name}</option>
                                                )
                                                })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="country">Purchased Quantity * </label>
                                        <input type="number" name={"purchased_quantity"} class="form-control" id={"purchased_quantity"} step = "0.01" min="0" required  onChange= {onChangeHandler} />
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="country">product Cost Each * </label>
                                        <input type="number" name={"productCostEach"} class="form-control" id={"productCostEach"} min="0" step="0.01" required  onChange= {onChangeHandler}/>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="country">product Cost * </label>
                                        <input type="number"  name={"productCost"} class="form-control" id={"productCost"} min="0"  step = "0.01" required  onChange= {onChangeHandler} />
                                </div>
                            </div>
						</div>
                    </div>
        </Modal.Body>
        <Modal.Footer>
            <Button className="br-none" onClick={()=>{setOpenAddUnitDialog(false)}}>Close</Button>
            <Button type="submit" className="br-none">Submit</Button>
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
  