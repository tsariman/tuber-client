import type {
  DialogContentTextProps,
  DialogProps,
  DialogTitleProps
} from '@mui/material';
import StateDialog from '../StateDialog';

export default class StateDialogAlert extends StateDialog {

  get props(): DialogProps {
    return {
      'aria-labelledby': 'alert-dialog-title',
      'aria-describedby': 'alert-dialog-description',
      ...this.dialogState.props
    } as DialogProps;
  }

  get titleProps(): DialogTitleProps {
    return {
      id: 'alert-dialog-title',
      ...this.dialogState.titleProps
    };
  }

  get contentTextProps(): DialogContentTextProps {
    return {
      id: 'alert-dialog-description',
      ...this.dialogState.contentTextProps
    };
  }

}
