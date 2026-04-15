import { StateJsxIcon } from 'src/mui/icon'
import type { TPlatform } from '../../tuber.interfaces'

export interface IPlatformIconProps {
  platform: TPlatform
}

const PLATFORM_ICON_NAME: Record<TPlatform, string> = {
  '_blank':      'no_icon',
  'youtube':     'youtube',
  'vimeo':       'vimeo',
  'dailymotion': 'dailymotion',
  'rumble':      'rumble',
  'odysee':      'odysee',
  'facebook':    'facebook',
  'twitch':      'twitch',
  'unknown':     'unknown',
}

export default function PlatformIcon({ platform }: IPlatformIconProps) {
  return <StateJsxIcon name={PLATFORM_ICON_NAME[platform]} />
}