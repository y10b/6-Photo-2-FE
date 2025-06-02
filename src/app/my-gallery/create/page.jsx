'use client';

import {useForm, Controller} from 'react-hook-form';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {
  Input,
  TextboxInput,
  UploadInput,
  DropdownInput,
} from '@/components/ui/input';
import Button from '@/components/common/Button';
import {
  createPhotoCard,
  fetchCardCreationQuota,
  uploadImage,
} from '@/lib/api/galleryApi';
import NoHeader from '@/components/layout/NoHeader';

export default function CreatePhotoCardPage() {
  const router = useRouter();
  const [remainingQuota, setRemainingQuota] = useState(0);
  const [imageFile, setImageFile] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: {errors, isValid},
  } = useForm({mode: 'onChange'});

  const onSubmit = async data => {
    try {
      const result = await createPhotoCard({
        ...data,
        price: Number(data.price),
        initialQuantity: Number(data.initialQuantity),
      });
      router.push('/my-gallery');
    } catch (error) {
      console.error('카드 생성 실패:', error);
    }
  };

  const handleImageChange = async file => {
    if (!file) return;
    try {
      const imageUrl = await uploadImage(file);
      setImageFile(file);
      setValue('imageUrl', imageUrl, {shouldValidate: true});
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
    }
  };

  useEffect(() => {
    fetchCardCreationQuota()
      .then(res => setRemainingQuota(res.remainingQuota))
      .catch(err => console.error('생성 가능 횟수 조회 실패:', err));
  }, []);

  return (
    <div className="max-w-[1480px] mx-auto px-4">
      <NoHeader title="포토카드 생성" />

      {/* 모바일 헤더 */}
      <div className="tablet:hidden px-4 mt-2 mb-4 flex items-baseline text-white">
        <span className="text-main text-[32px] leading-none">
          {remainingQuota}
        </span>
        <span className="text-xl leading-none">/3</span>
        <span className="text-gray300 text-sm ml-3 leading-none">
          ({new Date().getFullYear()}년 {new Date().getMonth() + 1}월)
        </span>
      </div>

      {/* 데스크탑/태블릿 헤더 */}
      <div className="hidden tablet:flex justify-between items-end">
        <h1 className="font-baskin text-[48px] pc:text-[62px] tracking-[-0.03em] text-white">
          포토카드 생성
        </h1>
        <div className="flex items-end mb-5">
          <span className="text-main text-[40px] leading-none self-end">
            {remainingQuota}
          </span>
          <span className="text-white text-[28px] leading-none self-end">
            /3
          </span>
          <span className="text-gray300 ml-3">
            ({new Date().getFullYear()}년 {new Date().getMonth() + 1}월)
          </span>
        </div>
      </div>

      <hr className="hidden tablet:flex border-2 border-gray200 mb-10" />

      <div className="flex justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 w-full max-w-[520px]"
        >
          <Input
            label="포토카드 이름"
            placeholder="포토카드 이름을 입력해 주세요"
            {...register('name', {
              required: '필수 입력 항목입니다.',
              maxLength: {value: 30, message: '최대 30자까지 입력 가능합니다.'},
            })}
            error={errors.name?.message}
          />

          <Controller
            name="grade"
            control={control}
            rules={{required: '필수 입력 항목입니다.'}}
            render={({field}) => (
              <DropdownInput
                label="등급"
                options={[
                  {label: 'COMMON', value: 'COMMON'},
                  {label: 'RARE', value: 'RARE'},
                  {label: 'SUPER_RARE', value: 'SUPER_RARE'},
                  {label: 'LEGENDARY', value: 'LEGENDARY'},
                ]}
                {...field}
                error={errors.grade?.message}
              />
            )}
          />

          <Controller
            name="genre"
            control={control}
            rules={{required: '필수 입력 항목입니다.'}}
            render={({field}) => (
              <DropdownInput
                label="장르"
                options={[
                  {label: '여행', value: 'TRAVEL'},
                  {label: '풍경', value: 'LANDSCAPE'},
                  {label: '인물', value: 'PORTRAIT'},
                  {label: '사물', value: 'OBJECT'},
                ]}
                {...field}
                error={errors.genre?.message}
              />
            )}
          />

          <Input
            label="가격"
            type="number"
            placeholder="가격을 입력해 주세요"
            {...register('price', {
              required: '필수 입력 항목입니다.',
              max: {value: 100000, message: '10만 원 이하로 입력해 주세요.'},
            })}
            error={errors.price?.message}
          />

          <Input
            label="발행량"
            type="number"
            placeholder="총 발행량을 입력해 주세요"
            {...register('initialQuantity', {
              required: '필수 입력 항목입니다.',
              max: {
                value: 10,
                message: '총 발행량은 10장 이하로 선택 가능합니다.',
              },
            })}
            error={errors.initialQuantity?.message}
          />

          <UploadInput
            label="이미지 URL"
            onChange={handleImageChange}
            error={errors.imageUrl?.message}
          />

          <TextboxInput
            label="설명"
            placeholder="카드 설명을 입력해 주세요"
            {...register('description', {required: '필수 입력 항목입니다.'})}
            error={errors.description?.message}
          />

          <Button
            type="submit"
            disabled={!isValid}
            className="w-full"
            style={{position: 'relative', zIndex: 9999, pointerEvents: 'auto'}}
          >
            생성하기
          </Button>
        </form>
      </div>
    </div>
  );
}
