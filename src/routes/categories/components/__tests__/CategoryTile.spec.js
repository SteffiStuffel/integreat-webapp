import React from 'react'
import { shallow } from 'enzyme'

import CategoryModel from 'modules/endpoint/models/CategoryModel'
import CategoryTile from '../CategoryTile'

const category = new CategoryModel({
  id: 3649,
  url: '/augsburg/de/willkommen',
  title: 'Willkommen',
  content: 'this is a test content',
  parentId: 0,
  parentUrl: '/augsburg/de',
  order: 11,
  availableLanguages: {
    en: 4804, ar: 4819, fa: 4827
  },
  thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png'
})

describe('CategoryTile', () => {
  test('should render and match snapshot', () => {
    const wrapper = shallow(
      <CategoryTile category={category} />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
