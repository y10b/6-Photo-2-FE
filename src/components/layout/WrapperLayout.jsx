import Header from './Header';

const WrapperLayout = ({children}) => {
  return (
    <>
      <Header />
      <main className="mt-[20px] tablet:mt-[40px] pc:mt-[60px] px-[16px] tablet:px-[20px]">
        {children}
      </main>
    </>
  );
};

export default WrapperLayout;
