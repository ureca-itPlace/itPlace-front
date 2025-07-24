import astronautImage from '../../../../assets/loginPage/loginPage.png';

const AuthSideCard = () => {
  return (
    <div className="w-[26.9375rem] max-xl:w-[23.125rem] max-lg:w-[17.3125rem] h-[39.9375rem] max-xl:h-[34.25rem] max-lg:h-[26.875rem] rounded-[1.875rem] max-xl:rounded-[1.625rem] max-lg:rounded-[1.25rem] overflow-hidden">
      <img src={astronautImage} alt="astronaut" className="w-full h-full object-cover" />
    </div>
  );
};

export default AuthSideCard;
