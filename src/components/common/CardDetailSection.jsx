import Image from 'next/image';
import CardProfile from '@/components/ui/card/cardProfile/CardProfile';
import NoHeader from '../layout/NoHeader';

export default function CardDetailSection({
  type,
  photoCard,
  exchangeCard,
  error,
}) {
  const {name, imageUrl} = photoCard;

  return (
    <div className="mx-auto w-[345px] tablet:w-[704px] pc:w-[1480px]">
      <NoHeader title="마켓플레이스" />

      <section className="mt-5 mb-[26px] tablet:mb-12 pc:mb-[70px]">
        <h3 className="mb-[10px] tablet:mb-5 font-bold text-2xl tablet:text-[32px] pc:text-[40px] text-white">
          {name}
        </h3>
        <hr className="border-2 border-gray100" />
      </section>

      <section className="flex flex-col tablet:flex-row gap-5 pc:gap-20 mb-30">
        <div className="w-[345px] tablet:w-[342px] pc:w-240 h-[258.75px] tablet:h-[256.5px] pc:h-180 relative">
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        </div>

        <div className="w-full tablet:flex-1">
          <CardProfile
            type={type}
            cards={[photoCard]}
            exchangeCard={exchangeCard}
            error={error}
          />
        </div>
      </section>
    </div>
  );
}
