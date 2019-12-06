import React from 'react'
import { Table, Container, Row, Col, Input, Button, Popover, PopoverBody} from 'reactstrap'
import axios from 'axios'
import CartProductionTotal from '../CartProductionTotal'

import './CartProduction.scss'
import OthersProduction from './OthersProduction';
import ProductionStore from './ProductionStore';

class CartProduction extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          //defauilt value of the date time
          date: '',
          prevDate : '',
          lastDate: '',
          days: [
            "Minggu",
            "Senin",
            "Selasa",
            "Rabu",
            "Kamis",
            "Jumat",
            "Saturday"
        ],
        };
    }

    componentDidMount() {
        this.props.cartStore.getDateTrx()
      }

    render() {
        return (
            <Container className="cart mt-4 pt-5 pr-0 pl-0">
                <Row style={{height: "400px"}}>
                    <Col xs="7" className="body-left">
                        <div className="date">Produksi per <span className="date-update">{this.props.cartStore.state.days[new Date(this.props.cartStore.state.lastDate).getDay()] + ", " +this.props.cartStore.state.formatDate}</span></div>
                        <div className="change-date" style={{marginTop: "5px"}}><a href="#" onClick={() => this.props.modalStore.toggleModal('changeDate', 'lg')}><strong>Set Tanggal</strong></a></div>
                        <div className="view-img" style={{marginTop: "10px"}}>
                            <img className="img-product" src={this.props.cartStore.state.selectedProduct.photo}></img>
                        </div>
                        <div className="select-view-product">
                            { this.props.cartStore.state.selectedProduct.name ? this.props.cartStore.state.selectedProduct.name : "Pilih product untuk melihat stok"}
                        </div>
    
                    </Col>
                    <Col xs="5" className="body-right">
                        <div>
                        <tr>
                            <th><i class="fas fa-plus-circle add-product"> Produksi</i></th>
                        </tr>
                        <tr className="full">
                            <td className="production">Produksi 1</td>
                            <td className="product-total text-right" id="produksi1">{ this.props.cartStore.state.produksi[this.props.cartStore.state.selectedProduct.name + "produksi1"] || 0 || "-"}</td>
                            <td className="button "><a className={this.props.cartStore.productionButton1()} onClick={() => this.props.modalStore.toggleModal('production', 'lg', "1")}><i class="fas fa-pen-square edit"></i></a></td>
                        </tr>
                        <tr>
                            <td className="production">Produksi 2</td>
                            <td className="product-total text-right" id="produksi2">{ this.props.cartStore.state.produksi[this.props.cartStore.state.selectedProduct.name + "produksi2"] || 0 || "-"}</td>
                            <td className="button"><a className={this.props.cartStore.productionButton2()} onClick={() => this.props.modalStore.toggleModal('production', 'lg', "2")}><i class="fas fa-pen-square edit"></i></a></td>
                        </tr>
                        <tr>
                            <td className="production">Produksi 3</td>
                            <td className="product-total text-right" id="produksi3">{ this.props.cartStore.state.produksi[this.props.cartStore.state.selectedProduct.name + "produksi3"] || 0 || "-"}</td>
                            <td className="button"><a className={this.props.cartStore.productionButton3()} onClick={() => this.props.modalStore.toggleModal('production', 'lg', "3")}><i class="fas fa-pen-square edit"></i></a></td>
                        </tr>
                        <hr/>
                        <tr>
                            <td className="total-production">Total Produksi</td>
                            <td className="calc-product-total text-right">{parseInt(this.props.cartStore.state.produksi[this.props.cartStore.state.selectedProduct.name + "produksi1"] || 0)+
                                                                           parseInt(this.props.cartStore.state.produksi[this.props.cartStore.state.selectedProduct.name + "produksi2"] || 0)+
                                                                           parseInt(this.props.cartStore.state.produksi[this.props.cartStore.state.selectedProduct.name + "produksi3"] || 0) || "-"
                                                                           }</td>
                        </tr>
                        </div>
                        <ProductionStore cartStore={this.props.cartStore} modalStore={this.props.modalStore}/>
                        <OthersProduction cartStore={this.props.cartStore} modalStore={this.props.modalStore}/>
                    </Col>
                </Row>
                <Row >
                    <Col>
                        <h5>Catatan {this.props.cartStore.state.selectedProduct.name} : {this.props.cartStore.state.produksi["note"+this.props.cartStore.state.selectedProduct.name] || ""} </h5>
                    </Col>
                </Row>

                <Table borderless striped>
                    <CartProductionTotal date={this.state} cartStore={this.props.cartStore}/>
                </Table>
            </Container>
        )
    }
}

export default CartProduction