import type { ModalState } from '../components/VerificationCodeForm';

export const modalPresets = {
  alreadyJoined: (goLogin: () => void, close: () => void) =>
    ({
      open: true,
      title: '이미 가입된 계정이에요요',
      subMessage: '',
      subMessageClass: '',
      buttons: [{ label: '로그인', onClick: goLogin, type: 'primary' }],
    }) as ModalState,
  //

  mergeAccount: (onMerge: () => void, close: () => void) =>
    ({
      open: true,
      title: '계정 통합 안내내',
      message: '입력하신 정보로',
      subMessage: '',
      subMessageClass: '',
      buttons: [{ label: '통합하기', onClick: onMerge, type: 'primary' }],
    }) as ModalState,

  uplusMember: (onUseData: () => void, onSkip: () => void) =>
    ({
      open: true,
      title: 'U+ 회원이시네요!',
      message: '기존 가입 정보를 불러오시겠습니까?',
      buttons: [
        { label: '아니요', onClick: onSkip, type: 'secondary' },
        { label: '예', onClick: onUseData, type: 'primary' },
      ],
    }) as ModalState,
};
