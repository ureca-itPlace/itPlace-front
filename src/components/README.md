# 공통 컴포넌트 가이드

## 컴포넌트 목록

재사용 가능한 공통 컴포넌트들입니다. 관리자 페이지, 마이페이지, 전체 혜택 페이지, 메인페이지 등에서 사용할 수 있습니다.

## Common 폴더 컴포넌트

### 1. StatisticsCard

상단 정보 카드 컴포넌트입니다.

```tsx
import { StatisticsCard } from '../../../../components/common';

<StatisticsCard
  title="회원 수"
  value={12345}
  subtitle="명"
  borderColor="border-l-purple04"
  valueColor="text-purple04"
  subtitleColor="text-black"
  width={344}
  height={87}
/>;
```

**Props:**

- `title`: string - 카드 제목
- `value`: string | number - 표시할 값
- `subtitle?`: string - 부제목 (선택사항)
- `borderColor?`: string - 왼쪽 경계선 색상 (Tailwind 클래스)
- `valueColor?`: string - 값 텍스트 색상 (Tailwind 클래스)
- `subtitleColor?`: string - 부제목 텍스트 색상 (Tailwind 클래스)
- `width?`: number - 카드 너비 (기본값: 344)
- `height?`: number - 카드 높이 (기본값: 87)

### 2. SearchBar

검색창 컴포넌트입니다.

```tsx
import { SearchBar } from '../../../../components/common';

<SearchBar
  placeholder="회원 검색"
  value={searchTerm}
  onChange={handleSearchChange}
  onClear={() => setSearchTerm('')}
  width={344}
  height={50}
  backgroundColor="bg-grey01"
/>;
```

**Props:**

- `placeholder`: string - 입력창 플레이스홀더
- `value`: string - 현재 입력값
- `onChange`: (e: React.ChangeEvent<HTMLInputElement>) => void - 입력 변경 핸들러
- `onClear`: () => void - 클리어 버튼 클릭 핸들러
- `width?`: number - 검색창 너비 (기본값: 344)
- `height?`: number - 검색창 높이 (기본값: 50)
- `backgroundColor?`: string - 배경색 (Tailwind 클래스, 기본값: 'bg-white')

### 3. FilterDropdown

필터 드롭다운 컴포넌트입니다.

```tsx
import { FilterDropdown } from '../../../../components/common';

const filterGroups = [
  {
    title: '카테고리',
    options: [
      { label: '전체', value: '전체' },
      { label: '편의점', value: '편의점' },
    ],
    selectedValue: selectedCategory,
    onSelect: handleCategoryFilter,
  },
];

<FilterDropdown
  isOpen={showFilterDropdown}
  onToggle={() => setShowFilterDropdown(!showFilterDropdown)}
  filterGroups={filterGroups}
  onReset={handleFilterReset}
  hasActiveFilters={selectedCategory !== null}
/>;
```

**Props:**

- `isOpen`: boolean - 드롭다운 열림 상태
- `onToggle`: () => void - 드롭다운 토글 핸들러
- `filterGroups`: FilterGroup[] - 필터 그룹 배열
- `onReset`: () => void - 필터 초기화 핸들러
- `hasActiveFilters`: boolean - 활성 필터 존재 여부

### 4. DataTable

데이터 테이블 컴포넌트입니다. (페이지네이션 별도)

```tsx
import { DataTable } from '../../../../components/common';

const columns = [
  { key: 'name', label: '이름', width: '200px' },
  {
    key: 'status',
    label: '상태',
    width: '120px',
    render: (value) => <span className="badge">{value}</span>,
  },
];

<DataTable
  data={currentData}
  columns={columns}
  onRowClick={handleRowClick}
  width={1410}
  height={516}
  emptyMessage="데이터가 없습니다."
/>;
```

**Props:**

- `data`: any[] - 테이블 데이터 배열
- `columns`: Column[] - 컬럼 정의 배열
- `onRowClick?`: (row: any) => void - 행 클릭 핸들러 (선택사항)
- `width?`: number - 테이블 너비 (기본값: 1410)
- `height?`: number - 테이블 높이 (기본값: 516)
- `emptyMessage?`: string - 빈 데이터 메시지 (기본값: '데이터가 없습니다.')

### 5. Pagination

페이지네이션 컴포넌트입니다.

```tsx
import { Pagination } from '../../../../components/common';

<Pagination
  currentPage={currentPage}
  itemsPerPage={itemsPerPage}
  totalItems={filteredData.length}
  onPageChange={handlePageChange}
  width={1410}
  pageRangeDisplayed={5}
/>;
```

**Props:**

- `currentPage`: number - 현재 페이지 번호
- `itemsPerPage`: number - 페이지당 아이템 수
- `totalItems`: number - 전체 아이템 수
- `onPageChange`: (pageNumber: number) => void - 페이지 변경 핸들러
- `width?`: number - 페이지네이션 너비 (기본값: 1410)
- `pageRangeDisplayed?`: number - 표시할 페이지 번호 개수 (기본값: 5)

### 6. ActionButton

액션 버튼 컴포넌트입니다.

```tsx
import { ActionButton } from '../../../../components/common';
import { TbRefresh } from 'react-icons/tb';

<ActionButton
  icon={<TbRefresh size={20} />}
  onClick={handleRefresh}
  variant="primary" // 또는 "secondary"
  size={50}
/>;
```

**Props:**

- `icon`: React.ReactNode - 버튼 아이콘
- `onClick`: () => void - 클릭 핸들러
- `variant?`: 'primary' | 'secondary' - 버튼 스타일 (기본값: 'primary')
- `size?`: number - 버튼 크기 (기본값: 50)

### 7. BenefitFilterToggle

기본 혜택 / VIP 콕 두 가지 상태를 전환할 수 있는 토글 버튼 컴포넌트입니다.

```tsx
import { BenefitFilterToggle } from '../../../../components/common';

<BenefitFilterToggle value={filter} onChange={setFilter} width="w-[300px]" fontSize="text-sm" />;
```

**Props:**

- `value`: 'default' | 'vipkok' - 현재 선택된 토글 값 (필수)
- `onChange`: (val: 'default' | 'vipkok') => void - 선택 값 변경 핸들러 (필수)
- `width?`: string - 전체 토글의 너비 (Tailwind 클래스, 기본값: 'w-[300px]')
- `fontSize?`: string - 버튼 내부 글자의 폰트 사이즈 (Tailwind 클래스, 기본값: 'text-sm')

### 8. RankingList

순위 목록을 표시하는 컴포넌트입니다.

```tsx
import { RankingList } from '../../../../components/common';

const rankingData = [
  { rank: 1, name: 'CGV', count: 1234 },
  { rank: 2, name: 'GS25', count: 987 },
  { rank: 3, name: '메가박스', count: 654 },
];

<RankingList title="인기 제휴처" data={rankingData} width={400} height={300} />;
```

**Props:**

- `title`: string - 순위 목록 제목
- `data`: RankingItem[] - 순위 데이터 배열
- `width?`: number - 컴포넌트 너비 (기본값: 400)
- `height?`: number - 컴포넌트 높이 (기본값: 300)

### 9. AdminModal

관리자 페이지용 모달 컴포넌트입니다.

```tsx
import { AdminModal } from '../../../../components/common';

<AdminModal isOpen={isModalOpen} onClose={handleCloseModal} title="상세 정보" size="large">
  <div>모달 내용</div>
</AdminModal>;
```

**Props:**

- `isOpen`: boolean - 모달 열림 상태
- `onClose`: () => void - 모달 닫기 핸들러
- `title`: string - 모달 제목
- `children`: React.ReactNode - 모달 내용
- `size?`: 'small' | 'medium' | 'large' - 모달 크기 (기본값: 'medium')

## 글로벌 공통 컴포넌트

### 1. Header

전역 헤더/네비게이션 컴포넌트입니다.

```tsx
import Header from '../components/Header';

<Header
  isLoggedIn={true}
  variant="glass" // 또는 "default"
/>;
```

**Props:**

- `isLoggedIn?`: boolean - 로그인 상태 (기본값: false)
- `variant?`: 'default' | 'glass' - 헤더 스타일 (기본값: 'default')

**기능:**

- 좌측 사이드바 형태의 네비게이션
- 로그인/로그아웃 기능
- 메뉴: 잇플 소개, 잇플 맵, 전체 혜택, 마이페이지
- glass 변형: 반투명 배경 스타일

### 2. Modal

범용 모달 컴포넌트입니다.

```tsx
import Modal from '../components/Modal';

// 기본 모달
<Modal
  isOpen={isModalOpen}
  onClose={handleClose}
  title="확인"
  message="정말 삭제하시겠습니까?"
  buttons={[
    { label: '취소', onClick: handleClose, type: 'secondary' },
    { label: '삭제', onClick: handleDelete, type: 'primary' }
  ]}
/>

// 입력 모달
<Modal
  isOpen={isInputModalOpen}
  onClose={handleClose}
  title="이름 변경"
  message="새 이름을 입력하세요"
  input={true}
  inputValue={inputValue}
  inputPlaceholder="이름을 입력하세요"
  onInputChange={setInputValue}
  buttons={[
    { label: '취소', onClick: handleClose, type: 'secondary' },
    { label: '확인', onClick: handleSave, type: 'primary' }
  ]}
/>

// 커스텀 내용 모달
<Modal
  isOpen={isCustomModalOpen}
  onClose={handleClose}
  title="상세 정보"
>
  <div>커스텀 컨텐츠</div>
</Modal>
```

**Props:**

- `isOpen`: boolean - 모달 열림 상태
- `onClose`: () => void - 모달 닫기 핸들러
- `title?`: string - 모달 제목
- `message?`: string - 메인 메시지
- `subMessage?`: string - 서브 메시지
- `subMessageClass?`: string - 서브 메시지 스타일 클래스
- `input?`: boolean - 입력창 표시 여부 (기본값: false)
- `inputValue?`: string - 입력창 값
- `inputPlaceholder?`: string - 입력창 플레이스홀더
- `onInputChange?`: (value: string) => void - 입력 변경 핸들러
- `buttons?`: ButtonType[] - 버튼 배열
- `children?`: React.ReactNode - 커스텀 컨텐츠

### 3. NoResult

결과 없음 상태를 표시하는 컴포넌트입니다.

```tsx
import NoResult from '../components/NoResult';

// 기본 사용
<NoResult />

// 커스텀 메시지
<NoResult
  message1="검색 결과가 없습니다"
  message2="다른 키워드로 검색해보세요"
/>

// 로그인 필요 상태
<NoResult
  message1="로그인이 필요합니다"
  message2="로그인 후 이용해주세요"
  buttonText="로그인하기"
  buttonRoute="/login"
  isLoginRequired={true}
/>

// 폰트 크기 조정
<NoResult
  message1="데이터가 없습니다"
  message2="나중에 다시 시도해주세요"
  message1FontSize="text-title-2"
  message2FontSize="text-body-0"
/>
```

**Props:**

- `message1?`: string - 상단 메시지 (기본값: '앗! 일치하는 결과를 찾을 수 없어요!')
- `message2?`: string - 하단 메시지 (기본값: '다른 키워드나 조건으로 다시 찾아보세요.')
- `buttonText?`: string - 버튼 텍스트 (없으면 버튼 숨김)
- `buttonRoute?`: string - 버튼 클릭 시 이동할 경로 (없으면 버튼 숨김)
- `isLoginRequired?`: boolean - 로그인 관련 이미지 사용 여부 (기본값: false)
- `message1FontSize?`: string - 상단 메시지 폰트 크기 (Tailwind 클래스, 기본값: 'text-title-4')
- `message2FontSize?`: string - 하단 메시지 폰트 크기 (Tailwind 클래스, 기본값: 'text-body-1')

**기능:**

- WebP 이미지 최적화 (fallback PNG)
- 로그인 여부에 따른 이미지 분기
- 버튼을 통한 페이지 라우팅

### 4. ToastProvider

토스트 알림을 제공하는 프로바이더 컴포넌트입니다.

```tsx
import ToastProvider from '../components/ToastProvider';
import { showToast } from '../utils/toast';

// App.tsx에서 루트에 배치
function App() {
  return (
    <div className="App">
      {/* 다른 컴포넌트들... */}
      <ToastProvider />
    </div>
  );
}

// 사용법
showToast('성공적으로 저장되었습니다', 'success');
showToast('오류가 발생했습니다', 'error');
showToast('알림 메시지입니다', 'info');
showToast('경고 메시지입니다', 'warning');
```

**기능:**

- react-toastify 기반 토스트 알림
- 설정: bottom-center 위치, 3초 자동 닫힘, 최대 1개 표시
- 클릭으로 닫기, 호버 시 일시정지, 드래그 가능

## 사용 예시

### 관리자 페이지 (회원 관리)

```tsx
// 상단 정보 카드들
<StatisticsCard title="회원 수" value={totalMembers} subtitle="명" />
<StatisticsCard title="최근 업데이트" value={lastUpdated} />

// 검색 및 필터링
<SearchBar placeholder="회원 검색" value={searchTerm} onChange={handleSearchChange} />
<FilterDropdown filterGroups={memberFilterGroups} />
<ActionButton icon={<TbRefresh />} onClick={handleRefresh} />

// 데이터 테이블과 페이지네이션
<DataTable data={currentMembers} columns={memberColumns} />
<Pagination currentPage={currentPage} totalItems={totalMembers} onPageChange={handlePageChange} />

// 모달
<AdminModal isOpen={isModalOpen} onClose={handleClose} title="회원 상세">
  <MemberDetail member={selectedMember} />
</AdminModal>
```

### 전체 혜택 페이지

```tsx
// 전역 헤더
<Header isLoggedIn={true} variant="default" />

// 혜택 필터 토글
<BenefitFilterToggle value={filter} onChange={setFilter} />

// 검색
<SearchBar
  placeholder="제휴처 검색"
  value={searchTerm}
  onChange={handleSearchChange}
  backgroundColor="bg-grey01"
/>

// 순위 표시
<RankingList title="인기 제휴처" data={popularPartners} />

// 결과 없음 상태
{benefits.length === 0 && (
  <NoResult
    message1="검색 결과가 없습니다"
    message2="다른 키워드로 검색해보세요"
  />
)}

// 토스트 알림 (전역)
<ToastProvider />
```

### 마이페이지

```tsx
// 전역 헤더
<Header isLoggedIn={true} variant="glass" />

// 혜택 필터
<BenefitFilterToggle value={filter} onChange={setFilter} />

// 통계 카드
<StatisticsCard
  title="이용한 혜택"
  value={usedBenefits}
  subtitle="개"
  borderColor="border-l-purple04"
  valueColor="text-purple04"
/>

// 로그인 필요 상태
{!isLoggedIn && (
  <NoResult
    message1="로그인이 필요합니다"
    message2="로그인 후 마이페이지를 이용해주세요"
    buttonText="로그인하기"
    buttonRoute="/login"
    isLoginRequired={true}
  />
)}

// 확인 모달
<Modal
  isOpen={isDeleteModalOpen}
  onClose={() => setIsDeleteModalOpen(false)}
  title="삭제 확인"
  message="정말 삭제하시겠습니까?"
  buttons={[
    { label: '취소', onClick: () => setIsDeleteModalOpen(false), type: 'secondary' },
    { label: '삭제', onClick: handleDelete, type: 'primary' }
  ]}
/>

// 페이지네이션
<Pagination
  currentPage={currentPage}
  totalItems={totalBenefits}
  onPageChange={handlePageChange}
/>
```

## 장점

1. **재사용성**: 동일한 UI 패턴을 여러 페이지에서 재사용
2. **일관성**: 모든 페이지에서 동일한 디자인 언어 사용
3. **유지보수**: 공통 컴포넌트 수정으로 모든 페이지에 변경사항 적용
4. **개발 속도**: 새로운 페이지를 빠르게 개발 가능
5. **타입 안정성**: TypeScript로 타입 안정성 보장
6. **분리된 관심사**: 각 컴포넌트가 독립적인 책임을 가짐
7. **사용자 경험**: 일관된 인터랙션과 피드백 제공

## 컴포넌트 분리 구조

- **DataTable**: 순수 테이블 렌더링에만 집중
- **Pagination**: 페이지네이션 로직과 UI에만 집중
- **SearchBar**: 검색 UI와 기본 이벤트 처리에만 집중
- **FilterDropdown**: 필터링 UI와 상태 관리에만 집중
- **BenefitFilterToggle**: 혜택 타입 전환 UI에만 집중
- **Header**: 전역 네비게이션과 인증 상태 관리에만 집중
- **Modal**: 범용 다이얼로그 UI에만 집중
- **NoResult**: 빈 상태 표시와 액션 가이드에만 집중
- **ToastProvider**: 전역 알림 시스템에만 집중
- **각 페이지**: 비즈니스 로직과 데이터 관리에만 집중

## 주의사항

1. **상태 관리**: 대부분의 컴포넌트는 내부 상태를 관리하지 않고 부모 컴포넌트에서 상태를 관리합니다.
2. **스타일링**: Tailwind CSS 클래스를 props로 받아 유연한 스타일링이 가능합니다.
3. **타입 정의**: 모든 컴포넌트는 TypeScript 인터페이스로 props 타입이 정의되어 있습니다.
4. **접근성**: 모든 컴포넌트는 웹 접근성 기준을 준수하도록 구현되었습니다.
5. **전역 컴포넌트**: Header와 ToastProvider는 App 레벨에서 한 번만 사용해야 합니다.
6. **이미지 최적화**: NoResult 컴포넌트는 WebP와 PNG fallback을 지원합니다.

상단 정보 카드 컴포넌트입니다.

```tsx
import { StatisticsCard } from '../../../../components/common';

<StatisticsCard
  title="회원 수"
  value={12345}
  subtitle="명"
  borderColor="border-l-purple04"
  valueColor="text-purple04"
  subtitleColor="text-black"
  width={344}
  height={87}
/>;
```

**Props:**

- `title`: string - 카드 제목
- `value`: string | number - 표시할 값
- `subtitle?`: string - 부제목 (선택사항)
- `borderColor?`: string - 왼쪽 경계선 색상 (Tailwind 클래스)
- `valueColor?`: string - 값 텍스트 색상 (Tailwind 클래스)
- `subtitleColor?`: string - 부제목 텍스트 색상 (Tailwind 클래스)
- `width?`: number - 카드 너비 (기본값: 344)
- `height?`: number - 카드 높이 (기본값: 87)

### 2. SearchBar

검색창 컴포넌트입니다.

```tsx
import { SearchBar } from '../../../../components/common';

<SearchBar
  placeholder="회원 검색"
  value={searchTerm}
  onChange={handleSearchChange}
  onClear={() => setSearchTerm('')}
  width={344}
  height={50}
  backgroundColor="bg-grey01"
/>;
```

**Props:**

- `placeholder`: string - 입력창 플레이스홀더
- `value`: string - 현재 입력값
- `onChange`: (e: React.ChangeEvent<HTMLInputElement>) => void - 입력 변경 핸들러
- `onClear`: () => void - 클리어 버튼 클릭 핸들러
- `width?`: number - 검색창 너비 (기본값: 344)
- `height?`: number - 검색창 높이 (기본값: 50)
- `backgroundColor?`: string - 배경색 (Tailwind 클래스, 기본값: 'bg-white')

### 3. FilterDropdown

필터 드롭다운 컴포넌트입니다.

```tsx
import { FilterDropdown } from '../../../../components/common';

const filterGroups = [
  {
    title: '카테고리',
    options: [
      { label: '전체', value: '전체' },
      { label: '편의점', value: '편의점' },
    ],
    selectedValue: selectedCategory,
    onSelect: handleCategoryFilter,
  },
];

<FilterDropdown
  isOpen={showFilterDropdown}
  onToggle={() => setShowFilterDropdown(!showFilterDropdown)}
  filterGroups={filterGroups}
  onReset={handleFilterReset}
  hasActiveFilters={selectedCategory !== null}
/>;
```

**Props:**

- `isOpen`: boolean - 드롭다운 열림 상태
- `onToggle`: () => void - 드롭다운 토글 핸들러
- `filterGroups`: FilterGroup[] - 필터 그룹 배열
- `onReset`: () => void - 필터 초기화 핸들러
- `hasActiveFilters`: boolean - 활성 필터 존재 여부

### 4. DataTable

데이터 테이블 컴포넌트입니다. (페이지네이션 별도)

```tsx
import { DataTable } from '../../../../components/common';

const columns = [
  { key: 'name', label: '이름', width: '200px' },
  {
    key: 'status',
    label: '상태',
    width: '120px',
    render: (value) => <span className="badge">{value}</span>,
  },
];

<DataTable
  data={currentData}
  columns={columns}
  onRowClick={handleRowClick}
  width={1410}
  height={516}
  emptyMessage="데이터가 없습니다."
/>;
```

**Props:**

- `data`: any[] - 테이블 데이터 배열
- `columns`: Column[] - 컬럼 정의 배열
- `onRowClick?`: (row: any) => void - 행 클릭 핸들러 (선택사항)
- `width?`: number - 테이블 너비 (기본값: 1410)
- `height?`: number - 테이블 높이 (기본값: 516)
- `emptyMessage?`: string - 빈 데이터 메시지 (기본값: '데이터가 없습니다.')

### 5. Pagination

페이지네이션 컴포넌트입니다.

```tsx
import { Pagination } from '../../../../components/common';

<Pagination
  currentPage={currentPage}
  itemsPerPage={itemsPerPage}
  totalItems={filteredData.length}
  onPageChange={handlePageChange}
  width={1410}
  pageRangeDisplayed={5}
/>;
```

**Props:**

- `currentPage`: number - 현재 페이지 번호
- `itemsPerPage`: number - 페이지당 아이템 수
- `totalItems`: number - 전체 아이템 수
- `onPageChange`: (pageNumber: number) => void - 페이지 변경 핸들러
- `width?`: number - 페이지네이션 너비 (기본값: 1410)
- `pageRangeDisplayed?`: number - 표시할 페이지 번호 개수 (기본값: 5)

### 6. ActionButton

액션 버튼 컴포넌트입니다.

```tsx
import { ActionButton } from '../../../../components/common';
import { TbRefresh } from 'react-icons/tb';

<ActionButton
  icon={<TbRefresh size={20} />}
  onClick={handleRefresh}
  variant="primary" // 또는 "secondary"
  size={50}
/>;
```

**Props:**

- `icon`: React.ReactNode - 버튼 아이콘
- `onClick`: () => void - 클릭 핸들러
- `variant?`: 'primary' | 'secondary' - 버튼 스타일 (기본값: 'primary')
- `size?`: number - 버튼 크기 (기본값: 50)

### 7. BenefitFilterToggle

기본 혜택 / VIP 콕 두 가지 상태를 전환할 수 있는 토글 버튼 컴포넌트입니다.

```tsx
import { BenefitFilterToggle } from '../../../../components/common';

<BenefitFilterToggle value={filter} onChange={setFilter} width="w-[300px]" fontSize="text-sm" />;
```

**Props:**

- `value`: 'default' | 'vipkok' - 현재 선택된 토글 값 (필수)
- `onChange`: (val: 'default' | 'vipkok') => void - 선택 값 변경 핸들러 (필수)
- `width?`: string - 전체 토글의 너비 (Tailwind 클래스, 기본값: 'w-[300px]')
- `fontSize?`: string - 버튼 내부 글자의 폰트 사이즈 (Tailwind 클래스, 기본값: 'text-sm')

### 8. RankingList

순위 목록을 표시하는 컴포넌트입니다.

```tsx
import { RankingList } from '../../../../components/common';

const rankingData = [
  { rank: 1, name: 'CGV', count: 1234 },
  { rank: 2, name: 'GS25', count: 987 },
  { rank: 3, name: '메가박스', count: 654 },
];

<RankingList title="인기 제휴처" data={rankingData} width={400} height={300} />;
```

**Props:**

- `title`: string - 순위 목록 제목
- `data`: RankingItem[] - 순위 데이터 배열
- `width?`: number - 컴포넌트 너비 (기본값: 400)
- `height?`: number - 컴포넌트 높이 (기본값: 300)

### 9. AdminModal

관리자 페이지용 모달 컴포넌트입니다.

```tsx
import { AdminModal } from '../../../../components/common';

<AdminModal isOpen={isModalOpen} onClose={handleCloseModal} title="상세 정보" size="large">
  <div>모달 내용</div>
</AdminModal>;
```

**Props:**

- `isOpen`: boolean - 모달 열림 상태
- `onClose`: () => void - 모달 닫기 핸들러
- `title`: string - 모달 제목
- `children`: React.ReactNode - 모달 내용
- `size?`: 'small' | 'medium' | 'large' - 모달 크기 (기본값: 'medium')

## 사용 예시

### 관리자 페이지 (회원 관리)

```tsx
// 상단 정보 카드들
<StatisticsCard title="회원 수" value={totalMembers} subtitle="명" />
<StatisticsCard title="최근 업데이트" value={lastUpdated} />

// 검색 및 필터링
<SearchBar placeholder="회원 검색" value={searchTerm} onChange={handleSearchChange} />
<FilterDropdown filterGroups={memberFilterGroups} />
<ActionButton icon={<TbRefresh />} onClick={handleRefresh} />

// 데이터 테이블과 페이지네이션
<DataTable data={currentMembers} columns={memberColumns} />
<Pagination currentPage={currentPage} totalItems={totalMembers} onPageChange={handlePageChange} />
```

### 전체 혜택 페이지

```tsx
// 혜택 필터 토글
<BenefitFilterToggle value={filter} onChange={setFilter} />

// 검색
<SearchBar
  placeholder="제휴처 검색"
  value={searchTerm}
  onChange={handleSearchChange}
  backgroundColor="bg-grey01"
/>

// 순위 표시
<RankingList title="인기 제휴처" data={popularPartners} />
```

### 마이페이지

```tsx
// 혜택 필터
<BenefitFilterToggle value={filter} onChange={setFilter} />

// 통계 카드
<StatisticsCard
  title="이용한 혜택"
  value={usedBenefits}
  subtitle="개"
  borderColor="border-l-purple04"
  valueColor="text-purple04"
/>

// 페이지네이션
<Pagination
  currentPage={currentPage}
  totalItems={totalBenefits}
  onPageChange={handlePageChange}
/>
```

## 장점

1. **재사용성**: 동일한 UI 패턴을 여러 페이지에서 재사용
2. **일관성**: 모든 페이지에서 동일한 디자인 언어 사용
3. **유지보수**: 공통 컴포넌트 수정으로 모든 페이지에 변경사항 적용
4. **개발 속도**: 새로운 페이지를 빠르게 개발 가능
5. **타입 안정성**: TypeScript로 타입 안정성 보장
6. **분리된 관심사**: 각 컴포넌트가 독립적인 책임을 가짐

## 컴포넌트 분리 구조

- **DataTable**: 순수 테이블 렌더링에만 집중
- **Pagination**: 페이지네이션 로직과 UI에만 집중
- **SearchBar**: 검색 UI와 기본 이벤트 처리에만 집중
- **FilterDropdown**: 필터링 UI와 상태 관리에만 집중
- **BenefitFilterToggle**: 혜택 타입 전환 UI에만 집중
- **각 페이지**: 비즈니스 로직과 데이터 관리에만 집중

## 주의사항

1. **상태 관리**: 대부분의 컴포넌트는 내부 상태를 관리하지 않고 부모 컴포넌트에서 상태를 관리합니다.
2. **스타일링**: Tailwind CSS 클래스를 props로 받아 유연한 스타일링이 가능합니다.
3. **타입 정의**: 모든 컴포넌트는 TypeScript 인터페이스로 props 타입이 정의되어 있습니다.
4. **접근성**: 모든 컴포넌트는 웹 접근성 기준을 준수하도록 구현되었습니다.
