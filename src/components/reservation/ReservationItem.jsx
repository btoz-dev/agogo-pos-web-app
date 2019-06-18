import React from 'react'

import { Row, Col } from 'reactstrap'

const ReservationItem = (props) => {
  return (
    <div>
        <Row>
          <Col sm="5" className="row-trx" onClick={() => props.cartStore.addSelectedReservation(props.trxID, props.trxName) || props.cartStore.reservationCheckout()}>
            <a className="open-booking" href="#" >
              {props.trxName}</a>
          </Col>
          <Col sm="5" className="transaction-list">
            <a className="open-booking" href="#" >
              {props.trxDate}</a>
          </Col>
          <Col sm="2" className="transaction-list">
            <a href="#"  onClick={() => props.cartStore.deleteReservation(props.trxID, props.trxIndex)}><i className="fas fa-backspace btn-delete-item" style={{ color: "black" }} /></a>
          </Col>
        </Row>
        <hr className="garis-pembatas"/>
          
    </div>
  )
}

export default ReservationItem