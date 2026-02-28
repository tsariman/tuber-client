// TODO - Install those import if or when needed.
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Box from '@mui/material/Box'
import FormGroup from '@mui/material/FormGroup'
import Stack from '@mui/material/Stack'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import type StateFormItemGroup from '../../controllers/StateFormItemGroup'
import {
  Fragment,
  memo,
  type JSX,
  type ReactElement,
  type ReactNode,
  useMemo
} from 'react'
import {
  BOX,
  DIV,
  FORM_CONTROL,
  FORM_CONTROL_LABEL,
  FORM_GROUP,
  INDETERMINATE,
  LOCALIZED,
  NONE,
  STACK
} from '@tuber/shared'
import { ler, log } from '../../business.logic/logging'
import { error_id } from '../../business.logic/errors'
import { redux } from '../../state'

interface IGroup {
  instance: StateFormItemGroup
  children: React.ReactNode
}

const BoxGroup = ({ instance: group, children }: IGroup) => (
  <Box {...group.props}>
    { children }
  </Box>
)

const StackGroup = ({ instance: group, children }: IGroup) => (
  <Stack {...group.props}>
    { children }
  </Stack>
)

// TODO - Delete following dummy fields when imports are un-commented =========

interface IFakeProps {
  dateAdapter?: ReactElement
  children?: ReactNode
}

const AdapterDayjs = <></>

const LocalizationProvider = (props: IFakeProps) => {
  log('Localization feature is not implemented.')
  void props
  return <Fragment />
}

// END - Delete ===============================================================

const LocalizedGroup = ({ children }: IGroup) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      { children }
    </LocalizationProvider>
  )
}

const FormGroupLocal = ({ instance: group, children }: IGroup) => (
  <FormGroup {...group.props}>
    { children }
  </FormGroup>
)

const FormControlLocal = ({ instance: group, children }: IGroup) => (
  <FormControl {...group.props}>
    { children }
  </FormControl>
)

const FormControlLabelLocal = ({ instance: group, children }: IGroup) => (
  <FormControlLabel
    label=''
    {...group.props}
    control={children as ReactElement}
  />
)

const IndeterminateGroup = ({ instance: group, children }: IGroup) => {
  const childrenArray = Array.isArray(children) ? [...children] : [children]
  const parent = childrenArray.shift()
  return (
    <div>
      <FormControlLabel
        {...group.getProps()}
        control={parent}
      />
      {childrenArray}
    </div>
  )
}

const DivGroup = ({ instance: group, children }: IGroup) => (
  <div {...group.props}>
    { children }
  </div>
)

const NoneGroup = ({ children }: IGroup) => (
  <>
    { children }
  </>
)

const map: {[constant: string]: (props: IGroup) => JSX.Element} = {
  [BOX]: BoxGroup,
  [STACK]: StackGroup,
  [LOCALIZED]: LocalizedGroup,
  [FORM_GROUP]: FormGroupLocal,
  [FORM_CONTROL]: FormControlLocal,
  [FORM_CONTROL_LABEL]: FormControlLabelLocal,
  [INDETERMINATE]: IndeterminateGroup,
  [DIV]: DivGroup,
  [NONE]: NoneGroup
}

const StateJsxFormItemGroup = memo(({ instance: group, children }: IGroup) => {
  const onKeyDownHandler = useMemo(() => {
    if (group.eventPropagationEnabled) {
      const originalHandler = group.has.possibleReduxHandler('onkeydown')?.(redux)
      if (originalHandler) {
        return (e: React.KeyboardEvent) => {
          e.stopPropagation() // Prevent event bubbling to avoid interfering with onchange/onclick
          originalHandler(e)
        }
      }
    }
    return undefined
  }, [group.eventPropagationEnabled, group.has])
  const onClickHandler = useMemo(() => {
    if (group.eventPropagationEnabled) {
      const originalHandler = group.has.possibleReduxHandler('onclick')?.(redux)
      if (originalHandler) {
        return (e: React.MouseEvent) => {
          e.stopPropagation() // Prevent event bubbling to avoid interfering with child handlers
          originalHandler(e)
        }
      }
    }
    return undefined
  }, [group.eventPropagationEnabled, group.has])
  const onBlurHandler = useMemo(() => {
    if (group.eventPropagationEnabled) {
      return group.has.possibleReduxHandler('onblur')?.(redux)
    }
    return undefined
  }, [group.eventPropagationEnabled, group.has])
  const onFocusHandler = useMemo(() => {
    if (group.eventPropagationEnabled) {
      return group.has.possibleReduxHandler('onfocus')?.(redux)
    }
    return undefined
  }, [group.eventPropagationEnabled, group.has])
  const onChangeHandler = useMemo(() => {
    if (group.eventPropagationEnabled) {
      const originalHandler = group.has.possibleReduxHandler('onchange')?.(redux)
      if (originalHandler) {
        return (e: React.ChangeEvent) => {
          e.stopPropagation() // Prevent event bubbling to avoid interfering with child onchange handlers
          originalHandler(e)
        }
      }
    }
    return undefined
  }, [group.eventPropagationEnabled, group.has])

  try {
    if (group.eventPropagationEnabled) {
      group.onKeyDown = onKeyDownHandler
      group.onClick = onClickHandler
      group.onBlur = onBlurHandler
      group.onFocus = onFocusHandler
      group.onChange = onChangeHandler
    }
    const groupType = group.type.toLowerCase()
    const Group = map[groupType] ?? map[NONE]
    return <Group instance={group}>{ children }</Group>
  } catch (e) {
    ler(`Form group selection exception. ${(e as Error).message}`)
    error_id(48).remember_exception(e)
    return <NoneGroup instance={group}>{ children }</NoneGroup>
  }
})

// Set display name for debugging
StateJsxFormItemGroup.displayName = 'StateJsxFormItemGroup'

export default StateJsxFormItemGroup