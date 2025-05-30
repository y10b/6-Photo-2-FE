'use client';

import {useState, useEffect} from 'react';
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
  const [form, setForm] = useState({
    name: '',
    description: '',
    imageUrl: '',
    grade: '',
    genre: '',
    price: '',
    initialQuantity: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [remainingQuota, setRemainingQuota] = useState(0);

  const validate = (name, value) => {
    if (!value.trim()) return '필수 입력 항목입니다.';
    if (name === 'name' && value.length > 30) {
      return '포토카드 이름은 최대 30자까지 입력 가능합니다.';
    }
    if (name === 'initialQuantity' && +value > 10) {
      return '총 발행량은 10장 이하로 선택 가능합니다.';
    }
    if (name === 'price' && +value > 1000000) {
      return '가격은 1,000,000원 이하로 입력해 주세요.';
    }
    return '';
  };

  const handleChange = e => {
    const {name, value} = e.target;
    setForm(prev => ({...prev, [name]: value}));
    if (touched[name]) {
      const error = validate(name, value);
      setErrors(prev => ({...prev, [name]: error}));
    }
  };

  const handleBlur = e => {
    const {name, value} = e.target;
    setTouched(prev => ({...prev, [name]: true}));
    const error = validate(name, value);
    setErrors(prev => ({...prev, [name]: error}));
  };

  const handleImageChange = async file => {
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file);
      setImageFile(file);
      setForm(prev => ({
        ...prev,
        imageUrl,
      }));
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
    }
  };

  useEffect(() => {
    const allFilled = Object.entries(form).every(([key, value]) => {
      if (key === 'imageUrl') return !!imageFile;
      return value.trim() !== '';
    });

    const allValid = Object.entries(form).every(([key, value]) => {
      if (key === 'imageUrl') return !!imageFile;
      return validate(key, value) === '';
    });

    setIsFormValid(allFilled && allValid);
  }, [form, imageFile]);

  useEffect(() => {
    fetchCardCreationQuota()
      .then(res => setRemainingQuota(res.remainingQuota))
      .catch(err => console.error('생성 가능 횟수 조회 실패:', err));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const result = await createPhotoCard({
        ...form,
        price: Number(form.price),
        initialQuantity: Number(form.initialQuantity),
      });

      router.push('/my-gallery');
    } catch (error) {}
  };

  return (
    <div className="max-w-[1480px] mx-auto px-4">
      {/* 모바일 헤더 */}
      <NoHeader title="포토카드 생성" />
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
          <span className="text-main  text-[40px] leading-none self-end">
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
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-[520px]"
        >
          <Input
            label="포토카드 이름"
            name="name"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="포토카드 이름을 입력해 주세요"
            error={errors.name}
            required
          />
          <DropdownInput
            label="등급"
            name="grade"
            value={form.grade}
            onChange={handleChange}
            onBlur={handleBlur}
            options={[
              {label: 'COMMON', value: 'COMMON'},
              {label: 'RARE', value: 'RARE'},
              {label: 'SUPER_RARE', value: 'SUPER_RARE'},
              {label: 'LEGENDARY', value: 'LEGENDARY'},
            ]}
            error={errors.grade}
            required
          />
          <DropdownInput
            label="장르"
            name="genre"
            value={form.genre}
            onChange={handleChange}
            onBlur={handleBlur}
            options={[
              {label: '여행', value: 'TRAVEL'},
              {label: '풍경', value: 'LANDSCAPE'},
              {label: '인물', value: 'PORTRAIT'},
              {label: '사물', value: 'OBJECT'},
            ]}
            error={errors.genre}
            required
          />
          <Input
            label="가격"
            name="price"
            type="number"
            min="1"
            value={form.price}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="가격을 입력해 주세요"
            error={errors.price}
            required
          />
          <Input
            label="발행량"
            name="initialQuantity"
            type="number"
            min="1"
            max="10"
            value={form.initialQuantity}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="총 발행량을 입력해 주세요"
            error={errors.initialQuantity}
            required
          />
          <UploadInput
            label="이미지 URL"
            name="imageUrl"
            onChange={handleImageChange}
            error={errors.imageUrl}
          />
          <TextboxInput
            label="설명"
            name="description"
            value={form.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="카드 설명을 입력해 주세요"
            error={errors.description}
            required
          />
          <Button
            type="submit"
            disabled={!isFormValid}
            className="w-full"
            style={{
              position: 'relative',
              zIndex: 9999,
              pointerEvents: 'auto',
            }}
          >
            생성하기
          </Button>
        </form>
      </div>
    </div>
  );
}
