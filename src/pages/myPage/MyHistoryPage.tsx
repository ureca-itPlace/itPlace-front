import { useEffect, useState } from 'react';
import MyPageContentLayout from '../../features/myPage/layout/MyPageContentLayout';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import NoResult from '../../components/NoResult';
import { mockHistory } from '../../features/myPage/mock/mockHistory';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RiResetRightFill } from 'react-icons/ri';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../store';

interface HistoryItem {
  image: string;
  benefitName: string;
  discountAmount: number;
  usedAt: string; // ISO 날짜 문자열
}

export default function MyHistoryPage() {
  // const user = useSelector((state: RootState) => state.auth.user);
  // const membershipGrade = user?.membershipGrade; // 없으면 null
  const membershipGrade = 'vvip'; //임시 데이터

  // 검색, 필터, 페이지네이션 상태
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // 데이터 상태
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filtered, setFiltered] = useState<HistoryItem[]>([]);
  const [currentItems, setCurrentItems] = useState<HistoryItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // 초기 목데이터 로드
  useEffect(() => {
    setHistory(mockHistory);
  }, []);

  // 검색과 날짜 필터 적용
  useEffect(() => {
    let list = [...history];

    if (keyword.trim()) {
      list = list.filter((item) => item.benefitName.toLowerCase().includes(keyword.toLowerCase()));
    }

    if (startDate) {
      list = list.filter((item) => new Date(item.usedAt) >= startDate);
    }

    if (endDate) {
      list = list.filter((item) => new Date(item.usedAt) <= endDate);
    }

    setFiltered(list);
    setPage(0);
  }, [keyword, startDate, endDate, history]);

  // 페이지네이션 처리
  useEffect(() => {
    const start = page * size;
    const end = start + size;
    setCurrentItems(filtered.slice(start, end));
  }, [filtered, page, size]);

  // history 전체 기준으로 계산: api연결 후에는 이번 달 계산값만 알아서 나옴
  useEffect(() => {
    const amount = history.reduce((acc, cur) => acc + cur.discountAmount, 0);
    setTotalAmount(amount);
  }, [history]);

  return (
    <MyPageContentLayout
      main={
        <div className="flex flex-col h-full">
          <h1 className="text-title-2 text-black mb-7">혜택 사용 이력</h1>

          {/* 검색바 + 날짜필터 */}
          <div className="flex justify-between mb-8 gap-2">
            <SearchBar
              placeholder="혜택명으로 검색하기"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onClear={() => setKeyword('')}
              width={280}
              height={50}
              backgroundColor="bg-grey01"
            />
            <div className="flex gap-2 items-center">
              <button
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                }}
                className="text-purple04 hover:text-purple05 text-body-0"
              >
                <RiResetRightFill />
              </button>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="시작 날짜"
                className="border border-grey03 rounded-[12px] px-2 h-[50px] w-[120px] placeholder:text-grey05 placeholder:font-normal placeholder:text-center outline-none focus:border-purple04"
              />
              <span className="text-grey05">~</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="종료 날짜"
                className="border border-grey03 rounded-[12px] px-2 h-[50px] w-[120px] placeholder:text-grey05 placeholder:font-normal placeholder:text-center outline-none focus:border-purple04"
              />
            </div>
          </div>

          {/* 혜택 사용 이력 리스트 or NoResult */}
          <div className="flex-grow">
            {membershipGrade == null ? (
              <div className="mt-28">
                <NoResult
                  message1="앗! 멤버십 등급이 없어 결과를 조회할 수 없어요"
                  message2="유플러스 회원이시라면 회원 정보 연동 후 이용할 수 있어요."
                  buttonText="회원 정보 연동하러가기"
                  buttonRoute="/myPage/info"
                />
              </div>
            ) : history.length === 0 ? (
              <div className="mt-28">
                <NoResult
                  message1="아직 받은 혜택이 없어요!"
                  message2="가까운 제휴처의 혜택을 찾아보세요."
                  buttonText="근처 혜택 보러가기"
                  buttonRoute="/benefits"
                />
              </div>
            ) : filtered.length === 0 ? (
              <div className="mt-28">
                <NoResult
                  message1="앗! 일치하는 결과를 찾을 수 없어요!"
                  message2="다른 키워드나 조건으로 다시 찾아보세요."
                />
              </div>
            ) : (
              <div className="flex flex-col gap-5 pt-1">
                {currentItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center border border-purple02 rounded-[10px] p-2"
                  >
                    {/* 왼쪽: 이미지 + 이름 */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <img
                        src={item.image}
                        alt={item.benefitName}
                        className="h-[70px] w-auto object-contain flex-shrink-0"
                      />
                      <span
                        className="ml-2 
        text-purple05 text-title-5 font-semibold
        overflow-hidden text-ellipsis whitespace-nowrap
        block
      "
                        title={item.benefitName}
                      >
                        {item.benefitName}
                      </span>
                    </div>

                    {/* 오른쪽: 가격 + 날짜를 묶음 */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className="text-black text-title-5 font-semibold w-[120px] text-right">
                        {item.discountAmount.toLocaleString()}원
                      </span>
                      <span className="text-grey05 text-body-1 px-4">{item.usedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 페이지네이션 */}
          {membershipGrade !== null && history.length > size && (
            <div className="mt-auto flex justify-center">
              <Pagination
                currentPage={page + 1} // 보정
                itemsPerPage={size}
                totalItems={filtered.length}
                onPageChange={(p) => setPage(p - 1)}
                width={37}
              />
            </div>
          )}
        </div>
      }
      aside={
        <div className="text-center">
          <h1 className="text-title-2 text-black mb-4 text-center">이번 달에 받은 혜택 금액</h1>
          <div className="flex flex-col items-center justify-center mt-6">
            <img
              src="/images/myPage/icon-money.webp"
              alt="혜택 사용 이력 아이콘"
              className="w-[250px] h-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/images/myPage/icon-money.png';
              }}
            />

            <p className="text-[36px] font-semibold text-grey05 pt-10">
              <span className="text-orange04">
                {membershipGrade !== null && history.length > 0
                  ? totalAmount.toLocaleString()
                  : '0'}
              </span>
              원 <br /> 할인 받았어요!
            </p>
          </div>
        </div>
      }
      bottomImage="/images/myPage/bunny-history.webp"
      bottomImageAlt="혜택 사용 이력 토끼"
      bottomImageFallback="/images/myPage/bunny-history.png"
    />
  );
}
