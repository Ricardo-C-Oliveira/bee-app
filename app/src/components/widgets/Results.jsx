import React, { Component } from 'react';
import { mapStateToProps, mapDispatchToProps } from './selectors';
import { connect } from 'react-redux';
import { Subtitle, Button } from 're-bulma';


//Load the db from a file path and populate the main store
class Results extends Component{
    constructor(props){
        super(props)

        this.newRun = this.newRun.bind(this)
    }

    newRun(){
        this.props.newRun()
    }

    render (){
        var letterstyle = {
            color: "white"
        };
        var num_intersected_polys = this.props.num_intersected_polys;
        var intersected_area = this.props.intersected_area;
        var result_returned = this.props.result_returned;
        return <div>
            <Subtitle style={letterstyle}>Results</Subtitle>
            {num_intersected_polys && <p>Total number of parcels inside the study area is: {num_intersected_polys}</p>}
            {intersected_area && <p>Total area is: {intersected_area} square meters.</p>}
            {result_returned && <Button color="isInfo" className="run-btn" onClick={this.newRun}>New Simulation</Button>}
        </div>
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Results);