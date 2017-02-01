class ContactInfo extends React.Component{

	render(){

		return(
			<div>{this.props.name}, {this.props.phone}</div>
		);
	}
}

class Contact extends React.Component{

	render(){

		return(
			<div>
				{contactData.contactList.map(function(aa,bb){
					return <ContactInfo name={aa.name} phone={aa.phone} />
				})}
			</div>

		);
	}
}

class App extends React.Component{

	render(){
		return(
			<Contact />
		);
	}
};

ReactDOM.render(<App />,document.getElementById('root'));