export interface CouponHistory {
  historyId: number;
  userId: number;
  giftName: string;
  result: 'SUCCESS' | 'FAIL';
  usedDate: string;
}
