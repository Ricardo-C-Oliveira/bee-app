import React, { Component } from 'react';
import { mapStateToProps, mapDispatchToProps } from './selectors';
import { connect } from 'react-redux';
import { Modal, Content, Button } from 're-bulma';


//Load the db from a file path and populate the main store
class Info extends Component{
  constructor(props){
      super(props)
      this.state = {
          infoModalState: false
      }
      this.toggleModal = this.toggleModal.bind(this)
  }

    toggleModal() {
        this.setState({
            infoModalState: !this.state.infoModalState
        })
    }

    render (){
        // this.props.loadDBFromDisk()
        return <div className="navbar-icon title">
        <i className="navbar-icon fa fa-info-circle fa-2x" onClick={this.toggleModal}/>
            <Modal
                type="card"
                headerContent="Info"
                isActive={this.state.infoModalState}
                onCloseRequest={() => this.setState({ infoModalState: false })}
            >
                <Content>
                    What should we add here?
                </Content>
            </Modal>
            </div>
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Info);
