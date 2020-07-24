import { Directive } from "@angular/core";
import { Validator, AbstractControl, NG_VALIDATORS } from "@angular/forms";
import { element } from "protractor";

@Directive({
	selector: "[unitValidatorDirective]",
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: UnitValidatorDirective,
			multi: true
		}
	]
})
export class UnitValidatorDirective implements Validator {
	validate(control: AbstractControl): { [key: string]: any } | null {
		if (!control.value || !control.value.length) {
			return null;
		}
		var categories: Array<string> = [];
		var numberOfUnitCategories: number = 0;
		var numberOfDayCategories: number = 0;
		var numberOfMonthCategories: number = 0;

		control.value.forEach((element) => {
			categories.push(element.slice(0, element.indexOf(".")));
		});
		categories.forEach((element) => {
			if (element == "days") {
				numberOfDayCategories++;
			}
			else if (element == "months") {
				numberOfMonthCategories++;
			}
			else {
				numberOfUnitCategories++;
			}
		});
		if (numberOfUnitCategories > 1) {
			return { moreThanOneUnitCategories: true };
		}
		if (
			(numberOfUnitCategories > 0 && numberOfDayCategories > 0) ||
			(numberOfUnitCategories > 0 && numberOfMonthCategories > 0) ||
			(numberOfMonthCategories > 0 && numberOfDayCategories > 0)
		) {
			return { moreThanOneCategory: true };
		}
		return null;
	}
}
