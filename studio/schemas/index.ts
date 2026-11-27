import homePage from './homePage'
import link from './link'
import page from './page'
import product from './product'
import {sectionTypes} from './sections'
import siteSettings from './siteSettings'

export const schemaTypes = [homePage, siteSettings, page, product, link, ...sectionTypes]
