import React, {Component} from 'react';
import {mapStateToProps, mapDispatchToProps} from './selectors';
import {connect} from 'react-redux';
import {
    Menu,
    MenuList,
    Subtitle,
    Button,
    Modal,
    Content,
    Label,
    Input
} from 're-bulma';

import './Widgets.css'

class FlowersList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            addModalState: false,
            newFlowerIndex: '',
            newFlowerName: '',
            newFlowerRadius: '',
            inputError: false
        }
        this.toggleModal = this.toggleModal.bind(this)
        this.submitNewFlower = this.submitNewFlower.bind(this)
        this.cancelFlower = this.cancelFlower.bind(this)
        this.deleteFlower = this.deleteFlower.bind(this)
        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleIndexChange = this.handleIndexChange.bind(this)
        this.handleRadiusChange = this.handleRadiusChange.bind(this)
    }

    toggleModal() {
        this.setState({
            addModalState: !this.state.addModalState
        })
    }

    deleteFlower(e) {
        console.log(e)

        if (this.props.dbType === 'cloud'){
            this.props.removeFlowerDBCloud(e)
        } else {
            this.props.removeFlowerDB(e)
        }
    }

    submitNewFlower() {
        const newFlowerNameVal = this.state.newFlowerName
        const newFlowerIndexVal = this.state.newFlowerIndex
        const newFlowerRadiusVal = this.state.newFlowerRadius

        if (newFlowerIndexVal.length == 0 || newFlowerNameVal.length == 0 || newFlowerRadiusVal == 0){
            this.setState({
                inputError: true
            })
        } else {
            if (this.props.dbType === 'cloud') {
                this.setState({
                    newFlowerRadius: '',
                    newFlowerIndex: '',
                    newFlowerName: '',
                    inputError: ''
                })
                this.setState({addModalState: false})

                this.props.addNewFlowerDBCloud({newFlowerNameVal, newFlowerIndexVal, newFlowerRadiusVal})
            } else {
                this.props.addNewFlowerDB({newFlowerNameVal, newFlowerIndexVal, newFlowerRadiusVal})
                this.setState({
                    newFlowerRadius: '',
                    newFlowerIndex: '',
                    newFlowerName: '',
                    inputError: ''
                })
                this.setState({addModalState: false})
            }
        }

        // this.setState({
        //     addModalState: !this.state.addModalState
        // })
    }

    cancelFlower(){
        this.setState({addModalState: false})
        this.setState({
            newFlowerRadius: '',
            newFlowerIndex: '',
            newFlowerName: '',
            inputError: ''
        })
    }

    handleNameChange(event) {
        this.setState({newFlowerName: event.target.value});
    }

    handleIndexChange(event) {
        this.setState({newFlowerIndex: event.target.value});
    }

    handleRadiusChange(event) {
        this.setState({newFlowerRadius: event.target.value});
    }

    render() {
        var letterstyle = {
            color: "white"
        };
        console.log(this.props.plants_list)
        const plants = this.props.plants_list.map((plant) => {
            return <li key={'flower_' + plant.plant_id} className="input-item" id={plant.plant_id} onClick={this.props.toggleFlower}>
                <input type="checkbox" checked={(this.props.use_plants.length === 0
                    ? false
                    : this.props.use_plants.forEach((plantOnList) => (plantOnList.plant_id === plant.plant_id)))} id={plant.plant_id}/>
                  <label id={plant.plant_id}>{plant.plant_name} (Index: {plant.plant_index}, Size: {plant.plant_radius})</label>
                <i className="fa fa-times-circle delete-icon" onClick={this.deleteFlower.bind(this, plant.plant_id)}/>
            </li>
        })

        return <div>
            <Modal type="card" headerContent="Add a new flower to the Database" isActive={this.state.addModalState} onCloseRequest={this.cancelFlower}>
                <Content>
                    <Label>Flower Name</Label>
                    <Input type="text" placeholder="Flower Name" value={this.state.newFlowerName} onChange={this.handleNameChange} help={(this.state.inputError ? {
                        color: 'isDanger',
                        text: 'Make sure that all fields are complete!',
                    } : null)}/>
                    <Label>Flower Index</Label>
                    <Input type="number" placeholder="Flower Index" value={this.state.newFlowerIndex} onChange={this.handleIndexChange} help={(this.state.inputError ? {
                        color: 'isDanger',
                        text: 'Make sure that all fields are complete!',
                    } : null)}/>
                    <Label>Flower Radius</Label>
                    <Input type="number" placeholder="Flower Radius in Meters" value={this.state.newFlowerRadius} onChange={this.handleRadiusChange} help={(this.state.inputError ? {
                        color: 'isDanger',
                        text: 'Make sure that all fields are complete!',
                    } : null)}/>
                    <Button color="isSuccess" onClick={this.submitNewFlower.bind(this)}>Add Flower</Button>
                    <Button color="isDanger" onClick={this.cancelFlower} style={{marginLeft: "10px"}}>Cancel</Button>
                </Content>
            </Modal>
            <Subtitle style={letterstyle}>2. Flower List</Subtitle>
            <div className="menu-list">
                <Menu>
                    <MenuList>{plants}</MenuList>
                </Menu>
            </div>
            <Button color="isPrimary" className="add-btn" onClick={this.toggleModal}>Add Flower</Button>
        </div>

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlowersList);
