import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root, channel) {
  ReactDOM.render(<Starter channel = {channel}/>, root);
}


class Starter extends React.Component {

	constructor(props) {
		super(props);
	
		this.channel = props.channel;
	
	var mat = [];
	for (var i = 0; i < 16; i++) {
		mat[i] = new Array(5);
	}
	
		this.state = {
		  tiles: mat,
			clicks: 0,
			first: [],
			second: [],
		};
	
		this.channel
		.join()
		.receive("ok", resp=> {
		  console.log("Joined successfully", resp.game);
		  this.setState(resp.game);
		})
		.receive("error", resp => { console.log("Unable to join", resp); });
	  }
	
	  tileClick(index) {
		let tile = this.state.tiles[index];
	
		this.channel.push("click", {tile: tile})
		  .receive("ok", resp => {console.log("click", resp.game);
								  this.setState(resp.game);
								});
	  }
	
	  checkMatch(){
		if (this.state.first[0] == this.state.second[0]) {
		  this.channel.push("reset_click", {})
								  .receive("ok", resp => {console.log("match, reset_clicked", resp.game);
														  this.setState(resp.game);
														});
		} else {
		setTimeout(() => {this.channel.push("not_match", {})
								  .receive("ok", resp => {console.log("not a match", resp.game);
														  this.setState(resp.game);
														});}, 800); 
	 }
		}
	
	  // sets the game back to a starting state with a new set of random tiles
	  restartGame() {
		   this.channel.push("new", {})
		 .receive("ok", resp => {console.log("new", resp.game);
								  this.setState(resp.game);});
	  }
	
	  render() {
	
	 let tiles = this.state.tiles;
	
	 let restartbutton = <button className="restart" onClick={this.restartGame.bind(this)}> Restart Game </button>;
	
	
	
	 let first_letter = this.state.first[0];
	 let sec_letter =  this.state.second[0];
	
	 if (first_letter != null && sec_letter != null) {
		this.checkMatch();
	 }
	
	return (
			<div>
					<h1> Memory Matching </h1>
		  <div className="row">
				  <div className="column">Clicks: {this.state.clicks}</div>
				  <div className="column">{restartbutton}</div>
				</div>
			   <div className="row">
				  <div className="column"> {<Tile hidden={tiles[0][3]}
											  letter={tiles[0][0]} 
			   onClick={this.tileClick.bind(this, tiles[0][4])} />} </div>
				  <div className="column"> {<Tile hidden={tiles[1][3]}
											  letter={tiles[1][0]}
			   onClick={this.tileClick.bind(this, tiles[1][4])} />} </div>
				  <div className="column"> {<Tile hidden={tiles[2][3]}
											  letter={tiles[2][0]}
			   onClick={this.tileClick.bind(this, tiles[2][4])} />} </div>
				 <div className="column"> {<Tile hidden={tiles[3][3]}
											letter={tiles[3][0]}
			 onClick={this.tileClick.bind(this, tiles[3][4])} />} </div>
			  </div>
				<div className="row">
				  <div className="column"> {<Tile hidden={tiles[4][3]}
											  letter={tiles[4][0]}
			   onClick={this.tileClick.bind(this, tiles[4][4])} />} </div>
				  <div className="column"> {<Tile hidden={tiles[5][3]}
											  letter={tiles[5][0]}
			   onClick={this.tileClick.bind(this, tiles[5][4])} />} </div>
				  <div className="column"> {<Tile hidden={tiles[6][3]}
											  letter={tiles[6][0]}
			   onClick={this.tileClick.bind(this, tiles[6][4])} />} </div>
				  <div className="column"> {<Tile hidden={tiles[7][3]}
											  letter={tiles[7][0]}
			   onClick={this.tileClick.bind(this, tiles[7][4])} />} </div>
			  </div>
				<div className="row">
				  <div className="column"> {<Tile hidden={tiles[8][3]}
											  letter={tiles[8][0]}
			   onClick={this.tileClick.bind(this, tiles[8][4])} />} </div>
				  <div className="column"> {<Tile hidden={tiles[9][3]}
											  letter={tiles[9][0]}
			   onClick={this.tileClick.bind(this, tiles[9][4])} />} </div>
				  <div className="column"> {<Tile hidden={tiles[10][3]}
											  letter={tiles[10][0]}
			   onClick={this.tileClick.bind(this, tiles[10][4])} />} </div>
				  <div className="column"> {<Tile hidden={tiles[11][3]}
											  letter={tiles[11][0]}
			   onClick={this.tileClick.bind(this, tiles[11][4])} />} </div>
			  </div>
				<div className="row">
				 <div className="column"> {<Tile hidden={tiles[12][3] }
											letter={tiles[12][0] }
			 onClick={this.tileClick.bind(this, tiles[12][4])} />} </div>
				  <div className="column"> {<Tile hidden={tiles[13][3]}
											  letter={tiles[13][0]}
			   onClick={this.tileClick.bind(this, tiles[13][4])} />} </div>
				  <div className="column"> {<Tile hidden={tiles[14][3]}
											  letter={tiles[14][0]}
			   onClick={this.tileClick.bind(this, tiles[14][4])} />} </div>
				  <div className="column"> {<Tile hidden={tiles[15][3]}
											  letter={tiles[15][0]}
			   onClick={this.tileClick.bind(this, tiles[15][4])} />} </div>
			  </div>
			</div>
		);
	  
	  }
	}
	
	function Tile(props) {
		if (props.hidden) {
			return <button className="tile" onClick={() => props.onClick(this, props.index)}>???</button>
		}
		else {
			return <button className="tile">{props.letter}</button>
		}
	}
  
