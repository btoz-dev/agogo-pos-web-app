import React, {Component} from 'react'
import { Container, Row, Col, NavLink, Button, Input, Label, FormGroup } from 'reactstrap';
import NumberFormat from 'react-number-format';
import CalcNumericPayment from '../calcs/CalcNumericPayment'
import './PaymentCheckout.scss';

const ReservationCheckout = (props) => {

  return (

    <Row className="PaymentCheckout d-block">
      <Container>
        <Row className="SidebarHeader">
          <Col>
            <NavLink onClick={() => props.cartStore.clearCart()} className="sidebar-header-nav"><i className="fas fa-arrow-left mr-2"></i> Pemesanan</NavLink>
          </Col>
        </Row>

        <Row className="SidebarBody">

          {/* LEFT */}
          <Col className="pr-0">
            {/* <h5 className="mb-0">ATAS NAMA</h5>
            <h4><strong>{props.cartStore.state.nama}</strong></h4> */}
            <h5 className="mb-0">TOTAL</h5>
            <h3><strong><NumberFormat value={props.cartStore.state.grandTotalAmountDiscount} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></strong></h3>
            <h5 className="mb-0">UANG MUKA</h5>
            <h3><strong><NumberFormat value={props.cartStore.state.dpReservationAmount} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></strong></h3>

            <h5 className="mt-4">TOTAL PEMBAYARAN</h5>
            <div className={props.cartStore.state.activeInputPayment === 'paymentTotal' ? 'input-keyboard-wrapper active-input' : 'input-keyboard-wrapper'}>
              <NumberFormat thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} className="mb-4 form-control-lg form-control" placeholder="Rp 0"  
                value={props.cartStore.state.valueInputPayment["paymentTotal"] || ""}
                name="paymentTotal" id="paymentTotal"
                autoFocus
                onChange={props.cartStore.onChangePayment}
                onFocus={props.cartStore.moveCaretAtEnd}
              />
              <Input className="input-masking mb-4" type="text" name="paymentTotal" id="paymentTotal" placeholder=" ..." bsSize="lg" 
                value={props.cartStore.state.valueInputPayment["paymentTotal"]}
                onFocus={props.cartStore.setActiveInputPayment}
                autoFocus
              />
            </div>

            <h5 className="mb-0">
              {(props.cartStore.state.valueInputPayment["paymentTotal"] < props.cartStore.state.grandTotalAmountDiscount || isNaN(props.cartStore.state.valueInputPayment["paymentTotal"]) )
              ? 'KURANG' 
              : 'KEMBALI'}
            </h5>
            <h3 className="text-orange"><strong>
            <NumberFormat value={props.cartStore.state.changePayment} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '}  />
            </strong></h3>
            <h5 className="mb-0">SISA PEMBAYARAN</h5>
            <h3><strong><NumberFormat value={props.cartStore.state.leftToPay} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></strong></h3>


          </Col>

          {/* RIGHT */}
          <Col className="px-0">
            <CalcNumericPayment
              cartStore={props.cartStore}
              onChange={props.cartStore.onChange} 
              onChangeInput={props.cartStore.onChangeInput} 
              onEnter={props.cartStore.onEnter} 
              inputName={props.cartStore.state.inputName}
            />
          </Col>
          
        </Row>

        <Row className="SidebarFooter mt-3">
        <FormGroup row>
                <Col sm={3}>
                    <Label>
                        <h7 className="mb-0">USER APPROVAL</h7>
                    </Label>
                </Col>
                <Col sm={9}>
                <Input className="mb-4 form-control-lg form-control" type="text" placeholder="USER APPROVAL" bsSize="md"
                        name="approvalUser" id="approvalUser"
                        onFocus={props.cartStore.setActiveInputRefund}
                        onChange={props.cartStore.onChangeApprove}
                        autoComplete="off"
                    />
                </Col>
                <Col sm={3}>
                    <Label>
                        <h7 className="mb-0">APPROVAL</h7>
                    </Label>
                </Col>
                <Col sm={9}>
                <Input className="mb-4 form-control-lg form-control" type="password" placeholder="PIN" bsSize="md"
                        // value={props.cartStore.state.valueInputBooking["approvalCode"]}
                        name="approvalCode" id="approvalCode"
                        onFocus={props.cartStore.setActiveInputRefund}
                        onChange={props.cartStore.onChangeApprove}
                        autoComplete="off"
                    />
                </Col>
            </FormGroup>
          <Col>
            <Button onClick={() => props.cartStore.doReservation(props.userNow.id, props.modalStore.toggleModal)} 
            color="danger" size="lg" className="py-3 px-5"><i className="fas fa-coins mr-2"></i> BAYAR</Button>
          </Col>
        </Row>
      </Container>
    </Row>

  )
}

export default ReservationCheckout