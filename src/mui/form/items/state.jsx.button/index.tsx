import React from 'react'
import { Icon, Button } from '@mui/material'
import { get_redux } from '../../../../state'
import type StateFormItem from '../../../../controllers/StateFormItem'
import {
  get_button_content_code,
  type TCombinations
} from './_button.common.logic'

interface IJsonButtonProps { instance: StateFormItem }

type TMapIcon = {
  [K in TCombinations]: () => React.JSX.Element | null
}

const ButtonContent = ({ instance: button }: IJsonButtonProps) => {
  const code = get_button_content_code(button)
  const map: TMapIcon = {
    textrighticon: () => (
      <>
        { button.text }
        &nbsp;
        <Icon>{ button.has.icon }</Icon>
      </>
    ),
    textrightfaicon: () => (
      <>
        { button.text }
        &nbsp;
      </>
    ),
    textlefticon: () => (
      <>
        <Icon>{ button.has.icon }</Icon>
        &nbsp;
        { button.text }
      </>
    ),
    textleftfaicon: () => (
      <>
        &nbsp;
        { button.text }
      </>
    ),
    icon: () => <Icon>{ button.has.icon }</Icon>,
    faicon: () => null,
    text: () => <>{ button.text }</>,
    none: () => <>❌ No Text!</>
  }
  return map[code]()
}

export default function StateJsxButton ({ instance: button }: IJsonButtonProps) {
  return (
    <Button
      {...button.props}
      onClick={button.clickReduxHandler(get_redux(button.props.href as string))}
    >
      <ButtonContent instance={button} />
    </Button>
  )
}