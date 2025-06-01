import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsDateRangeValid', async: false })
export class IsDateRangeValidConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments): boolean {
    const obj = args.object as any;
    if (!obj.startTime || !obj.endTime) return true;
    return new Date(obj.endTime) > new Date(obj.startTime);
  }

  defaultMessage(args: ValidationArguments): string {
    return 'endTime must be after startTime';
  }
}



export function IsDateRangeValid(validationOptions?: ValidationOptions) {
  return function (constructor: new (...args: any[]) => object) {
    registerDecorator({
      name: 'IsDateRangeValid',
      target: constructor,
      propertyName: undefined as any, 
      options: validationOptions,
      validator: IsDateRangeValidConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsStartTimeInFuture', async: false })
export class IsStartTimeInFutureConstraint implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments): boolean {
    if (!value) return true; 
    const now = new Date();
    return new Date(value) >= now;
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'startTime must not be in the past';
  }
}

export function IsStartTimeInFuture(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStartTimeInFutureConstraint,
    });
  };
}