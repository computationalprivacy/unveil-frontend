import React from 'react';
import LoginForm from './LoginForm';
import {withRouter} from 'react-router-dom';
import CPGLogoCorner from './mobileComponents/CPGLogoCorner';
import config from '../config';
import axios from 'axios';

const urljoin = require('url-join');

class Mobile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            failedLogin: false
        };
    }

    loginToPage(token) {
        this.props.history.push('/mobile', token);
    }

    onSubmit(data) {
        const fetch_login_url = urljoin(
            config.url, 'access/login/');
        console.log('Data present');
        console.log(fetch_login_url);
        console.log(data);
        axios.post(fetch_login_url, data).then(
            res => {
                console.log(res);
                this.loginToPage(res.data.token); // TODO: Verify this works
            }
        ).catch(
            err => {
                this.setState({
                    failedLogin: true
                });
            }
        );
    }


    componentDidMount(){
    }

    componentWillUnmount(){
    }

    render() {
        require('../css/responsive.css');
        require('../css/mobile.css');

        return <div style={{width: '100%'}}>
            <CPGLogoCorner/>
                <LoginForm onSubmit={(data) => this.onSubmit(data)}/>
            {this.state.failedLogin ? <div className="failed-login">Login failed, please make sure you have registered</div> : ''}
        </div>;
    }

}

export default withRouter(Mobile);
