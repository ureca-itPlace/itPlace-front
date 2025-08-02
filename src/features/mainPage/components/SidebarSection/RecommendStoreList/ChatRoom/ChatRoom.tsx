import React from 'react';
import { createPortal } from 'react-dom';
import { TbSend, TbRefresh, TbX } from 'react-icons/tb';
import LoadingSpinner from '../../../../../../components/LoadingSpinner';
import { getRecommendation, RecommendationError } from '../../../../api/recommendChatApi';
import { getCurrentLocation } from '../../../../api/storeApi';
import { useResponsive } from '../../../../../../hooks/useResponsive';

interface Partner {
  partnerName: string;
  imgUrl: string;
}

interface Message {
  sender: 'user' | 'bot';
  text: string;
  partners?: Partner[];
}

interface ChatRoomProps {
  onClose: () => void;
  onSearchPartner?: (partnerName: string) => void;
  onChangeTab?: (tabId: string) => void;
  onBottomSheetReset?: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({
  onClose,
  onSearchPartner,
  onChangeTab,
  onBottomSheetReset,
}) => {
  const { isMobile, isTablet } = useResponsive();
  const [isBotLoading, setIsBotLoading] = React.useState(false);
  const [input, setInput] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [showClearConfirm, setShowClearConfirm] = React.useState(false);

  // sessionStorage에서 메시지 복원
  const getInitialMessages = (): Message[] => {
    const saved = sessionStorage.getItem('chatMessages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // 파싱 실패 시 기본값 반환
      }
    }
    return [{ sender: 'bot', text: '궁금한 점을 자유롭게 물어보세요!' }];
  };

  const [messages, setMessages] = React.useState<Message[]>(getInitialMessages());

  // 컴포넌트 마운트 시 sessionStorage에서 메시지 복원
  React.useEffect(() => {
    const saved = sessionStorage.getItem('chatMessages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (error) {
        console.warn('sessionStorage 복원 실패:', error);
      }
    }
    setIsInitialized(true);
  }, []);

  // 메시지 변경 시 sessionStorage에 저장 (초기화 완료 후에만)
  React.useEffect(() => {
    if (isInitialized) {
      sessionStorage.setItem('chatMessages', JSON.stringify(messages));
    }
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isBotLoading, isInitialized]);

  // 채팅방 닫기 (세션 유지)
  const handleClose = () => {
    onClose();
  };

  // 채팅 내용 초기화
  const handleClearChat = () => {
    const initialMessages: Message[] = [
      { sender: 'bot', text: '궁금한 점을 자유롭게 물어보세요!' },
    ];
    setMessages(initialMessages);
    sessionStorage.setItem('chatMessages', JSON.stringify(initialMessages));
    setShowClearConfirm(false);
  };

  // 컴포넌트 마운트/언마운트 시 body 스타일 관리
  React.useEffect(() => {
    // 컴포넌트 마운트 시 현재 스크롤 위치 저장
    const originalScrollY = window.scrollY;

    // 모바일에서 바텀시트를 초기 상태로 리셋
    if (onBottomSheetReset && window.innerWidth < 768) {
      onBottomSheetReset();
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      // body 스타일 초기화
      document.body.style.height = '';
      document.body.style.overflow = '';
      document.body.style.position = '';

      // 스크롤 위치 복원 (더 확실하게)
      requestAnimationFrame(() => {
        window.scrollTo(0, originalScrollY);
      });
    };
  }, [onBottomSheetReset]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isBotLoading) return; // 로딩 중이면 전송 방지

    // 사용자 메시지 추가
    setMessages((prev) => [...prev, { sender: 'user', text: trimmed }]);
    setInput('');
    setIsBotLoading(true);

    try {
      // 현재 위치 가져오기 (실패 시 기본 위치 사용)
      let location;
      try {
        location = await getCurrentLocation();
      } catch (locationError) {
        console.warn('위치 정보를 가져올 수 없어 기본 위치를 사용합니다:', locationError);
        // 기본 위치: 서울시청
        location = { lat: 37.5665, lng: 126.978 };
      }

      // API 호출
      const response = await getRecommendation({
        question: trimmed,
        lat: location.lat,
        lng: location.lng,
      });

      // 봇 응답 추가
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: response.data.reason,
          partners: response.data.partners,
        },
      ]);
    } catch (error) {
      console.error('추천 정보를 가져오는 중 오류가 발생했습니다:', error);

      let errorMessage =
        '죄송합니다. 현재 추천 정보를 가져올 수 없습니다. 잠시 후 다시 시도해주세요.';

      // 구체적인 오류 처리
      if (error instanceof RecommendationError) {
        switch (error.code) {
          case 'FORBIDDEN_WORD_DETECTED':
            errorMessage =
              '죄송합니다. 부적절한 내용이 포함된 질문입니다. 다른 질문으로 시도해주세요.';
            break;
          case 'NO_STORE_FOUND':
            errorMessage =
              '현재 위치 주변에 해당하는 제휴처가 없습니다. 다른 지역이나 다른 키워드로 검색해보세요.';
            break;
          case 'INTERNAL_SERVER_ERROR':
            errorMessage =
              '현재 AI 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
            break;
          default:
            errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        // 일반 Error 객체 처리
        errorMessage = error.message;
      }

      // 오류 발생 시 기본 응답
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: errorMessage,
        },
      ]);
    } finally {
      setIsBotLoading(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 기본 동작 방지
      void handleSend();
    }
  };

  // 예시 질문 버튼 클릭 처리 (바로 전송)
  const handleExampleClick = async (question: string) => {
    if (isBotLoading) return; // 로딩 중이면 실행 방지

    // 사용자 메시지 추가
    setMessages((prev) => [...prev, { sender: 'user', text: question }]);
    setIsBotLoading(true);

    try {
      // 현재 위치 가져오기 (실패 시 기본 위치 사용)
      let location;
      try {
        location = await getCurrentLocation();
      } catch (locationError) {
        console.warn('위치 정보를 가져올 수 없어 기본 위치를 사용합니다:', locationError);
        // 기본 위치: 서울시청
        location = { lat: 37.5665, lng: 126.978 };
      }

      // API 호출
      const response = await getRecommendation({
        question,
        lat: location.lat,
        lng: location.lng,
      });

      // 봇 응답 추가
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: response.data.reason,
          partners: response.data.partners,
        },
      ]);
    } catch (error) {
      console.error('추천 정보를 가져오는 중 오류가 발생했습니다:', error);

      let errorMessage =
        '죄송합니다. 현재 추천 정보를 가져올 수 없습니다. 잠시 후 다시 시도해주세요.';

      // 구체적인 오류 처리
      if (error instanceof RecommendationError) {
        switch (error.code) {
          case 'FORBIDDEN_WORD_DETECTED':
            errorMessage =
              '죄송합니다. 부적절한 내용이 포함된 질문입니다. 다른 질문으로 시도해주세요.';
            break;
          case 'NO_STORE_FOUND':
            errorMessage =
              '현재 위치 주변에 해당하는 제휴처가 없습니다. 다른 지역이나 다른 키워드로 검색해보세요.';
            break;
          case 'INTERNAL_SERVER_ERROR':
            errorMessage =
              '현재 AI 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
            break;
          default:
            errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        // 일반 Error 객체 처리
        errorMessage = error.message;
      }

      // 오류 발생 시 기본 응답
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: errorMessage,
        },
      ]);
    } finally {
      setIsBotLoading(false);
    }
  };

  // 예시 질문들
  const exampleQuestions = [
    '근처 관광지 추천해줘',
    '카페 갈 만한 곳 있어?',
    '쇼핑할 수 있는 곳 알려줘',
    '테마파크 갈 만한 곳 있어?',
  ];

  // 제휴업체 카드 클릭 처리
  const handlePartnerClick = (partnerName: string) => {
    if (onSearchPartner) {
      onSearchPartner(partnerName);
    }
    if (onChangeTab) {
      onChangeTab('ai'); // 잇플AI 추천 탭 유지
    }
    // 채팅방 닫기
    onClose();
  };

  // 채팅방 JSX 컴포넌트
  const chatRoomContent = (
    <div
      className={`bg-white rounded-[18px] shadow-lg border border-grey02 p-0 flex flex-col items-center z-[9999] ${
        isMobile || isTablet ? '' : 'h-full'
      }`}
      style={
        isMobile || isTablet
          ? {
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90vw',
              maxWidth: '400px',
              height: '70vh',
              maxHeight: '600px',
              minHeight: '400px',
              overflow: 'hidden',
              zIndex: 9999,
              boxShadow:
                '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            }
          : {
              height: '60vh',
              maxHeight: '60vh',
              minHeight: '500px',
              overflow: 'hidden',
            }
      }
    >
      {/* 상단 프로필/타이틀 */}
      <div className="w-full flex items-center justify-end px-5 pt-5 pb-4 relative">
        <span className="absolute left-1/2 transform -translate-x-1/2 text-title-6 text-purple04">
          잇플AI 채팅방
        </span>
        <div className="flex items-center gap-2">
          {/* 채팅 초기화 버튼 */}
          <button
            className="text-grey03 hover:text-grey04 text-title-4 transition-colors"
            onClick={() => setShowClearConfirm(true)}
            aria-label="채팅 내용 초기화"
          >
            <TbRefresh />
          </button>
          {/* 닫기 버튼 */}
          <button
            className="text-grey03 hover:text-grey04 text-title-4"
            onClick={handleClose}
            aria-label="채팅방 닫기"
          >
            <TbX />
          </button>
        </div>
      </div>
      {/* 안내 문구 삭제됨, 챗봇이 첫 메시지로 안내함 */}

      {/* 메시지 영역 */}
      <div
        className="overflow-y-auto border-l border-r border-grey02 p-4 bg-grey01 w-full"
        style={{ flex: 1, maxHeight: isMobile || isTablet ? '50vh' : 'none', height: '100%' }}
      >
        {messages.length === 1 && messages[0].sender === 'bot' ? (
          // 초기 상태일 때 예시 질문 버튼들 표시
          <div className="space-y-3">
            {/* 봇의 첫 메시지 */}
            <div className="flex flex-col items-start">
              <div className="flex justify-start">
                <img
                  src="/images/main/mainCharacter.webp"
                  alt="잇콩이"
                  className="w-7 h-7 rounded-full border border-purple02 bg-white mr-2"
                />
                <span className="px-4 py-2 max-w-none break-words shadow bg-white text-black text-body-3 rounded-[10px]">
                  {messages[0].text}
                </span>
              </div>
            </div>

            {/* 예시 질문 버튼들 */}
            <div className="ml-9 space-y-2">
              <div className="text-body-4 text-grey04 mb-2">아래와 같이 질문해보세요 🐰</div>
              {exampleQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleExampleClick(question)}
                  className="block w-full text-left px-3 py-2 bg-white hover:bg-purple01 text-purple04 text-body-4 rounded-[10px] transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-grey05 text-body-3 text-center py-10">
            잇콩이에게 궁금한 점을 물어보세요!
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, idx) => {
              // 사용자 메시지
              if (msg.sender === 'user') {
                return (
                  <div key={idx} className="flex justify-end">
                    <div style={{ maxWidth: '80%' }}>
                      <span
                        className="inline-block px-4 py-2 shadow bg-purple04 text-white text-body-3 font-light rounded-[10px]"
                        style={{
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          wordBreak: 'break-word',
                        }}
                      >
                        {msg.text}
                      </span>
                    </div>
                  </div>
                );
              }

              // 봇 메시지
              return (
                <div key={idx} className="flex items-start gap-2">
                  <img
                    src="/images/main/mainCharacter.webp"
                    alt="잇콩이"
                    className="w-7 h-7 rounded-full border border-purple02 bg-white flex-shrink-0"
                  />
                  <div className="flex flex-col gap-2" style={{ maxWidth: 'calc(100% - 2.25rem)' }}>
                    <span className="px-4 py-2 break-words shadow bg-white text-black text-body-3 font-light rounded-[10px]">
                      {msg.text}
                    </span>
                    {/* 제휴업체 카드 */}
                    {msg.partners && msg.partners.length > 0 && (
                      <div className="w-full">
                        <div className="grid grid-cols-1 gap-2">
                          {msg.partners.map((partner, partnerIdx) => (
                            <div
                              key={partnerIdx}
                              className="bg-white rounded-[10px] p-3 shadow hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => handlePartnerClick(partner.partnerName)}
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={partner.imgUrl}
                                  alt={partner.partnerName}
                                  className="w-12 h-12 rounded-lg object-contain border border-grey02"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/images/thumbnail.png';
                                  }}
                                />
                                <div className="flex-1">
                                  <h4 className="text-body-2-bold text-grey05">
                                    {partner.partnerName}
                                  </h4>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {isBotLoading && (
              <div className="flex justify-start items-center mt-2">
                <img
                  src="/images/main/mainCharacter.webp"
                  alt="잇콩이"
                  className="w-7 h-7 rounded-full border border-grey02 bg-white mr-2"
                />
                <div className="flex items-center justify-center px-4 py-2 max-w-[90%] break-words shadow bg-white text-black text-body-3 font-light rounded-[10px]">
                  <LoadingSpinner className="mr-4 h-4 w-4 border-2 border-purple04 border-t-transparent" />
                  <span className="text-center">답변을 준비 중이에요...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      {/* 입력창 영역 */}
      <div className="w-full px-5 pb-5 bg-white flex gap-2 items-center">
        <input
          type="text"
          className="flex-1 rounded-[10px] px-4 mt-4 text-body-3 bg-grey01 focus:bg-white focus:outline-purple03"
          style={{ height: '44px', minHeight: '44px' }}
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        <button
          className={`bg-purple04 text-white mt-4 rounded-[10px] text-body-3 hover:bg-purple03 flex items-center justify-center ${isMobile || isTablet ? 'px-2 min-w-[40px]' : 'px-5'}`}
          style={{ height: '44px', minHeight: '44px', paddingTop: '0', paddingBottom: '0' }}
          onClick={() => void handleSend()}
        >
          <TbSend size={22} />
        </button>
      </div>

      {/* 채팅 초기화 확인 모달 */}
      {showClearConfirm && (
        <div className="absolute inset-0 flex items-center justify-center z-50 rounded-[18px]">
          <div className="bg-white rounded-[12px] p-6 mx-4 max-w-xs w-full shadow-lg border border-grey02">
            <h3 className="text-title-6 text-grey05 mb-3 text-center">채팅 내용 초기화</h3>
            <p className="text-body-3 text-grey04 mb-6 text-center">
              모든 대화 내용이 삭제됩니다.
              <br />
              정말 초기화하시겠습니까?
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2 text-body-3 text-grey04 bg-grey01 hover:bg-grey02 rounded-[8px] transition-colors"
                onClick={() => setShowClearConfirm(false)}
              >
                취소
              </button>
              <button
                className="flex-1 px-4 py-2 text-body-3 text-white bg-purple04 hover:bg-purple03 rounded-[8px] transition-colors"
                onClick={handleClearChat}
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // 모바일/태블릿에서는 포털로 렌더링, 웹에서는 직접 렌더링
  if (isMobile || isTablet) {
    return createPortal(chatRoomContent, document.body);
  }

  return chatRoomContent;
};

export default ChatRoom;
