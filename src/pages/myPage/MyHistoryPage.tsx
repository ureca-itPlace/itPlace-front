import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import api from '../../apis/axiosInstance';
import dayjs from 'dayjs';

import MyPageContentLayout from '../../features/myPage/layout/MyPageContentLayout';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import NoResult from '../../components/NoResult';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RiResetRightFill } from 'react-icons/ri';
import FadeWrapper from '../../features/myPage/components/FadeWrapper';

interface HistoryItem {
  image: string;
  benefitName: string;
  discountAmount: number;
  usedAt: string; // ISO 날짜 문자열
}

export default function MyHistoryPage() {
  // Redux 상태에서 사용자 정보 가져오기
  const user = useSelector((state: RootState) => state.auth.user);
  const membershipGrade = user?.membershipGrade ?? null;

  // 검색/필터/페이지네이션 상태
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0); // 0-based
  const [size] = useState(5);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // API 데이터 상태
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // 로딩 상태
  const [loading, setLoading] = useState(false);

  // ✅ 혜택 사용 이력 API 호출 (페이지/필터 변화 시 재호출)
  useEffect(() => {
    if (!membershipGrade) return; // 멤버십 없으면 호출 X

    const fetchHistory = async () => {
      try {
        const res = await api.get('/api/v1/membership-history', {
          params: {
            keyword: keyword || undefined,
            startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : undefined,
            endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : undefined,
            page,
            size,
          },
        });

        const data = res.data?.data;
        if (data && Array.isArray(data.content)) {
          setHistory(data.content);
          setCurrentPage(data.currentPage ?? 0);
          setTotalElements(data.totalElements ?? 0);
        } else {
          console.warn('⚠️ API 응답 구조가 예상과 다릅니다:', res.data);
          setHistory([]);
          setCurrentPage(0);
          setTotalElements(0);
        }
      } catch (err) {
        console.error('멤버십 이력 API 오류:', err);
        setHistory([]);
        setCurrentPage(0);
        setTotalElements(0);
      }
    };

    fetchHistory();
  }, [keyword, startDate, endDate, page, size, membershipGrade]);

  // ✅ 이번 달 총 할인 금액 API 호출 (mount 시 1회)
  useEffect(() => {
    if (!membershipGrade) return;

    const fetchSummary = async () => {
      try {
        const res = await api.get('/api/v1/membership-history/summary');
        const data = res.data?.data;
        setTotalAmount(data?.totalDiscountAmount ?? 0);
      } catch (err) {
        console.error('멤버십 요약 API 오류:', err);
        setTotalAmount(0);
      }
    };

    fetchSummary();
  }, [membershipGrade]);

  // 🔥 keyword, startDate, endDate가 바뀔 때마다 페이지를 0으로 초기화
  useEffect(() => {
    setPage(0);
  }, [keyword, startDate, endDate]);

  return (
    <MyPageContentLayout
      main={
        <div className="flex flex-col h-full">
          <h1 className="text-title-2 text-black mb-7">혜택 사용 이력</h1>

          {/* 🔎 검색바 + 날짜필터 */}
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

          {/* 📋 혜택 사용 이력 리스트 */}
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
            ) : (
              <div className="flex flex-col gap-5 pt-1">
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center border border-purple02 rounded-[10px] p-2"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <img
                        src={item.image}
                        alt={item.benefitName}
                        className="h-[70px] w-auto object-contain flex-shrink-0"
                      />
                      <span
                        className="ml-2 text-purple05 text-title-5 font-semibold overflow-hidden text-ellipsis whitespace-nowrap block"
                        title={item.benefitName}
                      >
                        {item.benefitName}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className="text-black text-title-5 font-semibold w-[120px] text-right">
                        {item.discountAmount.toLocaleString()}원
                      </span>
                      <span className="text-grey05 text-body-1 px-4">
                        {dayjs(item.usedAt).format('YYYY-MM-DD')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 페이지네이션 */}
          {
            <div className="mt-auto flex justify-center">
              <Pagination
                currentPage={currentPage + 1} // 0-based → 1-based
                itemsPerPage={size}
                totalItems={totalElements}
                onPageChange={(p) => setPage(p - 1)}
                width={37}
              />
            </div>
          }
        </div>
      }
      aside={
        <FadeWrapper changeKey={totalAmount.toLocaleString()}>
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
                <span className="text-orange04">{totalAmount.toLocaleString()}</span>
                원 <br /> 할인 받았어요!
              </p>
            </div>
          </div>
        </FadeWrapper>
      }
      bottomImage="/images/myPage/bunny-history.webp"
      bottomImageAlt="혜택 사용 이력 토끼"
      bottomImageFallback="/images/myPage/bunny-history.png"
    />
  );
}
