import React, { Component } from 'react';
import { mapStateToProps, mapDispatchToProps } from './selectors';
import { connect } from 'react-redux';
import { Modal, Content, Button, Label } from 're-bulma';
import Toggle from 'react-toggle'


//Load the db from a file path and populate the main store
class ConnectDB extends Component{
    constructor(props){
        super(props)
        this.state = {
            connectDBModalState: true,
            useCloudDB: true,
        }
        this.toggleModal = this.toggleModal.bind(this)
        this.getpath = this.getpath.bind(this)
        this.handleDBChoice = this.handleDBChoice.bind(this)
        this.connectDatabaseCloud = this.connectDatabaseCloud.bind(this)
    }

    toggleModal() {
        this.setState({
            connectDBModalState: !this.state.connectDBModalState
        })
    }

    handleDBChoice() {
        if (this.state.useCloudDB) {
            this.props.chooseDBType('local')
            this.setState({
                useCloudDB: false
            })
        } else {
            this.props.chooseDBType('cloud')
            this.setState({
                useCloudDB: true
            })
        }
    }

    getpath() {
        // const pathDB = document.getElementById("fileDB").files[0].path
        // const pathGeoJSON = document.getElementById("fileGeoJSON").files[0].path

        //TODO: Remove these
        const pathDB = '/Users/ricardooliveira/GIS/bee_app/bee_db.db'
        const pathGeoJSON = '/Users/ricardooliveira/GIS/bee_app/parcels.geojson'

        this.props.loadDBFromDisk(pathDB)
        this.props.loadGeoJSONFromDisk(pathGeoJSON)
        this.toggleModal()
    }

    connectDatabaseCloud() {
        this.toggleModal()

        this.props.loadDBFromCloud()
    }

    render (){
        // this.props.loadDBFromDisk()
        return <div className="navbar-icon title">
        <i className="navbar-icon fa fa-database fa-2x" onClick={this.toggleModal}/>
            <Modal
                type="card"
                headerContent="Connect to Data Sources"
                isActive={this.state.connectDBModalState}
                onCloseRequest={() => this.setState({ connectDBModalState: false })}
            >
                <label><span>Local Database  </span><Toggle
                    icons={{
                        checked: <i  className="fa fa-database"/>,
                        unchecked: <i className="fa fa-cloud" />
                    }}
                    className='custom-classname'
                    onChange={this.handleDBChoice}
                    /><span>  Cloud Hosted Database</span>
                </label>
                <hr />
                { this.state.useCloudDB ?
                    <Content>
                        You will be using the Database hosted on the cloud!
                        <br />
                        <br />
                        <Button color="isSuccess" onClick={this.connectDatabaseCloud}>Load Data Sources</Button>
                    </Content>
                    :
                    <Content>
                        Choose SQLite Database: <input id="fileDB" type="file"/>
                        <br />
                        <br />
                        Choose GeoJSON File: <input id="fileGeoJSON" type="file"/>
                        <br />
                        <br />
                        <Button color="isSuccess" onClick={this.getpath}>Load Data Sources</Button>
                    </Content>
                }
            </Modal>
            </div>
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectDB);
