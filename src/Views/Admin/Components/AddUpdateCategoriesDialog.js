import React, { useEffect, useState, Fragment } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import CallLoader from '../../../common/Loader.js';


import CategoriesAPI from '../../../api/categories.js';



export default function AddUpdateCategoriesDialog({open, setCategoryDialogOpen, setCategoryList, setSubCategory, setDefaultCategoryId, setDefaultSubCategoryId,  props}) {
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
    
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSubmiting(true);

    let category_name = document.getElementById('category_name').value;
    
    try{
      if(props.type === 1 && props.operation  === 'add'){
        const result = await  CategoriesAPI.addNewCategory({ category_name : category_name, get: props.get });
        setCategoryList(result.categoryList);
        setDefaultCategoryId(result.newCategoryId);
      }else if(props.type === 2 && props.operation  === 'add'){
        const result = await  CategoriesAPI.addNewSubCategory({ category_name : category_name, categoryId : props.id, get: props.get });
        setSubCategory(result.subCategoriesList);
        setDefaultSubCategoryId(result.newSubCategoryId);
      }else if(props.type === 1 && props.operation  === 'update'){
        const result = await  CategoriesAPI.updateCategory({ categoryId : props.id,  category_name : category_name});
        setCategoryList(result.categoryList);
      }else if(props.type === 2 && props.operation  === 'update'){
        const result = await  CategoriesAPI.updateSubCategory({ subCategoryId: props.id, categoryId: props.categoryId,  category_name : category_name });
        setSubCategory(result.subCategoriesList);
      }
      
      setIsSubmiting(false);
      setIsLoading(false);
      setCategoryDialogOpen(false);

    }catch(e){
      console.log("error...", e);
    }
  }


    return (
      <Fragment>
          <Modal show = {open} onHide={()=>{setCategoryDialogOpen(false)}} size="lg" centered >
            <Modal.Header closeButton >
              <Modal.Title id="contained-modal-title-vcenter">
                { (props.type === 1  && props.operation === 'add') ? 'Create Category'
                :(props.type === 2  && props.operation === 'add') ? 'Create Sub Category'
                :(props.type === 1  && props.operation === 'update') ? 'Update Category'
                :(props.type === 2  && props.operation === 'update') ? 'Update Sub Category' : ''
                } 
              </Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit} >
              <Modal.Body>
                  <div class="col-md-12">
                      <div class="form-group">
                          <label for="category_name">
                          { (props.type === 1 ) ? 'Category *'
                            :(props.type === 2 ) ? 'Sub Category *'
                            : ''
                          } 
                          </label>
                          <input id="category_name" type="text" defaultValue={props.value} class="form-control" placeholder="" required />
                      </div>
                  </div>
              </Modal.Body>
              <Modal.Footer>
                <Button className="br-none" onClick={()=>{setCategoryDialogOpen(false)}}>Close</Button>
                <Button type="submit" className="br-none" disabled={isSubmiting}>Submit</Button>
              </Modal.Footer>
            </form>
          </Modal>
        {isLoading ?   <CallLoader />   : null  }
      </Fragment>
    );
  }
  