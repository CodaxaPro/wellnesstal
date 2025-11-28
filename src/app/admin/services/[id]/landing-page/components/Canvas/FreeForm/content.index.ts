// content.index.ts
// Central export for all content components

export { ContentHeading } from './ContentHeading';
export { ContentText } from './ContentText';
export { ContentButton } from './ContentButton';
export { ContentImage } from './ContentImage';
export { ContentSpacer } from './ContentSpacer';

export type {
  HeadingConfig,
  TextConfig,
  ButtonConfig,
  ImageConfig,
  SpacerConfig,
  ContentComponent,
  HeadingLevel,
  TextAlign,
  FontWeight,
  ButtonVariant,
  ButtonSize,
  ImageFit,
} from './content.types';