import React from 'react';

/**
 * 1-bit pixel art, drawn on a 14 x 12 grid ('#' = ink).
 * Rendered at 2px per pixel inline (28 x 24), the same pixel as the
 * portrait, the bands and the cursor trail.
 */
export const ICONS = {
  pin: [
    '....######....',
    '...########...',
    '..###....###..',
    '..##......##..',
    '..##......##..',
    '..###....###..',
    '...########...',
    '....######....',
    '.....####.....',
    '......##......',
    '......##......',
    '..............',
  ],
  shoe: [
    '..............',
    '..............',
    '...###........',
    '...#.##.......',
    '...##.##......',
    '...#.#.##.....',
    '...##....###..',
    '..##.......##.',
    '..###########.',
    '..#.#.#.#.#.#.',
    '..###########.',
    '..............',
  ],
  cup: [
    '....#..#......',
    '.....#..#.....',
    '....#..#......',
    '..............',
    '..########....',
    '..#......###..',
    '..#......#.#..',
    '..#......###..',
    '...#....#.....',
    '....####......',
    '.##########...',
    '..............',
  ],
  cat: [
    '...#.#........',
    '...###........',
    '..#####.......',
    '..#.###.......',
    '.######.......',
    '..#####.......',
    '...#####...##.',
    '...######..#..',
    '..#######..#..',
    '..########.#..',
    '..#########...',
    '.##.######....',
  ],
};

export type IconName = keyof typeof ICONS;

interface PixelIconProps {
  name: IconName;
  className?: string;
  label?: string;
}

const PixelIcon: React.FC<PixelIconProps> = ({ name, className = 'ab-ic', label }) => {
  const rows = ICONS[name];
  const cells: React.ReactNode[] = [];
  rows.forEach((row, y) => {
    row.split('').forEach((ch, x) => {
      if (ch === '#') cells.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />);
    });
  });
  return (
    <svg
      className={className}
      viewBox={`0 0 ${rows[0].length} ${rows.length}`}
      shapeRendering="crispEdges"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      {cells}
    </svg>
  );
};

export default PixelIcon;
