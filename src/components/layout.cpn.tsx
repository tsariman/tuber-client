import {
  Fragment,
  useMemo,
  useCallback,
  type ReactNode,
  type JSX
} from 'react';
import Container from '@mui/material/Container';
import {
  LayoutCenteredNoScroll,
  LayoutCentered,
  VirtualizedTableLayout,
  DefaultLayoutToolbared
} from '../mui/layouts';
import StatePage from '../controllers/StatePage';
import { error_id, log } from '../business.logic';
import {
  LAYOUT_CENTERED_NO_SCROLL,
  LAYOUT_CENTERED,
  LAYOUT_DEFAULT,
  LAYOUT_MD,
  LAYOUT_SM,
  LAYOUT_XL,
  LAYOUT_XS,
  LAYOUT_TABLE_VIRTUALIZED,
  LAYOUT_NONE,
  LAYOUT_NONE_NO_APPBAR
} from '@tuber/shared';

interface ILayoutProps {
  def: StatePage;
  children: ReactNode;
  forceRefresh?: boolean; // Flag to bypass memoization when fresh rendering is needed
}

interface ILayoutMap {
  [constant: string]: () => JSX.Element;
}

/**
 * Application layout
 */
export default function Layout({
  def: page,
  children
}: ILayoutProps): JSX.Element | null {
  // Memoize layout functions to prevent unnecessary re-renders
  const renderLayoutCenteredNoScroll = useCallback(() => (
    <LayoutCenteredNoScroll>
      { children }
    </LayoutCenteredNoScroll>
  ), [children]);

  const renderLayoutCentered = useCallback(() => (
    <LayoutCentered>
      { children }
    </LayoutCentered>
  ), [children]);

  const renderLayoutDefault = useCallback(() => (
    <Container>
      { children }
    </Container>
  ), [children]);

  const renderLayoutMd = useCallback(() => (
    <Container maxWidth='md'>
      { children }
    </Container>
  ), [children]);

  const renderLayoutSm = useCallback(() => (
    <Container maxWidth='sm'>
      { children }
    </Container>
  ), [children]);

  const renderLayoutXl = useCallback(() => (
    <Container maxWidth='xl'>
      { children }
    </Container>
  ), [children]);

  const renderLayoutXs = useCallback(() => (
    <Container maxWidth='xs'>
      { children }
    </Container>
  ), [children]);

  const renderLayoutTableVirtualized = useCallback(() => (
    <VirtualizedTableLayout>
      { children }
    </VirtualizedTableLayout>
  ), [children]);

  const renderLayoutNone = useCallback(() => {
    if (page.hasAppbar) {
      return (
        <DefaultLayoutToolbared>
          { children }
        </DefaultLayoutToolbared>
      );
    }
    return (
      <Fragment>
        { children }
      </Fragment>
    );
  }, [children, page.hasAppbar]);

  const renderLayoutNoneNoAppbar = useCallback(() => (
    <Fragment>
      { children }
    </Fragment>
  ), [children]);

  // Memoize the layouts map to prevent recreation on every render
  const layoutsMap: ILayoutMap = useMemo(() => ({
    [LAYOUT_CENTERED_NO_SCROLL]: renderLayoutCenteredNoScroll,
    [LAYOUT_CENTERED]: renderLayoutCentered,
    [LAYOUT_DEFAULT]: renderLayoutDefault,
    [LAYOUT_MD]: renderLayoutMd,
    [LAYOUT_SM]: renderLayoutSm,
    [LAYOUT_XL]: renderLayoutXl,
    [LAYOUT_XS]: renderLayoutXs,
    [LAYOUT_TABLE_VIRTUALIZED]: renderLayoutTableVirtualized,
    [LAYOUT_NONE]: renderLayoutNone,
    [LAYOUT_NONE_NO_APPBAR]: renderLayoutNoneNoAppbar
    // TODO Add properties here for different types of layout
  }), [
    renderLayoutCenteredNoScroll,
    renderLayoutCentered,
    renderLayoutDefault,
    renderLayoutMd,
    renderLayoutSm,
    renderLayoutXl,
    renderLayoutXs,
    renderLayoutTableVirtualized,
    renderLayoutNone,
    renderLayoutNoneNoAppbar
  ]);

  // Memoize the processed layout string to avoid recalculation on every render
  const processedLayout = useMemo(() => {
    return page.layout.replace(/\s+/g, '').toLowerCase();
  }, [page.layout]);

  try {
    if (processedLayout) {
      return layoutsMap[processedLayout]();
    }
    return (
      <Fragment>
        { children }
      </Fragment>
    );
  } catch (e) {
    error_id(2).remember_exception(e); // error 2
    log((e as Error).message);
  }
  return (
    <Fragment>
      { children }
    </Fragment>
  );

}
