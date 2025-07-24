import astronautImage from '../../../../assets/loginPage/loginPage.png';

const AuthSideCard = () => {
  return (
    <div className="w-[431px] max-xl:w-[370px] max-lg:w-[277px] max-md:w-[320px] max-sm:w-full h-[639px] max-xl:h-[548px] max-lg:h-[430px] max-md:h-[380px] max-sm:h-full rounded-[30px] max-xl:rounded-[26px] max-lg:rounded-[20px] max-md:rounded-[18px] max-sm:rounded-none overflow-hidden">
      <img src={astronautImage} alt="astronaut" className="w-full h-full object-cover" />
    </div>
  );
};

export default AuthSideCard;
