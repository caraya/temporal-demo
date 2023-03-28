// Import the Temporal polyfill
import { Temporal } from 'temporal-polyfill'

const plainDateDisplay = document.getElementById('plainDate');
const plainDateLocale = document.getElementById('plainLocale')
const plainDateCustom = document.getElementById('dateCustom')
const plainDateTZ = document.getElementById('dateCustomTZ')
const plainDateRelative1 = document.getElementById('dateRelativeToday')
const plainDateRelative2 = document.getElementById('dateRelativeGivenDay')
const temporalDuration = document.getElementById('temporalDuration')
const results = document.getElementById('temporalPastDate');

// Date-only calendar using the ISO 8601 format and default format
const plainDate = Temporal.Now.plainDateISO();
plainDateDisplay.innerHTML = `${plainDate}`;

plainDateLocale.innerHTML = `${plainDate.toLocaleString()}`;

// You can also create a customized calendar display
// In this case is a month/year
plainDateCustom.innerHTML = `${plainDate.month}/${plainDate.year}`;

// Changing Locale
const cities = {
  'New York': 'America/New_York',
  'London': 'Europe/London',
  'Tokyo': 'Asia/Tokyo',
  "Santiago, Chile": 'America/Santiago'
};

Object.entries(cities).forEach(([name, timeZone]) => {
  let p = document.createElement('p')
  p.append(`${name} (${timeZone}) ${Temporal.Now.plainDateTimeISO(timeZone).toLocaleString()}`);
  plainDateTZ.append(p)
});

// Relative dates from today
const dateNow = Temporal.Now.plainDate('iso8601'); // Gets the current date

plainDateRelative1.innerHTML = `
<p><strong>Base date</strong>: ${dateNow.toString()}
<p>5 days from today: ${dateNow.add({days: 5}).toString()}</p>
<p>5 days ago: ${dateNow.add({days: -5}).toString()}`

// Relative dates from a given date
// Set the date
const date2 = Temporal.PlainDate.from('1994-03-27');

plainDateRelative2.innerHTML = `
<p><strong>Base Date</strong>: ${date2}
<p>5 days after initial date: ${date2.add({days: +5}).toString()}
<p>5 days before initial date: ${date2.add({days: -5}).toString()}`
const originalPastDate = Temporal.PlainDate.from("1994-03-27")
// If you have Intl.DurationFormat, then you can do this with
// until.toLocaleString() and untilMonths.toLocaleString(). This
// example will be updated when that becomes possible. For now, we can
// generate the string only in English.
function englishPlural(n, singular, plural) {
  return `${n} ${n === 1 ? singular : plural}`;
}

// If originalPastDate is not null/empty
if (originalPastDate !== null) {
  const browserCalendar = new Intl.DateTimeFormat().resolvedOptions().calendar;
  const pastDate = Temporal.PlainDate.from(originalPastDate).withCalendar(browserCalendar);
  const today = Temporal.Now.plainDate(browserCalendar);
  const since = today.since(pastDate, { largestUnit: 'day' });
  const sinceMonths = since.round({ largestUnit: 'month', relativeTo: today });
  const sinceYears = since.round({largestUnit: 'years', relativeTo: today });

  const dayString = englishPlural(since.days, 'day', 'days');
  const monthString =
    `${englishPlural(sinceMonths.months, 'month', 'months')}` +
    (sinceMonths.days !== 0 ? `, ${englishPlural(sinceMonths.days, 'day', 'days')}` : '');
  const yearString = 
    `${englishPlural(sinceYears.years, 'year', 'years')}` +
    (sinceYears.months !== 0 ? `, ${englishPlural(sinceYears.months, 'month', 'months')}` : '') +
    (sinceYears.days !== 0 ? `, ${englishPlural(sinceYears.days, 'day', 'days')}` : '');

  results.innerHTML = `
    <p>From and including: <strong>${today.toLocaleString()}</strong></p>
    <p>Going back to but not including: <strong>${pastDate.toLocaleString()}</strong></p>
    <p>It's been ${dayString} from the start date to, but not including the end date.</p>
    <p>Or ${monthString} since the start date, excluding the end date.</p>
    <p>Or ${yearString} since the start date</p>
  `;
}