import React from 'react'
import PropTypes from 'prop-types'
import { replace } from 'redux-little-router'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import CATEGORIES_ENDPOINT from 'modules/endpoint/endpoints/categories'
import LANGUAGES_ENDPOINT from 'modules/endpoint/endpoints/languages'
import LOCATION_ENDPOINT from 'modules/endpoint/endpoints/location'
import CategoryModel from 'modules/endpoint/models/CategoryModel'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import LocationModel from 'modules/endpoint/models/LocationModel'
import { setLanguageChangeUrls } from 'modules/language/actions/setLanguageChangeUrls'

import Breadcrumbs from 'routes/categories/components/Breadcrumbs'
import PdfButton from 'routes/categories/components/PdfButton'
import Page from '../components/Page'
import CategoryTiles from '../components/CategoryTiles'
import CategoryList from '../components/CategoryList'

/**
 * Displays a CategoryTable, CategoryList or a single category matching the route /<location>/<language>*
 */
class CategoriesPage extends React.Component {
  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.instanceOf(CategoryModel)).isRequired,
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)).isRequired,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    path: PropTypes.string,
    categoryId: PropTypes.string,
    setLanguageChangeUrls: PropTypes.func.isRequired,
    replaceUrl: PropTypes.func.isRequired
  }

  /**
   * If category is defined, we want to redirect to the page with the given id,
   * else we just dispatch the language change urls here
   */
  componentDidMount () {
    if (this.props.categoryId) {
      const category = CategoryModel.getCategoryById(this.props.categories, this.props.categoryId)
      if (!category) {
        // todo show an error that the page has not been found, redirect to the notFound route
      }
      this.props.replaceUrl(category.url)
    }
    this.setLanguageChangeUrls(this.props.path)
  }

  /**
   * Dispatches the action to set the language change urls after a prop change (selection of a category)
   * we must NOT call dispatch in componentWillUpdate or componentDidUpdate
   * @see https://reactjs.org/docs/react-component.html#componentwillupdate
   * @param nextProps The new props
   */
  componentWillReceiveProps (nextProps) {
    if (nextProps.path !== this.props.path) {
      this.setLanguageChangeUrls(nextProps.path)
    }
  }

  /**
   * The function used to map different languages to their CategoriesPage
   * @param {string} language The language
   * @param {string | undefined} id The id of a category
   * @returns {string} The url of the CategoriesPage of a different language
   */
  mapLanguageToUrl = (language, id) => (
    id ? `/${this.props.location}/${language}?id=${id}` : `/${this.props.location}/${language}`
  )

  /**
   * Gets and stores the available languages for the current page
   * @param {string} path The current path
   */
  setLanguageChangeUrls (path) {
    this.props.setLanguageChangeUrls(
      this.mapLanguageToUrl, this.props.languages, CategoryModel.getCategoryByPath(this.props.categories, path).availableLanguages
    )
  }

  getPdfFetchPath () {
    let path = `/${this.props.location}/${this.props.language}/fetch-pdf/`
    if (this.props.path) {
      path += this.props.path
    }
    return path
  }

  render () {
    const category = CategoryModel.getCategoryByPath(this.props.categories, this.props.path)
    if (!category) {
      // todo show an error that the page has not been found, redirect to the notFound route
    }
    const children = this.props.categories.filter(_category => _category.parent === category.id)

    let Content
    if (children.length === 0) {
      // last level, our category is a simple page
      Content = <Page page={category} />
    } else if (category.id === 0) {
      // first level, we want to display a table with all first order categories
      Content = <CategoryTiles categories={children}
                               title={category.title}
                               locations={this.props.locations} />
    } else {
      // some level between, we want to display a list
      Content = <CategoryList categories={children}
                              parentCategory={category} />
    }

    return <div>
      <Breadcrumbs
        categories={this.props.categories}
        category={category}
        locations={this.props.locations} />
      {Content}
      <PdfButton href={this.getPdfFetchPath()} />
    </div>
  }
}

const mapDispatchToProps = (dispatch) => ({
  setLanguageChangeUrls: (urls, languages, availableLanguages) => dispatch(
    setLanguageChangeUrls(urls, languages, availableLanguages)
  ),
  replaceUrl: (url) => dispatch(replace(url))
})

const mapStateToProps = (state) => ({
  language: state.router.params.language,
  location: state.router.params.location,
  path: state.router.pathname, // _ contains all the values from *
  categoryId: state.router.query.id
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFetcher(CATEGORIES_ENDPOINT),
  withFetcher(LANGUAGES_ENDPOINT),
  withFetcher(LOCATION_ENDPOINT)
)(CategoriesPage)
