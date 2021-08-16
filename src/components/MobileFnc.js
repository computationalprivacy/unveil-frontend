import React, {useState, useEffect} from 'react';
import Table from './Table';
import config from '../config';
import {HamburgerMenu, PAGE} from './mobileComponents/HamburgerMenu';
import CPGLogoCorner from './mobileComponents/CPGLogoCorner';
import axios from 'axios';
import {trimURL} from './Utils';
import {withRouter, Redirect} from 'react-router-dom';

require('../css/responsive.css');
require('../css/mobile.css');
const urljoin = require('url-join');
const fake_data = require('../data/data.json');
const Mobile = withRouter((props) => {
    const [page, setPage] = useState(PAGE.NONE);
    const [data, setData] = useState([]);
    const [session, setSession] = useState(-1);
    const [successLoadData, setSuccessLoadData] = useState(true);

    function selectData(data) {
        // This is just used for loading fake data
        console.log(data)
        return data.length > 0 ? data[0] : [];
    }

    useEffect(() => {
        const fetchSessionId = async () => {
            try {
                const fetch_session_url = urljoin(
                    config.url, 'display/get/', config.ap_screen);
                let res = await axios.get(fetch_session_url, {headers: {'Authorization': props.history.location.state}});
                setSession(res.data.id);
            } catch (e) {
                console.log(e)
                setSuccessLoadData(false);
            }
        }

        (async() => {
            await fetchSessionId();
        })();
    }, [props.history.location.state]);

    useEffect(() => {
        const fetchData = async () => {
            if (session !== config.disabledSessionIndicator
                && session !== config.fakeSessionID) {
                const fetch_data_url = urljoin(
                    config.url, 'ap/session/mobile/', String(session));
                try {
                    let res = await axios.get(fetch_data_url, {headers: {'Authorization': props.history.location.state}});
                    const data = selectData(res.data.results);
                    setData(data);
                } catch (e) {
                    console.log(e)
                    setSuccessLoadData(false);
                }
            } else if (session === config.fakeSessionID) {
                setData(selectData(fake_data));
            } else {
                setSuccessLoadData(false);
            }
        }

        (async() => {
            await fetchData();
        })();

        setInterval(fetchData, 5000);
    }, [session, props.history.location.state]);
    // This has been copied from the User component
    const updateInternetTraffic = () => {
        let i;
        let http = false;
        const HTTPRows = [];
        const HTTPRowsHighlight = [];
        const SecureRows = [];
        const SecureRowsHighlight = [];
        const maxLengthHTTP = 60;
        const totalLength = data.Internet_Traffic ? data.Internet_Traffic.length : 0;
        for (i = 0; i < totalLength; i++) {
            if (data.Internet_Traffic[i][2] === 'HTTP') {
                const http_row = data.Internet_Traffic[i];
                http_row[1] = trimURL(http_row[1], maxLengthHTTP);
                HTTPRows.push(http_row);
                http = true;
                if (data.Internet_Traffic[i][4]){
                    HTTPRowsHighlight.push(HTTPRows.length - 1)
                }

            } else {
                SecureRows.push(data.Internet_Traffic[i]);
                if (data.Internet_Traffic[i][4]){
                    SecureRowsHighlight.push(SecureRows.length - 1)
                }
            }
        }
        return [http, HTTPRows, HTTPRowsHighlight, SecureRows, SecureRowsHighlight];
    };


    const maxDnsRows = 13;
    const dnsQueries = data.DNS_Queries ? data.DNS_Queries.slice(0, Math.min(
        maxDnsRows, data.DNS_Queries.length)) : [];
    const httpPresence = updateInternetTraffic();
    const internetWidthDistribution = ['20%', '45%', '35%', '20%'];

    let pages = [];
    switch (page) {
        // Device, Website and Traffic ages have had thier code copied from User
        // TODO: Refactor user component to make reusable components that can be used in here... (to avoid code duplication)
        case PAGE.NONE:
            pages.push(<div id="opening-text">To check the data collected from your device click one of the buttons
                above</div>);
            break;
        case PAGE.DEVICE:
            pages.push(<div className="continue-div">Your device info</div>);
            pages.push(<div id="DeviceInfo">
                <Table info={data.Device_Info}
                       type='dict'
                       widthDistribution={['25%', '75%']}/>
            </div>);
            break;
        case PAGE.WEBSITE:
            // eslint-disable-next-line react/no-unescaped-entities
            pages.push(<div className="continue-div">Websites you've visited</div>);
            pages.push(<div id="DNSContainer">
                <header>DNS Queries</header>
                <div className="row">
                    <div className="col">
                        <Table
                            info={dnsQueries.slice(0,
                                (dnsQueries.length) / 2)}
                            type='listOfListsOne'
                            className="TableLeft"
                            maxRows={maxDnsRows / 2}/>
                    </div>
                    <div className="col">
                        <Table
                            info={dnsQueries.slice(
                                dnsQueries.length / 2,
                                dnsQueries.length)}
                            type='listOfListsOne'
                            className="TableRight"
                            maxRows={maxDnsRows / 2}/>
                    </div>
                </div>
            </div>);
            break;
        case PAGE.TRAFFIC:
            pages.push(<div className="continue-div">Your Internet Traffic</div>);
            pages.push(<div id="TrafficContainer">
                <header>Internet Traffic</header>
                {httpPresence[0] ?
                    <div>
                        <header className="tableTitle">
                            Unsecure Traffic
                        </header>
                        <Table info={httpPresence[1]}
                               type='listOfListsAllItems'
                               rotating={true}
                               maxRows={1}
                               highlightRows={httpPresence[2]}
                               widthDistribution={
                                   internetWidthDistribution}/>
                        <header id='SecureTrafficHeader'
                                className="tableTitle">
                            Secure Traffic
                        </header>
                        <Table info={httpPresence[3]}
                               type='listOfListsAllItems'
                               rotating={true}
                               maxRows={8}
                               highlightRows={httpPresence[4]}
                               widthDistribution={
                                   internetWidthDistribution}/>
                    </div> :
                    <Table info={data.Internet_Traffic}
                           type='listOfListsAllItems' rotating={true}
                           maxRows={10} widthDistribution={
                        internetWidthDistribution}/>}
            </div>);
            break;
        case PAGE.OPTOUT:
        default:
            break;
    }
    if (successLoadData) {
        return (<div style={{width: '100%'}}>
            <CPGLogoCorner/>
            <div>
                <HamburgerMenu setPage={(page) => setPage(page)}/>
            </div>
            <div>
                {pages}
            </div>
        </div>);
    } else {
        return (<Redirect to='/portal'/>)
    }


});

export default Mobile;
