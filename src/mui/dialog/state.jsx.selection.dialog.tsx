import {
  Avatar,
  Dialog,
  DialogTitle,
  List,
  ListItemAvatar,
  ListItemButton, 
  ListItemText
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../state'
import type {
  StateDialogSelection,
  StateDialogSelectionItem
} from '../../controllers'
import { StateJsxUnifiedIconProvider } from '../icon'
import { memo } from 'react'

/*
  Selection Dialog

  Use this dialog to select an item from the displayed list.
  Each item needs an icon and a title.

  The icon can be the relative URL of an image or a material-ui/font-awesome icon.
  See the section of the web-ui documentation on how to define an icon.

  @see https://github.com/crownlessking/web-ui#formitemhasfaicon

  ```ts
  const dialog = {
    dialogType: 'selection',
    items: [
      {
        title: '',
        avatar: {
          icon: '',
          faIcon: '',
          text: '',
          props: { ... }
        }
      },
      // ... more avatars
    ],
    callback: function(item) {

    }
  }
  ```
*/

export interface ISelectionDialogProps {
  instance: StateDialogSelection
}

const StateJsxSelectionDialog = memo((
  { instance: dialog }: ISelectionDialogProps
) => {
  const dispatch = useDispatch<AppDispatch>()
  const open = useSelector((state: RootState) => state.dialog.open ?? false)

  const onClose = () => dispatch({ type: 'dialog/dialogClose' })

  const handleListItemClick = (info: StateDialogSelectionItem) => {
    dispatch({ type: 'dialog/dialogClose' })
    dialog.callback(info)
  }

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>{  }</DialogTitle>
      <List sx={{ pt: 0 }}>
        {dialog.list.map((info, i) => (
          <ListItemButton
            onClick={() => handleListItemClick(info)}
            key={`list_item_button_${i}`}
          >
            <ListItemAvatar>
              <Avatar {...info.avatar.props}>
                {info.icon
                  ? (<StateJsxUnifiedIconProvider def={info.avatar.jsonIcon} />)
                  : info.avatar.text
                }
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={info.title} />
          </ListItemButton>
        ))}
      </List>
    </Dialog>
  )
}, (prevProps, nextProps) => prevProps.instance.state === nextProps.instance.state)

export default StateJsxSelectionDialog