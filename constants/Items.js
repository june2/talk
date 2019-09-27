import { getAges } from './../components/Util'

export const gender = [
  {
    label: '남자',
    value: 'M',
  },
  {
    label: '여자',
    value: 'F',
  },
]

export const locations = [
  {
    label: '서울',
    value: 'seoul',
  },
  {
    label: '경기',
    value: 'gyeonggi',
  },
  {
    label: '인천',
    value: 'incheon',
  },
  {
    label: '부산',
    value: 'busan',
  },
  {
    label: '대전',
    value: 'daejeon',
  },
  {
    label: '충북',
    value: 'chungbuk',
  },
  {
    label: '충남',
    value: 'chungnam',
  },
  {
    label: '강원',
    value: 'gangwon',
  },
  {
    label: '경북',
    value: 'gyeongbuk',
  },
  {
    label: '대구',
    value: 'daegu',
  },
  {
    label: '울산',
    value: 'ulsan',
  },
  {
    label: '광주',
    value: 'gwangju',
  },
  {
    label: '전북',
    value: 'jeonbuk',
  },
  {
    label: '전남',
    value: 'jeonnam',
  },
  {
    label: '제주',
    value: 'jeju',
  },
  {
    label: '해외',
    value: 'overseas',
  },
];

export const age = getAges();

export const getLocation = (key) => {
  if (key) {
    let find = locations.find(el => {
      if (el.value === key) {
        return el.label;
      }
    });
    if (find) {
      return find.label;
    }
  }
  return '';
}
