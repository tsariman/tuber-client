import type {
  DialogContentProps,
  DialogProps,
  DialogTitleProps
} from '@mui/material';
import type { IStateFormItem } from '../../interfaces/localized';
import StateDialog from '../StateDialog';

export default class StateDialogCustomized extends StateDialog {
  get props(): DialogProps {
    return {
      'aria-labelledby': 'customized-dialog-title',
      ...this.dialogState.props
    } as DialogProps;
  }
  get titleProps(): DialogTitleProps {
    return {
      id: 'customized-dialog-title',
      ...this.dialogState.titleProps
    };
  }
  get contentProps(): DialogContentProps {
    return {
      dividers: true,
      ...this.dialogState.contentProps
    };
  }
  get actions(): IStateFormItem[] {
    return this.dialogState.actions || [];
  }
}
