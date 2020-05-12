import HttpStatus from 'http-status-codes'
import fail from '../utils/fail'
import logger from '../utils/logger'
import { makeUpdatedResponse, makePaginatedResponse } from '../utils/response'

class BaseController {
  constructor(entitiesService, createSchema, updateSchema, patchSchema) {
    this.service = entitiesService
    this.createSchema = createSchema
    this.updateSchema = updateSchema
    this.patchSchema = patchSchema
  }

  getMany = async (req, res) => {
    try {
      const entities = await this.service.getMany(req)

      return res.status(HttpStatus.OK).json(entities)
    } catch (err) {
      logger.error(`[${this.constructor.name}] Error: ${err}`)
      return fail(res, err)
    }
  }

  getOne = async (req, res) => {
    try {
      const entity = await this.service.getOne(req)
      const response = makePaginatedResponse(req, entity)
      return res.status(HttpStatus.OK).json(response)
    } catch (err) {
      logger.error(`[${this.constructor.name}] Error: ${err}`)
      return fail(res, err)
    }
  }

  create = async (req, res) => {
    try {
      if (this.createSchema) {
        const { error } = this.createSchema.validate(req.body)
        if (error) {
          return res.status(HttpStatus.BAD_REQUEST).json(error)
        }
      }

      const newEntity = await this.service.create(req, res)
      const response = makePaginatedResponse(req, newEntity)
      return res.status(HttpStatus.CREATED).json(response)
    } catch (err) {
      logger.error(`[${this.constructor.name}] Error: ${err}`)
      return fail(res, err)
    }
  }

  patch = async (req, res) => {
    try {
      if (this.patchSchema) {
        const { error } = this.patchSchema.validate(req.body)
        if (error) {
          return res.status(HttpStatus.BAD_REQUEST).json(error)
        }
      }

      const source = await this.service.getOne(req, true)
      const updated = await this.service.patch(req)
      const response = makeUpdatedResponse(source, updated)
      return res.status(HttpStatus.OK).json(response)
    } catch (err) {
      logger.error(`[${this.constructor.name}] Error: ${err}`)
      return fail(res, err)
    }
  }

  update = async (req, res) => {
    try {
      if (this.updateSchema) {
        const { error } = this.updateSchema.validate(req.body)
        if (error) {
          return res.status(HttpStatus.BAD_REQUEST).json(error)
        }
      }

      const source = await this.service.getOne(req, true)
      const updated = await this.service.update(req)
      const response = makeUpdatedResponse(source, updated)
      return res.status(HttpStatus.OK).json(response)
    } catch (err) {
      logger.error(`[${this.constructor.name}] Error: ${err}`)
      return fail(res, err)
    }
  }

  upsert = async (req, res) => {
    try {
      const source = await this.service.getOne(req, true)
      let response

      if (!source) {
        const newEntitiy = await this.service.create(req, res)

        response = makePaginatedResponse(req, newEntitiy)
      } else {
        const updatedEntity = await this.service.update(req)

        response = makeUpdatedResponse(source, updatedEntity)
      }

      return res.status(HttpStatus.OK).json(response)
    } catch (err) {
      logger.error(`[${this.constructor.name}] Error: ${err}`)
      return fail(res, err)
    }
  }

  delete = async (req, res) => {
    try {
      const deleted = await this.service.delete(req)
      const response = makePaginatedResponse(req, deleted)
      return res.status(HttpStatus.NO_CONTENT).json(response)
    } catch (err) {
      logger.error(`[${this.constructor.name}] Error: ${err}`)
      return fail(res, err)
    }
  }
}

export default BaseController
