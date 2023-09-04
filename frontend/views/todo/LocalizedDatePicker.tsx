import { DatePicker, DatePickerDate, DatePickerI18n } from '@hilla/react-components/DatePicker.js';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import { DatePicker as DatePickerWebComponent } from '@vaadin/date-picker/vaadin-date-picker.js';
import React from 'react';

const dateFormat = 'dd.MM.yyyy';

const formatDateIso8601 = (dateParts: DatePickerDate): string => {
  const { year, month, day } = dateParts;
  const date = new Date(year, month, day);

  return dateFnsFormat(date, dateFormat);
};

const checkAllowedFormat = (inputValue: string): boolean => {
  var date: Date;
  if (inputValue.length > 8) {
    date = dateFnsParse(inputValue, dateFormat, new Date());
  } else {
    date = dateFnsParse(inputValue, dateFormat, new Date());
  }
  if (date.toDateString() === 'Invalid Date') {
    return false;
  }
  return true;
};

const parseDateIso8601 = (inputValue: string): DatePickerDate => {
  var date: Date;
  if (inputValue.length > 8) {
    date = dateFnsParse(inputValue, dateFormat, new Date());
  } else {
    date = dateFnsParse(inputValue, dateFormat, new Date());
  }
  return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
};

type Props = {
  id?: string;
  className?: string;
  label?: string | undefined;
  value?: string | undefined;
  errorMessage?: string | undefined;
  invalid?: boolean | undefined;
  helperText?: string | undefined;
  required?: boolean | undefined;
};

const i18n: DatePickerI18n = {
  monthNames: [
    'Tammikuu',
    'Helmikuu',
    'Maaliskuu',
    'Huhtikuu',
    'Toukokuu',
    'Kesäkuu',
    'Heinäkuu',
    'Elokuu',
    'Syyskuu',
    'Lokakuu',
    'Marraskuu',
    'Joulukuu',
  ],
  weekdays: ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai'],
  weekdaysShort: ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'],
  firstDayOfWeek: 1,
  today: 'Tänään',
  cancel: 'Peruuta',
  referenceDate: '1970-01-01',
  formatDate: formatDateIso8601,
  parseDate: parseDateIso8601,
  formatTitle: function (monthName: string, fullYear: number): string {
    return monthName + ' ' + fullYear;
  },
};

export const LocalizedDatePicker = React.forwardRef<DatePickerWebComponent, Props>((props: Props, ref) => (
  <DatePicker ref={ref} i18n={i18n} {...props} />
));
