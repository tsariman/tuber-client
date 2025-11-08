import {
  Fragment,
  useMemo,
  useCallback,
  type ReactNode,
  type JSX
} from 'react';
import { Box, Paper, Stack } from '@mui/material';
import type StateForm from '../../controllers/StateForm';
import { error_id } from '../../business.logic/errors';
import { log } from '../../business.logic/logging';

interface IJsonFormProps {
  def: StateForm;
  children: ReactNode;
}

function ConditionalPaper (
  { form, children }:{ form: StateForm; children: ReactNode; }
) {
  // Memoize the conditional paper rendering to avoid unnecessary re-renders
  const paperContent = useMemo(() => {
    if (form.paperBackground) {
      return (
        <Paper {...form.paperProps}>
          { children }
        </Paper>
      );
    } else {
      return (
        <Fragment>
          { children }
        </Fragment>
      );
    }
  }, [form.paperBackground, form.paperProps, children]);

  return paperContent;
}

export default function StateJsxForm (
  { def: form, children }: IJsonFormProps
) {
  // Memoize the box component to prevent re-creation on every render
  const BoxComponent = useCallback(() => (
    <ConditionalPaper form={form}>
      <Box
        {...form.props}
      >
        { children }
      </Box>
    </ConditionalPaper>
  ), [form, children]);

  // Memoize the stack component to prevent re-creation on every render
  const StackComponent = useCallback(() => (
    <ConditionalPaper form={form}>
      <Stack {...form.props}>
        { children }
      </Stack>
    </ConditionalPaper>
  ), [form, children]);

  // Memoize the none component to prevent re-creation on every render
  const NoneComponent = useCallback(() => (
    <ConditionalPaper form={form}>
      { children }
    </ConditionalPaper>
  ), [form, children]);

  // Memoize the component map to prevent re-creation on every render
  const map: {[constant: string]: () => JSX.Element} = useMemo(() => ({
    'box': BoxComponent,
    'stack': StackComponent,
    'none': NoneComponent
  }), [BoxComponent, StackComponent, NoneComponent]);

  // Memoize the final result to avoid unnecessary re-computations
  const result = useMemo(() => {
    try {
      const componentRenderer = map[form._type];
      if (componentRenderer) {
        return componentRenderer();
      }
      // Fallback to box if type is not found
      return map['box']();
    } catch (e) {
      error_id(20).remember_exception(e); // error 20
      log((e as Error).message);
      // Return box component as fallback
      return map['box']();
    }
  }, [map, form._type]);

  return result;
}
