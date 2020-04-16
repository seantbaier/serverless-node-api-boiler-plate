
import { isEmpty, isMimeType } from 'validator';

export default joi => ({
  base: joi.string(),
  type: 'string',
  messages: {
    'mimeType.invalid': '"{{#label}}" is not a MIME type',
  },
  rules: {
    mimeType: {
      method(options) {
        return this.$_addRule({ name: 'mimeType', args: { options } });
      },
      validate(value, { error }) {
        const isValid = !isEmpty(value, { ignore_whitespace: true })
            && isMimeType(value);

        if (!isValid) {
          return error('mimeType.invalid');
        }

        return value;
      },
    },
  },
});
