import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import TransactionItem from './TransactionItem';

class TransactionItems extends Component {

  constructor(props){
    super(props)
  }

  componentDidMount(){
    this.props.cartStore.fetchTransaction()
  }  

  render(){

    return (

      <Row className="TransactionItems row m-0">

      { this.props.cartStore.state.transaction.map((transaction, i) => 
      <Col xs="12">
        <TransactionItem 
          trxIndex={i}
          trxID={transaction.id} 
          trxName={transaction.invoice}
          userID={transaction.user_id}
          trxPrice={transaction.total} 
          trxDate={transaction.created_at} 
          cartStore={this.props.cartStore} 
          rootStore={this.props.rootStore}
        />
      </Col>
      )}    

    </Row>

    )
  }
}

export default TransactionItems