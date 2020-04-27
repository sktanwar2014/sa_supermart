import React, {useState, Fragment} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


import OrderAPI from '../../../api/order.js';



export default function OrderAcceptRejectDialog({open, setDialogOpen, props, setOrderList, setOrderedProductList, isUpdatable}) {

  const [products, setProducts] = useState(props.products);
  console.log(props, products)
    
  const handleOrderConfirmation = async (status) =>{
    try{
        const result = await OrderAPI.handleOrderConfirmation({orderId: props.order_id, order_status : status, date : props.order_date});
        setOrderList(result.orderList);            
        setOrderedProductList(result.orderedProducts);
        setDialogOpen(false);
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
                </tr>
              </thead>
              <tbody>
                {(products.length > 0 ? Object.values(products) :[]).map((product, index) => {
                    return(
                      <tr class="text-center">
                        <td>{index + 1}</td>
                        <td>{product.product_name}</td>
                        <td>{product.quantity + ' ' + product.ordered_unit_name}</td>
                        <td>{product.price}</td>
                        <td>{product.verified_quantity + ' ' + product.verified_unit_name}</td>
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
              <Fragment>
                <Button className="br-none" onClick={()=>{handleOrderConfirmation(4)}}>Accept</Button>
                <Button className="br-none" onClick={()=>{handleOrderConfirmation(5)}}>Reject</Button>
              </Fragment> :  ''}
        </Modal.Footer>
      </Modal>
    );
  }
  