import React from 'react';
import { Icon, Button } from '@mui/material';
import { get_redux } from '../../../../state';
import type StateFormItem from '../../../../controllers/StateFormItem';
import {
  get_button_content_code,
  type TCombinations
} from './_button.common.logic';

interface IJsonButtonProps { def: StateFormItem; }

type TMapIcon = {
  [K in TCombinations]: () => React.JSX.Element | null;
}

export default function StateJsxButton ({ def: button }: IJsonButtonProps) {
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
  const onClick = button.clickReduxHandler;
  const code = get_button_content_code(button);
  return (
    <Button
      {...button.props}
      onClick={onClick(get_redux(button.props.href as string))}
    >
      { map[code]() }
    </Button>
  );
}