import StatePage from '../../controllers/StatePage';
import { styled } from '@mui/material';
import { StateJsxIcon } from '../icon';
import { memo } from 'react';

const MsgDiv = styled('div')(() => ({
  width: '100%',
  textAlign: 'center'
}));

const CheckCircleOutlineIcon = memo(() => (
  <StateJsxIcon
    name='check_circle_outline'
    config={{
      sx: { fontSize: '29.5rem !important' }
    }}
  />
));

/**
 * Displays a generic page that indicates a successful operation.
 *
 * example:
 * ```tsx
 * <SuccessPage endpoint={endpoint} state={state} />
 * ```
 * ##### Variables
 * `message`: text to be displayed on the success page.
 *
 * example:
 * ```ts
 * displayPage('success', {
 *    message: 'I\'ll show up at the bottom of the page'
 * })
 * ```
 *
 * Tags: `success`, `page`, `message`
 */
export default function PageSuccess ({ def: page }:{ def: StatePage }) {
  const msg = page.parent.parent.tmp.get<string>(
    page.parent.parent.app.route,
    'message',
    page.data.message as string
  );

  return (
    <>
      <CheckCircleOutlineIcon />
      <MsgDiv style={{color: page.typography.color}}>
        <h1>{ msg }</h1>
      </MsgDiv>
    </>
  );

}
