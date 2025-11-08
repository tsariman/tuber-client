import { TextField } from '@mui/material';
import { redux, type AppDispatch, type IRedux, type RootState } from '../../../state';
import { StateJsxAdornment } from './state.jsx.input.adornment';
import {type StateFormItem, StateFormsData } from '../../../controllers';
import { useDispatch, useSelector } from 'react-redux';
import { NAME_NOT_SET, typeMap, type IFormItemDataError } from '@tuber/shared';
import StateJsxTextfieldInputProps from './state.jsx.textfield.input.props';
import {
  useCallback,
  useEffect,
  type FocusEventHandler,
  type KeyboardEventHandler
} from 'react';
import type { ISliceFormsDataErrorsArgs } from '../../../slices/formsDataErrors.slice';

interface IJsonTextfieldProps { def: StateFormItem; }
type TOnFocus = FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
type TOnKeyDown = (redux: IRedux) => KeyboardEventHandler<HTMLDivElement>;
type TOnChange = (textfield: StateFormItem) => React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
type TOnBlur = (textfield: StateFormItem,
  e: IFormItemDataError
) => FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;

export default function StateJsxTextfield({ def: textfield }: IJsonTextfieldProps) {
  const { name, parent: { name: formName } } = textfield;
  const formsDataState = useSelector((state: RootState) => state.formsData);
  const formsData = new StateFormsData(formsDataState);
  const formsDataErrors = useSelector(
    (state: RootState) => state.formsDataErrors
  );
  const dispatch = useDispatch<AppDispatch>();
  const value = formsData.getValue(formName, name, '');
  const error = formsDataErrors[formName]?.[name]?.error;

  useEffect(() => {
    if ((textfield.has.maxLength && textfield.has.maxLength > 0)
      || textfield.has.invalidationRegex
      || textfield.has.validationRegex
      || textfield.is.required
    ) {
      dispatch({
        type: 'formsDataErrors/formsDataErrorsUpdate',
        payload: {
          formName: textfield.parent.name,
          name: textfield.name,
          required: textfield.is.required,
          requiredMessage: textfield.has.requiredMessage,
          maxLength: textfield.has.maxLength,
          maxLengthMessage: textfield.has.state.maxLengthMessage,
          disableOnError: textfield.has.state.disableOnError,
          invalidationRegex: textfield.has.state.invalidationRegex,
          invalidationMessage: textfield.has.state.invalidationMessage,
          validationRegex: textfield.has.state.validationRegex,
          validationMessage: textfield.has.state.validationMessage
        } as ISliceFormsDataErrorsArgs
      });
    }
  }, [ dispatch, textfield, formName, name ]);

  const handleFocus: TOnFocus = useCallback((e) => {
    void e;
    if (error) {
      dispatch({ // Temporarily clears out error state from textfield if focused.
        type: 'formsDataErrors/formsDataErrorsUpdate',
        payload: {
          formName,
          name,
          error: false
        }
      });
    }
    (textfield.onFocus as TOnFocus)(e); // User defined function to run
  }, [dispatch, error, formName, name, textfield]);

  return name ? (
    <TextField
      {...textfield.props}
      label={textfield.label}
      type={typeMap[textfield.type]}
      error={error || textfield.has.regexError(value)}
      helperText={error
        ? formsDataErrors[formName]?.[name]?.message
        : textfield.props.helperText as string
      }
      value={value}
      onFocus={handleFocus}
      onChange={(textfield.onChange as TOnChange)(textfield)}
      onKeyDown={(textfield.onKeyDown as TOnKeyDown)(redux)}
      onBlur={(textfield.onBlur as TOnBlur)(textfield, formsDataErrors[formName]?.[name])}
      InputProps={StateJsxTextfieldInputProps(textfield.inputProps)}
    />
  ) : (
    <TextField
      value={NAME_NOT_SET}
      InputProps={{
        startAdornment: <StateJsxAdornment def={textfield.inputProps.start} />,
        endAdornment: <StateJsxAdornment def={textfield.inputProps.end} />
      }}
      disabled
    />
  );

}
