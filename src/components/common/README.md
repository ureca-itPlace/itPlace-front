# 공통 컴포넌트 가이드

관리자 페이지에서 사용할 수 있는 재사용 가능한 공통 컴포넌트들입니다.

## 컴포넌트 목록

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
/>;
```

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

## 사용 예시

### 회원 관리 페이지

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

### 제휴 관리 페이지

```tsx
// 동일한 패턴으로 사용
<StatisticsCard title="제휴처 수" value={totalPartners} subtitle="개" />
<SearchBar placeholder="제휴처 검색" />
<FilterDropdown filterGroups={partnerFilterGroups} />
<DataTable data={currentPartners} columns={partnerColumns} />
<Pagination currentPage={currentPage} totalItems={totalPartners} />
```

### 브랜드 관리 페이지

```tsx
// 동일한 패턴으로 사용
<StatisticsCard title="브랜드 수" value={totalBrands} subtitle="개" />
<SearchBar placeholder="브랜드 검색" />
<FilterDropdown filterGroups={brandFilterGroups} />
<DataTable data={currentBrands} columns={brandColumns} />
<Pagination currentPage={currentPage} totalItems={totalBrands} />
```

## 장점

1. **재사용성**: 동일한 UI 패턴을 여러 페이지에서 재사용
2. **일관성**: 모든 관리 페이지에서 동일한 디자인 언어 사용
3. **유지보수**: 공통 컴포넌트 수정으로 모든 페이지에 변경사항 적용
4. **개발 속도**: 새로운 관리 페이지 빠르게 개발 가능
5. **타입 안정성**: TypeScript로 타입 안정성 보장
6. **분리된 관심사**: 테이블과 페이지네이션을 독립적으로 사용 가능

## 컴포넌트 분리 구조

- **DataTable**: 순수 테이블 렌더링에만 집중
- **Pagination**: 페이지네이션 로직과 UI에만 집중
- **각 페이지**: 비즈니스 로직과 데이터 관리에만 집중
