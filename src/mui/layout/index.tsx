import { Fragment, memo, useMemo, type JSX, type ReactNode } from 'react'
import type StatePage from '../../controllers/StatePage'
import {
  LayoutCenteredNoScroll,
  LayoutCentered,
  VirtualizedTableLayout,
  DefaultLayoutToolbared
} from './layouts'
import {
  LAYOUT_CENTERED,
  LAYOUT_CENTERED_NO_SCROLL,
  LAYOUT_DEFAULT,
  LAYOUT_MD,
  LAYOUT_NONE,
  LAYOUT_NONE_NO_APPBAR,
  LAYOUT_SM,
  LAYOUT_TABLE_VIRTUALIZED,
  LAYOUT_XL,
  LAYOUT_XS
} from '@tuber/shared'
import Container from '@mui/material/Container'
import { error_id } from 'src/business.logic/errors'
import { ler } from 'src/business.logic/logging'

interface ILayout {
  instance: StatePage
  children: ReactNode
}

interface ILayoutProps {
  instance: StatePage
  children: ReactNode
}

interface ILayoutMap {
  [constant: string]: (props: ILayoutProps) => JSX.Element
}

const LayoutCenteredNoScrollCustomized = ({ children }: ILayoutProps) => (
  <LayoutCenteredNoScroll>
    { children }
  </LayoutCenteredNoScroll>
)

const LayoutCenteredCustomized = ({ children }: ILayoutProps) => (
  <LayoutCentered>
    { children }
  </LayoutCentered>
)

const LayoutDefault = ({ children }: ILayoutProps) => (
  <Container>
    { children }
  </Container>
)

const LayoutMd = ({ children }: ILayoutProps) => (
  <Container maxWidth='md'>
    { children }
  </Container>
)

const LayoutSm = ({ children }: ILayoutProps) => (
  <Container maxWidth='sm'>
    { children }
  </Container>
)

const LayoutXl = ({ children }: ILayoutProps) => (
  <Container maxWidth='xl'>
    { children }
  </Container>
)

const LayoutXs = ({ children }: ILayoutProps) => (
  <Container maxWidth='xs'>
    { children }
  </Container>
)

const LayoutTableVirtualized = ({ children }: ILayoutProps) => (
  <VirtualizedTableLayout>
    { children }
  </VirtualizedTableLayout>
)

const LayoutNone = ({ instance: page, children }: ILayoutProps) => {
  if (page.hasAppbar) {
    return (
      <DefaultLayoutToolbared>
        { children }
      </DefaultLayoutToolbared>
    )
  }
  return (
    <Fragment>
      { children }
    </Fragment>
  )
}

const LayoutNoneNoAppbar = ({ children }: ILayoutProps) => (
  <Fragment>
    { children }
  </Fragment>
)

const layoutMap: ILayoutMap = {
  [LAYOUT_CENTERED_NO_SCROLL]: LayoutCenteredNoScrollCustomized,
  [LAYOUT_CENTERED]: LayoutCenteredCustomized,
  [LAYOUT_DEFAULT]: LayoutDefault,
  [LAYOUT_MD]: LayoutMd,
  [LAYOUT_SM]: LayoutSm,
  [LAYOUT_XL]: LayoutXl,
  [LAYOUT_XS]: LayoutXs,
  [LAYOUT_TABLE_VIRTUALIZED]: LayoutTableVirtualized,
  [LAYOUT_NONE]: LayoutNone,
  [LAYOUT_NONE_NO_APPBAR]: LayoutNoneNoAppbar
}

const Layout = memo(({ instance: page, children }: ILayout) => {
  // Memoize the processed layout string to avoid recalculation on every render
  const processedLayout = useMemo(() => {
    return page.layout.replace(/\s+/g, '').toLowerCase()
  }, [page.layout])

  try {
    if (processedLayout) {
      const Layout = layoutMap[processedLayout]
      if (Layout) {
        return (
          <Layout instance={page}>
            { children }
          </Layout>
        )
      }
    }
  } catch (e) {
    error_id(2).remember_exception(e) // error 2
    ler(e instanceof Error ? e.message : String(e))
  }
  return (
    <Fragment>
      { children }
    </Fragment>
  )
})

export default Layout