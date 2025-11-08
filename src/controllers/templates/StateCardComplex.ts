import type { AvatarProps, CardHeaderProps } from '@mui/material';
import type { IStateCard } from '../../localized/interfaces';
import StateCard from '../StateCard';

export default class StateCardComplex extends StateCard {
  get props(): Required<IStateCard>['props'] {
    return {
      sx: {
        maxWidth: 345,
      },
      ...this.cardState.props
    };
  }
  get headerProps(): CardHeaderProps {
    return {
      title: 'Shrimp and Chorizo Paella',
      subheader: 'September 14, 2016',
      ...this.cardState.headerProps
    };
  }
  get avatarProps(): AvatarProps {
    return {
      alt: 'Avatar',
      ...this.cardState.avatarProps
    };
  }
  get fullText(): string { return this.cardState.fullText ?? ''; }
}
