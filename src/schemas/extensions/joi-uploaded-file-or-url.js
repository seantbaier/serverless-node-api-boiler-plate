import Joi from '@hapi/joi'

import JoiMimeType from './joi-mime-type'

const CustomJoi = Joi.extend(JoiMimeType)

const FileUploadData = CustomJoi.object({
  name: CustomJoi.string().required(),
  type: CustomJoi.string().mimeType().required(),
  data: CustomJoi.string().dataUri().required()
})

export default (joi) => ({
  base: joi.any(),
  type: 'any',
  messages: {
    'uploadedFileOrUrl.invalidFile': '"{{#label}}" is not a valid upload file',
    'uploadedFileOrUrl.invalidUrl': '"{{#label}}" is not a valid URL'
  },
  rules: {
    uploadedFileOrUrl: {
      method(options) {
        return this.$_addRule({ name: 'uploadedFileOrUrl', args: { options } })
      },
      validate(value, { error }) {
        if (typeof value === 'object') {
          const result = FileUploadData.validate(value)
          if (result.error) {
            return error('uploadedFileOrUrl.invalidFile')
          }

          return result.value
        }

        const result = Joi.string().uri().validate(value)

        if (result.error) {
          return error('uploadedFileOrUrl.invalidUrl')
        }

        return result.value
      }
    }
  }
})
