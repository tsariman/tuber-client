import React, { useMemo } from 'react'
import { useMediaQuery, useTheme } from '@mui/material'
import {
	StateLink,
	type StatePageAppbar,
	StatePagesData
} from 'src/controllers'
import Link from 'src/mui/link'
import type { IRedux } from 'src/state'
import { ENDPOINT, PLAYER_OPEN, SHOW_THUMBNAIL } from '../tuber.config'

interface IToolbarIcon {
	/** Parent definition for state links. It is required. */
	def: StatePageAppbar
}

interface IIntegratedPlayerToggleProps extends IToolbarIcon {
	/** When true, includes the parent route in the icon definition. */
	includeRoute?: boolean
}

/** When clicked, this icon displays an interface to create a new video bookmark. */
export const AddBookmark = React.memo<IToolbarIcon>(({ def: appbar }) => {
	const iconDef = useMemo(() => new StateLink({
		'type': 'icon',
		'props': {
			'size': 'small'
		},
		'has': {
			'icon': 'add_outline',
			'svgIconProps': {
				'sx': {
					'color': 'grey.600',
					'fontSize': 34
				}
			},
			'onclickHandler': `tuberCallbacks.$3_C_1`,
		},
	}, appbar), [appbar])

	return <Link instance={iconDef} />
})

AddBookmark.displayName = 'AddBookmark'

export const ShowThumbnailsToggle = React.memo<IToolbarIcon>(({ def: appbar }) => {
	const iconDef = useMemo(() => new StateLink({
		'type': 'icon',
		'props': {
			'size': 'small'
		},
		'has': {
			'icon': 'insert_photo_outline',
			'svgIconProps': {
				'sx': {
					'color': 'grey.600',
					'fontSize': 34
				}
			},
		},
		'onClick': (redux: IRedux) => () => {
			const { store: { getState, dispatch }, actions } = redux
			const reduxStore = new StatePagesData(getState().pagesData)
			reduxStore.configure({ endpoint: ENDPOINT })
			const showThumbnail = reduxStore.get<boolean>(SHOW_THUMBNAIL)
			dispatch(actions.pagesDataAdd({
				route: ENDPOINT,
				key: SHOW_THUMBNAIL,
				value: !showThumbnail
			}))
		}
	}, appbar), [appbar])

	return <Link instance={iconDef} />
})

ShowThumbnailsToggle.displayName = 'ShowThumbnailsToggle'

export const IntegratedPlayerToggle = React.memo<IIntegratedPlayerToggleProps>(({ def: appbar, includeRoute = false }) => {
	const theme = useTheme()
	const greaterThanMid = useMediaQuery(theme.breakpoints.up('md'))

	const iconDef = useMemo(() => new StateLink({
		'type': 'icon',
		'props': {
			'size': 'small'
		},
		'has': {
			'icon': 'monitor_outline',
			'svgIconProps': {
				'sx': {
					'color': 'grey.600',
					'fontSize': 34
				}
			},
			...(includeRoute ? { 'route': appbar.parent._key } : {})
		},
		'onClick': (redux: IRedux) => () => {
			const { store: { getState, dispatch }, actions } = redux
			const reduxStore = new StatePagesData(getState().pagesData)
			reduxStore.configure({ endpoint: ENDPOINT })
			const playerOpen = reduxStore.get<boolean>(PLAYER_OPEN)
			if (greaterThanMid) {
				dispatch(actions.pagesDataAdd({
					route: ENDPOINT,
					key: PLAYER_OPEN,
					value: !playerOpen
				}))
			} else {
				dispatch(actions.pagesDataAdd({
					route: ENDPOINT,
					key: PLAYER_OPEN,
					value: false
				}))
			}
		}
	}, appbar), [appbar, greaterThanMid, includeRoute])

	return <Link instance={iconDef} />
})

IntegratedPlayerToggle.displayName = 'IntegratedPlayerToggle'

export const Feedback = React.memo<IToolbarIcon>(({ def: appbar }) => {
	const iconDef = useMemo(() => new StateLink({
		'type': 'icon',
		'props': {
			'size': 'small'
		},
		'has': {
			'icon': 'feedback_outline',
			'svgIconProps': {
				'sx': {
					'color': 'grey.600',
					'fontSize': 34
				}
			},
			'onclickHandler': `tuberCallbacks.$87_C_2`
		}
	}, appbar), [appbar])

	// Stubbed to keep toolbar action lightweight until lazy-loaded feedback flow is added.
	return <Link instance={iconDef} />
})

Feedback.displayName = 'Feedback'


/** When clicked, this icon will show or hide the list of bookmarks. */
// const BookmarksListIcon = ({ callback, def: appbar }: IToolbarIcon) => {
//   const bookmarksListIconDef = new StateLink({
//     'type': 'icon',
//     'props': {
//       'size': 'small',
//       // 'sx': { 'color': grey[300] }
//     },
//     'has': {
//       'icon': 'subscriptions_outline',
//       'iconProps': {
//         'sx': {
//           'color': grey[600],
//           'fontSize': 34
//         }
//       }
//     },
//     'onClick': callback
//   }, appbar)
//   return <Link def={bookmarksListIconDef} />
// }

/** When clicked, this icon will show or hide the list of bookmarks. */
// const ToggleBookmarksIcon = ({ callback, def: appbar }: IToolbarIcon) => {
//   const iconDef = new StateLink({
//     'type': 'icon',
//     'props': {
//       'size': 'small'
//     },
//     'has': {
//       'icon': 'assignment_outline',
//       'iconProps': {
//         'sx': {
//           'color': grey[600],
//           'fontSize': 34
//         }
//       }
//     },
//     'onClick': callback
//   }, appbar)
//   return <Link def={iconDef} />
// }