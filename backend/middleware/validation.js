import Joi from 'joi';

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
        field: error.details[0].path[0]
      });
    }
    next();
  };
};

// Specific schema for NIN verification
export const ninVerificationSchema = Joi.object({
  aid: Joi.number().required().messages({
    'number.base': 'Agent ID must be a number',
    'any.required': 'Agent ID is required'
  }),
  nin: Joi.string().length(11).pattern(/^\d+$/).required().messages({
    'string.base': 'NIN must be a string',
    'string.length': 'NIN must be 11 digits',
    'string.pattern': 'NIN must contain only numbers',
    'any.required': 'NIN is required'
  })
});