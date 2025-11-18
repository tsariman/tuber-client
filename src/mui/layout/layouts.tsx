import { Box, Grid } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { type ReactNode, useMemo } from 'react';

const theme = createTheme();

interface IGenericProps {
  children: ReactNode;
}

interface IMainProps {
  p?: string | number;
  children: ReactNode;
}

const defaultClasses = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
  },
  content: {
    flexGrow: 1
  }
};

const Main = ({ p, children }: IMainProps) => {
  const sx = useMemo(() => ({
    ...defaultClasses.content, 
    p
  }), [p]);

  return (
    <Box
      component='main'
      sx={sx}
    >
      { children }
    </Box>
  );
};

export const Toolbar = ({ mHeight }: { mHeight?: string|number }) => {
  const minHeight = useMemo(() => {
    return (mHeight !== undefined)
      ? mHeight
      // info: https://stackoverflow.com/questions/52995225/how-does-one-use-or-get-started-with-theme-mixins-toolbar-in-material-ui
      : theme.mixins.toolbar.minHeight;
  }, [mHeight]);

  const sx = useMemo(() => ({
    ...defaultClasses.container,
    minHeight
  }), [minHeight]);

  return (
    <Box sx={sx} />
  );
};

/**
 * NON-SCROLLING CENTERED LAYOUT.
 *
 * The content of this layout cannot be scrolled, so make sure it is small
 * enough to fit the available viewport space. The content should automatically
 * resize.
 */
export const LayoutCenteredNoScroll = ({ children }: IGenericProps) => {
  const sx = useMemo(() => ({
    minHeight: '100vh'
  }), []);

  return (
    <Grid
      sx={sx}
      container={true}
      spacing={0}
      alignItems='center'
      justifyContent='center'
    >
      { children }
    </Grid>
  );
};

/**
 * Centered layout factory.
 *
 * Creates a layout where the content will be centered.
 * Use the parameter to adjust the gap between the `appbar` and the content.
 * The greater the number, the greater the gap.
 *
 * @param mHeight height of content in pixels
 *
 * @see https://stackoverflow.com/a/56497384/1875859
 */
const LayoutCenteredFactory = (mHeight?: number) => {
  const spacing = theme.spacing(3);
  
  return ({ children }: IGenericProps) => (
    <Main p={spacing}>
      <Toolbar mHeight={mHeight} />
      <Grid
        container
        spacing={0}
        alignItems='center'
        justifyContent='center'
      >
        { children }
      </Grid>
    </Main>
  );
};

/**
 * LAYOUT CENTERED with the default `Appbar` space top margin.
 */
export const LayoutCentered = LayoutCenteredFactory(32);

/**
 * LAYOUT CENTERED with no top margin.
 */
export const LayoutCenteredDialog = LayoutCenteredFactory(0);

/**
 * Default layout factory
 *
 * @param mHeight 
 */
const LayoutDefaultFactory = (mHeight = 0) => {
  const spacing = theme.spacing(0, 2);
  
  return ({children}: IGenericProps) => (
    <Main p={spacing}>
      <Toolbar mHeight={mHeight} />
      { children }
    </Main>
  );
};

export const DefaultLayout = LayoutDefaultFactory();
export const VirtualizedTableLayout = LayoutDefaultFactory(49); // 29

/** Applies toolbar space at the top if the page has an appbar */
const LayoutNoneFactory = (mHeight = 0) => {
  const sx = { w: '100%' };
  
  return ({children}: IGenericProps) => (
    <Box component='main' sx={sx}>
      <Toolbar mHeight={mHeight} />
      { children }
    </Box>
  );
};

/**
 * Applies toolbar space to prevent content from being hidden under the
 * appbar.
 */
export const DefaultLayoutToolbared = LayoutNoneFactory(40);
