// @flow

import * as React from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import type { StateType } from '../../../modules/app/StateType'
import { TFunction } from 'i18next'
import TunewsList from '../components/TunewsList'
import NewsElement from '../components/NewsElement'
import NewsTabs from '../components/NewsTabs'
import { CityModel, TunewsModel } from '@integreat-app/integreat-api-client'
import LoadingSpinner from '../../../modules/common/components/LoadingSpinner'
import { TU_NEWS } from '../constants'
import ContentNotFoundError from '../../../modules/common/errors/ContentNotFoundError'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import CityNotFoundError from '../../../modules/app/errors/CityNotFoundError'
import { fetchTunews } from '../actions/fetchTunews'
import TunewsDetailsRouteConfig from '../../../modules/app/route-configs/TunewsDetailsRouteConfig'

type PropsType = {|
  tunews: Array<TunewsModel>,
  language: string,
  city: string,
  cities: Array<CityModel>,
  areCitiesFetching: boolean,
  path: string,
  t: TFunction,
  isFetching: boolean,
  hasMore: boolean,
  fetchTunews: () => void
|}

export class TunewsPage extends React.PureComponent<PropsType> {
  renderTunewsElement = (city: string, language: string) => (tunewsItem: TunewsModel, city: string) => {
    const { t } = this.props
    const { id, title, content, date } = tunewsItem
    return (
      <NewsElement
        id={id}
        title={title}
        content={content}
        timestamp={date}
        key={id}
        t={t}
        link={new TunewsDetailsRouteConfig().getRoutePath({ city, language, id })}
        language={language}
        type={TU_NEWS}
      />
    )
  }

  render () {
    const {
      tunews, language, city, t, fetchTunews, hasMore, isFetching, cities, areCitiesFetching, path
    } = this.props

    if (areCitiesFetching) {
      return <LoadingSpinner />
    }

    const currentCity: ?CityModel = cities && cities.find(cityElement => cityElement.code === city)
    if (!currentCity) {
      return <FailureSwitcher error={new CityNotFoundError()} />
    }

    if (!currentCity.tunewsEnabled) {
      const error = new ContentNotFoundError({ type: 'category', id: path, city: city, language })
      return <FailureSwitcher error={error} />
    }

    return (
      <NewsTabs type={TU_NEWS} city={city} cities={cities} t={t} language={language}>
        <TunewsList
          items={tunews}
          renderItem={this.renderTunewsElement(city, language)}
          city={city}
          fetchMoreTunews={fetchTunews}
          hasMore={hasMore}
          isFetching={isFetching}
          language={language}
          noItemsMessage={t('currentlyNoNews')}
        />
      </NewsTabs>
    )
  }
}

const mapStateToProps = (state: StateType) => ({
  language: state.location.payload.language,
  city: state.location.payload.city,
  cities: state.cities.data,
  areCitiesFetching: state.cities.isFetching,
  path: state.location.pathname,
  hasMore: state.tunews.hasMore,
  tunews: state.tunews.allData,
  isFetching: state.tunews.payload.isFetching
})

export default connect<PropsType, *, *, *, *, *>(mapStateToProps, { fetchTunews })(
  withTranslation('news')(
    TunewsPage
  ))
