import { DatePicker, DatePickerDate, DatePickerI18n } from '@hilla/react-components/DatePicker.js';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import { DatePicker as DatePickerWebComponent } from '@vaadin/date-picker/vaadin-date-picker.js';
import { forwardRef } from 'react';

type Months = Record<string, string[]>;
type Weekdays = Record<string, string[]>;
type DateFormats = Record<string, string>;
type WeekStarts = Record<string, number>;

type LocalizedText = Record<string, string>;
type Localization = Record<string, LocalizedText>;
type I18ns = Record<string, DatePickerI18n>;

export type Language = 'us' | 'fi';

var language: Language = 'fi';

const languages: Language[] = ['us', 'fi'];

const monthNames: Months = {
  us: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  fi: [
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
};

const weekdays: Weekdays = {
  us: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  fi: ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai'],
};

const weekdaysShort: Weekdays = {
  us: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  fi: ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'],
};

const weekStarts: WeekStarts = {
  us: 0,
  fi: 1,
};

const dateFormats: DateFormats = {
  us: 'MM-dd-yyyy',
  fi: 'dd.MM.yyyy',
};

const dateFormatsShort: DateFormats = {
  us: 'MM-dd-yy',
  fi: 'dd.MM.yy',
};

const texts: Localization = {
  us: { today: 'Today', cancel: 'Cancel', referenceDate: '1970-01-01' },
  fi: { today: 'Tänään', cancel: 'Peruuta', referenceDate: '1970-01-01' },
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
  language: Language;
};

const formatDateIso8601 = (dateParts: DatePickerDate): string => {
  const { year, month, day } = dateParts;
  const date = new Date(year, month, day);

  return dateFnsFormat(date, dateFormats[language]);
};

const parseDateIso8601 = (inputValue: string): DatePickerDate => {
  var date: Date;
  if (inputValue.length > 8) {
    date = dateFnsParse(inputValue, dateFormats[language], new Date());
  } else {
    date = dateFnsParse(inputValue, dateFormatsShort[language], new Date());
  }
  return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
};

function createI18n(language: Language): DatePickerI18n {
  return {
    monthNames: monthNames[language],
    weekdays: weekdays[language],
    weekdaysShort: weekdaysShort[language],
    firstDayOfWeek: weekStarts[language],
    today: texts[language].today,
    cancel: texts[language].cancel,
    referenceDate: texts[language].referenceDate,
    formatDate: formatDateIso8601,
    parseDate: parseDateIso8601,
    formatTitle: function (monthName: string, fullYear: number): string {
      return monthName + ' ' + fullYear;
    },
  };
}

const i18ns: I18ns = {};

languages.forEach((lang) => {
  i18ns[lang] = createI18n(lang);
});

export const LocalizedDatePicker = forwardRef<DatePickerWebComponent, Props>((props: Props, ref) => (
  <DatePicker ref={ref} i18n={i18ns[props.language]} {...props} />
));
