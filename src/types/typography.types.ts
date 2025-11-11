import type React from 'react';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'label'
  | 'label1'
  | 'buttonText'
  | 'overline'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'heading5'
  | 'body1'
  | 'body2'
  | 'body3'
  | 'body4'
  | 'body5'
  | 'body6'
  | 'textPlaceholder'
  | 'helperText';

export type TypographyColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'danger'
  | 'success'
  | 'warning';

export type TypographyAlign = 'left' | 'center' | 'right' | 'justify';

export type TypographyWeight =
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: React.ElementType;
  color?: TypographyColor;
  align?: TypographyAlign;
  weight?: TypographyWeight;
  truncate?: boolean;
  noWrap?: boolean;
  italic?: boolean;
  uppercase?: boolean;
  className?: string;
  children: React.ReactNode;
}
