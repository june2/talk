import moment from 'moment';

export const dateConvert = (date) => {
  let diff = moment().diff(moment(date), 'minutes');
  if (diff < 1) return '지금';
  else if (diff > 0 && diff < 60) return diff + ' 분전';
  else if (diff > 59 && diff < 1440) return Math.floor(diff / 60) + ' 시간전';
  else return Math.floor(diff / 1440) + ' 일전';
}

// Get ages array
export const getAges = () => {
  let year = moment().year();
  let min = year - 19;
  let ages = [];

  for (let i = min; i >= min - 46; i--) {
    ages.push({
      label: `${i} (${year - i})`,
      value: i,
    })
  }
  return ages;
}

// Get age from year
export const getAge = (date) => {
  let now = moment().year();
  let year = moment(date).year();
  let age = now - year;
  return Number.isInteger(age) ? age : null;
}

// Get year
export const getYear = (date) => {
  return moment(date).year();
}

// Get year
export const timestamp = moment().unix().toString();
