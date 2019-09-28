import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<Starter />, root);
}


function Tile(props) {
	if (!props.flipped) {
		return <button className="tile" onClick={() => props.onClick(this, props.row, props.col, props.tileletter)}></button>
	}
	else {
		return <button className="tile">{props.tileletter}</button>
	}
}


class Starter extends React.Component {

  constructor(props) {
    super(props);
 
    let grid = this.initiateBoard();

    this.state = { tiles: grid, 
	    clicks: 0, 
	    first: "", 
	    second: "",
		firstRow: 0,
	    firstCol: 0,
	    secondRow: 0,
	    secondCol: 0};
  }

  initiateBoard() {
	
	let allLetters = ["a", "a", "b", "b", "c", "c", "d", "d", 
					 "e", "e", "f", "f", "g", "g", "h", "h"]; 
	let grid = []; 

	for (let row = 0; row < 4; row++) {
		grid[row] = [];
		for (let col = 0; col < 4; col++) {
			let letter = _.sample(allLetters); 
			allLetters.splice(allLetters.indexOf(letter), 1);
			grid[row].push(<Tile onClick={() => this.tileClick(row, col, letter)} 
				row={row} col={col} flipped={false} tileletter={letter}/>); 
		}
	}
	
	return grid;
  }

  revertClicked() {
	this.setState({first : "", 
				second : "", 
				firstRow : 0, 
				firstCol : 0, 

				secondRow : 0, 
				secondCol : 0});
  }

  restart() {
	this.setState({tiles : this.initiateBoard(), clicks : 0});
	this.revertClicked();
  }
 
  tileClick(row, col, letter) {
	this.setState({clicks : this.state.clicks + 1});	
	let curGrid = this.state.tiles.slice();

	if (this.state.first === "") { 	
		curGrid[row][col] = <Tile onClick={() => this.tileClick(row, col, letter)}
					row={row} col={col} flipped={true} tileletter={letter}/>;

		this.setState({first: letter, firstRow : row, firstCol : col, tiles : curGrid});
		
	} else  { 
		curGrid[row][col] = <Tile onClick={() => this.tileClick(row, col, letter)}
					row={row} col={col} flipped={true} tileletter={letter}/>;
		
		this.setState({sec : letter, secondRow : row, secondCol : col, tiles : curGrid});
		this.isMatch(letter, row, col);
	}
  }
	
  isMatch(letter, row, col){
		
	let grid = this.state.tiles.slice();
 
	let first = this.state.first;
	let firstRow = this.state.firstRow;
	let firstCol = this.state.firstCol;

	if (first === letter) {
		this.revertClicked();
	} 
	  else { 
		setTimeout(() => {
			grid[firstRow][firstCol] = <Tile onClick={() => this.tileClick(firstRow, firstCol, first)}
				row={firstRow} col={firstCol} flipped={false} tileletter={first}/>;
	
			grid[row][col] = <Tile onClick={() => this.tileClick(row, col, letter)}
				row={row} col={col} flipped={false} tileletter={letter}/>;
			
			this.setState({tiles : grid});
	     		}, 600);
		  this.setState({tiles : grid});
		  this.revertClicked();		
	}
  }



  render() {
	
	let grid = this.state.tiles.slice();
	let restartButton = <button className="restart" onClick={() =>this.restart()}> Restart</button>;

	return (  
		<div>
    	  	  <h1 align="center"> Memory Game </h1>
	  	 
	 	  <div className="row">
	    	  <div className="column"> {grid[0][0]} </div>
	    	  <div className="column"> {grid[0][1]} </div>
	    	  <div className="column"> {grid[0][2]} </div>
	   	  	  <div className="column"> {grid[0][3]} </div>

	  	  </div>
	  	  <div className="row">
	    	  <div className="column"> {grid[1][0]} </div>
	    	  <div className="column"> {grid[1][1]} </div>
	    	  <div className="column"> {grid[1][2]} </div>
	    	  <div className="column"> {grid[1][3]} </div>
	  	  </div>
	  	  <div className="row">
	    	  <div className="column"> {grid[2][0]} </div>
	    	  <div className="column"> {grid[2][1]} </div>
	    	  <div className="column"> {grid[2][2]} </div>
	    	  <div className="column"> {grid[2][3]} </div>
	  	  </div>
	  	  <div className="row">
	   	      <div className="column"> {grid[3][0]} </div>
	    	  <div className="column"> {grid[3][1]} </div>
	    	  <div className="column"> {grid[3][2]} </div>
	    	  <div className="column"> {grid[3][3]} </div>
	  	  </div>
			<div className="column">Clicks used: {this.state.clicks}</div>
			<div className="restart">{restartButton}</div>

		</div>
	);
  }
}
  
