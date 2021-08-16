import React, {Component, useState, useEffect, useRef} from 'react';
import config from '../../config';
import PropTypes from 'prop-types';
import { createAxiosInstance } from './utils';

const urljoin = require('url-join');
require('../../css/controller.css');

const ToggleButton = (props) => {
    const toggleOn = {
        backgroundColor: "green"
    }
    const toggleOff = {
        backgroundColor: "red"
    }

    return(
        <button className="btn btn-lg btn-info m-1" style={props.testing ? toggleOn: toggleOff} onClick={props.onClick}>{props.text}</button>
    )
}

const SelectUser = (props) => {
    const [userlist, setUserList] = useState([])
    const session = useRef(props.session_id);
    session.current = props.session_id;

    const selectValue = (event) => {
        props.onSelect(event.target.value)
    }

    const fetchUserList = async() => {
        const url = urljoin(config.url, 'display/get-filters/',  String(session.current))
        let li = []
        try {
            const axios = createAxiosInstance(props.token);
            let res = await axios.get(url)
            res.data.filters.forEach(filter => li.push(filter.device_id))
        } catch (e) {
        }

        setUserList([props.defaultOption].concat(li))
    };

    useEffect(() => {

        (async() => await fetchUserList())();

        // Repeat fetch every ten seconds
        const interval = setInterval(fetchUserList, 5000);
        return () => clearInterval(interval);
    }, []);

    let options = []
    userlist.forEach(function (user) {
        options.push(<option value={props.slot}>{user}</option>);
    })

    return(
        <div>
            <label>Select Device Slot#:</label>
            <select className="select-user" id="screen#" value={props.value} onChange={selectValue}>
                {options}
            </select>
        </div>
    );
}

const DisplayUserTable = (props) => {
    let defaultSetting = {
        "device_id": "ID_something??",
        "show_device_info": false,
        "show_dns_queries": false,
        "show_secure_internet_traffic": false,
        "show_unsecure_internet_traffic": false,
        "differentiate_trackers": false,
        "show_device": false,
        "device_position": -1
    }

    const [state, updateState] = useState([]);
    const defaultSelect = "UNSELECTED";

    const findDeviceById = (deviceId) => {
        let copy = state.filter(obj => {
            return obj.device_id === deviceId;
        })
        if (copy.length > 0) {
            return copy[0]
        }
        return null;
    }

    const filterDeviceBySlot = (slot) => {
        return state.filter(obj => obj.device_position === slot);
    }

    const selectUser = async (slot, deviceid) => {
        await removeUserFromDisplay(slot);

        if (deviceid !== defaultSelect) {

            let device = findDeviceById(deviceid);
            if (device !== null) {
                device.device_position = slot;
                device.show_device = true;
                updateState([...state])

            } else {
                let newNode = {...defaultSetting, device_position: slot, show_device: true, device_id: deviceid};
                let copy = [...state];
                copy.push(newNode);
                updateState(copy);
            }
        }
    }


    const removeUserFromDisplay = async (slot) => {
        const copy = state.map(obj => {
            if (obj.device_position === slot) {
                obj.device_position = -1;
                obj.show_device = false;
            }
            return obj
        })
        updateState([...copy])
    }

    useEffect( () => {
        const url = urljoin(config.url, 'display/set-filters/', String(props.session_id))
        // const url = urljoin(config.url, 'display/set-filters/',  "5fbeedb83049f3002127cc27")
                try {
                    const axios = createAxiosInstance(props.token);
                    axios.post(url, state).then(
                        ()  => {
                    })
                } catch (e){
                    console.log(e)
                }
    }, [state])

    const toggleUser = async (slot, property) => {
        let devices = filterDeviceBySlot(slot)
        if (devices.length > 0) {
            let current = devices[0]
            current[property] = !current[property];
            updateState([...state]);
        }
    }

    function getState(slot, property) {
        let arr = filterDeviceBySlot(slot);
        if (arr.length > 0) {
            return arr[0][property];
        }
        return false;
    }

    const tab = []
    for (let i = 0; i < props.h; i++) {
        tab.push(<tr>
            <td><SelectUser session_id={props.session_id} defaultOption={defaultSelect} value={getState(i, "device_id")} onSelect={(id) => selectUser(i, id)}/></td>
            <td>
                <ToggleButton testing={getState(i, "show_device_info")} onClick={() => toggleUser(i, "show_device_info")} text="Toggle Device Info" />
            </td>
            <td>
                <ToggleButton testing={getState(i, "show_dns_queries")} onClick={() => toggleUser(i, "show_dns_queries")} text="Toggle DNS Query" />
            </td>
            <td>
                <ToggleButton testing={getState(i, "show_secure_internet_traffic")} onClick={() => toggleUser(i, "show_secure_internet_traffic")} text="Toggle Internet Traffic" />
            </td>
            <td>
                <ToggleButton testing={getState(i, "differentiate_trackers")} onClick={() => toggleUser(i, "differentiate_trackers")} text="Toggle Tracker Highlight" />
            </td>
        </tr>)
    }
    return (
        <table className="table table-bordered">
            <tbody>
            {tab}
            </tbody>
        </table>
    )
}

class DisplayController extends Component {
    constructor(props) {
        super(props);
        this.axiosInstance = createAxiosInstance(props.token);
    }

    render() {
        return (
            <div>
                <DisplayUserTable session_id={this.props.session_id} h="8"/>
            </div>
        );
    }
}

export default DisplayController;
