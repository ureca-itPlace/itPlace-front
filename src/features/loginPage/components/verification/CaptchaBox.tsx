import ReCAPTCHA from 'react-google-recaptcha';
import { useRef } from 'react';

type Props = {
  onCaptchaChange?: (value: string | null) => void;
};

const CaptchaBox = ({ onCaptchaChange }: Props) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleCaptchaChange = (value: string | null) => {
    if (onCaptchaChange) {
      onCaptchaChange(value);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey="6LdXCI4rAAAAAI0bHEW3kbgvjDi2m_uZX1an4HV5"
        onChange={handleCaptchaChange}
        size="normal"
        theme="light"
        className="scale-100 max-xl:scale-90 max-lg:scale-75 max-md:scale-90 max-sm:scale-95"
      />
    </div>
  );
};

export default CaptchaBox;
