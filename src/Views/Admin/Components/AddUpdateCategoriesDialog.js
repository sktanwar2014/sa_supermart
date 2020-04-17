import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


import CategoriesAPI from '../../../api/categories.js';



export default function AddUpdateCategoriesDialog({open, setCategoryDialogOpen, setCategoryList, setSubCategory, setDefaultCategoryId, setDefaultSubCategoryId,  props}) {
  console.log(props)
    
  const handleSubmit = async (e) => {
    e.preventDefault();

    let category_name = document.getElementById('category_name').value;
    
    try{
      if(props.type === 1 && props.operation  === 'add'){
        const result = await  CategoriesAPI.addNewCategory({
          category_name : category_name,
        });
        setCategoryList(result.categoryList);
        setDefaultCategoryId(result.newCategoryId);
      }else if(props.type === 2 && props.operation  === 'add'){
        const result = await  CategoriesAPI.addNewSubCategory({
          category_name : category_name,
          categoryId : props.id,
        });
        setSubCategory(result.subCategoriesList);
        setDefaultSubCategoryId(result.newSubCategoryId);
      }
      setCategoryDialogOpen(false);

    }catch(e){
      console.log("error...", e);
    }    
  }


    return (
      <Modal show = {open} onHide={()=>{setCategoryDialogOpen(false)}} size="lg" centered >
        <Modal.Header closeButton >
          <Modal.Title id="contained-modal-title-vcenter">
            { (props.type === 1  && props.operation === 'add') ? 'Create Category'
             :(props.type === 2  && props.operation === 'add') ? 'Create Sub Category'
             : ''
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
                      <input id="category_name" type="text" class="form-control" placeholder="" required />
                  </div>
              </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="br-none" onClick={()=>{setCategoryDialogOpen(false)}}>Close</Button>
            <Button type="submit" className="br-none">Submit</Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
  