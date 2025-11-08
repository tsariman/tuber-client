// TODO - Install those import if or when needed.
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormGroup,
  Stack,
} from '@mui/material';
import React, {
  Fragment,
  type ReactElement,
  type ReactNode,
  useMemo
} from 'react';
import type StateFormItemGroup from '../../controllers/StateFormItemGroup';
import {
  BOX,
  STACK,
  LOCALIZED,
  FORM_GROUP,
  FORM_CONTROL,
  FORM_CONTROL_LABEL,
  INDETERMINATE,
  DIV,
  NONE
} from '@tuber/shared';

interface IFormItemGroupProps {
  def: StateFormItemGroup;
  children: React.ReactNode;
}

// TODO - Delete following dummy values when imports are available ============

interface IFakeProps {
  dateAdapter?: ReactElement;
  children?: ReactNode;
}

const AdapterDayjs = <></>;

const LocalizationProvider = (props: IFakeProps) => {
  void props;
  return null;
};

// END - Delete ===============================================================

const StateJsxFormItemGroup = React.memo<IFormItemGroupProps>(({ def: item, children }) => {
  // Memoize the table to prevent recreation on every render
  const table: Record<string, () => ReactElement> = useMemo(() => ({
    [BOX]: () => (
      <Box {...item.props}>
        {children}
      </Box>
    ),
    [STACK]: () => (
      <Stack {...item.props}>
        {children}
      </Stack>
    ),
    [LOCALIZED]: () => (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {children}
      </LocalizationProvider>
    ),
    [FORM_GROUP]: () => (
      <FormGroup {...item.props}>
        {children}
      </FormGroup>
    ),
    [FORM_CONTROL]: () => (
      <FormControl {...item.props}>
        {children}
      </FormControl>
    ),
    [FORM_CONTROL_LABEL]: () => {
      return (
        <FormControlLabel
          label=''
          {...item.props}
          control={children as ReactElement}
        />
      );
    },
    [INDETERMINATE]: () => {
      const childrenArray = Array.isArray(children) ? [...children] : [children];
      const parent = childrenArray.shift();
      return (
        <div>
          <FormControlLabel
            {...item.getProps()}
            control={parent}
          />
          {childrenArray}
        </div>
      );
    },
    [DIV]: () => (
      <div {...item.props}>
        {children}
      </div>
    ),
    [NONE]: () => (
      <Fragment>
        {children}
      </Fragment>
    )
  }), [item, children]);

  // Memoize the type lookup
  const itemType = useMemo(() => item.type.toLowerCase(), [item.type]);
  
  // Get the renderer function, with fallback to Fragment
  const renderer = table[itemType] || table[NONE];
  
  return renderer();
});

// Set display name for debugging
StateJsxFormItemGroup.displayName = 'StateJsxFormItemGroup';

export default StateJsxFormItemGroup;
