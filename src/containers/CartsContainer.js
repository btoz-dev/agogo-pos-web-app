import { Container } from 'unstated'
import axios from 'axios'

const initialState = {
  dataNyoba: [],
  nyoBa: [],
  data: [],
  dataTrx: [],
  dataRefund: {},
  dataRefundPS: {},
  dataRefundTK: {},
  items: [],
  refundItems: [],
  selectedItems: [],
  selectedProduct: {},
  selectedTransaction: {},
  dataReservation : {},
  clearProduction: [],
  production: [],
  product: {},
  postData: {},
  refund: [],
  trxRefund: [],
  transaction: [],
  reservation: [],
  products: [],
  produksi: {total: 0, rusak: 0, lain: 0, catatan: ""},
  isAdded: false,
  isCalcNumericCartOpen: false,
  inputQtyCartItem: '',
  searchCode: '',
  selectedQtyID: '',
  layoutName: "default",
  onReset: false,
  activeItem: -1,
  totalRefund: 0,
  totalAmount: 0,
  discountAmount: 0,
  discountPercentage: 0, 
  expenseAmount: 0,
  grandTotalAmount: 0,
  grandTotalAmountDiscount: 0,
  bookingAmount:0,
  isCashierOverlayShow: false,
  isPaymentCheckoutShow: false,
  isReservationCheckoutShow: false,
  isOrderBookingShow: false,
  isOrderBookingDeleteShow: false,
  isOrderBookingEditShow: false,
  isOrderBookingTakeShow: false,
  isBookingDeleteShow: false,
  isBookingEditShow: false,
  isBookingTakeShow: false,
  isDeleteBookingShow: false,
  isEditBookingShow: false,
  isTakeBookingShow: false,
  isRefundTKShow: true,
  isRefundPSShow: false,
  activeInputPayment: '',
  valueInputPayment: '',
  activeInputBooking: '',
  valueInputBooking: '',
  activeInputEditBooking: '',
  valueInputEditBooking: '',
  isTransactionListShow: false,
  isReservationListShow: false,
  isRefundShow: false,
  isRefundItem: false,
  valueInputRefund: '',
  activeInputRefund: '',
  valueInputApproval: '',
  activeInputApproval: '',
  discountType: 'Rp',
  changePayment: 0,
  payment: 0,
  selectedRefund: 'TK',
  whatRefund: 'TK',
  whatBooking: '',
  dpReservationAmount: 0,
  leftToPay: 0,
  date: '',
  currentTrx: '',
  popStatus: false,
  isDisabled: true,
  isDisabledRefund: true,
  disabledOrder: true,
  disabledOther: false,
  productNote: "",
  payRefundTK: true,
  abasa: false,
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

class CartsContainer extends Container {

  constructor(props) {
    super(props)
    this.state = initialState;
  }

  fetchProducts() {
    // axios.get(`http://gigit.store/wp-json/wp/v2/product?_embed`)
    axios.get(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/products`)
    .then(res => {
      const products = res.data;
      this.setState({ 
        products: products,
        }
      );
    })
  }

  setSearchCode(code) {
    console.log("CATEGORY => ", code)
    this.setState({ 
      searchCode: code
    }, 
      () => {
        this.codeSearch()
      }
    )
  }

  codeSearch() {
    let products = this.state.products
    let searchCode = this.state.searchCode

    let productsCode =  products.filter(function(product) {
      // return product.title.rendered === searchKeyword;
      return product.code === searchCode;
    });
    if(productsCode.length === 1){
      axios.get(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/cekInvoice`).then(res => {
      const trx = res.data;
      this.setState({ currentTrx: trx.current_invoice, isDisabled: false});
      // sessionStorage.setItem('transaction', JSON.stringify(transaction));
      })
      this.setState(
        {
          selectedProduct: {
            // idx: idx,
            id: productsCode[0].id,
            name: productsCode[0].name,
            qty: 1,
            price: productsCode[0].price
          }
        },
        () => {
          this.onAddToCart(this.state.selectedProduct);
          console.log(this.state.selectedProduct)
          console.log(this.state.items)
        })
    }else{
      console.log(productsCode)
    }

    // this.setState({ 
    //   productsFiltered: productsCode,
    //   activeCatClass: ''
    // },()=>{
    //   console.log("searchKeyword => ", searchCode)
    //   console.log("productsFiltered => ", productsCode)
    // })
    
  }


  clearCart = () => {
    console.log("CLEAR CART", this)
    this.setState(initialState);
  }

  resetProduct = () => {
    console.log("CLEAR CART", this.state.selectedItems)
    this.setState({valueInputRefund: '',
                  activeInputRefund: '',});
  }

  componentWillMount(){
    this.setState({
      windowInnerHeight: window.innerHeight
    },
      () => {
        this.setState({
          productItemsHeight: this.state.windowInnerHeight - 114
        })
      }
    );
  }

  fetchTransaction() {
    axios.get(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/orders`)
    .then(res => {
      const transaction = res.data;
      this.setState({ transaction: transaction});
      // sessionStorage.setItem('transaction', JSON.stringify(transaction));
    })
  }

  fetchReservation() {
    axios.get(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/preorders`)
    .then(res => {
      const transaction = res.data;
      this.setState({ reservation: transaction });
      // sessionStorage.setItem('transaction', JSON.stringify(transaction));
    })
  }


  // ===============
  // CART ACTION
  // ===============
  onAddToCart = this.onAddToCart.bind(this);
  onRemoveFromCart = this.onRemoveFromCart.bind(this);
  onRemoveToRefund = this.onRemoveToRefund.bind(this);
  onAddToCart(selectedProduct, jml) {

    let id = selectedProduct.id
    let user_id = selectedProduct.user_id
    let qty = selectedProduct.qty
    let index = this.state.items.findIndex( x => x.id === id);

    if (index === -1 || id === index){
      console.log("ADD NEW", index, id)
      this.setState({
        items: [...this.state.items, selectedProduct]
      },
        () => {
          // console.log('ITEMS Updated!');
          // console.log(this.state.items)

          this.sumTotalAmount()

          this.setState({
            isAdded: true,
            selectedProduct: {}
          },
            () => {
              this.sumGrandTotalAmount()

              setTimeout(() => {
                this.setState({
                  isAdded: false
                });
              }, 3500);
            }
          );
        }
      );
    }else{
      let currentQty = this.state.items[index].qty
      // console.log("CURRENT QTY", currentQty)

      // console.log("UPDATE w/ SELECTED ID", qty, id)
      this.onUpdateItem(id, Number(currentQty) + 1)
    }
    
  }


  addSelectedProduct(idx, id, name, qty, price, active_path, modal) {
    if(active_path === '/cashier' || active_path === '/booking'){
      if(active_path === '/cashier' && this.state.items.length === 0){
      axios.get(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/cekInvoice`).then(res => {
      const trx = res.data;
      this.setState({ currentTrx: trx.current_invoice, isDisabled: false});
      // sessionStorage.setItem('transaction', JSON.stringify(transaction));
      })
      }
      else if(active_path === '/booking'){
        axios.get(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/cekPOInvoice`).then(res => {
        const trx = res.data;
        this.setState({ currentTrx: trx.current_invoice, disabledOrder: false, disabledOther: true});
        // sessionStorage.setItem('transaction', JSON.stringify(transaction));
        })
      }
      this.setState(
        {
          selectedProduct: {
            idx: idx,
            id: id,
            name: name,
            qty: qty,
            price: price
          }
        },
        () => {
          this.onAddToCart(this.state.selectedProduct);
          console.log(this.state.selectedProduct)
          console.log(this.state.items)
        }
      );
    }
    else if (active_path === '/production'){
      this.setState({valueInputBooking: ""})
      console.log(this.state.valueInputBooking["note"])
      axios.get('http://101.255.125.227:82/api/product/' + id).then(res => {
        const product = res.data;
        this.setState({selectedProduct: product})
        console.log(product)
        // product["produksi1"] = 0
        // product["produksi2"] = 0
        // product["produksi3"] = 0
        let index = this.state.production.findIndex( x => x.id === id);
        
        if(index === -1 || id === index){
          this.state.production.push(product)
          const reset = {
            product_id: id,
            produksi1: "",
            produksi2: "",
            produksi3: "",
            total_produksi: "",
            ket_rusak: "",
            ket_lain: "",
            total_lain: "",
            username_approval: 'adi',
            pin_approval: '123456',
            catatan: null,
          }
          const productKosong = Object.assign(product, reset)
          this.state.clearProduction.push(productKosong)
          console.log(this.state.production, this.state.clearProduction)
        } else {
          axios.get('http://101.255.125.227:82/api/product/' + id)
          console.log("produsk")
          console.log(this.state.production)
        }

      })
      this.doProduction(id, modal)
      axios.get(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/TrxByProduct/` + id).then(res => {
      const pesan = res.data;
      let index = this.state.production.findIndex( x => x.id === id)
      if(pesan.production === null){
        this.state.produksi[this.state.selectedProduct.name + "produksi1"] = 0
        this.state.produksi[this.state.selectedProduct.name + "produksi2"] = 0
        this.state.produksi[this.state.selectedProduct.name + "produksi3"] = 0
        this.state.produksi[this.state.selectedProduct.name + "rusak"] = 0
        this.state.produksi[this.state.selectedProduct.name + "lain"] = 0
        this.state.produksi["note" + this.state.selectedProduct.name] = 0
        this.state.produksi["total_penjualan"+this.state.selectedProduct.name] = pesan.count_preorder + pesan.count_order
        this.state.produksi["stok_kemarin"+this.state.selectedProduct.name] = 0
        this.state.produksi["order"+this.state.selectedProduct.name] = pesan.count_order
        this.state.produksi["pesanan"+this.state.selectedProduct.name] = pesan.count_preorder
        this.setState({
          production: [
             ...this.state.production.slice(0,index),
             Object.assign({}, this.state.production[index], {penjualan_toko: pesan.count_order},
                                                             {penjualan_pemesanan: pesan.count_preorder},
                                                             {total_penjualan: parseInt(pesan.count_preorder) + parseInt(pesan.count_order)},
                                                             {stock_awal: parseInt(this.state.selectedProduct.stock)},
                                                             {sisa_stock: parseInt(this.state.selectedProduct.stock)},
                                                             {product_id: id},
                                                             {catatan: "tidak ada catatan"},
                                                             {produksi1: 0},
                                                             {produksi2: 0},
                                                             {produksi3: 0},
                                                             {total_produksi: 0},
                                                             {ket_rusak: 0},
                                                             {ket_lain: 0},
                                                             {total_lain: 0}),
             ...this.state.production.slice(index+1)
          ],
          clearProduction: [
            ...this.state.clearProduction.slice(0,index),
            Object.assign({}, this.state.clearProduction[index], {penjualan_toko: ""},
                                                                 {penjualan_pemesanan: ""},
                                                                 {total_penjualan: ""},
                                                                 {total_lain: 0},
                                                                 {stock_awal: parseInt(this.state.selectedProduct.stock)},
                                                                 {sisa_stock: parseInt(this.state.selectedProduct.stock)}),
            ...this.state.clearProduction.slice(index+1)
          ]
        })
      } else {
      this.state.produksi[this.state.selectedProduct.name + "produksi1"] = pesan.production.produksi1
      this.state.produksi[this.state.selectedProduct.name + "produksi2"] = pesan.production.produksi2
      this.state.produksi[this.state.selectedProduct.name + "produksi3"] = pesan.production.produksi3
      this.state.produksi[this.state.selectedProduct.name + "rusak"] = pesan.production.ket_rusak
      this.state.produksi[this.state.selectedProduct.name + "lain"] = pesan.production.ket_lain
      this.state.produksi["note" + this.state.selectedProduct.name] = pesan.production.catatan
      this.state.produksi["total"+this.state.selectedProduct.name] = pesan.count_order
      this.state.produksi["pemesanan"+this.state.selectedProduct.name] = pesan.count_preorder
      this.state.produksi["total_penjualan"+this.state.selectedProduct.name] = pesan.count_preorder + pesan.count_order
      this.state.produksi["stok_kemarin"+this.state.selectedProduct.name] = pesan.production.stock_awal
      this.state.produksi["order"+this.state.selectedProduct.name] = pesan.count_order
      this.state.produksi["pesanan"+this.state.selectedProduct.name] = pesan.count_preorder
      this.setState({
        production: [
           ...this.state.production.slice(0,index),
           Object.assign({}, this.state.production[index], {penjualan_toko: pesan.count_order},
                                                           {penjualan_pemesanan: pesan.count_preorder},
                                                           {total_penjualan: parseInt(pesan.count_preorder) + parseInt(pesan.count_order)},
                                                           {stock_awal: pesan.production.stock_awal},
                                                           {sisa_stock: 
                                                              parseInt(pesan.production.stock_awal || 0) 
                                                            + parseInt(pesan.production.total_produksi || 0)
                                                            - parseInt(pesan.count_order )
                                                            - parseInt(pesan.count_preorder)},                                                     {product_id: id},
                                                           {catatan: pesan.production.catatan || "tidak ada catatan"},
                                                           {produksi1: parseInt(pesan.production.produksi1 || 0)},
                                                           {produksi2: parseInt(pesan.production.produksi2 || 0)},
                                                           {produksi3: parseInt(pesan.production.produksi3 || 0)},
                                                           {total_produksi: parseInt(pesan.production.produksi1 || 0) + parseInt(pesan.production.produksi2 || 0) + parseInt(pesan.production.produksi3 || 0)},
                                                           {ket_rusak: parseInt(pesan.production.ket_rusak || 0)},
                                                           {ket_lain: parseInt(pesan.production.ket_lain || 0)},
                                                           {total_lain: parseInt(pesan.production.ket_rusak || 0) + parseInt(pesan.production.ket_lain || 0)},),
           ...this.state.production.slice(index+1)
        ],
        clearProduction: [
          ...this.state.clearProduction.slice(0,index),
          Object.assign({}, this.state.clearProduction[index], {penjualan_toko: ""},
                                                               {penjualan_pemesanan: ""},
                                                               {total_penjualan: ""},
                                                               {total_lain: 0},
                                                               {stock_awal: 
                                                                parseInt(pesan.production.stock_awal || 0) 
                                                              + parseInt(pesan.production.total_produksi || 0)
                                                              - parseInt(pesan.count_order )
                                                              - parseInt(pesan.count_preorder)},
                                                              {sisa_stock: 
                                                                parseInt(pesan.production.stock_awal || 0) 
                                                              + parseInt(pesan.production.total_produksi || 0)
                                                              - parseInt(pesan.count_order )
                                                              - parseInt(pesan.count_preorder)}),
          ...this.state.clearProduction.slice(index+1)
        ]
      })
      }
      
      })    
    }
    console.log("PRODUCTION BERISI",this.state.production, this.state.clearProduction) 
  }

  // getDataNyoba() {
  //   axios.get(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/products`)
  //   .then(res => {
  //     const products = res.data;
  //     products.forEach(trx => 
  //       this.state.dataNyoba.push({
  //       product_id: trx.id,
  //       produksi1: "",
  //       produksi2: "",
  //       produksi3: "",
  //       total_produksi: "",
  //       ket_rusak: "",
  //       ket_lain: "",
  //       catatan: null,
  //       })
  //     )
  //     this.setState({nyoBa: this.state.dataNyoba}, 
  //       () => console.log("COBA",this.state.nyoBa))
  //   })
  // }

addSelectedTransaction(id, current, idx) {
  axios.get('http://101.255.125.227:82/api/order/' + id).then(res => {
    this.setState({isDisabled: false})
    const transaction = res.data;
    console.log(id, current, id)
    transaction.forEach((trx, i) =>
      this.state.selectedItems.push({
        idx: i,
        id: trx.product_id,
        name: trx.product.name,
        qty: trx.qty,
        price: trx.product.price
      })
    )
    console.log("INI ", this.state.selectedItems)
    this.setState({items: this.state.selectedItems, selectedItems:[]}, 
      () => {this.sumTotalAmount() 
            this.setState({
              isAdded: true,
              selectedItems: []}, 
                () => {
                  this.sumGrandTotalAmount()
                  setTimeout(() => {
                  this.setState({
                    isAdded: false,
                    selectedItems: []
                });
              }, 3500);
            }
          )
        }
      )
    })
    this.setState({
      refund: [id, current],
      currentTrx: current, 
      isTransactionListShow: false,
      selectedItems: []})
  }

  addSelectedReservation(id, current, user_id, total) {
    this.setState({isDisabled: false, isRefundPSShow: true, selectedItems: []})
    let reservationCode = id
    axios.get(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/preorders`)
    .then(res => {
      const transaction = res.data;
      let reservationData = transaction.filter(function(data) {
        return data.id === reservationCode
      });
      if(reservationData.length === 0){
        console.log("GAGAL COY")
      } else {
      this.setState({dpReservationAmount: reservationData[0].uang_muka,  
                    changePayment: reservationData[0].subtotal - reservationData[0].uang_muka,
                    expenseAmount: reservationData[0].add_fee,
                    discountAmount: reservationData[0].discount},
                    () => axios.get('http://101.255.125.227:82/api/preorder/' + id).then(res => {
                      const transaction = res.data;
                      transaction.forEach((trx, i) => 
                        this.state.selectedItems.push({
                          idx: i,
                          id: trx.product_id,
                          invoice: current,
                          name: trx.product.name,
                          qty: trx.qty,
                          price: trx.product.price,
                          product_id: trx.product_id,
                          user_id: user_id,
                          total: reservationData[0].subtotal + reservationData[0].add_fee - reservationData[0].discount,
                          preorder_id: id,
                          nama: reservationData[0].nama,
                          alamat: reservationData[0].alamat,
                          tgl_selesai: reservationData[0].tgl_selesai,
                          telepon: reservationData[0].telepon,
                          catatan: reservationData[0].catatan,
                          add_fee: reservationData[0].add_fee,
                          uang_muka: reservationData[0].uang_muka,
                          waktu_selesai: reservationData[0].waktu_selesai,
                          sisa_harus_bayar: this.state.leftToPay,
                        })
                      )
                      console.log("INI ", this.state.selectedItems)
                      this.setState({items: this.state.selectedItems, currentTrx: reservationData[0].invoice}, 
                        () => {this.sumTotalAmount() 
                              this.setState({
                                isAdded: true,
                                  }, 
                                  () => {
                                    this.sumGrandTotalAmount()
                                    setTimeout(() => {
                                    this.setState({
                                      isAdded: false,
                                  });
                                }, 3500);
                              }
                            )
                          }
                        )
                      }))
      console.log(reservationData, id)
      }
    })
    // this.setState({
    //   selectedItems: []
    // })
    console.log(reservationCode, current)
    }

    addTransaction(user_id, modal) {
      const items = this.state.items
      items.forEach((x) => 
      this.state.data.push({
            user_id: user_id,
            product_id: x.id,
            qty: x.qty,
            price: x.price,
            subtotal: this.state.totalAmount,
            diskon: "",
            total: this.state.totalAmount,
            dibayar: "",
            kembali: "",
            status: "UNPAID",
          })
      )
      axios.post(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/orders`, this.state.data)
      .then(res => {
        modal('simpan')
        console.log("A",res)
        this.setState({data: []})
      })
      .catch(res => {
        modal('alert', '', '', res.response.data.message)
        console.log(res.response.data.message, this.state)
        this.setState({data: []})
      })
    }


  takeReservation(what_id, modal) {
    // console.log(this.state.selectedItems, this.state.dataReservation)
    let data = this.state.dataReservation
    let item = this.state.selectedItems
    let ref = item.map(trx => ({
      ...trx,
      subtotal: data.subtotal,
      diskon: data.discount,
      user_id: what_id,
      invoice: data.invoice,
      uang_dibayar: this.state.leftToPay,
      uang_kembali: 0,
      status: 'PAID',
      username_approval: this.state.dataReservation["user"],
      pin_approval: this.state.dataReservation["code"]
    }))

    console.log(ref)
    if(ref[0].username_approval === undefined){
      modal('alert','','','User tidak boleh kosong')
    } else if (ref[0].pin_approval === undefined){
      modal('alert','','','Pin tidak boleh kosong')
    } else {
      axios.post(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/editPreorders`, ref)
      .then(res => {
        modal('bayar')
        this.setState({selectedItems: []})
        console.log(res, this.state.selectedItems, this.state.items)
      })
      .catch(res => {
        this.setState({selectedItems: []})
        console.log(res, this.state.selectedItems, this.state.items)
        modal('alert','','',res.response.data.message)
      })
    this.setState({selectedItems: [], dataReservation: {}})
    }
  }

  // editReservation(user_now, data, what_id) {
    // console.log(user_now, data, what_id)
    // this.deleteReservation(what_id)
  //   this.doReservation(user_now, data)
  // }
  addReservation(user_now, modal, where) {
    const trx = this.state.items
    const data = this.state.dataReservation
    this.setState({selectedItems: []}, () => {
      trx.forEach((trx) => this.state.selectedItems.push({
        preorder_id: data.id,
        nama		: data.nama,
        invoice	: data.invoice,
        tgl_selesai	: data.tgl_selesai,
        alamat	: data.alamat,
        waktu_selesai	: data.waktu_selesai,
        telepon	: data.telepon,
        catatan	: data.catatan,
        user_id	: user_now.id,
        qty		: trx.qty,
        product_id: trx.id,
        price 	: trx.price,
        subtotal	: this.state.totalAmount,
        diskon	: this.state.discountAmount,
        add_fee	: this.state.expenseAmount,
        uang_muka	: this.state.dpReservationAmount,
        uang_dibayar	: 0,
        uang_kembali	: 0,
        total		: this.state.grandTotalAmountDiscount,
        sisa_harus_bayar	: this.state.leftToPay,
        // dibayar	: "",
        // kembali	: "",
        status	: "UNPAID",
        username_approval: this.state.dataReservation["user"],
        pin_approval: this.state.dataReservation["code"]
        }
        ))
        if(where === 'doOrder'){
          if(this.state.selectedItems[0].username_approval === undefined){
            modal('alert','','','User tidak boleh kosong')
          } else if (this.state.selectedItems[0].pin_approval === undefined){
            modal('alert','','','Pin tidak boleh kosong')
            console.log(this.state.selectedItems)
          }else{
          axios.post(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/preorders`, this.state.selectedItems)
          .then(res => {
            modal('bayar')
            this.setState({selectedItems: []})
            console.log(res, this.state.selectedItems, this.state.items)
          })
          .catch(res => {
            this.setState({selectedItems: []})
            console.log(res, this.state.selectedItems, this.state.items)
            modal('alert','','',res.response.data.message)
          })
          }
        } else {
          if(this.state.selectedItems[0].username_approval === undefined){
            modal('alert','','','User tidak boleh kosong')
          } else if (this.state.selectedItems[0].pin_approval === undefined){
            modal('alert','','','Pin tidak boleh kosong')
            console.log(this.state.selectedItems)
          }else{
          axios.post(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/editPreorders`, this.state.selectedItems)
          .then(res => {
            modal('bayar')
            this.setState({selectedItems: []})
            console.log(res, this.state.selectedItems, this.state.items)
          })
          .catch(res => {
            this.setState({selectedItems: []})
            console.log(res, this.state.selectedItems, this.state.items)
            modal('alert','','',res.response.data.message)
          })
        }
        }
    })
  }

  doRefund(modal) {
    let refundCode = this.state.whatRefund + '-' + (this.state.valueInputRefund["refundCode"])
    if(this.state.whatRefund === 'PS'){
    axios.get(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/preorders`)
    .then(res => {
      const transaction = res.data;
      let refundData = transaction.filter(function(data) {
        return data.invoice === refundCode
      });
      if(refundData.length === 0){
        modal.toggleModal('alert','','','Nomor order tidak ditemukan')
      } else {
      this.setState({dataRefund: refundData, isDisabledRefund: false}, () => this.addSelectedRefund())
      console.log("HU",refundData )
      }
    })
    console.log(refundCode)
    }
    else if(this.state.whatRefund === 'TK'){
      axios.get(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/orders`)
      .then(res => {
        const transaction = res.data;
        let refundData = transaction.filter(function(data) {
          return data.invoice === refundCode
        });
        if(refundData.length === 0){
          modal.toggleModal('alert','','','Nomor order tidak ditemukan')
        } else {
        this.setState({dataRefund: refundData, isRefundItem: true}, () => this.addSelectedRefund())
        console.log(refundData)
        }
      })
      console.log(refundCode)
      }
  }

  doNextRefund(modal) {
    this.setState({trxRefund: []})
    if(this.state.whatRefund === "PS"){
    let dataReservation = this.state.selectedItems
    dataReservation.forEach(data => 
    this.state.trxRefund.push({
      qty: data.qty,
      price: data.price,
      order_id: "",
      preorder_id: data.order_id,
      product_id: data.product_id,
      total: data.total,
      username_approval: this.state.dataReservation["user"],
      pin_approval: this.state.valueInputRefund["approvalCode"]}))
    this.doRefundPost(modal)
    }else if (this.state.whatRefund === "TK"){
      let dataReservation = this.state.refundItems
      dataReservation.forEach(data => 
        this.state.trxRefund.push({
          qty: data.qty,
          price: data.price,
          order_id: this.state.refund[0],
          preorder_id: "",
          product_id: data.id,
          total: parseInt(data.qty) * parseInt(data.price),
          username_approval: this.state.dataReservation["user"],
          pin_approval: this.state.valueInputRefund["approvalCode"]}))
      this.doRefundPost(modal)
    }
    // axios.put('https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/order/' + dataRefund.id, this.state.items)
  }

  doPostKas(transaction, user, modal){
    const saldo_akhir = transaction.total_transaksi + transaction.saldo_awal
    let postData = {
        user_id: user.id,
        saldo_awal: transaction.saldo_awal,
        transaksi: transaction.total_transaksi,
        saldo_akhir: saldo_akhir,
        username_approval: this.state.dataReservation["user"],
        pin_approval: this.state.valueInputRefund["approvalCode"]
      }
    console.log(postData.username_approval)
    if(!postData.username_approval){
      modal.clearModal()
      modal.toggleModal('alert','','','User tidak boleh kosong')
    } else if (!postData.pin_approval) {
      modal.clearModal()
      modal.toggleModal('alert','','','Pin tidak boleh kosong')
    } else {
    axios.post('https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/postKas', [postData])
    .then(res => {
      document.location.href = '/logout'
      console.log(res, [postData])
    })
    .catch(res => {
      modal.clearModal()
      modal.toggleModal('alert','','',res.response.data.message)
      console.log(res, [postData])
    })
    }
  }

  doRefundPost(modal){
    if(this.state.dataReservation["user"] === null){
      this.setState({trxRefund: []})
      modal('alert','','','USER tidak boleh kosong')
      console.log(this.state.trxRefund)
    } else if(isNaN(this.state.valueInputRefund["approvalCode"])){
      this.setState({trxRefund: []})
      modal('alert','','','USER & APPROVAL tidak boleh kosong')
      console.log(this.state.trxRefund)
    } else {
    axios.post(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/refunds`, this.state.trxRefund)
    .then(res => {
      modal('bayar')
      console.log(this.state.trxRefund, this.state.selectedItems)
      this.setState({trxRefund: [], selectedItems: []})
      })
    .catch(res => {
      modal('alert','','',res.response.data.message)
      console.log(this.state.trxRefund, this.state.selectedItems)
      this.setState({trxRefund: [], selectedItems: []})
    })
   }
  }

  addSelectedRefund() {
    if(this.state.whatRefund === "TK"){
      let dataRefund = this.state.dataRefund[0]
      this.addSelectedTransaction(dataRefund.id, dataRefund.invoice)
      console.log("BBBBBBBBBBBBB", this.state)
    }
    else if(this.state.whatRefund === "PS"){
      let dataRefund = this.state.dataRefund[0]
      this.addSelectedReservation(dataRefund.id, dataRefund.invoice, dataRefund.user_id, dataRefund.total)  
      console.log("AAAAAAAAAAAAA", this.state)
    }
    
  }

  // addSelectedRefundTK(dataParent) {
  //   let dataRefund = this.state.dataRefundTK[0]
  //   this.addSelectedTransaction(dataRefund.id, dataRefund.invoice)
  //   console.log("BBBBBBBBBBBBB", this.state, dataParent)
  // }

  // addSelectedRefundPS(dataParent) {
  //   let dataRefund = this.state.dataRefundPS[0]
  //   this.addSelectedReservation(dataRefund.id, dataRefund.invoice, dataRefund.user_id, dataRefund.total)
  //   // axios.get(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/preorder/`, dataRefund.id)
  //   //   .then(res => {
  //   //     const data = res.data;
  //   //     data.forEach(data => {
  //   //       this.state.selectedItems.push(
  //   //         {
  //   //           order_id: "",
  //             // preorder_id: dataRefund.id,
  //             // product_id: data.product_id,
  //             // user_id: dataRefund.user_id,
  //             // qty: data.qty,
  //             // price: data.price,
  //             // total: dataRefund.total,
  //             // username_approval: this.state.dataReservation["user"],
  //             // pin_approval: this.state.valueInputRefund["approvalCode"]
  //   //         }
  //   //       )
  //   //     })
  //   //   })
  //   console.log("AAAAAAAAAAAAA", dataRefund, this.state.dataRefund, dataParent )
  // }


  setSelectedQtyID = (idx, id, currentQty) => {
    this.setState({
      selectedQtyID: id,
      inputQtyCartItem: currentQty,
      isCalcNumericCartOpen: true,
      onReset: true,
      activeItem: idx,
      isCashierOverlayShow: true
    });
  }

  onUpdateItem(id, newQty) {
    let index = this.state.items.findIndex( x => x.id === id);
    let currentQty = this.state.items[index].qty;
    let updateQty = currentQty + 1;
    // console.log(currentQty)
    if (index === -1){
      console.log("ERROR")
      // handle error
    }else{
      this.setState({
        items: [
           ...this.state.items.slice(0,index),
           Object.assign({}, this.state.items[index], {qty: newQty}),
           ...this.state.items.slice(index+1)
        ]
      },
        () => {
          // this.sumTotalAmountPerItem(index)
          this.sumTotalAmount()
          setTimeout(() => {
            this.sumGrandTotalAmount()
          }, 1);
          this.onCloseCalc()
        } 
      );
    }
  }

  onRemoveFromCart(item) {
    const newArray = [...this.state.items];
    newArray.splice(item, 1);

    this.setState({
      items: newArray
    },
      () => {
        if(this.state.currentTrx !==null && this.state.items.length === 0){
          this.setState({isDisabled: true})
          this.sumTotalAmount()
          setTimeout(() => {
          this.sumGrandTotalAmount()
        }, 10);
        }else{
        this.sumTotalAmount()
        setTimeout(() => {
          this.sumGrandTotalAmount()
        }, 10);
      }
    }
    );
  }

  onRemoveToRefund(item) {
    this.setState({isDisabledRefund: false})
    const newArray = [...this.state.items];
    const selected = newArray.splice(item, 1);
    newArray.splice(item, 1);
    const newRefund = [...this.state.refundItems, selected[0]];

    this.setState({
      items: newArray,
      refundItems: newRefund
    },
      () => {
        console.log(newArray, newRefund)
        console.log(this.state.items)
        this.sumTotalAmount()
        setTimeout(() => {
          this.sumGrandTotalAmount()
        }, 10);
      }
    );
  }
  sumTotalAmountPerRefund(idx) {
    let total = 0;
    let item = this.state.refundItems[idx];
    total = item.price * parseInt(item.qty);
    // console.log("TOTAL HARGA PER ITEM", total)
    return total
  }


  sumTotalAmountPerItem(idx) {
    let total = 0;
    let item = this.state.items[idx];
    total = item.price * parseInt(item.qty);
    // console.log("TOTAL HARGA PER ITEM", total)
    return total
  }
  sumTotalAmount() {
    let total = 0;
    let totalRefund = 0;
    let items = this.state.items;
    let refundItems = this.state.refundItems;
    for (var i = 0; i < items.length; i++) {
      total += items[i].price * parseInt(items[i].qty);
    }
    for (var i = 0; i < refundItems.length; i++) {
      totalRefund += refundItems[i].price * parseInt(refundItems[i].qty);
    }
    this.setState({
      totalAmount: total,
      totalRefund: totalRefund
    });
  }
  sumGrandTotalAmount() {
    let sumTotalAmount = this.state.totalAmount
    let otherExpenses = parseInt( this.state.expenseAmount )
    let grandTotalAmount = parseInt( sumTotalAmount - otherExpenses )
    let dpReservationAmount = parseInt(this.state.dpReservationAmount)
    
    let discountAmount;
    if(this.state.discountType === '%'){
      console.log("this.discountPrice", this.discountPercentage())
      discountAmount = parseInt( sumTotalAmount * (this.discountPercentage()/100) )
    }
    if(this.state.discountType === 'Rp'){
      console.log("this.discountPrice", this.discountPrice())
      discountAmount = parseInt( this.discountPrice() )
    }

    this.setState({
      discountAmount: discountAmount,
      grandTotalAmount: grandTotalAmount
    },
      () => {
        let grandTotalAmountDiscount = parseInt( sumTotalAmount - discountAmount + otherExpenses )
        let leftToPay = parseInt (grandTotalAmountDiscount - dpReservationAmount)
        this.setState({
          grandTotalAmountDiscount: grandTotalAmountDiscount,
          leftToPay: leftToPay
        },
          () => {
            this.sumChangePayment()
          }
        )
      }
    )
  }

  discountPercentage(){
    let discount = this.state.valueInputPayment["paymentDiscount"] || this.state.discountPercentage
    if(discount === undefined || discount === ''){
      discount = 0;
    }
    if(discount > 100){
      discount = 100;
    }
    console.log("DISCOUNT", discount)
    this.setState({
      discountPercentage: discount
    })
    return discount
  }

  discountPrice(){
    let discount = this.state.valueInputPayment["paymentDiscount"] || this.state.valueInputBooking["paymentDiscount"] || this.state.discountAmount
    let sumTotalAmount = parseInt( this.state.totalAmount )
    if(discount === undefined || discount === ''){
      discount = 0;
    }
    if(discount >= sumTotalAmount){
      discount = sumTotalAmount;
    }
    console.log("DISCOUNT PRICE", discount)
    return discount
  }

  sumChangePayment() {
    let totalPayment = parseInt( this.state.valueInputPayment["paymentTotal"] || this.state.valueInputBooking["bookingAddition"])
    console.log("sumChangePayment", totalPayment)
    this.setState({payment: totalPayment})
    if(isNaN(totalPayment)){
      totalPayment = 0
    }

    let grandTotalAmountDiscount =  parseInt( this.state.grandTotalAmountDiscount )
    let dpReservationAmount = this.state.dpReservationAmount
    let changePayment = parseInt( totalPayment - grandTotalAmountDiscount + dpReservationAmount )
    
    this.setState({
      changePayment: changePayment
    })
  }

  onEnterRefund = (modal) => {
    // console.log("Button ENTER pressed");
    this.doRefund(modal)
  };

  

  // ===============
  // KEYBOARD ACTION
  // ===============
  onChange = inputQtyCartItem => {
    this.setState({
      inputQtyCartItem: inputQtyCartItem
    });
    // console.log("Input changed", inputQtyCartItem);
  };

  onKeyPress = (button) => {
    // console.log("Button pressed", button);
    if (button === "{enter}") {
      this.onEnter(this.state.selectedQtyID, this.state.inputQtyCartItem);
    }
  };

  onEnter = (id, newQty) => {
    // console.log("Button ENTER pressed");
    this.onUpdateItem(id, newQty)
  };

  onOpenCalc = () =>{
    this.setState({
      isCalcNumericCartOpen: true
    })
  }

  onCloseCalc = () =>{
    this.setState({
      isCalcNumericCartOpen: false,
      activeItem: -1,
      isCashierOverlayShow: false
    })
  }
  
  // /END KEYBOARD ACTION

  toggleCashierOverlayShow = () => {
    this.setState({
      isCashierOverlayShow: !this.state.isCashierOverlayShow
    })
  }


  isRefundTK = () => {
    console.log("orderBooking")
    this.toggleRefundTK()
  }

  toggleRefundTK = () => {
    this.setState({
      isRefundPSShow: false,
      isRefundTKShow: !this.state.isRefundTKShow
    })
  }
  isRefundPS = () => {
    console.log("orderBooking")
    this.toggleRefundPS()
  }

  toggleRefundPS = () => {
    this.setState({
      isRefundTKShow: false,
      isRefundPSShow: !this.state.isRefundPSShow
    })
  }



  // ===============
  // PAYMENT ACTIONS
  // ===============
  paymentCheckout = () => {
    // console.log("paymentCheckout")
    this.togglePaymentCheckoutShow()
  }

  togglePaymentCheckoutShow = () => {
    this.setState({
      isReservationListShow: false,
      isTransactionListShow: false,
      isRefundShow: false,
      isReservationCheckoutShow: false,
      isPaymentCheckoutShow: !this.state.isPaymentCheckoutShow
    })
  }

  reservationCheckout = () => {
    // console.log("paymentCheckout")
    this.toggleReservationCheckoutShow()
  }

  toggleReservationCheckoutShow = () => {
    this.setState({
      isReservationListShow: false, 
      isTransactionListShow: false,
      isRefundShow: false,
      isPaymentCheckoutShow: false,
      isReservationCheckoutShow: !this.state.isReservationCheckoutShow
    })
  }

  // =============
  // ORDER ACTIONS
  // =============
  orderBooking = () => {
    console.log("orderBooking")
    this.toggleOrderBookingShow()
  }

  toggleOrderBookingShow = () => {
    this.setState({
      isOrderBookingDeleteShow: false,
      isOrderBookingEditShow: false,
      isOrderBookingTakeShow: false,
      isOrderBookingShow: !this.state.isOrderBookingShow
    })
  }

  orderBookingDelete = () => {
    console.log("orderBookingDelete")
    this.setState({whatBooking: 'deleteBooking'})
    this.toggleOrderBookingDeleteShow()
  }

  toggleOrderBookingDeleteShow = () => {
    this.setState({
      isOrderBookingShow: false,
      isOrderBookingEditShow: false,
      isOrderBookingTakeShow: false,
      isOrderBookingDeleteShow: !this.state.isOrderBookingDeleteShow,
    })
  }

  orderBookingEdit = () => {
    console.log("orderBooking")
    this.setState({whatBooking: 'editBooking'})
    this.toggleOrderBookingEditShow()
  }

  toggleOrderBookingEditShow = () => {
    this.setState({
      isOrderBookingShow: false,
      isOrderBookingDeleteShow: false,
      isOrderBookingTakeShow: false,
      isOrderBookingEditShow: !this.state.isOrderBookingEditShow,
    })
  }
  orderBookingTake = () => {
    console.log("orderBooking")
    this.setState({whatBooking: 'takeBooking'})
    this.toggleOrderBookingTakeShow()
  }

  toggleOrderBookingTakeShow = () => {
    this.setState({
      isOrderBookingShow: false,
      isOrderBookingDeleteShow: false,
      isOrderBookingEditShow: false,
      isOrderBookingTakeShow: !this.state.isOrderBookingTakeShow,
    })
  }

  bookingDelete = () => {
    // console.log("orderBooking")
    this.toggleBookingDeleteShow()
  }

  toggleBookingDeleteShow = () => {
    // console.log()
    this.setState({
      isOrderBookingShow: false,
      isOrderBookingDeleteShow: false,
      isOrderBookingEditShow: false,
      isOrderBookingTakeShow: false,
      isBookingEditShow: false,
      isBookingTakeShow: false,
      isBookingDeleteShow: !this.state.isBookingDeleteShow,
    })
  }

  bookingEdit = () => {
    // console.log("orderBooking")
    this.toggleBookingEditShow()
  }

  toggleBookingEditShow = () => {
    // console.log()
    this.setState({
      isOrderBookingShow: false,
      isOrderBookingDeleteShow: false,
      isOrderBookingEditShow: false,
      isOrderBookingTakeShow: false,
      isBookingDeleteShow: false,
      isBookingTakeShow: false,
      isBookingEditShow: !this.state.isBookingEditShow,
    })
  }

  bookingTake = () => {
    // console.log("orderBooking")
    this.toggleBookingTakeShow()
  }

  toggleBookingTakeShow = () => {
    // console.log()
    this.setState({
      isOrderBookingShow: false,
      isOrderBookingDeleteShow: false,
      isOrderBookingEditShow: false,
      isOrderBookingTakeShow: false,
      isBookingEditShow: false,
      isBookingDeleteShow: false,
      isBookingTakeShow: !this.state.isBookingTakeShow,
    })
  }

  moveCaretAtEnd(e) {
    let temp_value = e.target.value
    e.target.value = ''
    e.target.value = temp_value
  }

  setActiveInputPayment = (event) => {
    // console.log('event', event.target.id)
    document.getElementById(event.target.id).focus();
    this.setState({
      activeInputPayment: event.target.id
    },
      () => {
        console.log("setActiveInput", this.state.activeInputPayment, this.state)
      }
    );
  }

  onChangePayment = valueInputPayment => {
    this.setState({
      valueInputPayment: valueInputPayment
    },
      () =>{
        this.sumGrandTotalAmount()
      }
    );
    console.log("Input changed", valueInputPayment);
  };

  setActiveInputBooking = (event) => {
    document.getElementById(event.target.id).focus();
    this.setState({
      activeInputBooking: event.target.id,
      // expenseAmount: event.target.value
    },
      () => {
        console.log("setActiveInput", this.state.activeInputBooking)
      }
    )
  }

  // changeBook = event => {

  // }

  onChangeBooking = valueInputBooking => {
    if (this.state.activeInputRefund === 'approvalUser'){
      const user = valueInputBooking.target.value
      this.state.dataReservation["user"] = user;
      console.log(user,this.state.dataReservation["user"],this.state.dataReservation.user,this.state.valueInputRefund["approvalUser"])
    }
    else if (this.state.activeInputRefund === 'approvalCode'){
      const code = valueInputBooking.target.value
      this.state.dataReservation["code"] = code;
      console.log(code,this.state.dataReservation["code"],this.state.dataReservation.code,this.state.valueInputBooking["approvalCode"])
    }
    else if(this.state.activeInputBooking === "bookingAddition"){
      const add_fee = valueInputBooking.value
      this.setState({expenseAmount: add_fee}, () => this.sumGrandTotalAmount(), this.state.dataReservation["add_fee"] = this.state.expenseAmount)
    }
    else if(this.state.activeInputBooking === "paymentDiscount"){
      const discount = valueInputBooking.value
      if(this.state.discountType === 'Rp'){
        this.setState({discountAmount: discount}, () => this.sumGrandTotalAmount(), this.state.dataReservation["diskon"] = this.state.discountAmount)
      }
      else if(this.state.discountType === '%'){
        this.setState({discountPercentage: discount}, () => this.sumGrandTotalAmount(), this.state.dataReservation["diskon"] = this.state.discountAmount)
      }
    }
    else if(this.state.activeInputBooking === "bookingPayment"){
      const dp = valueInputBooking.value
      this.state.dataReservation["status"] = "UNPAID";
      this.setState({dpReservationAmount: dp}, () => this.sumGrandTotalAmount(), this.state.dataReservation["dibayar"] = this.state.dpReservationAmount)
    } 
    else if (this.state.activeInputBooking === 'bookingName'){
      const name = valueInputBooking.target.value
      this.state.dataReservation["nama"] = name;
    }
    else if (this.state.activeInputBooking === 'bookingDate'){
      const date = valueInputBooking.target.value
      this.state.dataReservation["tgl_selesai"] = date;
    }
    else if (this.state.activeInputBooking === 'bookingTime'){
      const time = valueInputBooking.target.value
      this.state.dataReservation["waktu_selesai"] = time;
    }
    else if (this.state.activeInputBooking === 'bookingAddress'){
      const address = valueInputBooking.target.value
      this.state.dataReservation["alamat"] = address;
    }
    else if (this.state.activeInputBooking === 'bookingPhone'){
      const phone = valueInputBooking.target.value
      this.state.dataReservation["telepon"] = phone;
    }
    else if (this.state.activeInputBooking === 'bookingNote'){
      const note = valueInputBooking.target.value
      this.state.dataReservation["catatan"] = note;
    }
    else if (this.state.activeInputBooking === 'note'+this.state.selectedProduct.name){
      const note = valueInputBooking.target.value
      this.state.produksi["note"+this.state.selectedProduct.name] = note;
      let index = this.state.production.findIndex( x => x.id === this.state.selectedProduct.id)
      this.setState({
        production: [
           ...this.state.production.slice(0,index),
           Object.assign({}, this.state.production[index], {catatan: note || ""}),
           ...this.state.production.slice(index+1)
        ]
      })
    }
  }

  setActiveInputEditBooking = (event) => {
    document.getElementById(event.target.id).focus();
    this.setState({
      activeInputEditBooking: event.target.id,
    },
      () => {
        console.log("setActiveInput", this.state.activeInputEditBooking)
      }
    )
  }

  onChangeEditBooking = (valueInputEditBooking) => {
    this.setState({
      valueInputEditBooking: valueInputEditBooking.target.value
    })
    console.log("Input change", valueInputEditBooking.target.value)
  }

  onKeyPressPayment = (button) => {
    console.log("Button pressed", button);

    if (button === "{rp}") {
      this.setState({
        discountType: 'Rp'
      })
    }
    if (button === "{percentage}") {
      this.setState({
        discountType: '%'
      })
    }
    if (button === "{enter}") {
      this.onEnterPayment();
    }
  };

  onResetPayment = () => {
    this.setState({
      grandTotalAmountDiscount: this.state.totalAmount,
      discountAmount: 0
    })
  }

  onEnterPayment = () => {
    console.log("Button ENTER pressed");
    this.sumChangePayment()
  };





  // ===============
  // SHOW TRX ACTIONS
  // ===============
  openTransaction = () => {
    // console.log("OpenTransaction")
    this.toggleOpenTransactionShow()
  }

  toggleOpenTransactionShow = () => {
    this.setState({
      isReservationListShow: false,
      isRefundShow: false,
      isPaymentCheckoutShow: false,
      isReservationCheckoutShow: false,
      isTransactionListShow: !this.state.isTransactionListShow,
    })
  };

  // ===============
  // SHOW TRX ACTIONS
  // ===============
  openReservation = () => {
    // console.log("OpenReservation")
    this.toggleOpenReservationShow()
  }

  toggleOpenReservationShow = () => {
    this.setState({
      isTransactionListShow: false,
      isRefundShow: false,
      isPaymentCheckoutShow: false,
      isReservationCheckoutShow: false,
      isReservationListShow: !this.state.isReservationListShow
    })
  };

  // ===============
  // SHOW TRX ACTIONS
  // ===============
  openRefund = () => {
    // console.log("OpenReservation")
    this.toggleOpenRefundShow()
    this.setState({payRefundTK : false})
  }

  toggleOpenRefundShow = () => {
    this.setState({
      isReservationListShow: false,
      isTransactionListShow: false,
      isReservationCheckoutShow: false,
      isPaymentCheckoutShow: false,
      isRefundShow: !this.state.isRefundShow
    })
  }

  resetActiveInputRefund = () => {
    this.setState({
      activeInputRefund: ""
    },
      () => {
        console.log("resetActiveInput", this.state.activeInputRefund)
      }
    );
  }
  setActiveInputRefund = (event) => {
    // console.log('event', event.target.id)
    document.getElementById(event.target.id).focus();
    this.setState({
      activeInputRefund: event.target.id || 0
    },
      () => {
        console.log("setActiveInput", this.state.activeInputRefund)
      }
    );
  }
  onChangeRefund = valueInputRefund => {
    this.setState({
      valueInputRefund: valueInputRefund || 0
    });
    console.log("Input changed", valueInputRefund);
  };

  productNote = () => {
    return "A"
  }

  // handleChange= (event) => {
  //   if (this.state.activeInputBooking === 'bookingAddition'){
  //     this.setState({expenseAmount: event.target.value})
  //   } 
  //   else if (this.state.activeInputBooking === 'paymentDiscount'){
  //     this.setState({discountAmount: event.target.value})
  //   }
  //   else if (this.state.activeInputBooking === 'bookingPayment'){
  //     this.setState({bookingAmount: event.target.value})
  //   }
  // }

  handleRefundChange= (event) => {
    console.log("PENCET", this.state.selectedRefund, this.state.valueInputRefund)
    if (this.state.selectedRefund === 'PS'){
      this.setState({selectedRefund: event.target.value, whatRefund: event.target.value, isRefundPSShow: !this.state.isRefundPSShow, })
    }
    if (this.state.selectedRefund === 'TK'){
      this.setState({selectedRefund: event.target.value, whatRefund: event.target.value, isRefundPSShow: !this.state.isRefundPSShow, })
    }
  }

  handleDiscountChange= (event) => {
    if (this.state.discountType === 'Rp'){
      this.setState({discountType: event.target.value})
      console.log(this.state.discountType, this.state.discountAmount)
    }
    if (this.state.discountType === '%'){
      this.setState({discountType: event.target.value})
      console.log(this.state.discountType, this.state.discountPercentage)
    }
  }

  // handleBookingChange= (event) => {
  //   if (this.state.activeInputEditBooking === 'biaya_tambahan'){
  //     this.setState({add_fee: event.target.value})
  //   }else{
  //     console.log('wew')
  //   }
  // }

  doTransaction(user_id, modal) {
    let whatBooking = this.state.refund
    let items = this.state.items
    this.setState({data: []}, () => {
    if(whatBooking.length === 0){
      console.log("A")
      items.forEach((x) => 
      this.state.data.push({
            user_id: user_id,
            product_id: x.id,
            qty: x.qty,
            price: x.price * x.qty,
            subtotal: this.state.totalAmount,
            diskon: this.state.discountAmount,
            total: this.state.grandTotalAmountDiscount,
            dibayar: this.state.payment,
            kembali: this.state.changePayment,
            status: "PAID",
          })
      )
      this.doPayment(modal)
    }else{
      console.log("B")
      this.deleteSelectedOrder(whatBooking[0])
      items.forEach((x) => 
      this.state.data.push({
            invoice: whatBooking[1],
            user_id: user_id,
            product_id: x.id,
            qty: x.qty,
            price: x.price * x.qty,
            subtotal: this.state.totalAmount,
            diskon: this.state.discountAmount,
            total: this.state.grandTotalAmountDiscount,
            dibayar: this.state.payment,
            kembali: this.state.changePayment,
            status: "PAID",
        })
      )
      this.doPayment(modal)
    }
  })
  }
  doPayment(modal){
    let totalPayment = parseInt( this.state.valueInputPayment["paymentTotal"])
    if(isNaN(totalPayment)){
      modal('alert','','','Harap masukkan uang pembayaran')
    }
    else if(totalPayment < this.state.leftToPay){
      modal('alert','','','Uang pembayaran anda kurang')
    }
    else{
      axios.post(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/orders`, this.state.data)
      .then(res => {
      console.log(res, modal)
      modal('bayar')
      this.setState({refund: [], data: []})})
      .catch(res => {
      modal('alert', '' , '', res.response.data.message)
      this.setState({refund: [], data: []})})
    }
  }

  doReservation(user_id, modal) {
    let items = this.state.selectedItems
    let totalPayment = parseInt( this.state.valueInputPayment["paymentTotal"])
    let index = items.findIndex( x => x.preorder_id === items[0].preorder_id);
    // this.deleteReservation(items[0].preorder_id)
    console.log(items)
    if(isNaN(totalPayment)){
      modal('alert','','','Harap masukkan uang pembayaran')
    }
    else if(totalPayment < this.state.leftToPay){
      modal('alert','','','Uang pembayaran anda kurang')
    }
    else{
    this.setState({
      selectedItems: [
        ...this.state.selectedItems.slice(0,index),
        Object.assign({}, this.state.selectedItems[index],
          {user_id: user_id},
          {dibayar: this.state.payment},
          {preorder_id: items[0].preorder_id},
          {kembali: this.state.changePayment},
          {diskon: this.state.discountAmount},
          {subtotal: this.state.totalAmount},
          {status: "PAID"}),
        ...this.state.selectedItems.slice(index+1)
      ]
    }, () => {
      console.log(this.state.selectedItems)
      axios.post(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/editPreorders`, this.state.selectedItems)
      .then(res => {
        modal('bayar')
        this.setState({refund: [], selectedItems: []}) 
        console.log(this, res)})
      .catch(res => {
        modal('alert','','',res.response.data.message)
        this.setState({refund: [], selectedItems: []})
        console.log(res.response,)
      })
    })
   }
  }
  
  doOrder = (id) => {
    this.setState({isRefundPSShow: true, disabledOrder: true, disabledOther: true})
    let orderCode = id
    axios.get(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/preorders`)
    .then(res => {
      const transaction = res.data;
      let orderData = transaction.filter(function(data) {
        return data.id === orderCode
      });
      if(orderData.length === 0){
        console.log("GAGAL COY")
      } else {
      this.setState({dataReservation: orderData[0]}, 
        () => {if(this.state.whatBooking === 'deleteBooking'){
                this.deleteOrder(id)
                console.log("delete booking")
              }
              if(this.state.whatBooking === 'editBooking') {
                this.editOrder(id)
                this.setState({popStatus: !this.state.popStatus})
                console.log("edit booking")
              }
              if(this.state.whatBooking === 'takeBooking') {
                this.takeOrder(id)
                console.log("take boking")
              }})

      console.log(orderData, id)
      }
    })
    // console.log(reservationCode)
  }

  deleteOrder = (id) => {
    this.bookingDelete()
    this.addSelectedReservation(id)
    console.log("do delete booking") 
  }

  editOrder = (id) => {
    this.bookingEdit()
    this.addSelectedReservation(id)
    console.log("do edit booking") 
  }
  takeOrder = (id) => {
    this.bookingTake()
    this.addSelectedReservation(id)
    console.log("do edit booking") 
  }

  deleteSelectedOrder(id, idx) {
    axios.delete(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/order/` + id)
    const newTrx = [...this.state.transaction];
    newTrx.splice(idx, 1);
    this.setState({transaction: newTrx})
  }

  deleteReservation(id, idx) {
    axios.delete(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/preorder/` + id)
    const newTrx = [...this.state.reservation];
    newTrx.splice(idx, 1);
    this.setState({reservation: newTrx})
  }
  deleteReservationModal(modal) {
    let id = this.state.dataReservation.id
    axios.delete(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/preorder/` + id)
    .then(res => {
      modal('hapus')
    })
    .catch(res => {
      modal('alert', '', '',res.response.data.message)
    })
  }


  doProduction = (id, modal) => {
    this.getStokNow()
    let qty1 = this.state.valueInputRefund["refundCode1"] || 0
    let qty2 = this.state.valueInputRefund["refundCode2"] || 0
    let qty3 = this.state.valueInputRefund["refundCode3"] || 0
    let qty4 = this.state.valueInputRefund["refundCode4"] || 0
    let qty5 = this.state.valueInputRefund["refundCode5"] || 0
    let user = this.state.dataReservation['user']
    let pin = this.state.dataReservation['code']
    let index = this.state.production.findIndex( x => x.id === id);
    
    if(this.state.activeInputRefund === "refundCode1"){
      if(qty1 === 0){
        modal.clearModal()
        modal.toggleModal('alert','','','Jumlah produksi tidak boleh kosong')
      }
      else{
      this.state.produksi[this.state.selectedProduct.name+"produksi1"] = qty1 || 0
      this.setState({
        production : [
           ...this.state.production.slice(0,index),
           Object.assign({}, this.state.production[index], {produksi1: qty1 || 0}, {produksi2: this.state.production[index].produksi2 || 0}, {produksi3: this.state.production[index].produksi3 || 0},
           {total_produksi: parseInt(qty1 || 0) + parseInt(this.state.production[index].produksi2 || 0) + parseInt(this.state.production[index].produksi3 || 0)},
           {sisa_stock: parseInt(this.state.production[index].stock_awal || 0) 
            + parseInt(qty1 || 0)
            + parseInt(this.state.production[index].produksi2 || 0)
            + parseInt(this.state.production[index].produksi3 || 0) 
            - parseInt(this.state.produksi["order"+this.state.selectedProduct.name] ||0 )
            - parseInt(this.state.produksi["pesanan"+this.state.selectedProduct.name] || 0) 
            - parseInt(this.state.production[index].ket_lain || 0) 
            - parseInt(this.state.production[index].ket_rusak || 0)},           
           {ket_rusak: parseInt(this.state.production[index].ket_rusak || 0)}, {ket_lain: parseInt(this.state.production[index].ket_lain || 0)}, {total_lain: parseInt(this.state.production[index].ket_lain || 0) + parseInt(this.state.production[index].ket_rusak || 0)},
           {catatan: this.state.production[index].catatan || "tidak ada catatan"},
           {username_approval: user},
           {pin_approval: pin}),
           ...this.state.production.slice(index+1)
        ]
      }, () => this.changeDate(id, modal))
      }
    }
    else if(this.state.activeInputRefund === "refundCode2"){
      if(qty2 === 0){
        modal.clearModal()
        modal.toggleModal('alert','','','Jumlah produksi tidak boleh kosong')
      }
      else{
      this.state.produksi[this.state.selectedProduct.name+"produksi2"] = qty2 || 0
      this.setState({
        production: [
           ...this.state.production.slice(0,index),
           Object.assign({}, this.state.production[index], {produksi2: qty2 || 0}, {produksi1: this.state.production[index].produksi1 || 0}, {produksi3: this.state.production[index].produksi3 || 0},
           {total_produksi: parseInt(qty2 || 0) + parseInt(this.state.production[index].produksi1 || 0) + parseInt(this.state.production[index].produksi3 || 0)},
           {sisa_stock: parseInt(this.state.production[index].stock_awal || 0) 
            + parseInt(qty2 || 0)
            + parseInt(this.state.production[index].produksi1 || 0)
            + parseInt(this.state.production[index].produksi3 || 0) 
            - parseInt(this.state.produksi["order"+this.state.selectedProduct.name] ||0 )
            - parseInt(this.state.produksi["pesanan"+this.state.selectedProduct.name] || 0) 
            - parseInt(this.state.production[index].ket_lain || 0) 
            - parseInt(this.state.production[index].ket_rusak || 0)},           
           {ket_rusak: parseInt(this.state.production[index].ket_rusak || 0)}, {ket_lain: parseInt(this.state.production[index].ket_lain || 0)}, {total_lain: parseInt(this.state.production[index].ket_lain || 0) + parseInt(this.state.production[index].ket_rusak || 0)},
           {catatan: this.state.production[index].catatan || "tidak ada catatan"},
           {username_approval: user},
           {pin_approval: pin}),
           ...this.state.production.slice(index+1)
        ]
      }, () => this.changeDate(id, modal))
      }
    }
    else if(this.state.activeInputRefund === "refundCode3"){
      if(qty3 === 0 || qty3 === ''){
        modal.clearModal()
        modal.toggleModal('alert','','','Jumlah produksi tidak boleh kosong')
      }
      else{
      this.state.produksi[this.state.selectedProduct.name+"produksi3"] = qty3 || 0
      this.setState({
        production: [
           ...this.state.production.slice(0,index),
           Object.assign({}, this.state.production[index], {produksi3: qty3 || 0}, {produksi1: this.state.production[index].produksi1 || 0}, {produksi2: this.state.production[index].produksi2 || 0},
           {total_produksi: parseInt(qty3 || 0) + parseInt(this.state.production[index].produksi1 || 0) + parseInt(this.state.production[index].produksi2 || 0)},
           {sisa_stock: parseInt(this.state.production[index].stock_awal || 0) 
            + parseInt(qty3 || 0)
            + parseInt(this.state.production[index].produksi2 || 0)
            + parseInt(this.state.production[index].produksi1 || 0) 
            - parseInt(this.state.produksi["order"+this.state.selectedProduct.name] ||0 )
            - parseInt(this.state.produksi["pesanan"+this.state.selectedProduct.name] || 0) 
            - parseInt(this.state.production[index].ket_lain || 0) 
            - parseInt(this.state.production[index].ket_rusak || 0)},           
            {ket_rusak: parseInt(this.state.production[index].ket_rusak || 0)}, {ket_lain: parseInt(this.state.production[index].ket_lain || 0)}, {total_lain: parseInt(this.state.production[index].ket_lain || 0) + parseInt(this.state.production[index].ket_rusak || 0)},
           {catatan: this.state.production[index].catatan || "tidak ada catatan"},
           {username_approval: user},
           {pin_approval: pin}),
           ...this.state.production.slice(index+1)
        ]
      }, () => this.changeDate(id, modal))
      }
    }
    else if(this.state.activeInputRefund === "refundCode4"){
      if(qty4 === 0){
        modal.clearModal()
        modal.toggleModal('alert','','','Jumlah produksi tidak boleh kosong')
      }
      else{
      this.state.produksi[this.state.selectedProduct.name+"rusak"] = qty4 || 0
      this.setState({
        production: [
           ...this.state.production.slice(0,index),
           Object.assign({}, this.state.production[index], {ket_rusak: qty4 || 0}, {total_lain: parseInt(qty4 || 0) + parseInt(this.state.production[index].ket_lain || 0)},
           {sisa_stock: parseInt(this.state.production[index].stock_awal || 0) 
            + parseInt(this.state.production[index].produksi1 || 0)
            + parseInt(this.state.production[index].produksi2 || 0)
            + parseInt(this.state.production[index].produksi3 || 0) 
            - parseInt(this.state.produksi["order"+this.state.selectedProduct.name] ||0 )
            - parseInt(this.state.produksi["pesanan"+this.state.selectedProduct.name] || 0)
            - parseInt(this.state.production[index].qty4 || 0) 
            - parseInt(this.state.production[index].ket_lain || 0)},           
           {produksi1: parseInt(this.state.production[index].produksi1 || 0)}, {produksi2: parseInt(this.state.production[index].produksi2 || 0)}, {produksi3: parseInt(this.state.production[index].produksi3 || 0)},
           {total_produksi: parseInt(this.state.production[index].produksi1 || 0) + parseInt(this.state.production[index].produksi2 || 0) + parseInt(this.state.production[index].produksi3 || 0)},
           {catatan: this.state.production[index].catatan || "tidak ada catatan"},
           {username_approval: user},
           {pin_approval: pin}),
           ...this.state.production.slice(index+1)
        ]
      }, () => this.changeDate(id, modal))
      }
    }
    else if(this.state.activeInputRefund === "refundCode5"){
      if(qty5 === 0){
        modal.clearModal()
        modal.toggleModal('alert','','','Jumlah produksi tidak boleh kosong')
      }
      else{
      this.state.produksi[this.state.selectedProduct.name+"lain"] = qty5 || 0
      this.setState({
        production: [
           ...this.state.production.slice(0,index),
           Object.assign({}, this.state.production[index], {ket_lain: qty5 || 0}, {total_lain: parseInt(qty5 || 0) + parseInt(this.state.production[index].ket_rusak || 0)},
           {sisa_stock: parseInt(this.state.production[index].stock_awal || 0) 
            + parseInt(this.state.production[index].produksi1 || 0)
            + parseInt(this.state.production[index].produksi2 || 0)
            + parseInt(this.state.production[index].produksi3 || 0) 
            - parseInt(this.state.produksi["order"+this.state.selectedProduct.name] ||0 )
            - parseInt(this.state.produksi["pesanan"+this.state.selectedProduct.name] || 0)
            - parseInt(this.state.production[index].qty5 || 0) 
            - parseInt(this.state.production[index].ket_rusak || 0)},           
           {produksi1: parseInt(this.state.production[index].produksi1 || 0)}, {produksi2: parseInt(this.state.production[index].produksi2 || 0)}, {produksi3: parseInt(this.state.production[index].produksi3 || 0)},
           {total_produksi: parseInt(this.state.production[index].produksi1 || 0) + parseInt(this.state.production[index].produksi2 || 0) + parseInt(this.state.production[index].produksi3 || 0)},
           {catatan: this.state.production[index].catatan || "tidak ada catatan"},
           {username_approval: user},
           {pin_approval: pin}),
           ...this.state.production.slice(index+1)
        ]
      }, () => this.changeDate(id, modal))
      }
    }
    // else if(this.state.activeInputRefund === "refundCode5")
    else if(user === undefined ){
      modal.clearModal()
      modal.toggleModal('alert','','','User tidak boleh kosong')
    }
    else if (pin === undefined){
      modal.clearModal()
      modal.toggleModal('alert','','','Pin tidak boleh kosong')
    }
    console.log(this.state)
    console.log(this.state.produksi)
    console.log(this.state.production)
  }

  getStokNow = () => {
    // let total = 0
    // const stok = parseInt(this.state.selectedProduct.stock)
    // const produksi1 = parseInt(this.state.produksi[this.state.selectedProduct.name+"produksi1"] || 0)
    // const produksi2 = parseInt(this.state.produksi[this.state.selectedProduct.name+"produksi2"] || 0)
    // const produksi3 = parseInt(this.state.produksi[this.state.selectedProduct.name+"produksi3"] || 0)
    // const rusak = parseInt(this.state.produksi[this.state.selectedProduct.name + "rusak"] || 0)
    // const lain = parseInt(this.state.produksi[this.state.selectedProduct.name + "lain"] || 0)
    // total = stok+produksi1+ produksi2+ produksi3-rusak-lain
    
    let total = 0
    let data = this.state.production
    let whatId = this.state.selectedProduct.id
    let filterData = data.filter(function(data){
      return data.id === whatId
    })
    if(filterData.length !== 0){
      const stok = parseInt(filterData[0].stock_awal || 0)
      const produksi1 = parseInt(filterData[0].produksi1 || 0)
      const produksi2 = parseInt(filterData[0].produksi2 || 0)
      const produksi3 = parseInt(filterData[0].produksi3 || 0)
      const total_penjualan = parseInt(filterData[0].total_penjualan || 0)
      const total_lain = parseInt(filterData[0].total_lain || 0)
      total = stok+produksi1+produksi2+produksi3-total_penjualan-total_lain
      console.log(total, filterData, this.state.clearProduction)
      return total
    } else {
      return total
    }
    
  }
  getStokAwal(){
    let total = 0
    let data = this.state.production
    let whatId = this.state.selectedProduct.id
    let filterData = data.filter(function(data){
      return data.id === whatId
    })
    if(filterData.length === 0){
      return total
    } else {
    return parseInt(filterData[0].stock_awal)
    }

    // let total = 0
    // const stokAwal = parseInt(this.state.produksi["stok_kemarin"+ this.state.selectedProduct.name] || 0)
    // total = stokAwal

    // let data = this.state.production
    // let whatId = this.state.selectedProduct.id
    // let filterData = data.filter(function(data){
    //   return data.id === whatId
    // })
    // if(filterData.length === 0){
    //   return 0
    // } else {
    //   return parseInt(filterData[0].stock)
    // }
  }

  // whatisit = (id) => {
  //   let index = this.state.production.findIndex( x => x.id === id);
  //   let produksi1 = this.state.production[index].produksi1
  //   let produksi2 = this.state.production[index].produksi2
  //   let produksi3 = this.state.production[index].produksi3
  //   this.setState({produksi: {produksi1: produksi1, produksi2: produksi2, produksi3: produksi3}})
  // }

  // changeDate = () => {
  //   this.state.product.push({
  //       product_id: this.state.selectedProduct.id,
  //       produksi1: this.state.produksi.produksi1,
  //       produksi2: this.state.produksi.produksi2,
  //       produksi3: this.state.produksi.produksi3,
  //       total_produksi: this.state.produksi.produksi1+
  //                       this.state.produksi.produksi2+
  //                       this.state.produksi.produksi3,
  //       penjualan_toko: this.state.produksi["total"+this.state.selectedProduct.name],
  //       penjualan_pemesanan: this.state.produksi["pemesanan"+this.state.selectedProduct.name],
  //       total_penjualan: this.state.produksi["total"+this.state.selectedProduct.name]+ 
  //                         this.state.produksi["pemesanan"+this.state.selectedProduct.name],
  //       ket_rusak: this.state.produksi[this.state.selectedProduct.name+"rusak"],
  //       ket_lain: this.state.produksi[this.state.selectedProduct.name+"lain"],
  //       total_lain: this.state.produksi[this.state.selectedProduct.name+"rusak"]+
  //                   this.state.produksi[this.state.selectedProduct.name+"lain"],
  //       catatan: "belum",
  //       stock_awal: this.state.produksi["stok_kemarin"+this.state.selectedProduct.name],
  //       sisa_stock: this.state.produksi["stok_kemarin"+this.state.selectedProduct.name]+
  //                   this.state.produksi.produksi1+
  //                   this.state.produksi.produksi2+
  //                   this.state.produksi.produksi3-
  //                   this.state.produksi["total"+this.state.selectedProduct.name]-
  //                   this.state.produksi["pemesanan"+this.state.selectedProduct.name]
  //   })
  // }

  changeDate = (id, modal) => {
    let data = this.state.production
    let dataFiltered = data.filter(function(data){
      return data.id === id
    })
    console.log(this.getStokNow(), dataFiltered)
    // this.setState({production: []})
    axios.put(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/updateStock/` + id, [{sisa_stock: this.getStokNow()}])
    .then(res=> console.log(res))
    .catch(res => console.log(res))
    axios.post(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/postProduction`, dataFiltered)
    .then(modal.clearModal())
  }

  changeAllDate(modal, close){
    console.log("AWLOALWOALWOALWOWLO",this.state.clearProduction, modal)
    // modal('bayar')
    // axios.get(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/products`)
    // .then(res => {
    //   const data = res.data
    //   console.log(data)
    // })
    // axios.get(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/products`)
    // .then(res => {
    //   const products = res.data;
    //   products.forEach(trx => 
    //     this.state.dataNyoba.push({
    //     product_id: trx.id,
    //     produksi1: "",
    //     produksi2: "",
    //     produksi3: "",
    //     total_produksi: "",
    //     ket_rusak: "",
    //     ket_lain: "",
    //     catatan: null,
    //     })
    //   )
    //   this.setState({nyoBa: this.state.dataNyoba}, 
    //     () => {console.log("COBA",this.state.nyoBa) 
    //           this.setState({nyoBa: [], dataNyoba: []})})
    // })

    axios.post(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/postProduction`, this.state.clearProduction)
    .then(res => {
      this.clearCart()
      this.getDateTrx()
      close()
      // modal()
    })
    .catch(res => {
      modal('alert')
    })
  }

  getDateTrx(){
    axios({timeout: 4000, method: 'get', url:`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/GetLastDate`})
    .then(res => {
      this.setState({date: res.data}, () => {
        console.log("AAVV")
        console.log(this.state.date)
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); 
        var date = this.state.date.date
        if(date === 'no production') {
          this.setState({date: "TimeOut"})
        }else{
        var splitDate = date.created_at.split(" ")
        var takeDate = splitDate[0]
        var tanggal = new Date(takeDate).getDate()
        console.log(date, tanggal)
          this.setState({lastDate: takeDate, prevDate: year + '/' + month + '/' + (tanggal - 1)})
        }
      })
    })
  }

  // changeDate() {
  //   axios.get(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/orderByProduct/` + this.state.selectedProduct.id).then(res => {
  //     const toko = res.data;
  //   axios.get(`https://cors-anywhere.herokuapp.com/http://101.255.125.227:82/api/preorderByProduct/` + this.state.selectedProduct.id).then(res => {
  //     const pesan = res.data;
  //     this.setState({
  //       product: {
  //         product_id: this.state.selectedProduct.id,
  //         produksi1: this.state.produksi.produksi1,
  //         produksi2: this.state.produksi.produksi2,
  //         produksi3: this.state.produksi.produksi3,
  //         total_produksi: this.state.produksi.produksi1+
  //                         this.state.produksi.produksi2+
  //                         this.state.produksi.produksi3,
  //         penjualan_toko: toko,
  //         penjualan_pemesanan: pesan,
  //         total_penjualan: toko+pesan,
  //         ket_rusak: this.state.produksi.rusak,
  //         ket_lain: this.state.produksi.lain,
  //         total_lain: this.state.produksi.rusak+
  //                     this.state.produksi.lain,
  //         catatan: this.state.produksi.catatan,
  //         stock_awal: "30",
  //         sisa_stock: this.state.selectedProduct+
  //                     this.state.produksi.produksi1+
  //                     this.state.produksi.produksi2+
  //                     this.state.produksi.produksi3
  //       }
  //     })
  //     }) 
  //   })
  //   console.log("Clicked")
  // }
}




export default CartsContainer