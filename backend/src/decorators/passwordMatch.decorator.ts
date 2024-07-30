import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({
    name: 'PasswordMatch',
    async: false
})
export class PasswordMatch implements ValidatorConstraintInterface {
    validate(password: string, args: ValidationArguments) {
        if (password !== (args.object as any)[args.constraints[0]]) {
            return false
        }
        return true
    }
    defaultMessage?(args: ValidationArguments): string {
        return 'La contraseña y la confirmación no coinciden'
    }

}