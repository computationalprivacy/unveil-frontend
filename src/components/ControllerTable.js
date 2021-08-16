import React, {useEffect, useRef, useState} from 'react';
import config from '../config.js';
import {createAxiosInstance} from './controllerComponents/utils.js';
import ControllerRow from './ControllerRow.js';

const urljoin = require('url-join');

export default function ControllerTable(props) {
    const session = useRef(props.session_id);
    session.current = props.session_id;
    const [devices, setDevices] = useState([]);
    const fetchUserList = async() => {
        try {
            const url = urljoin(config.url, 'display/get-filters/', String(session.current));
            const axios = createAxiosInstance(props.token);
            let res = await axios.get(url);
            if (res.data.filters) {
                setDevices(res.data.filters);
            }
        } catch (e) {
            console.log(e);
        }
    };


    useEffect(() => {
        (async() => {
            await fetchUserList();

            // Repeat fetch every ten seconds
            const interval = setInterval(fetchUserList, 10000);
            return () => clearInterval(interval);
        })();
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            {devices.map(el => (<ControllerRow session={session.current} token={props.token} key={el.device_id} {...el}></ControllerRow>))}
        </div>);

}
