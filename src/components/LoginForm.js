import React from 'react';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            passcode: ''
        };

        this.updatePasscode = this.updatePasscode.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    updatePasscode(event) {
        this.setState({passcode: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.onSubmit({
            user_pin: this.state.passcode
        })
    }

    render() {
        return (
            <div style={{width: "100%"}}>
                <div className="login-form" >
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Passcode:
                        </label>
                        <input type="text" value={this.state.passcode} onChange={this.updatePasscode} />
                        <div/>
                        <input type="submit" value="Sign in" />
                    </form>
                </div>
            </div>
        );
    }
}

export default LoginForm