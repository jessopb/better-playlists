import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

let defaultStyle = {
  color: '#fff',
  backgroundColor: '#222'
}

let fakeServerData = {
  user: {
    name: 'Jessop',
    playlists: [
    {
      name: 'My favs',
      songs: [
        {name: 'Undertow', duration: 1234},
        {name: 'Aenima', duration: 2345},
        {name: 'Lateralus', duration: 2345},
        {name: 'Disgustipated', duration: 2345}]
    },
    {
      name: 'Comedy',
      songs: [
        {name: 'Beyond the Pale', duration: 2345},
        {name: 'On a boat', duration: 2345},
        {name: 'Turtlenecks', duration: 2345},
        {name: 'Boot to the Head', duration: 373}]
    },
    {
      name: 'My favs',
      songs: [
        {name: 'Undertow', duration: 1234},
        {name: 'Aenima', duration: 2345},
        {name: 'Lateralus', duration: 2345},
        {name: 'Disgustipated', duration: 2345}]
    },
    {
      name: 'My favs',
      songs: [
        {name: 'Undertow', duration: 1234},
        {name: 'Aenima', duration: 2345},
        {name: 'Lateralus', duration: 2345},
        {name: 'Disgustipated', duration: 2345}]
    },
  ]

  }
}
class PlaylistCounter extends Component {
  render() {
    return (
      <div style={{...defaultStyle, width: "40%", display: 'inline-block'}}>
        <h2>{this.props.playlists.length} Playlists</h2>
      </div>
    )
  }
}

class HoursCounter extends Component {
  render() {
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {return songs.concat(eachPlaylist.songs)
    },[])
    let totalDuration = allSongs.reduce((sum, eachSong)=>{ return sum + eachSong.duration }, 0)
    return (
      <div style={{...defaultStyle, width: "40%", display: 'inline-block'}}>
        <h2>{Math.round(totalDuration/3600)} Hours</h2>
      </div>
    )
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={{defaultStyle}}>
        <img/>
        <input type="text"/>
        Filter
      </div>
    )
  }
}

class Playlist extends Component {
  render() {
    return (
      <div style={{...defaultStyle, display: 'inline-block', width: "25%"}}>
        <img />
        <h3>Playlist Name</h3>
        <ul>
          <li>Song 1</li><li>Song 2</li><li>Song 3</li>
        </ul>

      </div>
    )
  }
}

class App extends Component {
  constructor() {
    super()
    this.state = {serverData: {}}
  }
  componentDidMount() {
    setTimeout(  () =>{
      this.setState({serverData: fakeServerData})
    }, 1000)
  }
  render() {

    return (
      <div className="App">

        {this.state.serverData.user ?
        <div>
          <h1 style={{...defaultStyle, 'font-size': '54px'}}>
            {this.state.serverData.user.name}'s playlist
          </h1>
          <PlaylistCounter playlists={this.state.serverData.user.playlists}/>
          <HoursCounter playlists={this.state.serverData.user.playlists}/>
          <Filter/>
          <Playlist/>
          <Playlist/>
          <Playlist/>
          <Playlist/>
        </div> : <h1> LOADING... </h1>
      }
      </div>
    );
  }
}

export default App;
