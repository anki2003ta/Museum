import { FC, ReactNode } from 'react';
import classNames from 'classnames';

type ScrollAreaProps = {
  children: ReactNode;
  className?: string;
};

export const ScrollArea: FC<ScrollAreaProps> = ({ children, className }) => (
  <div className={classNames('overflow-y-auto', className)}>
    {children}
  </div>
);
