import React, { Component } from 'react';
import { TempleWallet } from "@temple-wallet/dapp";
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.wallet = null;
    this.tezos = null;
    this.shopping=null;
  }
  state = {
    Name : "",
    Address : "",
    Item :"",
    weight : 0,
    transactionInitiated : false,
    transactionCompleted : false
  }
  
  updateState = (data,field) => {
    if(field === "Name")
    {
      this.setState({Name : data})
    }
    else if(field === "Address")
    {
      this.setState({Address : data})
    }
    else if(field === "Item")
    {
      this.setState({Item : data})
    }
    else if(field === "weight")
    {
      
      this.setState({weight : parseInt(data,10)})
    }

  }
  componentDidMount() 
  {
    this.checkWalletConfigurable();
  }
  checkWalletConfigurable = async() => {
    try 
    {
      await TempleWallet.isAvailable();
      this.wallet = new TempleWallet("Delivery Dapp");
      await this.wallet.connect("carthagenet");
      this.tezos = this.wallet.toTezos();
      this.shopping = await this.tezos.wallet.at("KT1JfYspxPfCaxLsuG4Zr7vMteBWxaELzsT5");
    }
    catch(e)
    {
      console.log(e , 'Error');
    }
  }
  sendDataToContract = async() => {
    this.setState({transactionInitiated : true})
    const operation = await this.shopping.methods.purchase(this.state.Name , this.state.Address,this.state.Item,this.state.weight).send();
    await operation.confirmation();
    this.setState({transactionCompleted : true})
  }
  render() {
    return (
      <div className="App">
        <h1>Delivery Something Now</h1>
        <input type="text" placeholder="Your Name" onChange={(event) => {this.updateState(event.target.value , "Name")}}/>
        <input type="text" placeholder="Your Address" onChange={(event) => {this.updateState(event.target.value , "Address")}}/>
        <input type="text" placeholder="Item" onChange={(event) => {this.updateState(event.target.value , "Item")}}/>
        <input type="number" placeholder="Weight" onChange={(event) => {this.updateState(event.target.value , "weight")}}/>
        <p>{this.state.transactionInitiated === true && this.state.transactionCompleted === false ? "Transaction started awaiting confirmation" : null}</p>
        <p>{this.state.transactionInitiated === true && this.state.transactionCompleted === true ? "Transaction Successfull" : null}</p>
        <button onClick={() => this.sendDataToContract()}>Send Data</button>
      </div>
    );
  }
}

export default App;