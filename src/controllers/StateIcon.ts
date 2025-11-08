import AbstractState from './AbstractState';
import type { IStateIcon } from '@tuber/shared';
import type StateAllIcons from './StateAllIcons';

export default class StateIcon extends AbstractState implements IStateIcon {
  private _iconState: IStateIcon;
  private _parent?: StateAllIcons;

  constructor(iconState: IStateIcon, parent?: StateAllIcons) {
    super();
    this._iconState = iconState;
    this._parent = parent;
  }

  /** Get a copy of the icon definition. */
  get state(): IStateIcon { return this._iconState; }
  /** Chain-access to parent StateAllIcons definition. */
  get parent(): StateAllIcons | undefined { return this._parent; }
  /** SVG props to spread on the SVG component */
  get props(): unknown {
    return {
      viewBox: this.viewBox,
      width: this.width,
      height: this.height,
      fill: this.fill,
      stroke: this.stroke,
      strokeWidth: this.strokeWidth,
      enableBackground: this.enableBackground,
      ...this.attributes
    };
  }
  get theme(): unknown {
    // Icons inherit theme from StateAllIcons -> State hierarchy
    return this.parent?.parent?.theme || {};
  }
  /** SVG viewBox attribute (default: "0 0 24 24") */
  get viewBox(): string {
    return this._iconState.viewBox || '0 0 24 24';
  }
  /** Icon width (default: 24) */
  get width(): number {
    return this._iconState.width || 24;
  }
  /** Icon height (default: 24) */
  get height(): number {
    return this._iconState.height || 24;
  }
  /** Icon fill color */
  get fill(): string {
    return this._iconState.fill || 'currentColor';
  }
  get opacity(): number | undefined {
    return this._iconState.opacity;
  }
  /** Icon stroke color */
  get stroke(): string | undefined {
    return this._iconState.stroke;
  }
  /** Icon stroke width */
  get strokeWidth(): number | undefined {
    return this._iconState.strokeWidth;
  }
  /** SVG path data or full SVG content */
  get svg(): string | undefined {
    return this._iconState.svg;
  }
  /** Array of SVG path elements */
  get paths(): Required<IStateIcon>['paths'] {
    return this._iconState.paths || [];
  }
  /** Array of SVG group elements */
  get groups(): Required<IStateIcon>['groups'] {
    return this._iconState.groups || [];
  }
  /** Array of SVG rect elements */
  get rects(): Required<IStateIcon>['rects'] {
    return this._iconState.rects || [];
  }
  /** Array of SVG polygon elements */
  get polygons(): Required<IStateIcon>['polygons'] {
    return this._iconState.polygons || [];
  }
  /** Additional SVG attributes */
  get attributes(): Record<string, string | number> {
    return this._iconState.attributes || {};
  }
  /** Enable background attribute for SVG */
  get enableBackground(): string | undefined {
    return this._iconState.enableBackground;
  }
  /** Check if icon has path data */
  get hasPathData(): boolean {
    return !!(this.svg || (this.paths && this.paths.length > 0));
  }
  /** Check if icon has geometric shapes */
  get hasShapes(): boolean {
    return !!(
      (this.rects && this.rects.length > 0) || 
      (this.polygons && this.polygons.length > 0) ||
      (this.groups && this.groups.length > 0)
    );
  }
  /** Check if icon has any renderable content */
  get hasContent(): boolean {
    return this.hasPathData || this.hasShapes;
  }
  /** Get the default path element if only svg string is provided */
  get defaultPathElement() {
    if (this.svg && (!this.paths || this.paths.length === 0)) {
      return {
        d: this.svg,
        fill: this.fill,
        opacity: this.opacity
      };
    }
    return null;
  }
}