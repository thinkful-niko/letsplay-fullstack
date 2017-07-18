import React, { Component } from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router';

class Game extends Component {
  //bind the function to *this*
  constructor() {
    super();
    this.state = {
      active: false
    };
  }

  handleClick = () => {
    this.props.gameClicked(this.props.id);
    console.log(this.props.id);
  }

  activeGame = () => {
    const currentState = this.state.active;
    this.setState({active: !currentState});
  }

  render() {
    let result = null;
    if (this.state.active === false) {
      result =  <div className="game-wrapper" onClick={this.activeGame}>
                  { this.props.cover ? 
                    <img className="box-art" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${this.props.cover.cloudinary_id}.jpg`} alt='gamebox art' />
                    :
                    <div>No Image Provided</div>
                  }
                    <p>{this.props.name}<span>{'\u2795'}</span></p>
                </div>;
    } else {
        result =  <div onClick={this.activeGame}>
                    <p>{this.props.name}<span>{'\u2796'}</span></p>
                    { this.props.cover ? 
                      <img className="box-art-big" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${this.props.cover.cloudinary_id}.jpg`} alt='gamebox art' />
                      :
                      <div>No Image Provided</div>
                    }
                    <p>Year: <Moment format="YYYY">{this.props.first_release_date}</Moment></p>
                    <p>Rating: {this.props.rating}</p>
                    <p className='summary'>{this.props.summary ? this.props.summary : this.props.storyline || 'This game has no summary'}</p>
                    <button className="add-delete-button" onClick={this.handleClick}>{this.props.buttonText}</button>
                  </div>;
    }

    return (
      <div className="game" >
        {result}
      </div>
    );
  }
}

export default Game;