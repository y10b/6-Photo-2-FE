import React, {useState, useEffect, useMemo} from 'react';
import Button from '../common/Button';
import {useModal} from '@/components/modal/ModalContext';
import {fetchMyCards} from '@/lib/api/shop';
import {createExchangeRequest} from '@/lib/api/exchange';
import CardList from '@/components/ui/card/cardOverview/CardList';
import {SearchInput, DropdownInput} from '@/components/ui/input';
import FilterBottomSheet from '@/components/market/FilterBottomSheet2';
import ExchangeOfferModal from './ExchangeOfferModal';
import Image from 'next/image';
import {useBreakpoint} from '@/hooks/useBreakpoint';
import {useRouter} from 'next/navigation';

function ExchangeConfirmContent({shopId}) {
  const {closeModal, openModal} = useModal();
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState({type: '', value: ''});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const {isMobile, isTablet, isPC} = useBreakpoint();

  useEffect(() => {
    const loadCards = async () => {
      try {
        setIsLoading(true);
        const response = await fetchMyCards({
          page: 1,
          take: 1000,
          keyword,
          filterType: filter.type,
          filterValue: filter.value,
        });
        // soldout이 아닌 카드만 필터링
        const availableCards = response.result.filter(
          card => card.quantityLeft > 0,
        );
        setCards(availableCards);
      } catch (error) {
        console.error('카드 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCards();
  }, [keyword, filter]);

  const handleCardClick = card => {
    // 첫 번째 모달 닫기
    closeModal();

    // 약간의 지연 후 두 번째 모달 열기
    setTimeout(() => {
      openModal({
        type: 'responsive',
        variant: isMobile ? 'full' : 'bottom',
        title: '포토카드 교환하기',
        isDismissible: true,
        isCloseable: true,
        overlayClassName: 'bg-black/50',
        modalClassName: 'cursor-default',
        className: {
          mobile: 'h-[95vh] rounded-t-[20px]',
          tablet: 'h-[95vh]',
          pc: 'max-w-[1000px] rounded-[20px]',
        },
        children: (
          <ExchangeOfferModal
            card={card}
            onExchange={async data => {
              try {
                await createExchangeRequest({
                  shopId,
                  targetCardId: card.userCardId,
                  description: data.description,
                });

                closeModal();
                openModal({
                  type: 'alert',
                  title: '교환 신청 완료',
                  description: '교환 신청이 완료되었습니다.',
                  button: {
                    label: '확인',
                    onClick: () => {
                      closeModal();
                      router.refresh();
                    },
                  },
                });
              } catch (error) {
                closeModal();
                openModal({
                  type: 'alert',
                  title: '교환 신청 실패',
                  description:
                    error.message || '교환 신청 중 오류가 발생했습니다.',
                  button: {
                    label: '확인',
                    onClick: closeModal,
                  },
                });
              }
            }}
            onCancel={closeModal}
          />
        ),
      });
    }, 100);
  };

  const handleSearch = () => {
    setKeyword(inputValue);
  };

  const getFilterCounts = cards => {
    const counts = {grade: {}, genre: {}};
    cards.forEach(card => {
      counts.grade[card.cardGrade] = (counts.grade[card.cardGrade] || 0) + 1;
      counts.genre[card.cardGenre] = (counts.genre[card.cardGenre] || 0) + 1;
    });
    return counts;
  };

  const filterCounts = useMemo(() => {
    return getFilterCounts(cards);
  }, [cards]);

  const handleFilterChange = newFilter => {
    setFilter(newFilter);
  };

  return (
    <div className="px-[15px] tablet:p-5 text-white min-h-[95vh] flex flex-col">
      <div className="flex-grow mb-[30px] tablet:mb-4">
        <h2 className="mb-[15px] tablet:mb-10 font-baskin font-normal text-sm tablet:text-base pc:text-2xl text-gray300">
          마이갤러리
        </h2>
        <p className="mb-[30px] font-baskin font-normal text-[26px] tablet:text-[40px] pc:text-[46px] text-white">
          포토카드 교환하기
        </p>
        <div className="mb-5 hidden tablet:block border-[2px] border-gray100" />

        {/* PC / 태블릿 검색,필터 */}
        <div className="hidden tablet:flex flex-wrap gap-2 items-center justify-between mb-[20px]">
          <div className="flex flex-wrap items-center max-w-full tablet:max-w-[calc(100%-180px)]">
            <div>
              <SearchInput
                name="query"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                placeholder="검색"
                className="pc:!w-[320px] pc:!h-[50px] tablet:!w-[200px] tablet:!h-[45px]"
              />
            </div>

            <div className="pc:ml-[60px] tablet:ml-[30px]">
              <DropdownInput
                className="border-none !px-0 !gap-[10px] bg-gray500"
                name="grade"
                value={filter.type === 'grade' ? filter.value : ''}
                onChange={({target}) =>
                  setFilter(prev =>
                    prev.type === 'grade' && prev.value === target.value
                      ? {type: '', value: ''}
                      : {type: 'grade', value: target.value},
                  )
                }
                placeholder="등급"
                options={[
                  {label: 'COMMON', value: 'COMMON'},
                  {label: 'RARE', value: 'RARE'},
                  {label: 'SUPER RARE', value: 'SUPER_RARE'},
                  {label: 'LEGENDARY', value: 'LEGENDARY'},
                ]}
              />
            </div>

            <div className="ml-[45px]">
              <DropdownInput
                className="border-none !px-0 !gap-[10px] bg-gray500"
                name="genre"
                value={filter.type === 'genre' ? filter.value : ''}
                onChange={({target}) =>
                  setFilter(prev =>
                    prev.type === 'genre' && prev.value === target.value
                      ? {type: '', value: ''}
                      : {type: 'genre', value: target.value},
                  )
                }
                placeholder="장르"
                options={[
                  {label: '여행', value: 'TRAVEL'},
                  {label: '풍경', value: 'LANDSCAPE'},
                  {label: '인물', value: 'PORTRAIT'},
                  {label: '사물', value: 'OBJECT'},
                ]}
              />
            </div>
          </div>
        </div>

        {/* 모바일 검색 + 필터 버튼 */}
        <div className="tablet:hidden flex justify-between items-center mb-[20px] gap-[10px]">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="w-[52px] h-[45px] border border-gray200 rounded-[2px] flex justify-center items-center"
          >
            <Image
              src="/icons/ic_filter.svg"
              alt="필터"
              width={20}
              height={20}
            />
          </button>
          <SearchInput
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            placeholder="검색"
          />
        </div>

        {/* 카드 목록 */}
        {isLoading ? (
          <div className="flex justify-center h-screen mt-[50px]">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-b-transparent border-l-gray-400 border-r-gray-400"></div>
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-gray300">교환 가능한 카드가 없습니다.</p>
          </div>
        ) : (
          <CardList
            cards={cards}
            onCardClick={handleCardClick}
            className="grid grid-cols-2 gap-[10px] justify-items-center mx-auto w-full"
          />
        )}
      </div>

      {/* 필터 바텀시트 (모바일 전용) */}
      <FilterBottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleFilterChange}
        filterCounts={filterCounts}
        tabs={['grade', 'genre']}
      />
    </div>
  );
}

export default ExchangeConfirmContent;
