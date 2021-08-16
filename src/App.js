import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import config from './config';
import loadable from '@loadable/component';
import Portal from './components/Portal';

const DataView = loadable(() => import('./components/DataView'));
const MapView = loadable(() => import('./components/MapView'));
const ScreenshotView = loadable(() => import('./components/ScreenshotsView'));
const SetupView = loadable(() => import('./components/SetupView'));
const Controller = loadable(() => import('./components/Controller'));
const Mobile = loadable(() => import('./components/MobileFnc'));


/* eslint-disable class-methods-use-this */
class App extends Component {

    render() {
        return (
            <BrowserRouter>
                <div>
                    {/* routing for the Terminal View, C.html*/}
                    <Route exact path='/data/:positionID' render={(props) => (
                        <div className="App">
                            <div className="ContainerRow">
                                <DataView start={config.maxDevicesPerScreen} {...props}/>
                            </div>
                        </div>)}/>
                    {/* routing for the Terminal View, D.html*/}
                    {/* routing for the Map View, B.html*/}
                    <Route exact={true} path='/probe' render={() => (
                        <div className="App">
                            <div className="ContainerRow">
                                <MapView/>
                            </div>
                        </div>)}/>
                    {/* routing for the First Page, A.html*/}
                    <Route exact={true} path='/setup' render={() => (
                        <div className="ContainerRow">
                            <SetupView/>
                        </div>)}/>
                    <Route exact={true} path='/screenshots' render={() => (
                        <div className="ContainerRow">
                            <ScreenshotView/>
                        </div>)}/>
                    <Route exact={true} path='/control' render={() => (
                        <div className="ContainerRow">
                            <Controller/>
                        </div>)}/>
                    <Route exact={true} path='/mobile' render={() => (
                        <div className="ContainerRow">
                            <Mobile/>
                        </div>)}/>
                    <Route exact={true} path='/portal' render={() => (
                        <div className="ContainerRow">
                            <Portal/>
                        </div>)}/>
                </div>
            </BrowserRouter>);
    }
}

export default App;
