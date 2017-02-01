class Counter extends React.Component{

	// state를 사용할 때는 초기값 설정이 필수이다.
	constructor(props){
		super(props);
		this.state={
			value:0
		};
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(){
		this.setState({
			value : this.state.value+1
		});
		// this.state.value=this.state.value+1;
		// this.forceUpdate();
	}

	render(){
		return(

			<div>
				<h2>{this.state.value}</h2>
				<button onClick={this.handleClick}>Press Me</button>
			</div>
		);
	}
};


class App extends React.Component{

	render(){
		return(
			<Counter />
		);
	}
};

ReactDOM.render(<App />,document.getElementById('root'));