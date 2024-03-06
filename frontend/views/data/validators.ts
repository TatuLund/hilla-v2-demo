import { Validator } from '@hilla/form';

/**
 * Validator that checks if a given date is in the future and not a weekend day.
 */
export class FutureWeekdayAndRequired implements Validator<string> {
    message = 'Deadline must be in the future and not a weekend day';
    name = "FutureWeekdayAndRequired";

    /**
     * Validates if the given date is in the future and not a weekend day.
     * @param date - The date to be validated.
     * @returns True if the date is in the future and not a weekend day, false otherwise.
     */
    validate = (date: string) => this.futureWeekdayAndRequired(date);

    private futureWeekdayAndRequired(date: string): boolean {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        const now = Date.parse(today.toDateString());
        const other = Date.parse(date);
        const otherDate = new Date(other);
        return other >= now && otherDate.getDay() != 0 && otherDate.getDay() != 6;
    }
}
