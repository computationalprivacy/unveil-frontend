import React from 'react';
require('../../css/controller.css');

// <SetPosition onClick={() => {}} numPositions={6} position={2}/>
const SetPosition = (props) => {
    // const [selected, setSelected] = useState(props.position ? props.position : -1);

    const toggleOn = {
        backgroundColor: 'green'
    };

    function click(position) {
        props.onClick(position);
    }

    let buttons = [];
    for (let i = 0; i < props.numPositions; i++) {
        buttons.push(<button className="btn btn-primary mb-4" style={props.position === i ? toggleOn : {}} onClick={() => click(i)}/>);
    }

    return (
        <div className="select-position">
            <table>
                <tr>
                    Position:
                </tr>
            {buttons}
            </table>
        </div>
    );
};

export default SetPosition;
