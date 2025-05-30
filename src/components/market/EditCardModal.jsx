'use client';

import React, {useEffect, useState, useCallback} from 'react';
import ResponsiveModalWrapper from '@/components/modal/ResponsiveModalWrapper';
import {fetchShopDetail, updateShop} from '@/lib/api/shop';
import Image from 'next/image';
import DropdownInput from '@/components/ui/input/DropdownInput';
import Button from '@/components/common/Button';
import Textarea from '@/components/ui/input/TextboxInput';
import {CounterInput} from '../ui/input';
import gradeStyles from '@/utils/gradeStyles';
import {useModal} from '@/components/modal/ModalContext';
import {useRouter} from 'next/navigation';
import useMediaQuery from '@/hooks/useMediaQuery';
import {useParams} from 'next/navigation';

export default function EditCardModal({isOpen, onClose}) {
  const {openModal, closeModal} = useModal();
  const router = useRouter();
  const {id} = useParams();

  const [shopDetails, setShopDetails] = useState(null);
  const [initialShopDetails, setInitialShopDetails] = useState(null);

  const [sellingQuantity, setSellingQuantity] = useState(1);
  const [sellingPrice, setSellingPrice] = useState('');
  const [exchangeGrade, setExchangeGrade] = useState('');
  const [exchangeGenre, setExchangeGenre] = useState('');
  const [exchangeDescription, setExchangeDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (isOpen && id) {
      setIsLoading(true);
      fetchShopDetail(Number(id))
        .then(response => {
          const shopItem = response.shop || response;
          if (shopItem) {
            setShopDetails(shopItem);
            const processedInitialData = {
              ...shopItem,
              price: shopItem.price,
              exchangeGrade: shopItem.exchangeGrade?.trim() || '',
              exchangeGenre: shopItem.exchangeGenre?.trim() || '',
              exchangeDescription: shopItem.exchangeDescription?.trim() || '',
            };
            setInitialShopDetails(processedInitialData);

            setSellingQuantity(shopItem.initialQuantity || 1);
            setSellingPrice(shopItem.price || '');
            setExchangeGrade(shopItem.exchangeGrade || '');
            setExchangeGenre(shopItem.exchangeGenre || '');
            setExchangeDescription(shopItem.exchangeDescription || '');
          } else {
            setShopDetails(null);
            setInitialShopDetails(null);
            openModal({
              type: 'alert',
              title: '판매글 정보 불러오기 실패',
              description: '해당 판매글 정보를 불러오는 데 실패했습니다.',
              button: {
                label: '확인',
                onClick: () => {
                  closeModal();
                  onClose();
                },
              },
            });
          }
        })
        .catch(error => {
          setShopDetails(null);
          setInitialShopDetails(null);
          openModal({
            type: 'alert',
            title: '판매글 정보 불러오기 실패',
            description: `판매글 정보를 불러오는 중 오류가 발생했습니다: ${
              error.message || '알 수 없는 오류'
            }`,
            button: {
              label: '마켓플레이스로 돌아가기',
              onClick: () => {
                closeModal();
                onClose();
                router.push('/market');
              },
            },
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (!isOpen) {
      setShopDetails(null);
      setInitialShopDetails(null);
      setSellingQuantity(1);
      setSellingPrice('');
      setExchangeGrade('');
      setExchangeGenre('');
      setExchangeDescription('');
      setIsLoading(false);
    }
  }, [isOpen, id, openModal, closeModal, onClose, router]);

  const handleQuantityChange = useCallback(newVal => {
    setSellingQuantity(newVal);
  }, []);

  const hasChanges = useCallback(() => {
    if (!initialShopDetails) return false;

    const initialPriceString = initialShopDetails.price;
    const currentPriceString = sellingPrice;

    if (
      sellingQuantity !== initialShopDetails.initialQuantity ||
      currentPriceString !== initialPriceString
    ) {
      return true;
    }

    const initialExchangeGrade = initialShopDetails.exchangeGrade?.trim() || '';
    const initialExchangeGenre = initialShopDetails.exchangeGenre?.trim() || '';
    const initialExchangeDescription =
      initialShopDetails.exchangeDescription?.trim() || '';

    const currentExchangeGrade = exchangeGrade?.trim() || '';
    const currentExchangeGenre = exchangeGenre?.trim() || '';
    const currentExchangeDescription = exchangeDescription?.trim() || '';

    const initialHasExchangeInfo =
      initialExchangeGrade ||
      initialExchangeGenre ||
      initialExchangeDescription;
    const currentHasExchangeInfo =
      currentExchangeGrade ||
      currentExchangeGenre ||
      currentExchangeDescription;

    if (initialHasExchangeInfo !== currentHasExchangeInfo) {
      return true;
    }

    if (currentHasExchangeInfo) {
      if (
        currentExchangeGrade !== initialExchangeGrade ||
        currentExchangeGenre !== initialExchangeGenre ||
        currentExchangeDescription !== initialExchangeDescription
      ) {
        return true;
      }
    }

    return false;
  }, [
    initialShopDetails,
    sellingQuantity,
    sellingPrice,
    exchangeGrade,
    exchangeGenre,
    exchangeDescription,
  ]);

  const handleEditSubmit = async () => {
    if (!sellingQuantity || !sellingPrice || sellingPrice === 0) {
      openModal({
        type: 'alert',
        title: '입력 오류',
        description: '판매 수량과 가격을 입력해주세요.',
        button: {
          label: '확인',
          onClick: closeModal,
        },
      });
      return;
    }

    const hasExchangeInfo =
      exchangeGrade || exchangeGenre || exchangeDescription;

    const updatedData = {
      initialQuantity: sellingQuantity,
      price: Number(sellingPrice),
    };

    if (hasExchangeInfo) {
      updatedData.listingType = 'FOR_SALE_AND_TRADE';
      updatedData.exchangeGrade = exchangeGrade;
      updatedData.exchangeGenre = exchangeGenre;
      updatedData.exchangeDescription = exchangeDescription;
    } else {
      updatedData.listingType = 'FOR_SALE';
      updatedData.exchangeGrade = null;
      updatedData.exchangeGenre = null;
      updatedData.exchangeDescription = null;
    }

    try {
      await updateShop(Number(id), updatedData);

      openModal({
        type: 'success',
        title: '수정 완료',
        description: '판매글이 성공적으로 수정되었습니다.',
        button: {
          label: '확인',
          onClick: () => {
            closeModal();
            onClose();
            window.location.reload();
          },
        },
      });
    } catch (error) {
      openModal({
        type: 'fail',
        title: '수정 실패',
        description: error.message || '수정 중 오류가 발생했습니다.',
        button: {
          label: '닫기',
          onClick: () => {
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

  const isSubmitDisabled = isLoading || !initialShopDetails || !hasChanges();

  return (
    <>
      <ResponsiveModalWrapper
        onClose={onClose}
        variant={isMobile ? 'full' : 'bottom'}
        title={'수정하기'}
      >
        <div
          className="px-[15px] tablet:p-5 text-white min-h-[90vh]"
          style={{overflowY: 'auto'}}
        >
          {isLoading ? (
            <div className="flex justify-center h-screen items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-b-transparent border-l-gray-400 border-r-gray-400"></div>
            </div>
          ) : shopDetails ? (
            <div>
              <h2 className="hidden tablet:block font-baskin text-4 text-gray300 mb-10">
                수정하기
              </h2>
              <p className="text-[24px] mb-[10px] tablet:text-[32px] font-bold tablet:mb-5">
                {shopDetails.photoCard.name || '카드 이름 없음'}
              </p>

              <div className="mb-[26px] border-[1.5px] border-gray100 tablet:mb-12"></div>

              <div className="tablet:flex tablet:gap-5 tablet:justify-between">
                <div className="relative min-w-[345px] min-h-[258.5px] tablet:w-[342px] tablet:h-[256.5px] pc:w-110 ">
                  {shopDetails.photoCard.imageUrl && (
                    <Image
                      src={shopDetails.photoCard.imageUrl}
                      alt={shopDetails.photoCard.name}
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
                          gradeStyles[shopDetails.photoCard.grade]
                        } text-[18px] font-normal`}
                      >
                        {shopDetails.photoCard.grade}
                      </p>
                      <div className="text-gray400">|</div>
                      <p className="text-[16px] text-gray300 font-normal">
                        {getGenreLabel(
                          shopDetails.photoCard.genre ||
                            shopDetails.photoCard.cardGenre,
                        )}
                      </p>
                    </div>
                    <p className="underline text-[18px] text-white ">
                      {shopDetails.seller.nickname}
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
                      max={shopDetails.remainingQuantity}
                      onChange={handleQuantityChange}
                      maxText={`${shopDetails.remainingQuantity}장`}
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
                  onClick={handleEditSubmit}
                  className="w-full"
                  disabled={isSubmitDisabled}
                >
                  수정하기
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-center text-white">
              카드 정보를 불러올 수 없습니다. 다시 시도해주세요.
            </p>
          )}
        </div>
      </ResponsiveModalWrapper>
    </>
  );
}
