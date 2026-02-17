import React from 'react';
import { AppHeader } from './common';

export interface SubHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

const SubHeader: React.FC<SubHeaderProps> = ({
  title,
  showBack = true,
  onBack,
  rightAction,
}) => {
  return (
    <AppHeader
      title={title}
      showBack={showBack}
      onBack={onBack}
      rightAction={rightAction}
      centeredTitle={false}
      backStyle="boxed"
    />
  );
};

export default SubHeader;
