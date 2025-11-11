import type { JSX } from 'react';
import React, { memo, useMemo } from 'react';

import clsx from 'clsx';

import type {
  TypographyColor,
  TypographyProps,
  TypographyVariant,
  TypographyWeight,
} from '@/types/typography.types';

const VARIANT_MAP: Record<
  TypographyVariant,
  { tag: keyof JSX.IntrinsicElements; className: string }
> = {
  h1: { tag: 'h1', className: 'text-5xl font-bold leading-tight' },
  h2: { tag: 'h2', className: 'text-4xl font-bold leading-snug' },
  h3: { tag: 'h3', className: 'text-3xl font-semibold leading-snug' },
  h4: { tag: 'h4', className: 'text-2xl font-semibold leading-snug' },
  h5: { tag: 'h5', className: 'text-xl font-medium leading-snug' },
  h6: { tag: 'h6', className: 'text-lg font-medium leading-snug' },
  caption: { tag: 'span', className: 'text-xs font-normal leading-snug' },
  label: {
    tag: 'span',
    className: 'font-nunito text-[13px] font-medium leading-snug',
  },
  buttonText: { tag: 'span', className: 'text-sm font-semibold leading-snug' },
  overline: { tag: 'span', className: 'text-xs font-medium uppercase' },
  heading1: {
    tag: 'h1',
    className: 'font-nunito font-bold text-[32px] leading-tight',
  },
  heading2: {
    tag: 'h2',
    className: 'font-nunito font-bold text-[22px] leading-snug',
  },
  heading3: {
    tag: 'h3',
    className: 'font-nunito font-bold text-[20px] leading-snug',
  },
  heading4: {
    tag: 'h4',
    className: 'font-nunito font-bold text-[18px] leading-snug',
  },
  heading5: {
    tag: 'h5',
    className: 'font-nunito font-semibold text-[20px] leading-snug',
  },
  body: { tag: 'p', className: 'text-base font-normal leading-relaxed' },
  bodySmall: { tag: 'p', className: 'text-sm font-normal leading-relaxed' },
  body1: {
    tag: 'p',
    className: 'font-nunito text-[16px] font-normal leading-relaxed',
  },
  body2: {
    tag: 'p',
    className: 'font-nunito text-[14px] font-normal leading-relaxed',
  },
  body3: {
    tag: 'p',
    className: 'font-nunito text-[14px] font-medium leading-relaxed',
  },
  body4: {
    tag: 'p',
    className: 'font-nunito text-[12px] font-normal leading-relaxed',
  },
  body5: {
    tag: 'p',
    className: 'font-nunito text-[13px] font-bold leading-relaxed',
  },
  body6: {
    tag: 'p',
    className: 'font-nunito text-[11px] font-normal leading-relaxed',
  },
  textPlaceholder: {
    tag: 'p',
    className: 'font-nunito text-[14px] font-normal leading-relaxed',
  },
  helperText: {
    tag: 'p',
    className: 'font-nunito text-[13px] font-semibold leading-relaxed',
  },
};

const COLOR_MAP: Record<TypographyColor, string> = {
  primary: 'text-gray-900 dark:text-gray-100',
  secondary: 'text-gray-700 dark:text-gray-300',
  muted: 'text-gray-500 dark:text-gray-400',
  danger: 'text-red-600 dark:text-red-400',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
};

const WEIGHT_MAP: Record<TypographyWeight, string> = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const TypographyComponent: React.FC<TypographyProps> = ({
  variant = 'body',
  as,
  color = 'primary',
  align,
  weight,
  truncate = false,
  noWrap = false,
  italic = false,
  uppercase = false,
  className,
  children,
  ...rest
}) => {
  const Tag = (as || VARIANT_MAP[variant].tag) as React.ElementType;

  const classes = useMemo(
    () =>
      clsx(
        VARIANT_MAP[variant].className,
        COLOR_MAP[color],
        weight && WEIGHT_MAP[weight],
        align && `text-${align}`,
        truncate && 'truncate',
        noWrap && 'whitespace-nowrap',
        italic && 'italic',
        uppercase && 'uppercase',
        className,
      ),
    [
      variant,
      color,
      weight,
      align,
      truncate,
      noWrap,
      italic,
      uppercase,
      className,
    ],
  );

  return React.createElement(Tag, { className: classes, ...rest }, children);
};

export const Typography = memo(TypographyComponent);
