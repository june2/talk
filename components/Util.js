import moment from 'moment';

export function dateConvert(date) {
  let diff = moment().diff(moment(date), 'minutes');
  return diff + ' 분전';
}