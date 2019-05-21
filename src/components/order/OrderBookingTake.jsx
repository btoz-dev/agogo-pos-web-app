import React from 'react'
import { Container, Row, Col, NavLink, Button, Input, Table } from 'reactstrap';
import ShadowScrollbars from '../scrollbars/ShadowScrollbars';
import FooterNavRightBooking from '../navigations/FooterNavRightBooking'

import OrderHeader from './OrderHeader';
import OrderItems from './OrderItems';

const OrderBookingTake = (props) => {
  
  return (
<Container className="reservation mt-4 pt-5 pr-0 pl-0">
        <NavLink onClick={() => props.cartStore.toggleOrderBookingTakeShow()} className="sidebar-header-nav"><i className="fas fa-arrow-left mr-2"></i>Transaksi Tertunda</NavLink>
            <Table borderless striped>
              <OrderHeader cartStore={props.cartStore}/>
            </Table>
  
            <ShadowScrollbars
              autoHide
              autoHideTimeout={1000}
              autoHideDuration={200}
              autoHeight
              autoHeightMin={600}
              autoHeightMax={0}
            >
              <div className="scroll-wrapper">
                <Table borderless striped className="mb-0">
                  <OrderItems transactionStore={props.transactionStore} cartStore={props.cartStore}/>
                </Table>
              </div>
            </ShadowScrollbars>
            <Row className="product-nav no-gutters">
              <Col xs="12">
                  <FooterNavRightBooking cartStore={props.cartStore} />
              </Col>
          </Row>
        </Container>
  )
}

export default OrderBookingTake