import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import TransactionItem from './TransactionItem';

class TransactionItems extends Component {

  constructor(props){
    super(props)
  }

  componentDidMount(){
    console.log("ETSTTTTTT", this.props.transactionStore)

  }

  render(){

    return (
<<<<<<< HEAD
      <div className="container-transaction">
        {this.props.transactionStore.state.transactionStore.map((transaction, i) => 
          <li>{transaction.username}</li>
        )}
      </div>
=======

      <Row className="TransactionItems row m-0">

      { this.props.transactionStore.state.transactionStore.map((transaction, i) => 
      <Col xs="7">
        <TransactionItem 
          trxIndex={i}
          trxID={transaction.id} 
          trxName={transaction.invoice}
          userID={transaction.user_id}
          trxPrice={transaction.total} 
          trxDate={transaction.created_at} 
          transactionStore={this.props.transactionStore} 
          cartStore={this.props.cartStore} 
        />
      </Col>
      )}    

    </Row>


      // <div>
      //   {this.props.transactionStore.state.transactionStore.map((transaction, i) => 
      //     <li>{transaction.username}</li>
      //   )}
      // </div>
>>>>>>> c35b374eb8da81d155b9afba4014f5a1956ef1e8
    )
  }
}

export default TransactionItems