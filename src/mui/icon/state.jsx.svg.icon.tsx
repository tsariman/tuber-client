import { SvgIcon } from '@mui/material';
import type StateIcon from '../../controllers/StateIcon';
import {
  type IStateIconPolygon,
  type IStateIconPath,
  type IStateIconRect,
  type IStateIconGroup
} from '@tuber/shared';

interface IJsonIconProps {
  def?: {
    svgIconProps: React.ComponentProps<typeof SvgIcon>;
  };
  svgDef: StateIcon;
}

interface ICommonProps {
  fill?: string;
}

interface IPathProps extends ICommonProps {
  path: IStateIconPath;
}

interface IPolygonProps extends ICommonProps {
  polygon: IStateIconPolygon;
}

interface IRectProps extends ICommonProps {
  rect: IStateIconRect;
}

const JsxIconGroup = ({ group, fill }: { group: IStateIconGroup; fill?: string }) => {
  const { children, ...groupAttributes } = group;
  return (
    <g {...groupAttributes}>
      {children.map((element, i) => {
        switch (element.type) {
          case 'path':
            return (
              <JsxIconPath
                key={`group-path-${i}`}
                path={element.props as IStateIconPath}
                fill={fill}
              />
            );
          case 'rect':
            return (
              <JsxIconRect
                key={`group-rect-${i}`}
                rect={element.props as IStateIconRect}
                fill={fill}
              />
            );
          case 'polygon':
            return (
              <JsxIconPoly
                key={`group-polygon-${i}`}
                polygon={element.props as IStateIconPolygon}
                fill={fill}
              />
            );
          case 'group':
            return (
              <JsxIconGroup
                key={`group-group-${i}`}
                group={element.props as IStateIconGroup}
                fill={fill}
              />
            );
          default:
            return null;
        }
      })}
    </g>
  );
};

const JsxIconPath = ({ path, fill }: IPathProps) => (
  <path
    d={path.d}
    fill={path.fill || fill}
    opacity={path.opacity}
  />
);

const JsxIconPoly = ({ polygon: poly, fill }: IPolygonProps) => (
  <polygon
    points={poly.points}
    fill={poly.fill || fill}
    stroke={poly.stroke}
    strokeWidth={poly.strokeWidth}
    transform={poly.transform}
  />
);

const JsxIconRect = ({ rect, fill }: IRectProps) => (
  <rect
    width={rect.width}
    height={rect.height}
    x={rect.x}
    y={rect.y}
    rx={rect.rx}
    ry={rect.ry}
    fill={rect.fill || fill}
  />
);

export default function StateJsxSvgIcon({ def, svgDef: svg }: IJsonIconProps) {
  // Return early if no content to render
  if (!svg.hasContent) {
    return null;
  }

  // Only apply explicit width/height if no fontSize is specified in iconProps
  const shouldApplyExplicitSize = !def?.svgIconProps?.fontSize;

  const svgIconProps: Required<IJsonIconProps>['def']['svgIconProps'] = (
    def && def.svgIconProps
  ) || {};

  return (
    <SvgIcon
      viewBox={svg.viewBox}
      sx={{
        ...(shouldApplyExplicitSize && {
          width: svg.width,
          height: svg.height,
        }),
        fill: svg.fill,
        stroke: svg.stroke,
        strokeWidth: svg.strokeWidth,
        ...svg.attributes
      }}
      {...svgIconProps}
    >
      {/* Render groups */}
      {svg.groups?.map((group, i) => (
        <JsxIconGroup
          key={`group-${i}`}
          group={group}
          fill={svg.fill}
        />
      ))}

      {/* Render paths */}
      {svg.paths.map((path, i) => (
        <JsxIconPath
          key={`path-${i}`}
          path={path}
          fill={path.fill || svg.fill}
        />
      ))}
      
      {/* Render default path if only svg string is provided */}
      {svg.defaultPathElement && (
        <path 
          d={svg.defaultPathElement.d} 
          fill={svg.defaultPathElement.fill}
          opacity={svg.defaultPathElement.opacity}
        />
      )}

      {/* Render rectangles */}
      {svg.rects.map((rect, i) => (
        <JsxIconRect 
          key={`rect-${i}`}
          rect={rect}
          fill={svg.fill}
        />
      ))}
      
      {/* Render polygons */}
      {svg.polygons.map((polygon, i) => (
        <JsxIconPoly
          key={`polygon-${i}`}
          polygon={polygon}
          fill={svg.fill}
        />
      ))}
    </SvgIcon>
  );
};
