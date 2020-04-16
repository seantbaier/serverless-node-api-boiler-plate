/**
 * User controller
 */
import { CreateSchema, UpdateSchema, PatchSchema } from '../schemas/user';
import userService from '../services/UserService';
import BaseController from './BaseController';

class UserController extends BaseController {}

export default new UserController(userService, CreateSchema, UpdateSchema, PatchSchema);
