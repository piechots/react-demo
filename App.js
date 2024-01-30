import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import {doc, addDoc, collection, deleteDoc, getDocs, getFirestore} from 'firebase/firestore/lite';
import {app} from './firebase';

class App extends Component {

  constructor(props) {
    super(props);
    this.state={
      teams:[]
    }
  }

  async refreshTeams(){
    var teamsList=[];
    const db=getFirestore(app);
    const teamsCol = collection(db,'teams');
    const teamsSnapshot=await getDocs(teamsCol);

    teamsSnapshot.forEach(doc=>{
      let team=doc.data();
      team.id=doc.id;
      teamsList.push(team);
    });

    this.setState({teams:teamsList});
  }

  componentDidMount(){
    this.refreshTeams();
  }

  async addClick(){
    var newTeams = document.getElementById("newTeams").value;
    var newTeamsObject = {description:newTeams};
    const db=getFirestore(app);
    const teamsCol = collection(db,'teams');
    await addDoc(teamsCol,newTeamsObject);
    this.refreshTeams();

  }

  async deleteClick(id){
    const db=getFirestore(app);
    const teamsRef = doc(db,'teams/'+id);

    await deleteDoc(teamsRef);
    this.refreshTeams();

  }

  render(){
    const {teams}=this.state;

  return (
    <div className="App">
      <h2>NFL Basics App</h2>
      <input id="newTeams"/>&nbsp;
      <button onClick={()=>this.addClick()}>Add Teams</button>
        {teams.map(team=>
        <p>
        <b>* {team.description}</b>&nbsp;
        <button onClick={()=>this.deleteClick(team.id)}>Delete Team</button>
        </p>
        )}
    </div>
  );
  }
}

export default App;
