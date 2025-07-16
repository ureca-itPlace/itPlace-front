// import { useEffect, useRef, useState } from 'react';
// import gsap from 'gsap';
// import AuthInput from './AuthInput';
// import AuthFooter from './AuthFooter';
// import AuthButton from './AuthButton';
// import { TbClock } from 'react-icons/tb';
// import { checkVerificationCode } from '../apis/verification';
// import Modal from '../../../components/Modal';
// import { modalPresets } from '../constants/modalPresets';
// import { useNavigate } from 'react-router-dom';

// // 버튼 타입 정의
// interface ModalButton {
//   label: string;
//   onClick: () => void;
//   type: 'primary' | 'secondary';
// }

// // 모달 상태 타입 정의
// interface ModalState {
//   open: boolean;
//   title: string;
//   message: string;
//   subMessage?: string;
//   subMessageClass?: string;
//   buttons: ModalButton[];
// }

// type Props = {
//   onGoToLogin: () => void;
//   onVerified: () => void;
// };

// const VerificationCodeForm = ({ onGoToLogin, onVerified }: Props) => {
//   const [code, setCode] = useState('');
//   const [modal, setModal] = useState<ModalState>({
//     open: false,
//     title: '',
//     message: '',
//     subMessage: '',
//     subMessageClass: '',
//     buttons: [],
//   });

//   const wrapperRef = useRef<HTMLDivElement>(null);
//   const navigate = useNavigate();

//   // TODO: 실사용 시 props로 전달받기
//   const phone = '01000000000';

//   useEffect(() => {
//     gsap.fromTo(
//       wrapperRef.current,
//       { opacity: 0 },
//       { opacity: 1, duration: 0.5, ease: 'power2.out' }
//     );
//   }, []);

//   const handleResend = () => {
//     console.log('인증번호 재발송 클릭됨');
//     // TODO: 인증번호 재발송 API 호출 위치
//   };

//   const closeModal = () => {
//     setModal({
//       open: false,
//       title: '',
//       message: '',
//       subMessage: '',
//       subMessageClass: '',
//       buttons: [],
//     });
//   };

//   const handleVerify = async () => {
//     if (!code.trim()) return;

//     try {
//       const res = await checkVerificationCode(phone, code);
//       const { userStatus, isLocalUser, uplusDataExists, registrationId } = res.data;

//       // 기존 회원이면서 우리 플랫폼 가입자일 경우
//       if (userStatus === 'EXISTING_USER' && isLocalUser) {
//         setModal(modalPresets.alreadyJoined(() => navigate('/login'), closeModal));
//       }
//       // 기존 회원이지만 우리 플랫폼 가입자는 아닌 경우 (OAuth 통합)
//       else if (userStatus === 'EXISTING_USER') {
//         setModal(
//           modalPresets.mergeAccount(() => {
//             // TODO: 통합 처리 API 필요
//             console.log('계정 통합 실행');
//             closeModal();
//             onVerified();
//           }, closeModal)
//         );
//       }
//       // U+ 데이터 존재 시 → 간편가입 유도
//       else if (uplusDataExists) {
//         setModal(
//           modalPresets.uplusMember(
//             () => {
//               // TODO: U+ 데이터 자동 입력 처리
//               console.log('U+ 정보 사용');
//               closeModal();
//               onVerified();
//             },
//             () => {
//               closeModal();
//               onVerified(); // 사용하지 않아도 다음 단계로 진행
//             }
//           )
//         );
//       }
//       // 신규 가입자
//       else {
//         onVerified();
//       }
//     } catch (error) {
//       console.warn('백엔드 연결 전이므로 강제로 다음으로 넘깁니다.');
//       onVerified();
//     }
//   };

//   return (
//     <>
//       <div ref={wrapperRef} className="w-full flex flex-col items-center">
//         {/* 제목 */}
//         <div className="text-left w-[320px]">
//           <p className="text-title-4">
//             보내드린 <span className="font-semibold">인증번호 6자리</span>를
//           </p>
//           <p className="text-title-4">입력해주세요</p>
//         </div>

//         {/* 인증번호 입력 */}
//         <AuthInput
//           name="code"
//           placeholder="인증번호"
//           value={code}
//           onChange={(e) => setCode(e.target.value)}
//           className="mt-[48px]"
//         />

//         {/* 타이머 + 안내 텍스트 */}
//         <div className="text-body-3 text-grey03 mt-[20px] w-[320px] flex items-center gap-[4px]">
//           <TbClock size={16} className="text-grey03" />
//           <span>남은 시간</span>
//           <span className="text-danger font-medium">2:58</span>
//         </div>

//         <div className="text-body-3 text-grey03 mt-[13px] w-[320px]">
//           인증 번호를 받지 못하셨나요?{' '}
//           <span onClick={handleResend} className="text-purple04 font-medium cursor-pointer">
//             다시 보내기
//           </span>
//         </div>

//         {/* 다음 버튼 */}
//         <AuthButton
//           label="다음"
//           onClick={handleVerify}
//           variant={code.trim() ? 'default' : 'disabled'}
//           className="mt-[180px]"
//         />

//         {/* 하단 링크 */}
//         <AuthFooter
//           leftText="이미 회원이신가요?"
//           rightText="로그인 하러 가기"
//           onRightClick={onGoToLogin}
//         />
//       </div>

//       {/* 공통 모달 */}
//       <Modal
//         isOpen={modal.open}
//         title={modal.title}
//         message={modal.message}
//         subMessage={modal.subMessage}
//         subMessageClass={modal.subMessageClass}
//         buttons={modal.buttons}
//         onClose={closeModal}
//       />
//     </>
//   );
// };

// export default VerificationCodeForm;
