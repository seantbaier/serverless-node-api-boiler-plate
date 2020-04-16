
import { isEmpty } from 'validator';

export default joi => ({
  base: joi.string(),
  type: 'string',
  messages: {
    'notWhitespace.invalid': '"{{#label}}" cannot be all whitespace',
  },
  rules: {
    notWhitespace: {
      method(options) {
        return this.$_addRule({ name: 'notWhitespace', args: { options } });
      },
      validate(value, { error }) {
        const isValid = !isEmpty(value, { ignore_whitespace: true });

        if (!isValid) {
          return error('notWhitespace.invalid');
        }

        return value;
      },
    },
  },
});
