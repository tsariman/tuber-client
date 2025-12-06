import { Fragment, memo } from 'react'
import { Icon, Button } from '@mui/material'
import type { StateFormItem, StateDialog } from '../../../controllers'
import { get_redux } from '../../../state'

interface IJsonButtonProps { instance: StateFormItem<StateDialog> }
interface IJsonButtonContentProps {
  instance: StateFormItem<StateDialog>
}

const ButtonContent = ({ instance: button }: IJsonButtonContentProps) => {
  if (button.text) {
    switch (button.has.iconPosition) {

    // icon is located on the right of the button title
    case 'right':
      if (button.has.icon) {
        return (
          <Fragment>
            { button.text }
            &nbsp;
            <Icon>{ button.has.icon }</Icon>
          </Fragment>
        )
      } else if (button.has.faIcon) {
        return (
          <Fragment>
            { button.value }
            &nbsp;
          </Fragment>
        )
      }
      break

    // icon is located on the left of the button title
    case 'left':
    default:
      if (button.has.icon) {
        return (
          <Fragment>
            <Icon>{ button.has.icon }</Icon>
            &nbsp;
            { button.text }
          </Fragment>
        )
      } else if (button.has.faIcon) {
        return (
          <Fragment>
            &nbsp;
            { button.text }
          </Fragment>
        )
      }

    } // END switch

    return <Fragment>{ button.text }</Fragment>
  } else {
    if (button.has.icon) {
      return <Icon>{ button.has.icon }</Icon>
    } else if (button.has.faIcon) {
      console.error('.faIcon is no longer a valid icon.')
      return ( null )
    }
  }
  return (
    <Fragment>
      No Text!
    </Fragment>
  )
} // END ButtonContent

const StateJsxDialogActionButton = memo((
  { instance: button }: IJsonButtonProps
) => {
  return (
    <Button
      {...button.props}
      onClick={button.clickReduxHandler(get_redux(button.props.href as string))}
    >
      <ButtonContent instance={button} />
    </Button>
  )
}, (prevProps, nextProps) => prevProps.instance.state === nextProps.instance.state)

export default StateJsxDialogActionButton
