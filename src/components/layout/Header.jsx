import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header>
      <nav className="h-[60px] flex items-center justify-between max-w-[744px] m-auto px-[20px] tablet:max-w-[1200px] tablet:px-[40px] pc:px-[0]">
        <Image
          className="tablet:hidden"
          src={"/icons/ic_menu.svg"}
          width={22}
          height={22}
          alt="메뉴 토글"
        />
        <Link href={"/"}>
          <figure className="relative w-[83px] h-[15px] tablet:w-[111px] tablet:h-[20px] pc:w-[138px] pc:h-[25px]">
            <Image src={"/logo.svg"} fill className="object-cover" alt="로고" />
          </figure>
        </Link>
        {/* 비회원일 경우 */}
        <ul className="flex items-center gap-[30px] text-[14px] font-[500] text-[var(--color-gray200)]">
          <li className="">
            <Link href={"/login"}>로그인</Link>
          </li>
          <li className="hidden tablet:block">
            <Link href={"/signup"}>회원가입</Link>
          </li>
        </ul>

        {/* 회원일 경우 */}
        {/* <ul className="flex items-center gap-[30px]">
          <div className="flex items-center gap-[30px]">
            <li className="hidden tablet:block text-[14px] font-[700]">
              1,540 P
            </li>
            <li>
              <figure className="relative w-[22px] h-[22px] tablet:w-[24px] tablet:h-[24px]">
                <Image
                  className="object-cover"
                  src={"/icons/ic_alarm_default.svg"}
                  fill
                  alt="알림"
                />
              </figure>
            </li>
            <li className="hidden tablet:block font-baskin text-[18px] font-[400]">
              유디
            </li>
          </div>
          <div className="hidden tablet:block w-[1px] h-[20px] bg-[var(--color-gray400)]" />
          <li className="hidden tablet:block text-[14px] text-[var(--color-gray400)]">
            로그아웃
          </li>
        </ul> */}
      </nav>
    </header>
  );
};

export default Header;
