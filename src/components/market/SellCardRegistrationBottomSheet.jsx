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

export default function SellCardRegistrationBottomSheet({
  isOpen,
  onClose,
  cardId,
}) {
  const {openModal, closeModal} = useModal();
  const router = useRouter();

  const [cardDetails, setCardDetails] = useState(null);
  const [sellingQuantity, setSellingQuantity] = useState(1);
  const [sellingPrice, setSellingPrice] = useState('');
  const [exchangeGrade, setExchangeGrade] = useState('');
  const [exchangeGenre, setExchangeGenre] = useState('');
  const [exchangeDescription, setExchangeDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && cardId) {
      setIsLoading(true);
      fetchMyCards({page: 1, take: 1000})
        .then(response => {
          const cards = response.result || response;
          const foundCard = cards.find(card => card.userCardId === cardId);
          if (foundCard) {
            setCardDetails(foundCard);
            setSellingQuantity(1);
            setExchangeGrade('');
            setExchangeGenre('');
            setExchangeDescription('');
          } else {
            setCardDetails(null);
            openModal({
              type: 'fail',
              title: '판매 등록',
              result: '실패',
              description: `[${cardDetails.cardGrade} | ${cardDetails.title}] ${sellingQuantity}장 판매 등록에 실패했습니다.`,
              button: {
                label: '마켓플레이스로 돌아가기',
                onClick: () => {
                  router.push('/market');
                  closeModal();
                },
              },
            });
          }
        })
        .catch(error => {
          setCardDetails(null);
          openModal({
            type: 'fail',
            title: '판매 등록',
            result: '실패',
            description: `[${cardDetails.cardGrade} | ${cardDetails.title}] ${sellingQuantity}장 판매 등록에 실패했습니다.`,
            button: {
              label: '마켓플레이스로 돌아가기',
              onClick: () => {
                router.push('/market');
                closeModal();
              },
            },
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setCardDetails(null);
      setSellingQuantity(1);
      setSellingPrice('');
      setExchangeGrade('');
      setExchangeGenre('');
      setExchangeDescription('');
      setIsLoading(false);
    }
  }, [isOpen, cardId, openModal]);

  const handleQuantityChange = useCallback(newVal => {
    setSellingQuantity(newVal);
  }, []);

  const handleRegisterSale = async () => {
    if (!cardDetails) {
      openModal({
        type: 'fail',
        title: '판매 등록',
        result: '실패',
        description: `[${cardDetails.cardGrade} | ${cardDetails.title}] ${sellingQuantity}장 판매 등록에 실패했습니다.`,
        button: {
          label: '마켓플레이스로 돌아가기',
          onClick: () => {
            router.push('/market');
            closeModal();
          },
        },
      });
      return;
    }
    if (
      !sellingQuantity ||
      sellingQuantity <= 0 ||
      sellingQuantity > cardDetails.quantityLeft
    ) {
      openModal({
        type: 'fail',
        title: '판매 등록',
        result: '실패',
        description: `[${cardDetails.cardGrade} | ${cardDetails.title}] ${sellingQuantity}장 판매 등록에 실패했습니다.`,
        button: {
          label: '마켓플레이스로 돌아가기',
          onClick: () => {
            router.push('/market');
            closeModal();
          },
        },
      });
      return;
    }
    if (!sellingPrice || sellingPrice <= 0) {
      openModal({
        type: 'fail',
        title: '판매 등록',
        result: '실패',
        description: `[${cardDetails.cardGrade} | ${cardDetails.title}] ${sellingQuantity}장 판매 등록에 실패했습니다.`,
        button: {
          label: '마켓플레이스로 돌아가기',
          onClick: () => {
            router.push('/market');
            closeModal();
          },
        },
      });
      return;
    }

    const currentListingType =
      exchangeGrade || exchangeGenre || exchangeDescription
        ? 'FOR_SALE_AND_TRADE'
        : 'FOR_SALE';

    const saleData = {
      photoCardId: Number(cardDetails.photoCardId),
      quantity: Number(sellingQuantity),
      price: Number(sellingPrice),
      listingType: currentListingType,
      ...(currentListingType === 'FOR_SALE_AND_TRADE' && {
        exchangeGrade,
        exchangeGenre,
        exchangeDescription,
      }),
    };

    console.log('판매 등록 데이터:', saleData);

    try {
      await registerSale(saleData);

      openModal({
        type: 'success',
        title: '판매 등록',
        result: '성공',
        description: `[${cardDetails.cardGrade} | ${cardDetails.title}] ${sellingQuantity}장 판매 등록에 성공했습니다.`,
        button: {
          label: '마켓플레이스로 돌아가기',
          onClick: () => {
            router.push('/my-gallery');
            closeModal();
          },
        },
      });
    } catch (error) {
      console.error('판매 등록 실패:', error);
      openModal({
        type: 'fail',
        title: '판매 등록',
        result: '실패',
        description: `[${cardDetails.cardGrade} | ${cardDetails.title}] ${sellingQuantity}장 판매 등록에 실패했습니다.`,
        button: {
          label: '마켓플레이스로 돌아가기',
          onClick: () => {
            router.push('/market');
            closeModal();
          },
        },
      });
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

  const getGenreLabel = genreValue => {
    const foundGenre = genreOptions.find(option => option.value === genreValue);
    return foundGenre ? foundGenre.label : genreValue;
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <ResponsiveModalWrapper onClose={onClose} variant="bottom">
        <div
          className="p-5 text-white min-h-[90vh]"
          style={{overflowY: 'auto'}}
        >
          {isLoading ? (
            <div className="flex justify-center h-screen">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-b-transparent border-l-gray-400 border-r-gray-400"></div>
            </div>
          ) : cardDetails ? (
            <div>
              <h2 className="font-baskin text-4 text-gray300 mb-10">
                나의 포토카드 판매하기
              </h2>
              <p className="text-[32px] font-bold mb-5">{cardDetails.title}</p>
              <div className="border-[1.5px] border-gray100 mb-12"></div>
              <div className="flex gap-5 justify-between">
                <div className="relative w-[342px] h-[256.5px] pc:w-110">
                  {cardDetails.imageUrl && (
                    <Image
                      src={cardDetails.imageUrl}
                      alt={cardDetails.title || '카드 이미지'}
                      layout="fill"
                      objectFit="cover"
                    />
                  )}
                </div>
                <div className="tablet:w-[342px] pc:w-110">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[15px]">
                      <p
                        className={`${
                          gradeStyles[cardDetails.cardGrade]
                        } text-[18px] font-bold`}
                      >
                        {cardDetails.cardGrade}
                      </p>
                      <div className="text-gray400">|</div>
                      <p className="text-[16px] text-gray300 font-bold">
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

              <div className="mt-[80.5px]">
                <p className="text-[22px] font-bold mb-[10px]">
                  교환 희망 정보
                </p>
                <div className="border-[1.5px] border-gray100 mb-[46px]"></div>
                <div className="flex">
                  <div className="w-full mr-5">
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

              <div className="flex gap-3 mt-15 mb-15">
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
