import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import ReservationItem from './ReservationItem';

class ReservationItems extends Component {

  constructor(props){
    super(props)
  }

  render(){

    return (

      <Row className="TransactionItems row m-0">

      { this.props.cartStore.state.reservation.map((transaction, i) => 
      <Col xs="12">
        <ReservationItem 
          trxIndex={i}
          trxID={transaction.id} 
          trxName={transaction.invoice}
          userID={transaction.user_id}
          trxPrice={transaction.total} 
          trxDate={transaction.created_at} 
          cartStore={this.props.cartStore} 
        />
      </Col>
      )}    

    </Row>

    )
  }
}

export default ReservationItems