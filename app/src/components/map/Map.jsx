import React, {Component} from 'react';
import {mapStateToProps, mapDispatchToProps} from './selectors';
import {connect} from 'react-redux';
import {Map, TileLayer, ZoomControl, FeatureGroup, GeoJSON, Popup} from 'react-leaflet';
import {EditControl} from "react-leaflet-draw"
import {
    Button,
    Modal,
    Content,
    Label,
    Input
} from 're-bulma';

import './Map.css';
import '../../../node_modules/leaflet/dist/leaflet.css'
import '../../../node_modules/leaflet-draw/dist/leaflet.draw.css'

let layer;
let drawHandlerObj;

class MainMap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editModal: false,
            newAreaName: '',
            newAreaDescription: '',
            newAreaGeom: '',
            addAreaHandler: false,
            inputError: false,
            shouldZoom: true
        }
        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
        this.handleNewGeometry = this.handleNewGeometry.bind(this)
        this.submitArea = this.submitArea.bind(this)
        this.cancelArea = this.cancelArea.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
        this._onCreate = this._onCreate.bind(this)
        this.toggleAddAreaHandler = this.toggleAddAreaHandler.bind(this)
        this._mounted = this._mounted.bind(this)
    }

    handleNameChange(event) {
        this.setState({newAreaName: event.target.value});
    }

    handleDescriptionChange(event) {
        this.setState({newAreaDescription: event.target.value});
    }

    handleNewGeometry(event) {
        this.setState({newAreaGeom: event});
    }

    submitArea() {
        const newAreaNameVal = this.state.newAreaName
        const newAreaDescriptionVal = this.state.newAreaDescription
        const newAreaGeomVal = this.state.newAreaGeom

        if (newAreaNameVal.length == 0 || newAreaDescriptionVal.length == 0){
            this.setState({
                inputError: true
            })
        } else {
            this.setState({
                editModal: !this.state.editModal,
                addAreaHandler: !this.state.addAreaHandler,
                newAreaName: '',
                newAreaDescription: '',
                newAreaGeom: '',
                inputError: false,
                shouldZoom: !this.state.shouldZoom
            })

            this.refs.layergroup.leafletElement.removeLayer(layer)
            this.toggleAddAreaHandler

            this.props.addNewAreaDBCloud({newAreaNameVal, newAreaDescriptionVal, newAreaGeomVal})

        }
    }

    cancelArea() {
        let layer = this.state.newLayer
        this.refs.layergroup.leafletElement.removeLayer(layer)

        this.toggleModal()
        this.setState({
            addAreaHandler: !this.state.addAreaHandler,
            newAreaName: '',
            newAreaDescription: '',
            inputError: false,
            shouldZoom: !this.state.shouldZoom
        })
    }

    toggleModal() {
        this.setState({
            editModal: !this.state.editModal
        })
    }

    _onCreate(e) {
        layer = e.layer
        this.toggleModal()
        this.handleNewGeometry(JSON.stringify(layer.toGeoJSON()))
        this.setState({
            newLayer: layer
        })
    }

    _mounted(drawControl) {
        drawHandlerObj = drawControl._toolbars.draw._modes.rectangle.handler;
    }

    toggleAddAreaHandler() {
        if (this.state.addAreaHandler) {
            drawHandlerObj.disable()
        } else {
            drawHandlerObj.enable()
        }

        this.setState({
            addAreaHandler: !this.state.addAreaHandler,
            shouldZoom: !this.state.shouldZoom
        })
    }

    componentWillReceiveProps(nextProps){
        // if (this.refs.layergroup.leafletElement._leaflet !== undefined) {
        //     console.log(this.refs.layergroup.leafletElement)
        //     this.refs.layergroup.leafletElement.removeLayer(this.refs.layergroup.leafletElement._layers[0]._layers[0]);
        // }
    }

    componentDidUpdate(){
        if (this.state.shouldZoom) {
            let layergroup = this.refs.layergroup.leafletElement._layers
            let layer = layergroup[Object.getOwnPropertyNames(layergroup)[0]]._layers
            if (layer !== undefined) {
                let layerBounds = layer[Object.getOwnPropertyNames(layer)[0]]._bounds
                this.refs.map.leafletElement.fitBounds(layerBounds)
            }
        }
    }


    render() {
        // clean this, make (this.props.use_area a variable and re-use it, fill area popup
        const areaLayer = (this.props.use_area.length > 0 ?
             <GeoJSON key={this.props.use_area["0"].area_id} data={JSON.parse(this.props.use_area["0"].geom)}>
                 <Popup><Label><p>Study Area Name: {this.props.use_area["0"].study_area}</p><p>Study Area Description: {this.props.use_area["0"].study_descr}</p></Label></Popup>
                 </GeoJSON>
         : null)
        return (
            <div className='map-wrapper'>
                <Map className='Map' center={[39.739800, -104.911276]} zoom={10} maxZoom={17} zoomControl={false} ref="map">
                    <ZoomControl position='topright'/>
                    <TileLayer url="http://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png" attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'/>
                    <FeatureGroup ref="layergroup">
                        <EditControl position='topright' onEdited={this._onEditPath} onCreated={this._onCreate} onDeleted={this._onDeleted} onMounted={this._mounted} draw={{
                            polygon: false,
                            circle: false,
                            polyline: false,
                            marker: false
                        }}/>
                        {areaLayer}
                    </FeatureGroup>
                </Map>
                {
                    this.state.addAreaHandler ? <Button className="add-btn" color="isDanger" onClick={this.toggleAddAreaHandler}>Cancel</Button>
                    : <Button className="add-btn" color="isPrimary" onClick={this.toggleAddAreaHandler}>Add New Study Area</Button>
                }
                <Modal isActive={this.state.editModal} type="card" headerContent="Add this Study Area to the Database" onCloseRequest={this.cancelArea}>
                    <Content>
                        <Label>Area Name</Label>
                        <Input ref="areaNameField" type="text" placeholder="Area Name" value={this.state.newAreaName} onChange={this.handleNameChange} help={(this.state.inputError ? {
                            color: 'isDanger',
                            text: 'Make sure that all fields are complete!',
                        } : null)}/>
                        <Label>Study Area Description</Label>
                        <Input type="text" placeholder="Study Area Description" value={this.state.newAreaDescription} onChange={this.handleDescriptionChange} help={(this.state.inputError ? {
                            color: 'isDanger',
                            text: 'Make sure that all fields are complete!',
                        } : null)}/>
                        <Button color="isSuccess" onClick={this.submitArea}>Add New Study Area</Button>
                        <Button color="isDanger" onClick={this.cancelArea} style={{marginLeft: "10px"}}>Cancel</Button>
                    </Content>
                </Modal>
            </div>
        )
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MainMap);
