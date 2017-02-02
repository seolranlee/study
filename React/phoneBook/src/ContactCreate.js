import React, { Component } from 'react';

export default class ContactCreate extends React.Component {

	constructor(props){

		super(props);
		this.state = {
			name: '',
			phone: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	handleChange(e) {
 		let nextState = {};
 		nextState[e.target.name] = e.target.value;
 		this.setState(nextState);
 		// 이해안감

 	}

 	handleClick() {
 		const contact = {
 			name: this.state.name,
 			phone: this.state.phone,
 		};

 		this.props.onCreate(contact);

 		this.setState({
 			name: '',
 			phone: '',
 		});

 		// this.refs.myInput.focus();
 		this.nameInput.focus();
 	}

 	handleKeyPress(e) {
 		if(e.charCode == 13){	// 13은 enter란 뜻
 			this.handleClick();
 		}

 	}

	render(){
  
		return (

			<div>
				<h2>Create Contact</h2>
				<p>
					<input
						type="text"
						name="name"
						placeholder="name"
						value={this.state.name}
						onChange={this.handleChange}
						// ref="myInput"
						ref={(ref)=>{this.nameInput=ref}}
					/>
					<input
						type="text"
						name="phone"
						placeholder="phone"
						value={this.state.phone}
						onChange={this.handleChange}
						onKeyPress={this.handleKeyPress}
					/>

					<button onClick={this.handleClick}>Create</button>
				</p>
			</div>

		);
	}
}