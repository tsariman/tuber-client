import { styled } from '@mui/material';
import StatePage from '../../controllers/StatePage';

const H1 = styled('h1')(() => ({
  width: '100%',
  fontSize: '200px',
  textAlign: 'center',
  margin: 0
}));

const H2 = styled('h2')(() => ({
  width: '100%',
  fontSize: '32px',
  textAlign: 'center',
  margin: 0
}));

export default function PageNotFound ({ def: page }: { def: StatePage }) {
  const message = page.parent.parent.tmp.get<string>(
    page.parent.parent.app.route,
    'message',
    page.data.message as string
  );

  return (
    <>
      <H1>404</H1>
      <H2>{ message }</H2>
    </>
  );
}
