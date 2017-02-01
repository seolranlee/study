class Codelab extends React.Component{

	render(){
		return(

			<div>
				<h1>Hello {this.props.name}</h1>
				<h2>{this.props.number}</h2>
				<div>{this.props.children}</div>
			</div>
		);
	}
};

Codelab.propTypes={
	name : React.PropTypes.string,
	number : React.PropTypes.any.isRequired
}

Codelab.defaultProps={
	name:'Unknow',
}

class App extends React.Component{

	render(){
		return(

			<Codelab name={this.props.name} number={this.props.number}>{this.props.children}{this.props.value}</Codelab>
		);
	}
};

App.defaultProps={
	value:0
}

ReactDOM.render(<App number={5}>사이에 있는 값이 들어간다.</App>,document.getElementById('root'));