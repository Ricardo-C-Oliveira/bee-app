import React, { Component } from 'react';
import { mapStateToProps, mapDispatchToProps } from './selectors';
import { connect } from 'react-redux';
import { Modal, Content, Button , Subtitle} from 're-bulma';


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
                    <p>Welcome to the Bee Carrying Capacity App! This app was built through a joint partnership between the University of Colorado Denver Geography and Environmental Sciences (CU Denver GES) Department and the Butterfly Pavilion (BP) in Westminster, Colorado. It is designed to help BP researchers measure the “bee friendliness”, or pollinator carrying capacity, for various properties throughout the Denver Metropolitan area.
                        Attention: The application contains property data for The City and County of Denver, Adams County, Boulder County, Douglas County, Arapahoe County, and Broomfield County. Any simulation outside the mentioned counties will result on empty results.</p>
                    <hr />
                    <div style={{textAlign: "left"}}>
                    <Subtitle>How To Use This App:</Subtitle>
                    <ol>
                        <li>
                            Select the Study Area of interest by clicking its checkbox from the list.  (Study Area not listed? Zoom the map to the Study Area, click on the "Add New Study Area" button, then click and drag a rectangle to outline the Study Area.)
                        </li>
                        <li>
                            Update model parameters, if required. (Click the "Restore Default Values" button to reset parameter values to the defaults.)
                        </li>
                        <li>
                            Run the model by clicking the "Go!" button.
                        </li>
                        <li>
                            To set up a completely new model, click the "Start Over" button.
                        </li>
                    </ol>
                        < hr />
                        <Subtitle>Credits</Subtitle>
                        <ul>
                            <li>BP: Colorado Native Plant Species, Model Parameters</li>
                            <li>CU Denver GES Department, Graduate Student Team (Jesse Rozelle, Marcelle Caturia, Rachel Stevenson, and Ricardo Oliveira): Model and App Design
                            </li>
                            <li>CU Denver GES Department, Prof. Amanda Weaver, PhD: Partnership Coordination</li>
                            <li>Adams County, City and County of Denver, Open Colorado: GIS data</li>
                        </ul>
                        < hr />
                        For questions about the application or to report bugs please contact the developer at: <a href="mailto:ricardo.oliveira@ucdenver.edu">ricardo.oliveira@ucdenver.edu</a>

                        </div>

                </Content>
            </Modal>
            </div>
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Info);
