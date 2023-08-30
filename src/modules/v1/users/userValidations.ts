import { Request, Response, NextFunction } from 'express';
import { validateField, validationConfig } from 'src/helpers/validations.helper';
import responseMessages from 'src/constants/messages';


export const validateEmail = (req: Request, res: Response, next: NextFunction
) => {
  validateField(req, res, next, 'email',
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    responseMessages.INVALID_EMAIL_FORMAT
  );
};

export const validateName = (req: Request, res: Response, next: NextFunction) => {
  validateField(req, res, next, 'first_name',
    /^[a-zA-Z ]{3,30}$/,
    responseMessages.INVALID_FIRST_NAME
  );

  validateField(req, res, next, 'last_name',
    /^[a-zA-Z ]{3,30}$/,
    responseMessages.INVALID_LAST_NAME
  );
};

export const validatePhone = (req: Request, res: Response, next: NextFunction) => {
  validateField(req, res, next, 'phone',
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    responseMessages.INVALID_PHONE_FORMAT
  );
};

export const validateRegisterFields = (fields: Record<string, string>): string[] => {
  const errors: string[] = [];

  for (const field in fields) {
    if (fields.hasOwnProperty(field)) {
      const value = fields[field];
      const config = validationConfig[field.toLowerCase()];

      if (config && !config.regex.test(value)) {
        errors.push(config.errorMessage);
      }
    }
  }

  return errors;
};