import React, { Component } from 'react';
import { mapStateToProps, mapDispatchToProps } from './selectors';
import { connect } from 'react-redux';
import { Modal, Content, Message, Notification, Image } from 're-bulma';


//Load the db from a file path and populate the main store
class RunnningSim extends Component{
    constructor(props){
        super(props)
        this.state = {
            runningSimModalState: false
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            runningSimModalState: nextProps.running_modal
        })
    }

    render (){
        return <div>
            {/*<Modal*/}
                {/*type="card"*/}
                {/*isActive={this.state.runningSimModalState}*/}
            {/*>*/}
                {/*<Content>*/}
                    {/*Running simulation please wait.*/}
                {/*</Content>*/}
            {/*</Modal>*/}
            <Modal isActive={this.state.runningSimModalState}>
                <Notification color="isInfo">
                    <p style={{textAlign: 'center'}}>Running simulation, please wait.</p>
                    <Image src="http://i.imgur.com/bDJ5KYr.gif" size="is480X320"></Image>
                </Notification>
            </Modal>
        </div>
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(RunnningSim);
