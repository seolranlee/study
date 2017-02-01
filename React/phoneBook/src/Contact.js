import React, { Component } from 'react';
import ContactInfo from './ContactInfo'
import ContactDetails from './ContactDetails'
import ContactCreate from './ContactCreate'

import update from 'react-addons-update'

 export default class Contact extends React.Component {

 	constructor(props){
 		super(props);
 		this.state = {
 			selectedID : -1,
 			selectedKey : -1,
 			keyword: '',
 			contactData: [
 				{ name: 'Abet', phone: '010-0000-0001', id: 1 },
 				{ name: 'Betty', phone: '010-0000-0002', id: 2 },
 				{ name: 'Charlie', phone: '010-0000-0003', id: 3 },
 				{ name: 'David', phone: '010-0000-0004', id: 4 },
 			],

 		}
 		this.handleChange = this.handleChange.bind(this);
 		this.handleClick = this.handleClick.bind(this);
 		this.handleCreate = this.handleCreate.bind(this);
 		this.handleRemove = this.handleRemove.bind(this);
 		this.handleEdit = this.handleEdit.bind(this);
 	}

 	handleChange(e) {
 		this.setState({
 			keyword : e.target.value
 		})

 	}

 	handleClick(contact, key){

 		for(var i = 0; i<this.state.contactData.length; i++){
 			if( this.state.contactData[i].id == contact.id ){
 				this.setState({
 					selectedKey: i
 				})
 			}
 		}

 		this.setState({
 			selectedID : contact.id
 		});

 		console.log(this.state.selectedKey)
 	}

 	handleCreate(contact){
 		this.setState({
 			contactData: update(this.state.contactData, { $push: [contact] } )
 		});
 	}

 	handleRemove(){
 		if(this.state.selectedKey < 0){
 			return;
 		}
 		this.setState({
 			contactData: update(this.state.contactData,
 				{ $splice: [[this.state.selectedKey, 1]] }
 			),
 			selectedKey: -1
 		})
 	}

 	handleEdit(name, phone){
 		this.setState({
 			contactData: update(this.state.contactData, 
 				{
 					[this.state.selectedKey] : {
 						name: { $set: name },
 						phone: { $set: phone }
 					}

 				}
 			)
 		})
 	}

 	render(){

 		const mapToComponents = (data) => {
 			data.sort();
 			data = data.filter(

 				(contact) => {
 					return contact.name.toLowerCase().indexOf(this.state.keyword) > -1;
 				}
 			);
 			return data.map((contact, i)=>{
 				return (<ContactInfo
 							contact={contact}
 							key={i}
 							onClick={()=>this.handleClick(contact, i)}
 						/>);
 			});
 		}

 		return (

 			<div>
 				<h1>Contacts</h1>
 				<input
 					name="keyword"
 					placeholder="Search"
 					value={this.state.keyword}
 					onChange={this.handleChange}
 				/>
 				<div>{mapToComponents(this.state.contactData)}</div>
 				<ContactDetails
 					isSelected={this.state.selectedID != -1}
 					contact={this.state.contactData[this.state.selectedKey]}
 					onRemove={this.handleRemove}
 					onEdit={this.handleEdit}
 				/>
 				<ContactCreate 
 					onCreate={this.handleCreate}
 				/>
 			</div>
 		);
 	}
 }