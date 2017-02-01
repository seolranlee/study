import React from 'react';
 // es6의 문법
 // var React = require('react');


class App extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			name: ''
		};
	}
	render(){

		return (
			<div>
				<button onClick={()=>{this.setState({name:'velopert'})}}>Click Me</button>
				<h1>wow {this.state.name}</h1>
			</div>
			);
	}
}
 
 export default App;
 // es6의 문법
 // module.export = App;