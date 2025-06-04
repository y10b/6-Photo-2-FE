'use client';

import React, {useEffect, useState, useCallback} from 'react';
import ResponsiveModalWrapper from '@/components/modal/ResponsiveModalWrapper';
import {fetchMyCards, registerSale} from '@/lib/api/shop';
import Image from 'next/image';
import DropdownInput from '@/components/ui/input/DropdownInput';
import Button from '@/components/common/Button';
import Textarea from '@/components/ui/input/TextboxInput';
import {CounterInput} from '../ui/input';
import gradeStyles from '@/utils/gradeStyles';
import {useModal} from '@/components/modal/ModalContext';
import {useRouter} from 'next/navigation';
import useMediaQuery from '@/hooks/useMediaQuery';

export default function SellCardRegistrationBottomSheet({
  isOpen,
  onClose,
  cardId,
}) {
  const {openModal, closeModal} = useModal();
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [cardDetails, setCardDetails] = useState(null);
  const [sellingQuantity, setSellingQuantity] = useState(1);
  const [sellingPrice, setSellingPrice] = useState('');
  const [exchangeGrade, setExchangeGrade] = useState('');
  const [exchangeGenre, setExchangeGenre] = useState('');
  const [exchangeDescription, setExchangeDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const resetForm = () => {
    setCardDetails(null);
    setSellingQuantity(1);
    setSellingPrice('');
    setExchangeGrade('');
    setExchangeGenre('');
    setExchangeDescription('');
    setIsLoading(false);
  };

  const gradePriceLimits = {
    COMMON: {min: 100, max: 1000},
    RARE: {min: 1000, max: 3000},
    SUPER_RARE: {min: 3000, max: 5000},
    LEGENDARY: {min: 5000, max: 10000},
  };

  const showResultModal = isSuccess => {
    const modalType = isSuccess ? 'success' : 'fail';
    openModal({
      type: modalType,
      title: '판매 등록',
      result: isSuccess ? '성공' : '실패',
      description: `[${cardDetails?.cardGrade} | ${
        cardDetails?.title
      }] ${sellingQuantity}장 판매 등록에 ${
        isSuccess ? '성공' : '실패'
      }했습니다.`,
      button: {
        label: '마켓플레이스로 돌아가기',
        onClick: () => {
          closeModal();
          onClose();
          router.push('/market');
        },
      },
    });
  };

  const loadCardDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetchMyCards({page: 1, take: 1000});
      const cards = response.result || response;
      const foundCard = cards.find(card => card.userCardId === cardId);
      if (foundCard) {
        setCardDetails(foundCard);
        setSellingQuantity(1);
        setExchangeGrade('');
        setExchangeGenre('');
        setExchangeDescription('');
      } else {
        onClose();
        showResultModal(false);
      }
    } catch (error) {
      onClose();
      showResultModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && cardId) {
      loadCardDetails();
    } else {
      resetForm();
    }
  }, [isOpen, cardId]);

  const handleQuantityChange = useCallback(newVal => {
    setSellingQuantity(newVal);
  }, []);

  const handleRegisterSale = async () => {
    if (
      !cardDetails ||
      sellingQuantity <= 0 ||
      sellingQuantity > cardDetails.quantityLeft ||
      !sellingPrice ||
      sellingPrice <= 0
    ) {
      openModal({
        type: 'alert',
        title: '가격 오류',
        description: '판매 수량과 가격을 올바르게 입력해주세요.',
        button: {
          label: '확인',
          onClick: () => closeModal(),
        },
      });
      return;
    }

    const price = Number(sellingPrice);
    const grade = cardDetails.cardGrade?.toUpperCase();
    const limits = gradePriceLimits[grade];

    if (!limits || price < limits.min || price > limits.max) {
      openModal({
        type: 'alert',
        title: '가격 오류',
        description: `${grade} 등급은 ${limits.min}P ~ ${limits.max}P 사이로만 설정할 수 있어요.`,
        button: {
          label: '확인',
          onClick: () => closeModal(),
        },
      });
      return;
    }

    const listingType =
      exchangeGrade || exchangeGenre || exchangeDescription
        ? 'FOR_SALE_AND_TRADE'
        : 'FOR_SALE';

    const saleData = {
      photoCardId: Number(cardDetails.photoCardId),
      quantity: Number(sellingQuantity),
      price,
      listingType,
      ...(listingType === 'FOR_SALE_AND_TRADE' && {
        exchangeGrade,
        exchangeGenre,
        exchangeDescription,
      }),
    };

    try {
      await registerSale(saleData);
      onClose();
      showResultModal(true);
    } catch (error) {
      console.error('판매 등록 실패:', error);
      onClose();
      showResultModal(false);
    }
  };

  const gradeOptions = [
    {label: 'COMMON', value: 'COMMON'},
    {label: 'RARE', value: 'RARE'},
    {label: 'SUPER RARE', value: 'SUPER_RARE'},
    {label: 'LEGENDARY', value: 'LEGENDARY'},
  ];

  const genreOptions = [
    {label: '여행', value: 'TRAVEL'},
    {label: '풍경', value: 'LANDSCAPE'},
    {label: '인물', value: 'PORTRAIT'},
    {label: '사물', value: 'OBJECT'},
  ];

  const getGenreLabel = genreValue =>
    genreOptions.find(option => option.value === genreValue)?.label ||
    genreValue;

  if (!isOpen) return null;

  return (
    <>
      <ResponsiveModalWrapper
        onClose={onClose}
        variant={isMobile ? 'full' : 'bottom'}
        title={'나의 포토카드 판매하기'}
      >
        <div
          className="px-[15px] tablet:p-5 text-white min-h-[90vh]"
          style={{overflowY: 'auto'}}
        >
          {isLoading ? (
            <div className="flex justify-center h-screen">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-b-transparent border-l-gray-400 border-r-gray-400"></div>
            </div>
          ) : cardDetails ? (
            <div>
              <h2 className="hidden tablet:block font-baskin text-4 text-gray300 mb-10">
                나의 포토카드 판매하기
              </h2>
              <p className="text-[24px] mb-[10px] tablet:text-[32px] font-bold tablet:mb-5">
                {cardDetails.title}
              </p>

              <div className="mb-[26px] border-[1.5px] border-gray100 tablet:mb-12"></div>

              <div className="tablet:flex tablet:gap-5 tablet:justify-between">
                <div className="relative min-w-[345px] min-h-[258.5px] tablet:w-[342px] tablet:h-[256.5px] pc:w-110 ">
                  {cardDetails.imageUrl && (
                    <Image
                      src={cardDetails.imageUrl}
                      alt={cardDetails.title || '카드 이미지'}
                      layout="fill"
                      objectFit="cover"
                    />
                  )}
                </div>
                <div className="mt-[20.25px] tablet:w-[342px] tablet:mt-0 pc:w-110">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[15px]">
                      <p
                        className={`${
                          gradeStyles[cardDetails.cardGrade]
                        } text-[18px] font-normal`}
                      >
                        {cardDetails.cardGrade}
                      </p>
                      <div className="text-gray400">|</div>
                      <p className="text-[16px] text-gray300 font-normal">
                        {getGenreLabel(
                          cardDetails.cardGenre || cardDetails.genre,
                        )}
                      </p>
                    </div>
                    <p className="underline text-[18px] text-white ">
                      {cardDetails.sellerNickname || cardDetails.nickname}
                    </p>
                  </div>
                  <div className="w-full border-[1px] border-gray400 my-[30px]"></div>
                  <div className="mb-[20px] flex justify-between items-center">
                    <span className="font-normal text-[18px] pc:text-xl text-white">
                      총 판매 수량
                    </span>
                    <CounterInput
                      initialValue={sellingQuantity}
                      min={1}
                      max={cardDetails.quantityLeft}
                      onChange={handleQuantityChange}
                      maxText={`${cardDetails.quantityLeft}장`}
                      width="w-[144px] pc:w-[176px]"
                      height="h-[45px] pc:h-[50px]"
                    />
                  </div>
                  <div className="flex justify-between text-white w-full">
                    <span className="py-[9.5px] font-normal text-[18px] pc:text-xl">
                      장당 가격
                    </span>
                    <div className="relative w-[202px] pc:w-[245px]">
                      <input
                        type="number"
                        className="w-full h-[45px] pc:h-[50px] border rounded-[2px] pr-6 bg-gray500 text-white px-[20px]"
                        placeholder="숫자만 입력"
                        value={sellingPrice}
                        onChange={e => setSellingPrice(e.target.value)}
                      />
                      <span className="absolute top-1/2 right-[20px] -translate-y-1/2 font-bold text-[18px] pc:text-xl text-white pointer-events-none">
                        P
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-30 tablet:mt-[80.5px]">
                <p className="text-[22px] font-bold mb-[10px]">
                  교환 희망 정보
                </p>
                <div className="border-[1.5px] border-gray100 mb-[46px]"></div>
                <div className="tablet:flex">
                  <div className="mb-[34px] tablet:mb-0 w-full mr-5">
                    <label
                      htmlFor="exchangeGrade"
                      className="block text-4 font-bold mb-[10px]"
                    >
                      등급
                    </label>
                    <DropdownInput
                      id="exchangeGrade"
                      name="exchangeGrade"
                      value={exchangeGrade}
                      onChange={e => setExchangeGrade(e.target.value)}
                      options={gradeOptions}
                      placeholder="등급을 선택해 주세요"
                      className="w-full"
                    />
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="exchangeGenre"
                      className="block text-4 font-bold mb-[10px]"
                    >
                      희망 장르
                    </label>
                    <DropdownInput
                      id="exchangeGenre"
                      name="exchangeGenre"
                      value={exchangeGenre}
                      onChange={e => setExchangeGenre(e.target.value)}
                      options={genreOptions}
                      placeholder="장르를 선택해 주세요"
                      className="w-full"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="exchangeDescription"
                    className="block text-4 font-bold mb-[10px] mt-[34px]"
                  >
                    교환 희망 설명
                  </label>
                  <Textarea
                    id="exchangeDescription"
                    value={exchangeDescription}
                    onChange={e => setExchangeDescription(e.target.value)}
                    placeholder="설명을 입력해 주세요"
                    rows="3"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-11 tablet:mt-15 mb-15">
                <Button
                  role="button"
                  variant="outline"
                  onClick={onClose}
                  className="w-full"
                >
                  취소하기
                </Button>
                <Button
                  role="submit"
                  variant="primary"
                  onClick={handleRegisterSale}
                  className="w-full"
                >
                  판매하기
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-center">카드 정보를 불러올 수 없습니다.</p>
          )}
        </div>
      </ResponsiveModalWrapper>
    </>
  );
}
