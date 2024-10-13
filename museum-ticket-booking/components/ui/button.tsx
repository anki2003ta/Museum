import { ButtonHTMLAttributes, FC } from 'react';
import classNames from 'classnames';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: FC<ButtonProps> = ({ children, className, ...props }) => (
  <button
    className={classNames(
      'px-4 py-2 rounded-md text-white bg-[#8B7D6B] hover:bg-[#E8E0CC] focus:outline-none ml-4',
      className
    )}
    {...props}
  >
    {children}
  </button>
);
