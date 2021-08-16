import React, {useEffect, useState} from 'react';
import ToggleButton from './controllerComponents/toggleButton';
import SetPosition from './controllerComponents/setPosition';
import {createAxiosInstance} from './controllerComponents/utils';
import config from '../config';

const urljoin = require('url-join');

export default function ControllerRow(props) {
    const [device_id] = useState(props.device_id);
    const [show_device_info, setShow_device_info] = useState(props.show_device_info);
    const [show_dns_queries, setShow_dns_queries] = useState(props.show_dns_queries);
    const [show_secure_internet_traffic, setShow_secure_internet_traffic] = useState(props.show_secure_internet_traffic);
    const [differentiate_trackers, setDifferentiate_trackers] = useState(props.differentiate_trackers);
    const [show_device, setShow_device] = useState(props.show_device);
    const [device_position, setDevice_position] = useState(props.device_position);
    const [device_pin] = useState(props.device_pin);
    const [rating] = useState(props.rating);

    useEffect(() => {
        try {
            const url = urljoin(config.url, 'display/set-filters/', props.session);
            const axios = createAxiosInstance(props.token);
            axios.post(url,
                [ {'device_id': device_id,
                'show_device_info': show_device_info,
                'show_dns_queries': show_dns_queries,
                'show_secure_internet_traffic': show_secure_internet_traffic,
                'differentiate_trackers': differentiate_trackers,
                'show_device': show_device,
                'device_position': device_position,
                'device_pin': device_pin
                }
            ]
            );
        } catch (e) {
            console.log(e);
        }
        // eslint-disable-next-line
    }, [device_id, show_device_info, show_dns_queries, show_secure_internet_traffic, differentiate_trackers, show_device, device_position, device_pin]);


    return (<div>
        <table className="table">
            <tr>
                <td>
                    Device Pin: <br/> {device_pin}
                </td>
                <td>
                    <ToggleButton text="Show Device" toggle={show_device} onClick={(toggle) => {setShow_device(toggle);}}/>
                </td>
                <td>
                    Score: <br/>
                    {rating}
                </td>
                <td>

                </td>
                <td>
                    {show_device ? <SetPosition onClick={(pos) => {setDevice_position(pos);}} numPositions={6} position={device_position}/> : <div/>}
                </td>
            </tr>
            {show_device ?
                <tr>
                    <td>
                    </td>
                    <td>
                        <ToggleButton text="Toggle Device Info" toggle={show_device_info} onClick={(toggle) => {setShow_device_info(toggle);}}/>
                    </td>
                    <td>
                        <ToggleButton text="Toggle DNS Queries" toggle={show_dns_queries} onClick={(toggle) => {setShow_dns_queries(toggle);}}/>
                    </td>
                    <td>
                        <ToggleButton text="Toggle Internet Traffic" toggle={show_secure_internet_traffic} onClick={(toggle) => {setShow_secure_internet_traffic(toggle);}}/>
                    </td>
                    <td>
                        <ToggleButton text="Toggle Tracker Highlighting" toggle={differentiate_trackers} onClick={(toggle) => {setDifferentiate_trackers(toggle);}}/>
                    </td>
                </tr> : <div/>
            }
        </table>
    </div>);

}
