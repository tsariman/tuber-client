import type {
    IState as ISState,
    IFormChoices as ISFormChoices,
    IStateAppbar as ISStateAppBar,
    IStateFormItemCustom as ISStateFormItemCustom,
    IStateFormItem as ISStateFormItem,
    IStateLink as ISStateLink,
    ISelectProps,
    IStateDialog as ISStateDialog,
    IStateCard as ISStateCard,
    IStatePage as ISStatePage,
    IStateDrawer as ISStateDrawer,
    TWithOptional,
    IStateFormItemAdornment as ISStateFormItemAdornment,
    IStateForm as ISStateForm,
    IStateFormItemCheckboxBox as ISStateFormItemCheckboxBox,
    IStateFormItemInputProps as ISStateFormItemInputProps,
    IStateFormItemGroup as ISStateFormItemGroup,
} from '@tuber/shared';
import type { TReduxHandler } from '../../state';
import type { SxProps } from '@mui/material/styles';

/** Chip state. */
export interface IStateChip extends IStateFormItemCustom {
  /** [ **required** ] Chip id */
  id: string;
};
/** All chip states for a page stored as an object. */
export type TStateChips = Record<string, IStateChip>;
/**
 * All chip states for all pages stored as an object. e.g.
 * ```ts
 * const state: TStateAllChips = {
 *   'endpoint': {
 *     'chipId': {}
 *   }
 * };
 * ```
 */
export type TStateAllChips = Record<string, TStateChips>;

export interface IStateLink<T=unknown>
  extends Omit<ISStateLink<T>, 'onClick' | 'has'>
{
  onClick?: TReduxHandler;
  has?: IStateFormItemCustom;
}

export interface IStateAppbar
  extends Omit<ISStateAppBar, 'items'
    | 'items2'
    | 'searchFieldIcon'
    | 'searchFieldIconButton'
    | 'inputBaseChips'
  >
{
  items?: IStateLink[];
  items2?: IStateLink[];
  /** Icon that's in the left corner of app bar search field. */
  searchFieldIcon?: IStateFormItemCustom;
  /** Icon button that's in the right corner of app bar search field. */
  searchFieldIconButton?: IStateLink;
  /** Appbar input chips */
  inputBaseChips?: IStateFormItemCustom[];
}

export interface IStateFormItemAdornment
  extends Omit<ISStateFormItemAdornment, 'icon'>
{
  text?: string;
  textProps?: React.HTMLAttributes<HTMLSpanElement> & {
    sx?: SxProps;
  };
  icon?: IStateLink;
}

export interface IStateFormItemInputProps
  extends Omit<ISStateFormItemInputProps, 'start' | 'end'>
{
  start?: IStateFormItemAdornment;
  end?: IStateFormItemAdornment;
}

export interface IStateFormItem<T=unknown>
  extends Omit<ISStateFormItem<T>, 'has' | 'items' | 'inputProps'>
{
  has?: IStateFormItemCustom<T>;
  items?: Array<IStateFormItem>;
  inputProps?: IStateFormItemInputProps;
}

export interface IStateForm extends Omit<ISStateForm, 'items'> {
  items?: IStateFormItem[];
}

export interface IStateAllForms { [prop: string]: IStateForm; }
export type TStateAllForms = Record<string, IStateForm>;

/**
 * Dialog base state
 */
export interface IStateDialog<T=unknown>
  extends Omit<ISStateDialog<T>, 'actions' | 'items'>
{
  actions?: IStateFormItem<T>[];
  items?: IStateFormItem<T>[];
}

export interface IStateFormItemGroup
  extends Omit<ISStateFormItemGroup, 'items'>
{
  items?: IStateFormItem[];
}

export interface IStateAllDialogs { [prop: string]: IStateDialog; }
export type TStateAllDialogs = Record<string, IStateDialog>;

export interface IFormChoices extends Omit<ISFormChoices, 'has'> {
  has?: IStateFormItemCustom;
}

export interface IStateFormItemCheckboxBox
  extends Omit<ISStateFormItemCheckboxBox, 'has'>
{
  has?: IStateFormItemCustom;
}

export interface IStateFormItemCustom<T = unknown>
  extends Omit<ISStateFormItemCustom<T>, 'callback'
    | 'onClick'
    | 'onDelete'
    | 'clickReduxHandler'
    | 'focusReduxHandler'
    | 'keydownReduxHandler'
    | 'changeReduxHandler'
    | 'blurReduxHandler'
  >
{
  callback?: TReduxHandler;
  /** Used by the Chip component */
  onClick?: TReduxHandler;
  /** Used by the Chip component */
  onDelete?: TReduxHandler;
  clickReduxHandler?: TReduxHandler;
  focusReduxHandler?: TReduxHandler;
  keydownReduxHandler?: TReduxHandler;
  changeReduxHandler?: TReduxHandler;
  blurReduxHandler?: TReduxHandler;
}

export interface IStateFormSelect extends ISelectProps {
  has?: IStateFormItemCustom;
}

export interface IStateCard extends Omit<ISStateCard, 'actions'> {
  actions?: IStateFormItem[];
}

export interface IStateDrawer extends Omit<ISStateDrawer, 'items'> {
  items?: IStateLink[];
}

/** Type for a drawer defined within a page. */
export interface IStatePageDrawer extends TWithOptional<IStateDrawer, 'width'> {
  content?: string[];
}


export interface IStatePage extends Omit<ISStatePage, 'appbar' | 'drawer'> {
  appbar?: IStateAppbar;
  /** Page drawer */
  drawer?: IStatePageDrawer;
}

/** Contains all page states. */
export interface IStateAllPages { [prop: string]: IStatePage; }
export type TStateAllPages = Record<string, IStatePage>;

export interface IState
  extends Omit<ISState, 'chips'
    | 'appbar'
    | 'dialog'
    | 'drawer'
    | 'pages'
    | 'dialogs'
    | 'forms'
  >
{
  chips: TStateAllChips;
  appbar: IStateAppbar;
  dialog: IStateDialog;
  drawer: IStateDrawer;
  pages: IStateAllPages;
  dialogs: IStateAllDialogs;
  forms: TStateAllForms;
};

export type TNetState = Partial<IState>;