import { InputHTMLAttributes, FC } from 'react';
import classNames from 'classnames';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input: FC<InputProps> = ({ className, ...props }) => (
  <input
    className={classNames(
      'px-4 py-2 rounded-md border focus:outline-none focus:ring focus:border-blue-300',
      className
    )}
    {...props}
  />
);
