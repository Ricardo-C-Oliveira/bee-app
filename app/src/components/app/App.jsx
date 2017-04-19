import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from './selectors';
import Map from '../map/Map';
import FlowersList from '../widgets/FlowersList';
import StudyAreasList from '../widgets/StudyAreaList';
import PlaceFlowers from '../widgets/PlaceFlowers';
import ConnectDB from '../widgets/ConnectDB';
import Info from '../widgets/Info';
import Results from '../widgets/Results';
import ErrorModal from '../widgets/ErrorModal';
import {Tile, Title, Subtitle} from 're-bulma'

import './App.css';

class App extends Component {


  render() {
    var style = {borderRadius: '5px', padding: '10px', position: 'relative'};
    var letterstyle = {color: "white"}

    return (
      <div className="App">
          <header className="navbar navbar-default header">
              {/*<div className="title">Bee Caring Capacity</div>*/}
              <Title className="title">BEE CARRYING CAPACITY TOOLKIT</Title>
            <Info className="navbar-icon"/>
            <ConnectDB className="navbar-icon"/>
            <ErrorModal className="navbar-icon"/>
            {/*<i className="navbar-icon fa fa-database fa-2x title"/>*/}
          </header>

        <Tile context="isAncestor" className="tile-main">
          <Tile isVertical size="is12">
            <Tile>
              <Tile context="isParent" size="is6">
                <Tile context="isChild" style={style} className="map-tile">
                    <Subtitle style={letterstyle}>Region of Study</Subtitle>
                    <Map/>
                </Tile>
              </Tile>
              <Tile isVertical>

                <Tile className="upper-tiles">
                  <Tile context="isParent" size="is6">
                    <Tile context="isChild" style={style} className="input-tile">
                      <StudyAreasList/>
                    </Tile>
                  </Tile>
                  <Tile context="isParent" size="is6">
                    <Tile context="isChild" style={style} className="input-tile">
                      <FlowersList/>
                    </Tile>
                  </Tile>
                </Tile>

                <Tile className="bottom-tiles">
                  <Tile context="isParent" size="is6">
                    <Tile context="isChild" style={style} className="input-tile">
                      <PlaceFlowers/>
                    </Tile>
                  </Tile>
                  <Tile context="isParent" size="is6">
                    <Tile context="isChild" style={style} className="result-tile">
                      <Results/>
                    </Tile>
                  </Tile>
                </Tile>
              </Tile>
            </Tile>
          </Tile>
        </Tile>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
