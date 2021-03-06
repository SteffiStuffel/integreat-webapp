// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import SprungbrettOfferPage from '../../../routes/sprungbrett/containers/SprungbrettOfferPage'
import {
  CategoriesMapModel,
  CityModel,
  EventModel,
  OfferModel,
  LanguageModel,
  LocalNewsModel,
  PageModel,
  Payload,
  PoiModel,
  TunewsModel,
  WohnenOfferModel
} from '@integreat-app/integreat-api-client'
import Layout from '../../layout/components/Layout'
import LocationLayout from '../../layout/containers/LocationLayout'
import GeneralHeader from '../../layout/components/GeneralHeader'
import GeneralFooter from '../../layout/components/GeneralFooter'
import type { StateType } from '../StateType'
import { getRouteConfig } from '../route-configs'
import Helmet from '../../common/containers/Helmet'
import type { Dispatch } from 'redux'
import type { LocationState } from 'redux-first-router'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import type { RouteConfig } from '../route-configs/RouteConfig'
import toggleDarkModeAction from '../../theme/actions/toggleDarkMode'
import LanguageFailure from '../../common/containers/LanguageFailure'
import RouteContentSwitcher from './RouteContentSwitcher'
import type { StoreActionType } from '../StoreActionType'

export type LanguageChangePathsType = Array<{ code: string, path: string | null, name: string }>

type PropsType = {|
  citiesPayload: Payload<Array<CityModel>>,
  categoriesPayload: Payload<CategoriesMapModel>,
  poisPayload: Payload<Array<PoiModel>>,
  eventsPayload: Payload<Array<EventModel>>,
  localNewsPayload: Payload<Array<LocalNewsModel>>,
  localNewsElementPayload: Payload<LocalNewsModel>,
  tunewsPayload: Payload<Array<TunewsModel>>,
  tunewsElementPayload: Payload<TunewsModel>,
  offersPayload: Payload<Array<OfferModel>>,
  sprungbrettJobsPayload: Payload<Array<SprungbrettOfferPage>>,
  wohnenOffersPayload: Payload<Array<WohnenOfferModel>>,
  disclaimerPayload: Payload<PageModel>,
  languages: ?Array<LanguageModel>,
  viewportSmall: boolean,
  darkMode: boolean,
  location: LocationState,
  toggleDarkMode: () => void,
  t: TFunction
|}

/**
 * Switches what content should be rendered depending on the current route
 */
export class Switcher extends React.Component<PropsType> {
  getAllPayloads = () => {
    const { location, languages, viewportSmall, darkMode, toggleDarkMode, t, ...payloads } = this.props
    return payloads
  }

  getLanguageChangePaths = (routeConfig: RouteConfig<*, *>): ?LanguageChangePathsType => {
    const { languages, location } = this.props
    const payloads = routeConfig.getRequiredPayloads(this.getAllPayloads())
    return languages && languages.map(language => ({
      path: routeConfig.getLanguageChangePath({ payloads, location, language: language.code }),
      name: language.name,
      code: language.code
    }))
  }

  renderHelmet = (): React.Node => {
    const { location, citiesPayload, t } = this.props
    const routeConfig = getRouteConfig(location.type)
    const payloads = routeConfig.getRequiredPayloads(this.getAllPayloads())
    const cityModel = citiesPayload.data && citiesPayload.data.find(city => city.code === location.payload.city)
    const pageTitle = routeConfig.getPageTitle({ t, payloads, cityName: cityModel ? cityModel.name : '', location })
    const metaDescription = routeConfig.getMetaDescription(t)
    const languageChangePaths = this.getLanguageChangePaths(routeConfig)
    return (
      <Helmet pageTitle={pageTitle}
              metaDescription={metaDescription}
              languageChangePaths={languageChangePaths}
              cityModel={cityModel} />
    )
  }

  isLanguageInvalid (): boolean {
    const { location, citiesPayload, languages } = this.props
    const { city, language } = location.payload
    return language && city && !!citiesPayload.data && !!languages && !languages.find(lang => lang.code === language)
  }

  renderLayoutWithContent (): React.Node {
    const { location, viewportSmall, darkMode, categoriesPayload, citiesPayload, toggleDarkMode, eventsPayload } = this.props

    const routeConfig = getRouteConfig(location.type)
    const payloads = routeConfig.getRequiredPayloads(this.getAllPayloads())
    const feedbackTargetInformation = routeConfig.getFeedbackTargetInformation({ location, payloads })
    const languageChangePaths = this.getLanguageChangePaths(routeConfig)

    const error = this.isLanguageInvalid()
    if (error || !routeConfig.isLocationLayoutRoute) {
      return (
        <Layout footer={(error || routeConfig.requiresFooter) && <GeneralFooter />}
                header={(error || routeConfig.requiresHeader) && <GeneralHeader viewportSmall={viewportSmall} />}
                darkMode={darkMode}>
          {error ? <LanguageFailure cities={citiesPayload.data}
                                    location={location}
                                    languageChangePaths={languageChangePaths} />
            : <RouteContentSwitcher location={location} allPayloads={this.getAllPayloads()} />}
        </Layout>
      )
    } else {
      return (
        <LocationLayout feedbackTargetInformation={feedbackTargetInformation}
                        location={location}
                        categories={categoriesPayload.data}
                        cities={citiesPayload.data}
                        events={eventsPayload.data}
                        darkMode={darkMode}
                        viewportSmall={viewportSmall}
                        toggleDarkMode={toggleDarkMode}
                        languageChangePaths={languageChangePaths}>
          <RouteContentSwitcher location={location} allPayloads={this.getAllPayloads()} />
        </LocationLayout>
      )
    }
  }

  render () {
    return (
      <>
        {this.renderHelmet()}
        {this.renderLayoutWithContent()}
      </>
    )
  }
}

const mapStateToProps = (state: StateType) => ({
  citiesPayload: state.cities,
  categoriesPayload: state.categories,
  eventsPayload: state.events,
  localNewsPayload: state.localNews,
  localNewsElementPayload: state.localNewsElement,
  tunewsPayload: state.tunews.payload,
  tunewsElementPayload: state.tunewsElement,
  poisPayload: state.pois,
  offersPayload: state.offers,
  sprungbrettJobsPayload: state.sprungbrettJobs,
  wohnenOffersPayload: state.wohnen,
  disclaimerPayload: state.disclaimer,
  languages: state.languages.data,
  viewportSmall: state.viewport.is.small,
  darkMode: state.darkMode,
  location: state.location
})

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>) => ({
  toggleDarkMode: () => dispatch(toggleDarkModeAction())
})

export default connect<*, *, *, *, *, *>(mapStateToProps, mapDispatchToProps)(
  withTranslation('app')(
    Switcher
  ))
