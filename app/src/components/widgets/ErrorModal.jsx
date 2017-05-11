import React, { Component } from 'react';
import { mapStateToProps, mapDispatchToProps } from './selectors';
import { connect } from 'react-redux';
import { Modal, Content, Message } from 're-bulma';


//Load the db from a file path and populate the main store
class ErrorModal extends Component{
    constructor(props){
        super(props)
        this.state = {
            errorModalState: false
        }
        this.toggleModal = this.toggleModal.bind(this)
    }

    toggleModal() {
        this.setState({
            errorModalState: !this.state.errorModalState
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            errorModalState: nextProps.error_modal
        })
    }

    render (){
        return <div>
            <Modal
                type="card"
                headerContent="Error"
                isActive={this.state.errorModalState}
                onCloseRequest={() => this.setState({ errorModalState: false })}
            >
                <Content>
                    <Message header="An error occured" color="isDanger" >
                        {this.props.error_msg}
                    </Message>
                    <br />

                    Please inform this error to ricardo.oliveira@ucdenver.edu
                </Content>
            </Modal>
        </div>
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(ErrorModal);
