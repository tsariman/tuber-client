# WEBUI

### `IStateApp`

#### `IStateApp.title`

* **Type**: `string`
* **Usage**: Set the title of the website
* **Example**
    ```tsx
    <Typography>{ app.title }</Typography>
    ```

### `IStateAppbar`

```ts
const appbarState: IStateAppbar = {
    props: {},
    toolbarProps: {},
    muiIconProps: {},
    typography: {
        color: '',
        fontFamily: ''
    },
    items: [],
    textLogoProps: {}
}
```

#### `IStateAppbar.props`

* **Type**: `AppbarProps`
* **Usage**: Spread on the `<AppBar />` component.
* **Example**: `<Toolbar {...props}/>`

#### `IStateAppbar.toolbarProps`

* **Type**: `ToolbarProps`
* **Usage**: Spread on the `<Toolbar />` component.
* **Example**: `<Toolbar {...toolbarProps}/>`

#### `IStateAppbar.muiIconProps`

* **Type**: `IconButtonProps`
* **Usage**: Spread on the `<IconButton />` component.
* **Example**: `<IconButton {...muiIconProps}/>`

#### `IStateAppbar.typography`

* **Type**: `IStateTypography`
* **Usage**: Customize the `color` and `fontFamily` of the website title

#### `IStateAppbar.textLogoProps`

* **Type**: `TypographyProps`
* **Usage**: Spread on the `<Typography />` component wrapper of the website title.
* **Example**: `<Typography {...textLogoProps}/>`

#### `IStateAppbar.items`

* **Type**: `IstateLink[]`
* **Usage**: Define the navigation links of the app bar. (`<AppBar />`)
* **Example**: N/A

### `IStateFormItemCustom<T>` (StateFormItemCustomChip`<unknown>`[])

This interfaces defines the chip graphical component of the middle-search app bar input field. This is mostly an automated process but it is design to customize the behavior of the input.

#### `IStateFormItemCustom<T>.props`

* **Type**: `Record<string, unknown>`
* **Usage**: Spread on the `<chip />` component of the input field.
* **Example**: `<chip {...props}/>`