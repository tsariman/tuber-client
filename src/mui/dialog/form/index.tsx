import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import { Fragment, useMemo, useCallback, type JSX } from 'react';
import type { IStateFormItemSelectOption } from '@tuber/shared';
import {
  BOX,
  BREAK_LINE,
  CHECKBOXES,
  DATE_TIME_PICKER,
  DESKTOP_DATE_TIME_PICKER,
  FORM_CONTROL,
  FORM_CONTROL_LABEL,
  FORM_GROUP,
  FORM_HELPER_TEXT,
  FORM_LABEL,
  HTML,
  INDETERMINATE,
  STATE_SELECT,
  LOCALIZED,
  MOBILE_DATE_TIME_PICKER,
  NUMBER,
  PASSWORD,
  PHONE_INPUT,
  RADIO_BUTTONS,
  STACK,
  SWITCH,
  TEXT,
  TEXTAREA,
  TEXTFIELD,
} from '@tuber/shared';
import type { IStateFormItemGroup } from '../../../localized/interfaces';
import type StateForm from '../../../controllers/StateForm';
import type StateFormItem from '../../../controllers/StateFormItem';
import StateFormItemGroup from '../../../controllers/StateFormItemGroup';
import StateFormItemInput from '../../../controllers/templates/StateFormItemInput';
import StateFormItemRadio from '../../../controllers/templates/StateFormItemRadio';
import StateFormItemSwitch from '../../../controllers/templates/StateFormItemSwitch';
import type StateFormItemCheckboxBox from '../../../controllers/StateFormItemCheckboxBox';
import type StateFormItemRadioButton from '../../../controllers/StateFormItemRadioButton';
import type StateFormItemSwitchToggle from '../../../controllers/StateFormItemSwitchToggle';
import { error_id } from '../../../business.logic/errors';
import StateJsxFormItemGroup from '../../form/state.jsx.form.item.group';
import DialogCheckboxes from './dialog.checkboxes';
import DialogPhoneInput from './dialog.phone.input';
import DialogPicker from './dialog.picker';
import DialogRadio from './dialog.radio';
import DialogSwitch from './dialog.switch';
import DialogTextField from './dialog.textfield';
import DialogSelect from './select';
import { log } from '../../../business.logic/logging';

interface IRecursiveFormBuilder {
  form: StateForm;
  items?: StateFormItem['items'];
  depth?: number;
}

interface IItemTable {
  [constant: string]: (
    item: StateFormItem,
    key: string | number
  ) => JSX.Element | JSX.Element[];
}

export type THive = Record<string, unknown>;

export default function RecursiveFormItems (props: IRecursiveFormBuilder) {
  const form = props.form;
  const items = props.items;
  const depth = props.depth ?? 0;
  
  // Memoize the hive computation to avoid recalculating on every render
  const hive = useMemo(() => {
    const formItems = items || form.items;
    const hiveData: THive = {};
    formItems.map(item => {
      const type_toLowerCase = item.type.toLowerCase();
      if (type_toLowerCase !== 'json_button' && 'submit' !== type_toLowerCase) {
        hiveData[item.name] = item.has.defaultValue ?? '';
      }
      return hiveData[item.name];
    });
    return hiveData;
  }, [items, form.items]);

  // Memoize the group item renderer
  const groupItem = useCallback((def: StateFormItem, key: string|number) => {
    const groupItemDef = new StateFormItemGroup(
      def.state as IStateFormItemGroup,
      def.parent
    );
    return (
      <StateJsxFormItemGroup key={`group${depth}-${key}`} def={groupItemDef}>
        <RecursiveFormItems
          key={`group-recursion${depth}-${key}`}
          form={form}
          items={groupItemDef.items}
          depth={depth + 1}
        />
      </StateJsxFormItemGroup>
    );
  }, [form, depth]);

  // Memoize the text item renderer
  const textItem = useCallback((def: StateFormItem, key: string|number) => {
    return (
      <DialogTextField
        key={`textfield${depth}-${key}`}
        def={def}
        hive={hive}
      />
    );
  }, [depth, hive]);

  // Memoize the date time picker item renderer
  const dateTimePickerItem = useCallback((item: StateFormItem, key: string|number) => {
    return (
      <DialogPicker
        key={`datetime-picker-item${depth}-${key}`}
        def={item}
        hive={hive}
      />
    );
  }, [depth, hive]);

  // Memoize the items table to prevent re-creation on every render
  const itemsTable: IItemTable = useMemo(() => ({
    [BOX]: groupItem,
    [BREAK_LINE]: (_item: StateFormItem, key: string|number) => (
      <br key={`breakline${depth}-${key}`} />
    ),
    [CHECKBOXES]: (def: StateFormItem, key: string|number) => (
      <DialogCheckboxes
        def={def as StateFormItem<StateForm, StateFormItemCheckboxBox>}
        hive={hive}
        key={`checkboxes${depth}-${key}`}
      />
    ),
    [DATE_TIME_PICKER]: dateTimePickerItem,
    [DESKTOP_DATE_TIME_PICKER]: dateTimePickerItem,
    [FORM_CONTROL]: groupItem,
    [FORM_CONTROL_LABEL]: groupItem,
    [FORM_GROUP]: groupItem,
    [FORM_HELPER_TEXT]: (def: StateFormItem, key: string|number) => (
      <FormHelperText
        key={`form-helper-text${depth}-${key}`}
      >
        { def.text }
      </FormHelperText>
    ),
    [FORM_LABEL]: (def: StateFormItem, key: string|number) => (
      <FormLabel
        {...def.props}
        key={`form-label${depth}-${key}`}
      >
        { def.text }
      </FormLabel>
    ),
    [HTML]: (item: StateFormItem, key: string | number) => (
      <div
        key={`html${depth}-${key}`}
        {...item.props}
        dangerouslySetInnerHTML={{__html: item.has.content}}
      />
    ),
    [INDETERMINATE]: groupItem,
    [STATE_SELECT]: (def: StateFormItem, key: string|number) => (
      <DialogSelect
        def={def as StateFormItem<StateForm, IStateFormItemSelectOption>}
        hive={hive}
        key={`json-select${depth}-${key}`}
      />
    ),
    [LOCALIZED]: groupItem,
    [MOBILE_DATE_TIME_PICKER]: dateTimePickerItem,
    [NUMBER]: textItem,
    [PASSWORD]: textItem,
    [RADIO_BUTTONS]: (def: StateFormItem, key: string|number) => {
      const radioDef = new StateFormItemRadio(
        def.state as StateFormItem<StateForm, StateFormItemRadioButton>,
        def.parent
      );
      return (
        <DialogRadio
          def={radioDef}
          hive={hive}
          key={`radio${depth}-${key}`}
        />
      );
    },
    [STACK]: groupItem,
    [SWITCH]: (def: StateFormItem, key: string|number) => {
      const switchDef = new StateFormItemSwitch(
        def.state as StateFormItem<StateForm, StateFormItemSwitchToggle>,
        def.parent
      );
      return (
        <DialogSwitch
          def={switchDef}
          hive={hive}
          key={`switch${depth}-${key}`}
        />
      );
    },
    [TEXT]: textItem,
    [TEXTAREA]: textItem,
    [TEXTFIELD]: textItem,
    [PHONE_INPUT]: (def: StateFormItem, key: string|number) => {
      const inputDef = new StateFormItemInput(def.state, def.parent);
      return (
        <DialogPhoneInput
          def={inputDef}
          hive={hive}
          key={`phone${depth}-${key}`}
        />
      );
    }
  }), [
    groupItem,
    depth,
    hive,
    dateTimePickerItem,
    textItem
  ]);

  // Memoize the items array to process
  const itemsToRender = useMemo(() => 
    items || form.items, 
    [items, form.items]
  );

  // Memoize the rendered form items
  const renderedItems = useMemo(() => {
    return itemsToRender.map((item, i) => {
      try {
        return itemsTable[item.type.toLowerCase()](item, i);
      } catch (e) {
        const message = `Form item type (${item.type}) does not exist.`;
        error_id(19).remember_exception(e, message); // error 19
        log(message);
        return (
          <div key={`bad-field${depth}-${i}`}>
            ❌ BAD FIELD <em>"{item.type}"</em>
          </div>
        );
      }
    });
  }, [itemsToRender, itemsTable, depth]);

  return (
    <Fragment>
      {renderedItems}
    </Fragment>
  );
}
