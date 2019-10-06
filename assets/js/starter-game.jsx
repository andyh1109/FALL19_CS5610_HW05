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
	
	let tileList = [];
	for (let i = 0; i < 16; i++) {
		tileList[i] = new Array(5);
	}
	
		this.state = {
		  tiles: tileList,
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
	

	  restartGame() {
		   this.channel.push("new", {})
		 .receive("ok", resp => {console.log("new", resp.game);
								  this.setState(resp.game);});
	  }
	
		  render() {
		  let tileList = this.state.tiles.map((rowData, rowIndex) => 
		  <tr key={rowIndex} >
			  {
				  rowData.map((tile, i) => <td key={i} onClick={() => this.tileClick(tile)}>
					<div className = "column"> 
					</div>

				  </td>)
			  }
		  </tr>);

		  return tileList;
	  }
	}
	
	function Tile(props) {
		if (props.hidden) {
			return <button className="tile" onClick={() => props.onClick(this, props.index)}></button>
		}
		else {
			return <button className="tile">{props.letter}</button>
		}
	}
  
