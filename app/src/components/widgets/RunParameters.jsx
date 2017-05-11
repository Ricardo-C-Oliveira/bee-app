import React, { Component } from 'react';
import { mapStateToProps, mapDispatchToProps } from './selectors';
import { connect } from 'react-redux';
import {Subtitle, Input, Button, Group, FormHorizontal, ControlLabel, Label} from 're-bulma';
import Slider from 'rc-slider';

import './Widgets.css'


class RunParameters extends Component{
    constructor(props){
        super(props)
        this.state = {
            hiveAcreVal: 2.38,
            beeHiveVal: 50000
        }

        this.runSimulation = this.runSimulation.bind(this)
        this.handleParamChange = this.handleParamChange.bind(this)
        this.useDefaults = this.useDefaults.bind(this)

    }

    runSimulation() {
        let params = {
            ...this.state,
            use_area: this.props.use_area[0].area_id
        }

        this.props.runSimulation(params)
    }

    useDefaults() {
        this.setState({
            hiveAcreVal: 2.38,
            beeHiveVal: 50000
        })

    }

    handleParamChange(input, e) {
        var change = {}

        change[input] = e.target.value;
        this.setState(change);

    }


    render(){
        var letterstyle = {color: "black"}

        return <div>
        <Subtitle style={letterstyle}>2. Set Model Parameters</Subtitle>
            <FormHorizontal>
                <Group>
                    <Label className="parameter-descr">Hives per Acre </Label>
                    <Input key="hiveAcreField" type="number" defaultValue={this.state.hiveAcreVal} value={this.state.hiveAcreVal} onChange={this.handleParamChange.bind(this, 'hiveAcreVal')}/>
                </Group>
            </FormHorizontal>
            <br />
            <FormHorizontal>
            <Group>
                <Label className="parameter-descr">Bees per Hive </Label>
                <Input key="beeHiveField" type="number" defaultValue={this.state.beeHiveVal} value={this.state.beeHiveVal} onChange={this.handleParamChange.bind(this, 'beeHiveVal')}/>
            </Group>
            </FormHorizontal>
            < br/>
            <Button color="isPrimary" className="default-btn" onClick={this.useDefaults}>Restore Default Values</Button>
            <Button color="isSuccess" className="run-btn" state={(this.props.use_area.length > 0 ? "" : "isDisabled")} onClick={this.runSimulation}>Go!</Button>
            </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RunParameters);
