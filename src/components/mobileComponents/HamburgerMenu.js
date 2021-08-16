import React from 'react';

export const PAGE = {
    NONE: 'none',
    DEVICE: 'device',
    WEBSITE: 'website',
    TRAFFIC: 'traffic',
    OPTOUT: 'opt-out'
}

const navigations = [
    {
        name: "Your Device Info",
        page: PAGE.DEVICE
    },
    {
        name: "Websites You've Visited",
        page: PAGE.WEBSITE
    },
    {
        name: "Your Internet Traffic",
        page: PAGE.TRAFFIC
    },
    {
        name: "Opt out",
        page: PAGE.OPTOUT
    }
];

export class HamburgerMenu extends React.Component {
    constructor(props) {
        super(props);
        require('../../css/mobile.css');
        this.state = {
            isOpen: false,
        };
    }

    componentDidMount(){
    }

    componentWillUnmount(){
    }

    NavigationButton(route){
        require('../../css/mobile.css');
        return(
            <button onClick={() => {this.toggleMenu(); this.props.setPage(route.page);}}>BTN {route.name}</button>
        )
    }

    render() {
        require('../../css/mobile.css');
        let menu = [];
        if (this.state.isOpen) {
            for (let i = 0; i < navigations.length; i++) {
                menu.push(this.NavigationButton(navigations[i]));
            }
        }


        return (<div>
            <div onClick={() => this.toggleMenu()}>
                <svg className="burger-menu" viewBox="0 0 100 80" width="40" height="40">
                    <rect width="100" height="12"></rect>
                    <rect y="30" width="100" height="12"></rect>
                    <rect y="60" width="100" height="12"></rect>
                </svg>
            </div>
                {this.state.isOpen &&
                <div className="vertical-menu">
                    <button onClick={() => {this.toggleMenu(); this.props.setPage(navigations[0].page);}}>{navigations[0].name}</button>
                    <button onClick={() => {this.toggleMenu(); this.props.setPage(navigations[1].page);}}>{navigations[1].name}</button>
                    <button onClick={() => {this.toggleMenu(); this.props.setPage(navigations[2].page);}}>{navigations[2].name}</button>
                    <button onClick={() => {this.toggleMenu(); this.props.setPage(navigations[3].page);}}>{navigations[3].name}</button>
                </div>

                }
        </div>);
    }

    toggleMenu() {
        this.setState({isOpen: !this.state.isOpen});
    }
}

export default HamburgerMenu;