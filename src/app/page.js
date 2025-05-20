import Button from "@/components/common/Button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="max-w-[744px] mx-auto overflow-x-hidden tablet:max-w-[1200px] pc:max-w-full">
        <section className="bg-custom-landing1bg max-w-[1798px] mx-auto h-[412px] rounded-[24px] flex flex-col items-center tablet:h-[722px] pc:h-[1088px]">
          <Image
            src={"/logo.svg"}
            width={138}
            height={25}
            alt="로고"
            className="hidden tablet:block tablet:mt-[67px] pc:mt-[77px]"
          />
          <div className="mt-[49px] tablet:mt-[22px]">
            <p className="text-[20px] font-bold text-center leading-[1.2] tablet:text-[40px]">
              구하기 어려웠던
              <br />
              <span className="text-[var(--color-main)]">나의 최애</span>가
              여기에!
            </p>
          </div>
          <Link
            href={"/product"}
            className="text-black font-bold text-[12px] mt-[24px] mb-[26px] tablet:mt-[38px] tablet:mb-[37px] tablet:text-[16px] pc:mt-[33px] pc:mb-[0]"
          >
            <p className="w-[150px] h-[40px] flex items-center justify-center bg-main tablet:w-[226px] tablet:h-[55px]">
              최애 찾으러 가기
            </p>
          </Link>
          <figure className="relative w-[calc(100%+120px)] h-[199px] overflow-visible tablet:h-[352px] pc:h-[765px]">
            <Image
              className="absolute object-contain"
              src={"/images/landing/landing1.svg"}
              fill
              alt="랜딩 페이지 최애 포토 바로 가기"
            />
          </figure>
        </section>
      </div>

      <section className="bg-landing2 w-full h-[440px] tablet:h-[707px] pc:h-[800px]" />
      <section className="bg-landing3 w-full h-[440px] tablet:h-[776px] pc:h-[800px]" />
      <section className="bg-landing4 w-full h-[440px] tablet:h-[667px] pc:h-[900px]" />
      <section className="mt-[60px] mb-[116px] flex flex-col items-center justify-center gap-[23px] tablet:gap-[27px] tablet:mb-[190px] pc:mt-[114px] pc:mb-[161px]">
        <figure className="relative w-[95px] h-[114px] tablet:w-[130px] tablet:h-[150px]">
          <Image
            src={"/images/landing/landing5.svg"}
            fill
            alt="landing5"
            className="object-cover"
          />
        </figure>
        <p className="text-[20px] font-bold tablet:text-[28px]">
          나의 최애를 지금 찾아보세요!
        </p>
        <Link
          href={"/product"}
          className="text-black font-bold text-[12px] mt-[24px] mb-[26px] tablet:mt-[38px] tablet:mb-[37px] tablet:text-[16px] pc:mt-[33px] pc:mb-[0]"
        >
          <p className="w-[150px] h-[40px] flex items-center justify-center bg-main tablet:w-[226px] tablet:h-[55px]">
            최애 찾으러 가기
          </p>
        </Link>
      </section>
    </div>
  );
}
