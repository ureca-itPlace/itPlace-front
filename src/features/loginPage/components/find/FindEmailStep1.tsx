import PhoneAuth from '../common/PhoneAuth';

type Props = {
  name: string;
  phone: string;
  onChangeName: (val: string) => void;
  onChangePhone: (val: string) => void;
  onClickNext: () => void;
  onClickTabPassword: () => void;
};

const FindEmailStep1 = ({
  name,
  phone,
  onChangeName,
  onChangePhone,
  onClickNext,
  onClickTabPassword,
}: Props) => {
  return (
    <PhoneAuth
      name={name}
      phone={phone}
      onChangeName={onChangeName}
      onChangePhone={onChangePhone}
      onSubmit={onClickNext}
      showTab={true}
      showCaptcha={false}
      title="" // 탭으로 대체
      submitLabel="다음"
      onClickTabPassword={onClickTabPassword}
    />
  );
};

export default FindEmailStep1;
