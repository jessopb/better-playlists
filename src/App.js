import React, { Component } from 'react';
import queryString from 'query-string';
import logo from './logo.svg';
import './App.css';

let defaultStyle = {
  color: '#fff',
  backgroundColor: '#222'
}
/*
let fakeServerData = {
  user: {
    name: 'Jessop',
    playlists: [
      {
        name: 'Tool',
        songs: [
          {name: 'Undertow', duration: 1234},
          {name: 'Aenima', duration: 2345},
          {name: 'Lateralus', duration: 2345},
          {name: 'Disgustipated', duration: 2345}]
      },
    ]
  }
}
*/
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

    let allSongs = this.props.playlists
      .reduce((songs, eachPlaylist) => {
        return songs.concat(eachPlaylist.songs)
      },[])

    let totalDuration = allSongs
      .reduce((sum, eachSong)=>{
        return sum + eachSong.duration
      }, 0)

    return (
      <div style={{...defaultStyle, width: "40%", display: 'inline-block'}}>
        {(Math.round(totalDuration/3600) < 1)
          ? <h2>{Math.round(totalDuration/60)} Minutes</h2>
          : <h2>{Math.round(totalDuration/3600)} Hours</h2>
        }
      </div>
    )
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={defaultStyle}>
        <img/>
        <label>Filter </label>
        <input type="text" onKeyUp={e =>
          this.props.onTextChange(e.target.value)}/>
      </div>
    )
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist
    return (
      <div style={{...defaultStyle, display: 'inline-block', width: "25%"}}>
        <img src={playlist.imageUrl} style={{width: '160px'}}/>
        <h3>{playlist.name}</h3>
        <ul>
          {playlist.songs
            .map(song => <li>{song.name}</li>)}
        </ul>
      </div>
    )
  }
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      serverData: {},
      filterString: ''
    }
  }

  componentDidMount() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;

    if (!accessToken) return;

    fetch('https://api.spotify.com/v1/me', {
        headers: {'Authorization': 'Bearer ' + accessToken}
      }).then((response)=> response.json())
        .then( data => this.setState( {
          user: {
            name: data.display_name
          }
    }))

    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {'Authorization': 'Bearer ' + accessToken}})
      .then((response)=> response.json())
      .then(playlistData => {
        let playlists = playlistData.items
        let trackDataPromises = playlists.map(playlist => {
          let responsePromise = fetch(playlist.tracks.href, {
            headers: {'Authorization': 'Bearer ' + accessToken}
          })

          let trackDataPromise = responsePromise
            .then(response => response.json())
          return trackDataPromise
        })
        let allTracksDataPromises =
          Promise.all(trackDataPromises)
        let playlistsPromise = allTracksDataPromises
          .then(trackDatas => {
            trackDatas.forEach((trackData, i) => {
              playlists[i].trackDatas = trackData.items
                .map(item => item.track)
                .map(trackData => ({
                  name: trackData.name,
                  duration: trackData.duration_ms / 1000
                }))
          })
          return playlists
        })
        return playlistsPromise
      })
      .then( data => {
        this.setState({
          playlists: data.map(item =>
              ({name: item.name,
                imageUrl: item.images[0].url,
              songs: item.trackDatas.slice(0,3)
              })
          )
        })
      })
  }
  render() {
    let playlistToRender =
      this.state.user &&
      this.state.playlists
        ?
        this.state.playlists
          .filter(playlist => {
            let matchesPlaylist =  playlist.name
              .toLowerCase()
              .includes(
                this.state.filterString.toLowerCase())
            let matchesSong = playlist.songs.filter(song =>
              song.name.toLowerCase().includes(this.state.filterString.toLowerCase())

            )
            return matchesPlaylist || matchesSong.length > 0
            })
        : []
      return (
        <div className="App">
          { this.state.user ?
          <div>
            <h1 style={{...defaultStyle, 'font-size': '54px'}}>
              {this.state.user.name}'s playlist
            </h1>

            <PlaylistCounter playlists={playlistToRender}/>
            <HoursCounter playlists={playlistToRender}/>
            <Filter onTextChange={text => this.setState({filterString: text})}/>
            {playlistToRender
              .map(playlist =>
                <Playlist playlist={playlist}/>
            )}

          </div> :
          <button
            onClick={()=>window.location='http://localhost:8888/login'}
            style={{padding: '20px', 'font-size': '50px', 'margin-top': '20px'}}>Sign in with Spotify</button>
          }
        </div>
      );
  }
}

export default App;
