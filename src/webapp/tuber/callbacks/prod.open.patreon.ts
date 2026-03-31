import type { IRedux } from 'src/state'
import Config from 'src/config'

/** Opens the Patreon support page in a new tab. */
export default function open_patreon_upgrade(redux: IRedux) {
  return () => {
    void redux
    const url = Config.PATREON_URL || 'https://www.patreon.com/'
    window.open(url, '_blank', 'noopener,noreferrer')?.focus()
  }
}
