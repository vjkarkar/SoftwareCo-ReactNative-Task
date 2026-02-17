import React from 'react';
import { AppHeader } from './common';

export interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  rightAction,
}) => {
  return (
    <AppHeader
      title={title}
      showBack={showBack}
      rightAction={rightAction}
      centeredTitle
      backStyle="plain"
    />
  );
};

export default Header;
