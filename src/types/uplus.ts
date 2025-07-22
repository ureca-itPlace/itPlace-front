// src/types/uplus.ts
export interface UplusData {
  name: string;
  phoneNumber: string;
  gender: string;
  birthday: string; // "20000101"
  membershipId: string;
}

export interface UplusSuccessResponse {
  code: 'UPLUS_DATA_FOUND';
  status: 'OK';
  message: string;
  data: UplusData;
  timestamp: string;
}

export interface UplusErrorResponse {
  code: 'UPLUS_DATA_NOT_FOUND';
  status: 'BAD_REQUEST';
  message: string;
  data: null;
  timestamp: string;
}
