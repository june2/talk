import moment from 'moment';

export const dateConvert = (date) => {
  let diff = moment().diff(moment(date), 'minutes');
  return diff + ' 분전';
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
