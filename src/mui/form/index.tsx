import {
  Fragment,
  type ReactNode,
  type JSX,
  memo
} from 'react'
import { Box, Paper, Stack } from '@mui/material'
import type StateForm from '../../controllers/StateForm'
import { error_id } from '../../business.logic/errors'
import { ler } from '../../business.logic/logging'

interface IJsonFormProps {
  instance: StateForm
  children: ReactNode
}

interface IConditionalPaper {
  form: StateForm
  children: ReactNode
}

interface IContainer {
  form: StateForm
  children: ReactNode
}

const ConditionalPaper = ({ form, children }: IConditionalPaper) => {
  if (form.paperBackground) {
    return (
      <Paper {...form.paperProps}>
        { children }
      </Paper>
    )
  } else {
    return (
      <Fragment>
        { children }
      </Fragment>
    )
  }
}

const BoxContainer = ({ form, children }: IContainer) => (
  <ConditionalPaper form={form}>
    <Box
      {...form.props}
    >
      { children }
    </Box>
  </ConditionalPaper>
)

const StackContainer = ({ form, children }: IContainer) => (
  <ConditionalPaper form={form}>
    <Stack {...form.props}>
      { children }
    </Stack>
  </ConditionalPaper>
)

const NoneContainer = ({ form, children }: IContainer) => (
  <ConditionalPaper form={form}>
    { children }
  </ConditionalPaper>
)

const containerMap: {[constant: string]: (props: IContainer) => JSX.Element} = {
  'box': BoxContainer,
  'stack': StackContainer,
  'none': NoneContainer
}

const StateJsxForm = memo(({ instance: form, children }: IJsonFormProps) => {
  try {
    const DynamicForm = containerMap[form._type] ?? containerMap['box']
    return (
      <DynamicForm form={form}>
        { children }
      </DynamicForm>
    )
  } catch (e) {
    error_id(20).remember_exception(e) // error 20
    ler((e as Error).message)
    return <BoxContainer form={form}>{children}</BoxContainer>
  }
})

export default StateJsxForm