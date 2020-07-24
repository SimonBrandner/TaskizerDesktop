import { Directive } from "@angular/core";
import { Validator, AbstractControl, NG_VALIDATORS } from "@angular/forms";

@Directive({
	selector: "[ordinalValidatorDirective]",
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: OrdinalValidatorDirective,
			multi: true
		}
	]
})
export class OrdinalValidatorDirective implements Validator {
	validate(control: AbstractControl): { [key: string]: any } | null {
		console.log(control.value);
		console.log(control.value < 1);
		if (control.value != undefined && control.value < 1) {
			return { ordinalTooSmall: true };
		}
		return null;
	}
}
