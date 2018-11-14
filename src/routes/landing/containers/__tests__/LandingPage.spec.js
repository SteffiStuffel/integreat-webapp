// @flow

import React from 'react'
import { shallow } from 'enzyme'
import ConnectedLandingPage, { LandingPage } from '../LandingPage'
import CityModel from '../../../../modules/endpoint/models/CityModel'
import configureMockStore from 'redux-mock-store'
import { LANDING_ROUTE } from '../../../../modules/app/routes/landing'
import { routesMap } from '../../../../modules/app/routes'

describe('LandingPage', () => {
  const cities = [
    new CityModel({
      name: 'City',
      code: 'city',
      live: true,
      eventsEnabled: false,
      extrasEnabled: false,
      sortingName: 'City'
    })
  ]

  it('should match snapshot', () => {
    expect(shallow(<LandingPage cities={cities} language={'de'} />)).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const language = 'en'

    const location = {type: LANDING_ROUTE, payload: {language}, routesMap}

    const mockStore = configureMockStore()
    const store = mockStore({
      location: location,
      cities: {data: cities}
    })

    const landingPage = shallow(
      <ConnectedLandingPage store={store} cities={cities} />
    )

    expect(landingPage.props()).toMatchObject({
      language,
      cities
    })
  })
})
