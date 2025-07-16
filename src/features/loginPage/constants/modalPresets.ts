// features/auth/constants/modalPresets.ts

export const modalPresets = {
  // 계정 통합 안내 모달
  mergeAccount: (onMerge: () => void, onCancel: () => void) => ({
    open: true,
    title: '계정 통합 안내',
    message:
      '입력하신 정보로 기존 가입 내역이 확인되었습니다.\n\n통합을 진행하면 기존 계정의 정보가 유지되며 앞으로는 현재 로그인 방식으로 편리하게 서비스를 이용하실 수 있습니다.',
    subMessage: '단! 동일한 이메일 주소와 휴대폰 번호로는 중복 가입이 불가능합니다.',
    subMessageClass: 'text-danger text-body-1 mt-4',
    buttons: [
      { label: '다음에 하기', onClick: onCancel, type: 'secondary' },
      { label: '통합하기', onClick: onMerge, type: 'primary' },
    ],
  }),

  // 이미 가입된 계정일 때
  alreadyJoined: (onLogin: () => void, onCancel: () => void) => ({
    open: true,
    title: '이미 가입된 계정입니다',
    message: '입력하신 정보로 이미 회원가입된 내역이 있습니다.\n로그인 화면으로 이동하시겠습니까?',
    subMessage: '',
    subMessageClass: '',
    buttons: [
      { label: '아니요', onClick: onCancel, type: 'secondary' },
      { label: '예', onClick: onLogin, type: 'primary' },
    ],
  }),

  // U+ 회원일 경우 간편가입 유도
  uplusMember: (onUse: () => void, onSkip: () => void) => ({
    open: true,
    title: '유플러스 회원이시네요!',
    message: '기본 가입 정보를 불러오시겠습니까?',
    subMessage: '',
    subMessageClass: '',
    buttons: [
      { label: '아니요', onClick: onSkip, type: 'secondary' },
      { label: '예', onClick: onUse, type: 'primary' },
    ],
  }),
};
