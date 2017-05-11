import React, {Component} from 'react';
import {mapStateToProps, mapDispatchToProps} from './selectors';
import {connect} from 'react-redux';
import {
    Subtitle,
    Button,
    Table,
    Thead,
    Tbody,
    Td,
    Th,
    Tr
} from 're-bulma';

//Load the db from a file path and populate the main store
class Results extends Component {
    constructor(props) {
        super(props)

        this.newRun = this.newRun.bind(this)
    }

    newRun() {
        this.props.newRun()
    }

    render() {
        var letterstyle = {
            color: "black"
        };
        let results = this.props.results

        return <div>
            <Subtitle style={letterstyle}>Results</Subtitle>
            { results &&
            <div>
                <p className="result">Total available area: {Number(results.available_acreage).toFixed(2)} Acres</p>
                <p className="result">Total number of supported hives: {Number(results.supported_hives).toFixed(2)} Hives</p>
                <p className="result">Total number of supported bees: {Number(results.supported_bees).toFixed(2).toLocaleString()} Bees</p>
            </div>
            }
            <Button color="isInfo" state={results ? "" : "isDisabled"} className="run-btn" onClick={this.newRun}>Start Over</Button>
        </div>
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Results);
