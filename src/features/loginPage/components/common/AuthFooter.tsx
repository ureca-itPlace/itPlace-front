type Props = {
  leftText: string;
  rightText: string;
  onRightClick: () => void;
};

const AuthFooter = ({ leftText, rightText, onRightClick }: Props) => {
  return (
    <div className="w-[310px] flex justify-center gap-[5px] text-body-3 text-grey04 mt-[16px] duration-300">
      <span>{leftText}</span>
      <span onClick={onRightClick} className="text-purple04 hover:text-purple05 cursor-pointer">
        {rightText}
      </span>
    </div>
  );
};

export default AuthFooter;
