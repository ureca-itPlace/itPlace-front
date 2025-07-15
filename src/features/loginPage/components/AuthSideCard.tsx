import astronautImage from '../../../assets/loginPage/loginPage.png';

const AuthSideCard = () => {
  return (
    <div className="w-[26.9375rem] h-[39.9375rem] rounded-[1.875rem] overflow-hidden">
      <img src={astronautImage} alt="astronaut" className="w-full h-full object-cover" />
    </div>
  );
};

export default AuthSideCard;
