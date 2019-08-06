import React, { Component } from 'react';
import {
  observer,
  inject
} from 'mobx-react'

import PropTypes from 'prop-types'
// import AppState from '../../app'
// @inject ('appState') @observer

export default class TopicList extends Component{

  render() {
    return (
      <div>
        This is TopicList
      </div>
    )
  }

}

// TopicList.PropTypes = {
//   appState: PropTypes.instanceOf(AppState).isRequired,
// }