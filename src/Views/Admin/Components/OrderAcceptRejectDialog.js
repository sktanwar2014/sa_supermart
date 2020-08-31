import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


import OrderAPI from '../../../api/order.js';



export default function OrderAcceptRejectDialog({open, setDialogOpen, props, isUpdatable, getOrderListOfSingleDay}) {
// console.log(props)
  const [products, setProducts] = useState(props.products);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleOrderConfirmation = async (e) =>{
    e.preventDefault();
    setIsSubmitting(true);
    try{
        let productData  = [];
          products.map((data)=> {
            let isComponentExist = document.querySelector(`input[name="action-${data.delivered_id}"]:checked`);
            let status = '';
            if(isComponentExist === null){
              status = '5';
            }else if(isComponentExist !== ""){
              status = isComponentExist.value;
            }
            productData.push({
                delivered_id : data.delivered_id,
                product_id : data.product_id,
                status :  status,
            });
          });
        const result = await OrderAPI.handleOrderConfirmation({orderId: props.order_id, customer_id: props.user_id,  productData: productData});
        getOrderListOfSingleDay();
        setDialogOpen(false);
        setIsSubmitting(false);
    }catch(e){
        console.log('Error...',e);
    }
  }

    return (
      <Modal show = {open} onHide={()=>{setDialogOpen(false)}} size="lg" centered >
        <Modal.Header closeButton >
          <Modal.Title id="contained-modal-title-vcenter">
              Product Verification
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={handleOrderConfirmation}>
        <Modal.Body>
          <div class="w-100">            
            <table className="unit-array-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Products </th>
                  <th>Delivered Quantity</th>
                  <th>Price</th>
                  <th>Verified Quantity</th>
                  {isUpdatable === 1 && <th>Action</th> }
                </tr>
              </thead>
              <tbody>
                {(products.length > 0 ? Object.values(products) :[]).map((product, index) => {
                    return(
                      <tr class="text-center">
                        <td>{index + 1}</td>
                        <td>{product.product_name}</td>
                        <td>{product.quantity + ' ' + product.unit_name}</td>
                        <td>{product.price}</td>
                        <td>{product.verified_quantity + ' ' + product.verified_unit_name}</td>
                        {isUpdatable === 1 && 
                        <td>
                          {(Number(product.quantity) === Number(product.verified_quantity) && (product.verified_unit_id === product.unit_id)) ? ''
                           :
                           <div class="radio">
                              <label style={{ paddingRight: '15px'}}><input type="radio" name={"action-"+product.delivered_id} value="5" class="mr-1" required/>Accept</label>
                              <label><input type="radio" name={"action-"+product.delivered_id} value="6" class="mr-1" required/> Reject</label>
                            </div>
                          }
                        </td>
                        }
                      </tr>
                    )
                })}	
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {isUpdatable === 0  ?
            <Button className="br-none" onClick={()=>{setDialogOpen(false)}}>Close</Button>
            : isUpdatable === 1 ?
                <Button type="submit" className="br-none" disabled={isSubmitting}>Submit</Button>
              :  ''}
        </Modal.Footer>
        </form>
      </Modal>
    );
  }
  