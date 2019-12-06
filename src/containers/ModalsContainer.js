import { Container } from 'unstated'
import axios from 'axios'
import DefaultIP from './DefaultIP'


class ModalsContainer extends Container {
  constructor() {
  super();
  this.toggleModal = this.toggleModal.bind(this);
  this.state = {
    modal: false,
    modalType: 'reguler',
    modalSize: 'sm',
    modalWhere : '',
    modalMessage: '',
    transaction: '',
  };
  this.toggleModal = this.toggleModal.bind(this);
}

  toggleModal = (type, size, where, message) => {
    this.setState({
      modalType: type,
      modalSize: size,
      modalWhere: where,
      modalMessage: message
    },
    () => {
      setTimeout(this.setState({
        modal: !this.state.modal
      }), 1000)
      
    })
  } 

  clearModal = () => {
    this.setState({modal: !this.state.modal})
  }

  getData(){
    axios.get(DefaultIP + `/api/getTrx`)
    .then(res => this.setState({transaction: res.data}))
  }
  
}

export default ModalsContainer