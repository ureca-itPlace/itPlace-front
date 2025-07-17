type ErrorMessageProps = {
  message: string;
};

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return <p className="text-body-4 text-danger mt-[6px] pl-[6px]">{message}</p>;
};

export default ErrorMessage;
