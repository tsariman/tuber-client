import { Fragment } from 'react';
import type StateForm from '../../../controllers/StateForm';
import StateFormItem from '../../../controllers/StateFormItem';
import StateJsxDialogActionButton from './state.jsx.form.button';
import type { IStateFormItem } from '../../../localized/interfaces';
import { STATE_BUTTON } from '@tuber/shared';

interface IFieldItemProps {
  def: IStateFormItem[];
  parent: StateForm;
}

export default function StateJsxDialogAction({
  def: formItems,
  parent
}: IFieldItemProps) {
  return (
    <Fragment>
      {formItems.map((state, i) => {
        if (state.type?.toLowerCase() !== STATE_BUTTON) { return ( null ) }
        const item = new StateFormItem(state, parent)
        return <StateJsxDialogActionButton def={item} key={`dialgo-action-${i}`} />
      })}
    </Fragment>
  );
}
