import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from './selectors';
import Map from '../map/Map';
import FlowersList from '../widgets/FlowersList';
import StudyAreasList from '../widgets/StudyAreaList';
import RunParameters from '../widgets/RunParameters';
import ConnectDB from '../widgets/ConnectDB';
import Info from '../widgets/Info';
import Results from '../widgets/Results';
import ErrorModal from '../widgets/ErrorModal';
import RunningSim from '../widgets/RunningSim';
import {Tile, Title, Subtitle, Nav, NavGroup, NavItem} from 're-bulma'

import beeimg from './beeimg.png'

import './App.css';

class App extends Component {

  componentDidMount() {
    this.props.loadDBFromCloud();
  }

  render() {
    var style = {borderRadius: '5px', padding: '10px', position: 'relative'};
    var letterstyle = {color: "black"}

    return (
      <div className="App">
          {/*<header className="navbar navbar-default header">*/}

              {/*<Title className="title"> <img src={beeimg} height="40" width="40"/> BEE CARRYING CAPACITY APP</Title>*/}
            {/*<Info className="navbar-icon"/>*/}
            {/*<ErrorModal className="navbar-icon"/>*/}
            {/*<RunningSim/>*/}
          {/*</header>*/}

        <Nav>
          <NavGroup align="left" className="navbar navbar-default header">
            <NavItem>
              <img src={beeimg} width="24" height="24" />
              <Title className="title">BEE CARRYING CAPACITY APP</Title>
            </NavItem>
          </NavGroup>
          <NavGroup align="right">
            <NavItem>
              <Info className="navbar-icon"/>
            </NavItem>
          </NavGroup>
        </Nav>
        <ErrorModal className="navbar-icon"/>
        <RunningSim/>


        <Tile context="isAncestor" className="tile-main">
          <Tile isVertical size="is12">
            <Tile>
              <Tile context="isParent" size="is6">
                <Tile context="isChild" style={style} className="map-tile">
                    <Subtitle style={letterstyle}>Study Area Map</Subtitle>
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
                      <RunParameters/>
                    </Tile>
                  </Tile>
                </Tile>

                <Tile className="bottom-tiles">
                  <Tile context="isParent" size="is12">
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
