type ErrorMessageProps = {
  message: string;
};

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <p className="text-body-4 max-xl:text-body-5 max-lg:text-body-5 text-danger mt-[6px] max-xl:mt-[5px] max-lg:mt-[4px] pl-[6px] max-xl:pl-[5px] max-lg:pl-[4px]">
      {message}
    </p>
  );
};

export default ErrorMessage;
