import React from 'react'
import PropTypes from 'prop-types'

import PageModel from 'endpoints/models/PageModel'
import CategoriesTable from './CategoriesTable'
import LOCATIONS_ENDPOINT from 'endpoints/location'
import withFetcher from 'endpoints/withFetcher'

import style from './TitledCategoriesTable.css'

class TitledCategoriesTable extends React.Component {
  static propTypes = {
    parentPage: PropTypes.instanceOf(PageModel).isRequired,
    pages: PropTypes.arrayOf(PropTypes.shape({
      page: PropTypes.instanceOf(PageModel).isRequired,
      url: PropTypes.string.isRequired
    })).isRequired
  }

  getTitle () {
    return this.props.locations.find((location) => location.code === this.props.parentPage.title).name
  }

  render () {
    return (
      <div>
        <div>
          <h1 className={style.title}>{this.getTitle()}</h1>
        </div>
        <CategoriesTable pages={this.props.pages}/>
      </div>
    )
  }
}

export default withFetcher(LOCATIONS_ENDPOINT, true, true)(TitledCategoriesTable)
