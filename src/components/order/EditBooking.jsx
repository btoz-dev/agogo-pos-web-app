import React from 'react'
import { Container, Row, Col, Input, Label, Button, NavLink, Form, FormGroup } from 'reactstrap'
import NumberFormat from 'react-number-format';
import './EditBooking.scss'

const EditBooking = (props) => {
    return (

        <Row className="editBooking d-block">
            <Container>
                <Row className="SidebarHeader">
                    <Col>
                        <NavLink onClick={() => props.cartStore.toggleBookingEditShow()} className="sidebar-header-nav"><i className="fas fa-arrow-left mr-2"></i> Pemesanan</NavLink>
                    </Col>
                </Row>

                <Row className="SidebarBody">
                    <Col sm={5}>
                        <h7 className="mb-0">PEMESAN</h7>
                        <Input style={{ color: "white" }} value={props.cartStore.state.dataTrx.nama} className="input pemesan" placeholder="NAMA"></Input>
                    </Col>
                    <Col sm={4}>
                        <h7 className="mb-0">TANGGAL SELESAI</h7>
                        <Input style={{ color: "white" }} value={props.cartStore.state.dataTrx.tgl_selesai} className="input tgl" placeholder="DD-MM-YYYY"></Input>
                    </Col>
                    <Col sm={3}>
                        <h7 className="mb-0">JAM SELESAI</h7>
                        <Input style={{ color: "white" }} value="JamSelesai" className="input jam" placeholder="HH-MM"></Input>
                    </Col>
                </Row>

                <Row className="Sidebar">
                    <Col sm={5}>
                        <Input style={{ color: "white" }} value={props.cartStore.state.dataTrx.alamat} className="input alamat" type="textarea" placeholder="ALAMAT"></Input>
                        <Input style={{ color: "white" }} value={props.cartStore.state.dataTrx.telepon} className="input telepon" placeholder="TELEPON"></Input>
                    </Col>
                    <Col sm={7}>
                        <Input value={props.cartStore.state.dataTrx.catatan} className="input-note" type="textarea" placeholder="CATATAN"></Input>
                    </Col>
                </Row>

                <Row className="Sidebar">

                    {/* LEFT */}
                    <Col className="pr-0">

                        <Form>
                            <FormGroup row>
                                <Label sm={3} className="control-label">BIAYA TAMBAHAN</Label>
                                <Col sm={9}>
                                <div className={props.cartStore.state.activeInputEditBooking === 'biaya_tambahan' ? 'input-keyboard-wrapper active-input' : 'input-keyboard-wrapper'}>
                                <NumberFormat type="text" thousandSeparator={'.'} decimalSeparator={','} className="mb-4 form-control-lg form-control" placeholder="Rp 0" 
                                    value={props.cartStore.state.valueInputEditBooking["biaya_tambahan"] || props.cartStore.state.dataTrx.add_fee || ""}
                                    name="biaya_tambahan" id="biaya_tambahan" onChange={props.cartStore.onChangeEditBooking}
                                    prefix={'Rp '} onFocus={props.cartStore.moveCaretAtEnd}
                                />
                                <Input className="input-masking mb-4" type="text" placeholder=" ..." bsSize="lg" 
                                    value={props.cartStore.state.valueInputEditBooking["biaya_tambahan"] || props.cartStore.state.dataTrx.add_fee || ""}
                                    name="biaya_tambahan" id="biaya_tambahan" onChange={props.cartStore.onChangeEditBooking}
                                    onFocus={props.cartStore.setActiveInputEditBooking} 

                                />
                                </div>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label sm={3} className="control-label">DISKON</Label>
                                <Col sm={7}>
                                    <div className={props.cartStore.state.activeInputEditBooking === 'discount' ? 'input-keyboard-wrapper active-input' : 'input-keyboard-wrapper'}>
                                    <NumberFormat type="text" thousandSeparator={'.'} decimalSeparator={','} className="mb-4 form-control-lg form-control" placeholder="Rp 0" 
                                        value={props.cartStore.state.valueInputEditBooking["discount"] || props.cartStore.state.dataTrx.discount}
                                        name="discount" id="discount" onChangeAll={props.cartStore.onChangeEditBooking.bind(this)}
                                        prefix={'Rp '} onFocus={props.cartStore.moveCaretAtEnd}
                                    />
                                    <Input className="input-masking mb-4" type="text" placeholder=" ..." bsSize="lg" 
                                        value={props.cartStore.state.valueInputEditBooking["discount"] || props.cartStore.state.dataTrx.discount}
                                        name="discount" id="discount" onChangeAll={props.cartStore.onChangeEditBooking.bind(this)}
                                        onFocus={props.cartStore.setActiveInputEditBooking} 
                                    />
                                    </div>
                                </Col>
                                <Col sm={2}>
                                <FormGroup check>
                                    <Input checked={props.cartStore.state.discountType === "Rp"} onChange={props.cartStore.handleDiscountChange} value="Rp" className="radio sm" size="sm" type="radio" name="Rp" id="Rp" /><Label check> Rp </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Input checked={props.cartStore.state.discountType === "%"} onChange={props.cartStore.handleDiscountChange} value="%" className="radio sm" size="sm" type="radio" name="%" id="%" /><Label check> % </Label>
                                </FormGroup>   
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label sm={3} className="control-label">UANG MUKA<br/><i className="far fa-times-circle notif-close"></i><span className="notif"> Belum dibayar</span></Label>
                                <Col sm={9}>
                                <div className={props.cartStore.state.activeInputEditBooking === 'uang_muka' ? 'input-keyboard-wrapper active-input' : 'input-keyboard-wrapper'}>
                                <NumberFormat type="text" thousandSeparator={'.'} decimalSeparator={','} className="mb-4 form-control-lg form-control" placeholder="Rp 0" 
                                    value={props.cartStore.state.dataTrx.uang_muka}
                                    name="uang_muka" id="uang_muka"
                                    prefix={'Rp '} onFocus={props.cartStore.moveCaretAtEnd}
                                />
                                <Input className="input-masking mb-4" type="text" placeholder=" ..." bsSize="lg" 
                                    value={props.cartStore.state.dataTrx.uang_muka}
                                    name="uang_muka" id="uang_muka" 
                                />
                                </div>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label sm={3} className="approval">APPROVAL</Label>
                                <Col sm={6}>
                                    <Input type="password" className="input-lg approval" ></Input>
                                </Col>
                                <Col sm={3}>
                                    <Button onClick={() => props.modalStore.toggleModal('bayar', '') || props.cartStore.editReservation(props.userNow, props.cartStore.state.dataTrx, props.cartStore.state.dataTrx.id)} color="danger" className="input-lg"><i className="fas fa-edit"></i> SIMPAN</Button>
                                </Col>
                            </FormGroup>
                        </Form>

                    </Col>

                </Row>

            </Container>
        </Row>

    )
}

export default EditBooking;