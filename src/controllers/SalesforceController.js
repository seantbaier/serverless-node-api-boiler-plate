/**
 * User controller
 */
import salesforceService from '../services/SalesforceService'
import BaseController from './BaseController'

class SalesforceController extends BaseController {}

export default new SalesforceController(salesforceService)
