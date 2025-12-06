import { styled } from '@mui/material'
import { useMemo, useRef, memo } from 'react'
import { err } from '../../business.logic/logging'
import type StatePageAppbar from '../../controllers/templates/StatePageAppbar'

interface IStateJsxLogo {
  instance: StatePageAppbar
}

/**
 * @see https://codesandbox.io/s/7q80d?file=/src/MyAppBar.tsx
 */
const ImgLogo = styled('img')(() => ({ marginRight: 10 }))

const PathLogo = styled('path')(() => ({}))
const DivLogoContainer = styled('div')(() => ({}))
const DivLogo = styled('div')(() => ({}))

/**
 * To define a logo, set the `appbar.logoTag` and `appbar.logoProps`.
 *
 * Now, the `appbar.logoTag` is optional. As in, it will default to an img tag.
 * Which means, the meat and potato is the `appbar.logoProps`. If it is not
 * defined, the logo will never show.
 *
 * To define it, if its an img tag, just give it the image src and any other
 * required attributes.
 *
 * Yes, `appbar.logoProps` is where you have to set the src of the image.
 *
 * You can also use a path tag. Just google how to create a path image and
 * set whatever attributes need to be set for the path tag in the
 * `appbar.logoProps` property.
 */
const StateJsxLogo = memo(({ instance: appbar }: IStateJsxLogo) => {
  const logoTag = appbar.logoTag.toLowerCase()
  const logoProps = appbar.logoProps
  const logoContainerProps = appbar.logoContainerProps

  // Used to apply logo image real size in the absence of user-defined height
  // and width.
  const logoRef = useRef<HTMLDivElement>(null)

  const logoTagTable = useMemo(() => ({
    'img': <ImgLogo {...logoProps} />,
    'path': <PathLogo {...logoProps} />,
    'div': <DivLogo {...logoProps} ref={logoRef} />
  }), [logoProps])

  const Logo = logoTagTable[logoTag as keyof typeof logoTagTable]

  if (Logo) {
    return (
      <DivLogoContainer {...logoContainerProps}>
        { Logo }
      </DivLogoContainer>
    )
  }

  err(`Invalid \`${logoTag}\` logo.`)

  return ( null )
}, (prevProps, nextProps) => prevProps.instance.state === nextProps.instance.state)

export default StateJsxLogo