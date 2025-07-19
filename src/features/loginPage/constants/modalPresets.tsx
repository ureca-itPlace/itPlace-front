import type { ModalState } from '../components/verification/VerificationCodeForm';

export const modalPresets = {
  alreadyJoined: (goLogin: () => void, _close: () => void) =>
    ({
      open: true,
      title: '이미 가입된 계정이에요',
      message: '로그인 화면으로 이동하시겠어요?',
      subMessage: '',
      subMessageClass: '',
      buttons: [{ label: '로그인', onClick: goLogin, type: 'primary' }],
      onClose: _close, // _close 함수를 onClose prop에 연결
    }) as ModalState,

  mergeAccount: (onMerge: () => void, onCancel: () => void) =>
    ({
      open: true,
      title: '계정 통합 안내',
      message: '입력하신 정보로 기존 가입 내역이 확인되었습니다.',
      subMessage:
        '통합을 진행하면 기존 계정의 정보가 유지되며 앞으로는 \n 현재 로그인 방식으로 편리하게 서비스를 이용하실 수 있습니다.',
      subMessageClass: 'text-body-2 text-grey04 mt-[12px]',
      buttons: [
        {
          label: '그만하기',
          onClick: onCancel,
          type: 'secondary',
        },
        {
          label: '통합하기',
          onClick: onMerge,
          type: 'primary',
        },
      ],
      children: (
        <p className="text-body-3 text-danger mt-[20px] text-center">
          단! 동일한 이메일 주소와 휴대폰 번호로는 중복 가입이 불가능합니다.
        </p>
      ),
    }) as ModalState,

  uplusMember: (onUseData: () => void, onSkip: () => void) =>
    ({
      open: true,
      title: 'U+ 회원이시네요!',
      message: '기존 가입 정보를 불러오시겠습니까?',
      subMessage: '',
      subMessageClass: '',
      buttons: [
        { label: '아니요', onClick: onSkip, type: 'secondary' },
        { label: '예', onClick: onUseData, type: 'primary' },
      ],
    }) as ModalState,

  integrationSuccess: (onClose: () => void) =>
    ({
      open: true,
      title: '통합에 성공하셨습니다.',
      message: 'Itplace 계정과 카카오톡 계정/n모두 자유롭게 이용하실 수 있습니다.',
      subMessage: '',
      subMessageClass: '',
      buttons: [{ label: '확인', onClick: onClose, type: 'primary' }],
    }) as ModalState,
};
