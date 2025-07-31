import React from 'react';
import LoadingSpinner from '../../../../../../components/LoadingSpinner';

interface ChatRoomProps {
  onClose: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ onClose }) => {
  const [isBotLoading, setIsBotLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<{ sender: 'user' | 'bot'; text: string }[]>([
    { sender: 'bot', text: '궁금한 점을 자유롭게 물어보세요!' },
  ]);
  const [input, setInput] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isBotLoading]);

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

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    // 사용자 메시지 추가
    setMessages((prev) => [...prev, { sender: 'user', text: trimmed }]);
    setInput('');
    setIsBotLoading(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '잇콩이가 답변을 준비 중이에요! (예시 답변)' },
      ]);
      setIsBotLoading(false);
    }, 700);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

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
        <span className="font-bold text-title-6 text-purple04 flex-1 text-center">
          잇플AI 채팅방
        </span>
        <button
          className="text-grey03 hover:text-grey04 text-title-3 absolute right-5 top-4"
          onClick={onClose}
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
        {messages.length === 0 ? (
          <div className="text-grey05 text-sm text-center py-10">
            잇콩이에게 궁금한 점을 물어보세요!
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <img
                    src="\images\main\mainCharacter.webp"
                    alt="잇콩이"
                    className="w-7 h-7 rounded-full border border-purple02 bg-white mr-2"
                  />
                )}
                <span
                  className={`inline-block px-4 py-2 max-w-[70%] break-words shadow ${
                    msg.sender === 'user'
                      ? 'bg-purple04 text-white text-body-3 rounded-[10px]'
                      : 'bg-white text-black text-body-3 rounded-[10px]'
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            {isBotLoading && (
              <div className="flex justify-start items-center mt-2">
                <img
                  src="\images\main\mainCharacter.webp"
                  alt="잇콩이"
                  className="w-7 h-7 rounded-full border border-grey04 bg-white mr-2"
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
          onClick={handleSend}
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
