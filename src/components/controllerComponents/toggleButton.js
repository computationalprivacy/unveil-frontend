import React from 'react';
require('../../css/controller.css');

const ToggleButton = (props) => {
    const toggleOn = {
        backgroundColor: 'green'
    };
    const toggleOff = {
        backgroundColor: 'red'
    };


    function click() {
        props.onClick(!props.toggle);
    }

    return (
        <button className="btn btn-primary mb-4" style={props.toggle ? toggleOn : toggleOff} onClick={() => click()}>{props.text}</button>
    );
};

export default ToggleButton;
