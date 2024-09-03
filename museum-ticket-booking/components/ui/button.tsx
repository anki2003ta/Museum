import { ButtonHTMLAttributes, FC } from 'react';
import classNames from 'classnames';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: FC<ButtonProps> = ({ children, className, ...props }) => (
  <button
    className={classNames(
      'px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none',
      className
    )}
    {...props}
  >
    {children}
  </button>
);
