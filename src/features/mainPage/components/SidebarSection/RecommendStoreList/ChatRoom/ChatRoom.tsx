import React from 'react';
import LoadingSpinner from '../../../../../../components/LoadingSpinner';
import { getRecommendation, RecommendationError } from '../../../../api/recommendChatApi';
import { getCurrentLocation } from '../../../../api/storeApi';

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
}

const ChatRoom: React.FC<ChatRoomProps> = ({ onClose }) => {
  const [isBotLoading, setIsBotLoading] = React.useState(false);
  const [input, setInput] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = React.useState(false);

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

  // 컴포넌트 마운트/언마운트 시 body 스타일 관리
  React.useEffect(() => {
    // 컴포넌트 마운트 시 현재 스크롤 위치 저장
    const originalScrollY = window.scrollY;

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
  }, []);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

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
      void handleSend();
    }
  };

  // 예시 질문 버튼 클릭 처리 (바로 전송)
  const handleExampleClick = async (question: string) => {
    setInput(question);

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
      setInput(''); // 입력창 초기화
    }
  };

  // 예시 질문들
  const exampleQuestions = [
    '근처 맛집 추천해줘',
    '카페 갈 만한 곳 있어?',
    '쇼핑할 수 있는 곳 알려줘',
    '영화관 어디 있지?',
  ];

  return (
    <div
      className="bg-white rounded-[18px] shadow-lg border border-grey02 p-0 flex flex-col items-center relative"
      style={{
        width: '100%',
        height: '60vh',
        maxWidth: '100%',
        minWidth: '220px',
        overflow: 'hidden',
        // 위치를 고정하여 다른 요소들에 영향을 주지 않도록
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* 상단 프로필/타이틀 */}
      <div className="w-full flex items-center gap-3 px-5 pt-5 pb-4 relative">
        <span className="text-title-6 text-purple04 flex-1 text-center">잇플AI 채팅방</span>
        <button
          className="text-grey03 hover:text-grey04 text-title-3 absolute right-5 top-4"
          onClick={handleClose}
          aria-label="채팅방 닫기"
        >
          ×
        </button>
      </div>
      {/* 안내 문구 삭제됨, 챗봇이 첫 메시지로 안내함 */}

      {/* 메시지 영역 */}
      <div
        className="overflow-y-auto border border-grey02 p-4 bg-grey01 w-full"
        style={{ flex: 1, maxHeight: '50vh', height: '100%' }}
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
              <div className="text-body-4 text-grey04 mb-2">예시 질문:</div>
              {exampleQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleExampleClick(question)}
                  className="block w-full text-left px-3 py-2 bg-purple01 hover:bg-purple02 text-purple04 text-body-4 rounded-[8px] transition-colors"
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
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'bot' && (
                    <img
                      src="/images/main/mainCharacter.webp"
                      alt="잇콩이"
                      className="w-7 h-7 rounded-full border border-purple02 bg-white mr-2"
                    />
                  )}
                  <span
                    className={`px-4 py-2 max-w-none break-words shadow ${
                      msg.sender === 'user'
                        ? 'bg-purple04 text-white text-body-3 rounded-[10px]'
                        : 'bg-white text-black text-body-3 rounded-[10px] break-words'
                    }`}
                  >
                    {msg.text}
                  </span>
                </div>

                {/* 제휴업체 카드 */}
                {msg.sender === 'bot' && msg.partners && msg.partners.length > 0 && (
                  <div className="mt-2 ml-9 w-full max-w-[90%]">
                    <div className="grid grid-cols-1 gap-2">
                      {msg.partners.map((partner, partnerIdx) => (
                        <div
                          key={partnerIdx}
                          className="bg-white border border-grey02 rounded-[10px] p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={partner.imgUrl}
                              alt={partner.partnerName}
                              className="w-12 h-12 rounded-lg object-cover border border-grey02"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/thumbnail.png';
                              }}
                            />
                            <div className="flex-1">
                              <h4 className="text-body-2-bold text-grey05">
                                {partner.partnerName}
                              </h4>
                              <p className="text-body-4 text-grey04 mt-1">제휴업체</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isBotLoading && (
              <div className="flex justify-start items-center mt-2">
                <img
                  src="\images\main\mainCharacter.webp"
                  alt="잇콩이"
                  className="w-7 h-7 rounded-full border border-grey02 bg-white mr-2"
                />
                <div className="flex items-center px-4 py-2 max-w-[70%] break-words shadow bg-white text-black text-body-3 rounded-[10px]">
                  <LoadingSpinner className="mr-2 h-5 w-5 border-2 border-purple04 border-t-transparent" />
                  <span>답변을 준비 중이에요...</span>
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
          className="bg-purple04 text-white px-5 mt-4 rounded-[10px] text-body-3 hover:bg-purple03"
          style={{ height: '44px', minHeight: '44px', paddingTop: '0', paddingBottom: '0' }}
          onClick={() => void handleSend()}
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
