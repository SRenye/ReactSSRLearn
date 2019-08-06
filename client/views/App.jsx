import React from 'react'
import Routes from '../config/router.jsx'
import {
  Link 
} from 'react-router-dom'
export default class App extends React.Component{

  componentDidMount() {
    // do something 
  }
  render() {
    return [
      <div>
        <Link to="/">首页</Link>
        <br/>
        <Link to="/detail">详情页</Link>
        <br/>
        <Link to='/list'></Link>
      </div>,
      <Routes/>
    ]
  }
}

