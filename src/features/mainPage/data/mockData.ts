// import { Platform, Category } from '../types';

// export const mockCategories: Category[] = [
//   { id: 'all', name: '전체' },
//   { id: 'entertainment', name: '🎬 엔터테인먼트', icon: '🎬' },
//   { id: 'beauty', name: '💄 뷰티/건강', icon: '💄' },
//   { id: 'shopping', name: '🛍️ 쇼핑', icon: '🛍️' },
//   { id: 'life', name: '🏪 생활/편의', icon: '🏪' },
//   { id: 'food', name: '🍽️ 푸드', icon: '🍽️' },
//   { id: 'culture', name: '🎨 문화/여가', icon: '🎨' },
//   { id: 'education', name: '📚 교육', icon: '📚' },
//   { id: 'travel', name: '✈️ 여행/교통', icon: '✈️' },
// ];

// export const mockPlatforms: Platform[] = [
//   // 엔터테인먼트
//   {
//     id: '1',
//     storeId: 1,
//     partnerId: 1,
//     name: 'CGV 강남',
//     category: 'entertainment',
//     address: '서울 강남구 강남대로 438',
//     latitude: 37.5665,
//     longitude: 126.978,
//     benefits: ['영화 예매 20% 할인', '팝콘 무료 제공'],
//     rating: 4.5,
//     distance: 150,
//     imageUrl: '/images/mock/cgv.png',
//     phone: '02-1234-5678',
//     hours: '10:00 - 24:00',
//   },
//   {
//     id: '2',
//     name: '메가박스 코엑스',
//     category: 'entertainment',
//     address: '서울 강남구 영동대로 513',
//     latitude: 37.513,
//     longitude: 127.059,
//     benefits: ['영화 예매 15% 할인', '음료 할인'],
//     rating: 4.3,
//     distance: 300,
//     imageUrl: '/images/admin/megabox.png',
//     phone: '02-2345-6789',
//     hours: '09:00 - 25:00',
//   },
//   {
//     id: '3',
//     name: '롯데월드',
//     category: 'entertainment',
//     address: '서울 송파구 올림픽로 240',
//     latitude: 37.5112,
//     longitude: 127.0982,
//     benefits: ['자유이용권 30% 할인', '연간이용권 할인'],
//     rating: 4.7,
//     distance: 800,
//     imageUrl: '/images/admin/lotteworld.png',
//     phone: '02-3456-7890',
//     hours: '09:30 - 22:00',
//   },

//   // 쇼핑
//   {
//     id: '4',
//     name: 'GS25 강남점',
//     category: 'shopping',
//     address: '서울 강남구 테헤란로 123',
//     latitude: 37.5001,
//     longitude: 127.028,
//     benefits: ['전품목 5% 할인', '1+1 상품 추가 혜택'],
//     rating: 4.1,
//     distance: 200,
//     imageUrl: '/images/mock/gs25.png',
//     phone: '02-4567-8901',
//     hours: '24시간',
//   },
//   {
//     id: '5',
//     name: 'GS더프레시 역삼점',
//     category: 'shopping',
//     address: '서울 강남구 역삼로 456',
//     latitude: 37.4979,
//     longitude: 127.028,
//     benefits: ['신선식품 10% 할인', '배송비 무료'],
//     rating: 4.4,
//     distance: 350,
//     imageUrl: '/images/admin/GSthefresh.png',
//     phone: '02-5678-9012',
//     hours: '07:00 - 23:00',
//   },

//   // 푸드
//   {
//     id: '6',
//     name: '배스킨라빈스 강남점',
//     category: 'food',
//     address: '서울 강남구 강남대로 789',
//     latitude: 37.4951,
//     longitude: 127.028,
//     benefits: ['아이스크림 20% 할인', '케이크 예약 할인'],
//     rating: 4.2,
//     distance: 120,
//     imageUrl: '/images/admin/baskin.png',
//     phone: '02-6789-0123',
//     hours: '10:00 - 23:00',
//   },
//   {
//     id: '7',
//     name: '파리바게뜨 역삼점',
//     category: 'food',
//     address: '서울 강남구 역삼동 234-5',
//     latitude: 37.4959,
//     longitude: 127.0394,
//     benefits: ['빵류 15% 할인', '커피 1+1'],
//     rating: 4.0,
//     distance: 280,
//     imageUrl: '/images/admin/paris.png',
//     phone: '02-7890-1234',
//     hours: '06:30 - 22:00',
//   },

//   // 뷰티/건강
//   {
//     id: '8',
//     name: '올리브영 강남점',
//     category: 'beauty',
//     address: '서울 강남구 강남대로 101',
//     latitude: 37.5045,
//     longitude: 127.0251,
//     benefits: ['화장품 10% 할인', '멤버십 포인트 2배'],
//     rating: 4.3,
//     distance: 180,
//     phone: '02-8901-2345',
//     hours: '10:00 - 22:00',
//   },

//   // 생활/편의
//   {
//     id: '9',
//     name: '세븐일레븐 테헤란점',
//     category: 'life',
//     address: '서울 강남구 테헤란로 567',
//     latitude: 37.5089,
//     longitude: 127.0634,
//     benefits: ['생필품 5% 할인', '택배 서비스 할인'],
//     rating: 3.9,
//     distance: 90,
//     phone: '02-9012-3456',
//     hours: '24시간',
//   },

//   // 문화/여가
//   {
//     id: '10',
//     name: '스타벅스 강남역점',
//     category: 'culture',
//     address: '서울 강남구 강남대로 456',
//     latitude: 37.4979,
//     longitude: 127.0276,
//     benefits: ['음료 10% 할인', '사이즈업 무료'],
//     rating: 4.4,
//     distance: 160,
//     phone: '02-0123-4567',
//     hours: '06:00 - 24:00',
//   },

//   // 교육
//   {
//     id: '11',
//     name: '교보문고 강남점',
//     category: 'education',
//     address: '서울 강남구 역삼로 789',
//     latitude: 37.5012,
//     longitude: 127.0396,
//     benefits: ['도서 5% 할인', '전자책 무료 체험'],
//     rating: 4.6,
//     distance: 220,
//     phone: '02-1234-5670',
//     hours: '09:30 - 22:00',
//   },

//   // 여행/교통
//   {
//     id: '12',
//     name: '뚜루카 강남지점',
//     category: 'travel',
//     address: '서울 강남구 테헤란로 890',
//     latitude: 37.5067,
//     longitude: 127.0567,
//     benefits: ['렌터카 20% 할인', '장기대여 추가 혜택'],
//     rating: 4.1,
//     distance: 400,
//     imageUrl: '/images/mock/turucar.png',
//     phone: '02-2345-6781',
//     hours: '08:00 - 20:00',
//   },
// ];

// // 카테고리별 필터링 함수
// export const getPlatformsByCategory = (categoryId: string): Platform[] => {
//   if (categoryId === 'all') {
//     return mockPlatforms;
//   }
//   return mockPlatforms.filter((platform) => platform.category === categoryId);
// };

// // 검색어로 필터링 함수
// export const searchPlatforms = (query: string): Platform[] => {
//   if (!query.trim()) {
//     return mockPlatforms;
//   }

//   const searchTerm = query.toLowerCase();
//   return mockPlatforms.filter(
//     (platform) =>
//       platform.name.toLowerCase().includes(searchTerm) ||
//       platform.address.toLowerCase().includes(searchTerm) ||
//       platform.benefits.some((benefit) => benefit.toLowerCase().includes(searchTerm))
//   );
// };

// // 거리순 정렬 함수
// export const sortPlatformsByDistance = (platforms: Platform[]): Platform[] => {
//   return [...platforms].sort((a, b) => a.distance - b.distance);
// };

// // 평점순 정렬 함수
// export const sortPlatformsByRating = (platforms: Platform[]): Platform[] => {
//   return [...platforms].sort((a, b) => b.rating - a.rating);
// };
