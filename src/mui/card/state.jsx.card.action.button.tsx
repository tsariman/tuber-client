import { Fragment, type JSX } from 'react';
import { Icon, Button } from '@mui/material';
import store, { actions, type IRedux } from '../../state';
import { type StateFormItemCardAction } from '../../controllers';

type TMapIcon = {
  [K in 'icon'|'faIcon'|'none']: () => JSX.Element;
};

type TMapPosition = {
  [K in 'left'|'right']: TMapIcon;
};

export default function StateJsxCardActionButton (
  { def: button }: { def: StateFormItemCardAction }
) {
  const redux: IRedux = {
    store,
    actions,
    route: button.props.href as string
  };
  const onClick = button.clickReduxHandler;

  const mapRight: TMapIcon = {
    icon: () => (
      <Fragment>
        { button.text }
        &nbsp;
        <Icon>{ button.has.icon }</Icon>
      </Fragment>
    ),
    faIcon: () => {
      return (
        <Fragment>
          { button.value }
          &nbps;
        </Fragment>
      )
    },
    'none': () => (
      <Fragment>
        { button.text }
      </Fragment>
    )
  };

  const mapLeft: TMapIcon = {
    icon: () => (
      <Fragment>
        <Icon>{ button.has.icon }</Icon>
        &nbsp;
        { button.text }
      </Fragment>
    ),
    faIcon: () => {
      return (
        <Fragment>
          &nbsp;
          { button.text }
        </Fragment>
      )
    },
    'none': () => (
      <Fragment>
        { button.text }
      </Fragment>
    )
  };

  const map: TMapPosition = {
    left: mapLeft,
    right: mapRight
  };

  if (button.text) {
    const iconPosition = button.has.iconPosition ?? 'left';
    const iconType = button.has.faIcon
      ? 'faIcon'
      : button.has.icon ? 'icon' : 'none';
    const buttonContent = map[iconPosition][iconType]();
    return (
      <Button
        {...button.props}
        onClick={onClick(redux)}
      >
        { buttonContent }
      </Button>
    );
  }
  if (button.has.icon) {
    return (
      <Button
        {...button.props}
        onClick={onClick(redux)}
      >
        <Icon>{ button.has.icon }</Icon>
      </Button>
    );
  }
  if (button.has.faIcon) {
    return (
      <Button
        {...button.props}
        onClick={onClick(redux)}
      >
        { button.text }
      </Button>
    );
  }
  return (
    <Button
      {...button.props}
      onClick={onClick(redux)}
    >
      ❌ No Text!
    </Button>
  );
}