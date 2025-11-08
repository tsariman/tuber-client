import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';
import type { IStateBackground, IStateComponent } from '@tuber/shared';
import type {
  AppBarProps as AppbarProps,
  ToolbarProps,
  IconButtonProps,
  TypographyProps,
  BoxProps,
  SxProps
} from '@mui/material';
import type { HTMLAttributes } from 'react';

export const appbarSlice = createSlice({
  name: 'appbar',
  initialState: initialState.appbar,
  reducers: {
    appbarBackgroundUpdate: (state, action: PayloadAction<IStateBackground>) => {
      state.background = action.payload;
    },
    appbarPropsUpdate: (state, action: PayloadAction<AppbarProps>) => {
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.props = action.payload;
    },
    appbarToolbarPropsUpdate: (state, action: PayloadAction<ToolbarProps>) => {
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.toolbarProps = action.payload;
    },
    appbarMenuIconPropsUpdate: (state, action: PayloadAction<IconButtonProps>) => {
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.menuIconProps = action.payload;
    },
    appbarLogoPropsUpdate: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.logoProps = action.payload;
    },
    appbarTextLogoPropsUpdate: (state, action: PayloadAction<TypographyProps>) => {
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.textLogoProps = action.payload;
    },
    appbarSearchFieldPropsUpdate: (state, action: PayloadAction<HTMLAttributes<HTMLDivElement> & { sx?: SxProps }>) => {
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.searchContainerProps = action.payload;
    },
    appbarDesktopMenuItemsPropsUpdate: (state, action: PayloadAction<BoxProps>) => {
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.desktopMenuItemsProps = action.payload;
    },
    appbarMobileMenuItemsPropsUpdate: (state, action: PayloadAction<BoxProps>) => {
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.mobileMenuItemsProps = action.payload;
    },
    appbarMobilMenuIconPropsUpdate: (state, action: PayloadAction<IconButtonProps>) => {
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.mobileMenuIconProps = action.payload;
    },
    appbarLogoThemeUpdate: (state, action: PayloadAction<HTMLAttributes<HTMLDivElement>>) => {
      // @ts-expect-error The Redux toolkit and Material-UI do not get along.
      state.logoTheme = action.payload;
    },
    appbarBackgroundInheritedUpdate: (state, action: PayloadAction<string>) => {
      state.backgroundInherited = action.payload;
    },
    appbarUseDefaultBackgroundUpdate: (state, action: PayloadAction<boolean>) => {
      state.useDefaultBackground = action.payload;
    },
    appbarUseDefaultTypographyUpdate: (state, action: PayloadAction<boolean>) => {
      state.useDefaultTypography = action.payload;
    },
    appbarTypographyInheritedUpdate: (state, action: PayloadAction<string>) => {
      state.typographyInherited = action.payload;
    },
    appbarComponentsUpdate: (state, action: PayloadAction<{ [comp: string]: IStateComponent[] }>) => {
      state.components = action.payload;
    },
  }
})

export const appbarActions = appbarSlice.actions;
export const {
  appbarBackgroundUpdate,
  appbarPropsUpdate,
  appbarToolbarPropsUpdate,
  appbarMenuIconPropsUpdate,
  appbarLogoPropsUpdate,
  appbarTextLogoPropsUpdate,
  appbarSearchFieldPropsUpdate,
  appbarDesktopMenuItemsPropsUpdate,
  appbarMobileMenuItemsPropsUpdate,
  appbarLogoThemeUpdate,
  appbarMobilMenuIconPropsUpdate,
  appbarBackgroundInheritedUpdate,
  appbarUseDefaultBackgroundUpdate,
  appbarUseDefaultTypographyUpdate,
  appbarTypographyInheritedUpdate,
  appbarComponentsUpdate
} = appbarSlice.actions;

export default appbarSlice.reducer;
