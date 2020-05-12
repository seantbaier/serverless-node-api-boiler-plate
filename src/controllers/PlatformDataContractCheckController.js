/**
 * User controller
 */
import platformDataContractCheckforceService from '../services/PlatformDataContractCheckService'
import BaseController from './BaseController'

class PlatformDataContractCheckController extends BaseController {}

export default new PlatformDataContractCheckController(
  platformDataContractCheckforceService
)
