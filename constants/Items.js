import { getAges, timestamp } from './../components/Util'

const products = [
  {
    id: 'p700',
    title: '포인트 700',
  },
  {
    id: 'p4000',
    title: '포인트 4000',
  },
  {
    id: 'p16000',
    title: '포인트 16000',
  },
  {
    id: 'p40000',
    title: '포인트 40000',
  },
  {
    id: 'p80000',
    title: '포인트 80000',
  },
]

export const getProductTitle = (id) => {
  let product = products.find(item => item.id === id);
  if (product) return product.title;
  else '';
}

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

export const getTimestamp = timestamp;
