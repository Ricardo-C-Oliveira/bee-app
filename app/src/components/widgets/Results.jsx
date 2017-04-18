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
            color: "white"
        };
        var num_intersected_polys = this.props.num_intersected_polys;
        var intersected_area = this.props.intersected_area;
        var result_returned = this.props.result_returned;
        var flowers_results = this.props.flowers_result;
        console.log(flowers_results)

        const flowersResults = (flowers_results
            ? flowers_results.map((result) => {
                return   <Tr key={Math.random()}>
                      <Td>{result.name}</Td>
                      <Td>{result.number_flowers}</Td>
                      <Td>{result.flower_score}</Td>
                  </Tr>
            })
            : null)

        return <div>
            <Subtitle style={letterstyle}>Results</Subtitle>
            <div className="menu-list" id="results-pane">
            {num_intersected_polys && <p>Total number of parcels inside the study area is: {num_intersected_polys}</p>}
            {intersected_area && <p>Total area is: {intersected_area}
                square meters.</p>}

            {flowers_results && <Table isNarrow>
                <Thead>
                    <Tr>
                        <Th>Flower Name</Th>
                        <Th>Number of Flowers</Th>
                        <Th>Total Flower Index</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {flowersResults}
                </Tbody>
            </Table>}
            </div>
            <Button color="isInfo" state={result_returned ? "" : "isDisabled"} className="run-btn" onClick={this.newRun}>New Simulation</Button>
        </div>
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Results);
