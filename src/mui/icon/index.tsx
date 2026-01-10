import { Badge, Icon as MuiIcon, SvgIcon } from '@mui/material'
import type { StateFormItemCustom } from '../../controllers'
import StateAllIcons from '../../controllers/StateAllIcons'
import type StateIcon from '../../controllers/StateIcon'
import { Fragment, memo, useMemo, type JSX } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../state'
import StateJsxSvgIcon from './state.jsx.svg.icon'

interface IJsonIconProps {
  instance: StateFormItemCustom<unknown> // StateFormItem | StateLink
}

export interface IStateJsxIconProps {
  name: string
  config?: React.ComponentProps<typeof SvgIcon>
}

interface IxProps {
  svg: StateIcon
  has: StateFormItemCustom<unknown>
}

const LocalIconSelection = ({ svg, has }: IxProps) => (
  <StateJsxSvgIcon def={has} svgDef={svg} />
)

/** @deprecated RenderSvgIcon */
const LocalSvgIconSelection = ({ has }: IxProps) => (
  <MuiIcon {...has.iconProps}>{ has.svgIcon }</MuiIcon>
)

/** @deprecated RenderMuiIcon */
const LocalMuiIconSelection = ({ has }: IxProps) => (
  <MuiIcon {...has.iconProps}>{ has.muiIcon }</MuiIcon>
)

/** @deprecated RenderFaIcon */
const LocalFaIconSelection = () => {
  console.error('.faIcon is no longer a valid icon.')
  return <Fragment />
}

/** @deprecated RenderNone */
const NoneIconSelection = () => <Fragment>❌</Fragment>

const map: Record<string, (props: IxProps) => JSX.Element> = {
  icon: LocalIconSelection,
  svgIcon: LocalSvgIconSelection,
  muiIcon: LocalMuiIconSelection,
  faIcon: LocalFaIconSelection,
  none: NoneIconSelection
}

/**
 * Unified Icon Provider if these providers are installed. They may not be  
 * @example
 * ```ts
 * const item = {
 *    has: {
 *       icon: '',
 *       faIcon: ''
 *    }
 * }
 * ```
 */
export const StateJsxUnifiedIconProvider = (({ instance: has }: IJsonIconProps) => {
  const iconsState = useSelector((state: RootState) => state.icons)
  const allIcons = useMemo(() => new StateAllIcons(iconsState), [iconsState])
  const svg = useMemo(() => allIcons.getIcon(has.icon), [allIcons, has.icon])

  const type = useMemo(() => {
    if (has.svgIcon && has.svgIcon !== 'none') return 'svgIcon'
    if (has.icon) return 'icon'
    if (has.faIcon) return 'faIcon'
    return 'none'
  }, [has.svgIcon, has.icon, has.faIcon])

  const SelectedIcon = map[type]
  return (
    <SelectedIcon svg={svg} has={has} />
  )
})

export const StateJsxIcon = ({ name, config } : IStateJsxIconProps) => {
  const iconsState = useSelector((state: RootState) => state.icons)
  const allIcons = useMemo(() => new StateAllIcons(iconsState), [iconsState])
  const iconSvg = useMemo(() => allIcons.getIcon(name), [allIcons, name])

  return (
    <StateJsxSvgIcon def={{ svgIconProps: config || {} }} svgDef={iconSvg} />
  )
}

const StateJsxBadgedIcon = memo(({ instance: has }: IJsonIconProps) => {
  const badgeProps = useMemo(() => ({
    color: 'error' as const,
    ...has.badge,
    badgeContent: '-'
  }), [has.badge])
  const iconsState = useSelector((state: RootState) => state.icons)
  const allIcons = useMemo(() => new StateAllIcons(iconsState), [iconsState])
  const svg = useMemo(() => allIcons.getIcon(has.icon), [allIcons, has.icon])

  return (
    <Fragment>
      {has.badge ? (
        <Badge {...badgeProps}>
          <StateJsxSvgIcon def={has} svgDef={svg} />
        </Badge>
      ) : (
        <StateJsxSvgIcon def={has} svgDef={svg} />
      )}
    </Fragment>
  )
})

StateJsxBadgedIcon.displayName = 'StateJsxBadgedIcon'

export default StateJsxBadgedIcon