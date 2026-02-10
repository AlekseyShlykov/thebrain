"use client";

import { useId, useState, useEffect } from "react";
import type { BrainSystem } from "@/lib/config";

/** Head outline (Vector 1) – viewBox 838×943 */
const HEAD_PATH =
  "M170.004 856.5L152.004 916V940L539.504 942.5L555.504 932L568.504 912L574.004 890V864.5L576.004 837L582.004 815.5L592.004 799.5L607.004 788L630.004 780L654.004 776.5H675.504H696.504L721.504 773.5L746.504 765.5L763.504 755L773.004 736V720.5L769.004 702L763.504 692.5L759.504 676V655.5L769.004 643L778.004 639.5L781.004 624.5L775.504 613.5L763.504 606.5L775.504 601L784.004 591.5L790.004 576L784.004 560.5L778.004 549L781.004 538L790.004 525.5L803.004 520.5L830.504 507L837.004 497.5V483L827.004 471L811.504 455L771.004 413L752.504 390.5L749.004 377.5V366L756.004 354L759.004 337L752.504 299L735.004 251.5L719.504 211L687.004 152L645.004 102.5L621.004 81L585.504 55.5L548.004 37.5L500.004 22L458.004 11.5L415.004 5.5L381.004 0.5H347.004L291.004 5.5L216.004 21L160.004 47.5L107.004 85L74.0036 120L36.5036 178.5L8.0036 255.5L0.503601 306L8.0036 383L31.0036 451.5L65.0036 505.5L92.5036 541.5L124.504 578L152.004 622L170.004 664L182.004 731V789.5L170.004 856.5Z";

/** Neocortex (Vector 5) – viewBox 684×839, cyan */
const NEOCORTEX_PATH =
  "M190.509 838.015L227.009 826.515L301.009 803.015L325.009 795.515L334.509 783.015L426.509 591.015L446.009 559.015L462.509 550.015L477.509 534.515L485.509 508.015L508.009 500.515L524.509 492.015L537.009 479.015L540.009 459.015L550.509 454.015L563.009 444.015L568.509 426.515L561.509 410.015L558.009 388.515L565.509 380.015L584.009 385.015H599.009L618.509 376.015L632.009 363.515L637.509 345.515L639.509 330.015L658.509 323.515L672.509 316.515L681.509 299.515L682.509 281.515L675.009 258.515L663.509 243.515L668.509 238.515L672.009 220.515L668.009 205.015L657.509 190.515L639.009 178.515L644.009 172.515V159.515L641.509 145.515L632.009 133.515L622.509 124.015L609.009 118.515L591.009 116.515L589.509 105.515L587.509 92.0153L573.009 79.0153L555.009 71.0153L540.509 70.0153L526.009 72.5153L523.509 57.5153L519.509 49.5153L510.009 38.0153L498.509 29.5153L482.509 25.5153L465.509 25.0153L444.509 29.5153L435.009 16.5153L425.509 10.5153L411.009 5.51532L400.509 4.51532L380.009 10.5153L369.009 18.0153L363.009 11.5153L350.009 4.51532L331.009 0.51532L317.509 4.51532L297.509 13.0153L284.009 4.51532L270.509 2.51532L253.509 5.01532L233.509 21.0153L227.009 16.5153H213.009L197.509 22.0153L184.509 24.5153L167.009 46.0153L159.509 44.5153L145.009 45.5153L126.509 56.5153L111.009 73.5153L107.509 89.0153H101.509L83.0089 97.5153L73.0089 105.015L65.0089 117.015L62.5089 136.515L46.0089 143.515L31.5089 154.515L25.0089 171.515L27.0089 193.515L14.5089 203.515L5.50888 213.515L0.508881 234.515L4.50888 261.015L19.0089 276.515L13.5089 284.015L5.00888 299.015L4.50888 315.515L13.0089 338.015L42.0089 349.515L37.0089 374.015L45.5089 392.515L65.0089 409.515H78.5089L84.0089 425.515L90.5089 443.515L110.509 452.015L133.009 453.015L140.009 470.015L151.009 481.015L169.509 486.015L160.009 495.015L155.509 508.015L158.509 522.515L169.509 535.515L182.009 544.515L169.509 557.015L166.509 577.015L177.009 592.015H196.509L217.509 586.015L227.009 599.515L247.009 606.515L267.509 599.515H274.509L267.509 628.515L190.509 838.015Z";

/** Limbic (Vector 6) – viewBox 419×723, yellow */
const LIMBIC_PATH =
  "M142.016 511.502L64.5157 722.002L140.016 698.002L151.516 689.002L238.516 488.002L252.016 465.502L271.516 432.502L285.016 402.502L297.516 377.002L312.016 371.002L325.016 365.002L337.516 356.002L346.016 344.502L339.516 326.502L325.516 308.502L334.516 293.502L353.516 277.002L366.016 270.002L375.516 255.002L379.016 241.002L375.016 225.002L361.516 219.002L350.016 212.002L348.016 201.002L357.516 195.002L374.016 184.502L396.016 166.002L412.516 144.002L417.516 126.002V108.002L414.516 92.0022L409.016 76.5022L391.016 61.5022L370.016 57.0022L346.516 61.5022L342.516 51.0022L330.016 37.5022L316.016 29.0022L292.516 28.0022L272.516 32.0022L268.016 20.5022L254.016 10.0022L241.016 2.0022L230.016 1.0022L210.016 0.502197L190.516 7.5022L173.016 17.0022L155.016 7.5022H144.016L126.016 12.5022L107.016 24.0022L100.516 41.0022L91.5157 39.0022L75.0157 42.5022L62.0157 50.5022L48.5157 68.0022L45.0157 91.5022L33.5157 99.0022L22.0157 108.502L7.01572 129.502L0.515717 155.502L6.51572 179.002L22.0157 202.502L40.0157 217.502L36.0157 234.502L37.0157 252.502L48.5157 273.502L62.5157 289.002L83.0157 296.002L108.016 294.502L128.516 287.002V300.002L136.016 318.002L144.516 327.502L150.016 334.502L142.016 346.502L133.016 351.002L110.516 355.002L99.0157 355.502H88.0157L79.0157 359.002L75.0157 362.002L72.5157 368.502L81.5157 375.002L71.0157 383.502L60.0157 391.502L52.0157 408.002L52.5157 425.002L70.0157 439.002L96.5157 439.502L118.016 437.002L143.516 437.502L153.016 447.002L152.016 474.502L142.016 511.502Z";

/** Reptilian (Vector 8) – viewBox 241×617, red */
const REPTILIAN_PATH =
  "M88.3633 381.511L5.18927 596.011L0.67984 615.511L26.2333 608.011L33.248 585.511L57.2983 521.011L172.038 266.511L192.581 234.511L207.112 195.511L202.101 167.511L196.59 142.511L208.615 122.011L228.156 96.5112L235.17 72.5112L239.68 46.0112L229.158 26.0112L210.118 8.51123L176.548 0.51123L152.998 5.01123L130.451 11.0112L111.411 27.0112L89.3654 24.5112L67.8203 27.0112L51.7868 38.5112L45.7742 63.0112L45.2731 93.0112L69.3234 118.511L89.3654 120.011H109.908L120.931 126.011L132.957 148.011L138.468 178.011L132.456 219.011L114.919 241.011L88.3633 266.011L64.814 278.011L26.2333 283.511H12.2039L5.18927 298.011L16.2123 309.011H42.7679H64.814L88.3633 322.011L97.8832 343.511L88.3633 381.511Z";

const VIEWBOX_WIDTH = 838;
const VIEWBOX_HEIGHT = 943;

/** Brain position: centered in the head outline (viewBox 838×943). */
const BRAIN_CENTER_X = 419;
const BRAIN_CENTER_Y = 460;

/** Approximate geometric center of each path in its native viewBox. */
const NEOCORTEX_CENTER_X = 341;
const NEOCORTEX_CENTER_Y = 419;
const LIMBIC_CENTER_X = 209;
const LIMBIC_CENTER_Y = 361;
const REPTILIAN_CENTER_X = 120;
const REPTILIAN_CENTER_Y = 308;

/** Scale each layer: turquoise largest (~majority), yellow ~40–50% of it, red smallest (~15–20% of yellow). Increased size. */
const NEOCORTEX_SCALE = 0.88;
const LIMBIC_SCALE = 0.88;
const REPTILIAN_SCALE = 0.88;

/** Bottom Y in each path's native coords (SVG y down = max Y). */
const NEOCORTEX_MAX_Y = 839;
const LIMBIC_MAX_Y = 722;
const REPTILIAN_MAX_Y = 626;

/** Common bottom plane in head coords: use neocortex (deepest). Others get vertical offset so bottoms align. */
const commonBottomY =
  BRAIN_CENTER_Y + (NEOCORTEX_MAX_Y - NEOCORTEX_CENTER_Y) * NEOCORTEX_SCALE;
const limbicBottomY = BRAIN_CENTER_Y + (LIMBIC_MAX_Y - LIMBIC_CENTER_Y) * LIMBIC_SCALE;
const reptilianBottomY = BRAIN_CENTER_Y + (REPTILIAN_MAX_Y - REPTILIAN_CENTER_Y) * REPTILIAN_SCALE;
const LIMBIC_OFFSET_Y = commonBottomY - limbicBottomY;
const REPTILIAN_OFFSET_Y = commonBottomY - reptilianBottomY;

/** Transform: place path center at BRAIN_CENTER, scale, then shift so all share common bottom. */
const NEOCORTEX_TRANSFORM = `translate(${BRAIN_CENTER_X}, ${BRAIN_CENTER_Y}) scale(${NEOCORTEX_SCALE}) translate(${-NEOCORTEX_CENTER_X}, ${-NEOCORTEX_CENTER_Y})`;
const LIMBIC_TRANSFORM = `translate(0, ${LIMBIC_OFFSET_Y}) translate(${BRAIN_CENTER_X}, ${BRAIN_CENTER_Y}) scale(${LIMBIC_SCALE}) translate(${-LIMBIC_CENTER_X}, ${-LIMBIC_CENTER_Y})`;
const REPTILIAN_TRANSFORM = `translate(0, ${REPTILIAN_OFFSET_Y}) translate(${BRAIN_CENTER_X}, ${BRAIN_CENTER_Y}) scale(${REPTILIAN_SCALE}) translate(${-REPTILIAN_CENTER_X}, ${-REPTILIAN_CENTER_Y})`;

/** Colors from your previous picture: turquoise (back), yellow (middle), red (front). */
const DIAGRAM_COLORS: Record<BrainSystem, string> = {
  neocortex: "#03E7DF",   // bright turquoise
  limbic: "#E1E438",      // bright yellow
  reptilian: "#F71212",   // vibrant red
};

export interface VectorBrainDiagramProps {
  highlightedZone?: BrainSystem | null;
  /** When set (e.g. Stage 2 result), this zone fills the head and goes to foreground; others at 60% opacity. */
  dominantZone?: BrainSystem | null;
  /** When set with dominantZone (Stage 2 result), this zone is drawn in front at 80% opacity (the "controlled" zone). */
  foregroundZone?: BrainSystem | null;
  scaleReptilian?: number;
  scaleLimbic?: number;
  scaleNeocortex?: number;
  className?: string;
  onZoneClick?: (zone: BrainSystem) => void;
  onZoneHover?: (zone: BrainSystem | null) => void;
}

const BRAIN_SYSTEMS: BrainSystem[] = ["neocortex", "limbic", "reptilian"];

const ZONE_TRANSFORMS: Record<BrainSystem, string> = {
  neocortex: NEOCORTEX_TRANSFORM,
  limbic: LIMBIC_TRANSFORM,
  reptilian: REPTILIAN_TRANSFORM,
};
const ZONE_PATHS: Record<BrainSystem, string> = {
  neocortex: NEOCORTEX_PATH,
  limbic: LIMBIC_PATH,
  reptilian: REPTILIAN_PATH,
};

export function VectorBrainDiagram({
  highlightedZone = null,
  dominantZone = null,
  foregroundZone = null,
  scaleReptilian = 1,
  scaleLimbic = 1,
  scaleNeocortex = 1,
  className = "",
  onZoneClick,
  onZoneHover,
}: VectorBrainDiagramProps) {
  const clipId = useId();
  const highlightStroke = "rgba(255,255,255,0.7)";
  const highlightStrokeWidth = 4;
  /** When one zone is highlighted, the others use 60% transparency (opacity 0.4). */
  const dimmedOpacity = 0.4;
  /** Stage 2 result: non-dominant zones at 60% opacity. */
  const nonDominantOpacity = 0.6;
  /** Stage 2 result: controlled zone in front at 80% opacity. */
  const foregroundZoneOpacity = 0.8;

  const [showDominantFill, setShowDominantFill] = useState(false);
  useEffect(() => {
    if (!dominantZone) {
      setShowDominantFill(false);
      return;
    }
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setShowDominantFill(true));
    });
    return () => cancelAnimationFrame(t);
  }, [dominantZone]);

  const opacityFor = (zone: BrainSystem) => {
    if (dominantZone != null) {
      return dominantZone === zone ? 1 : nonDominantOpacity;
    }
    return highlightedZone == null ? 1 : highlightedZone === zone ? 1 : dimmedOpacity;
  };

  const isDominantMode = dominantZone != null;

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      className={`select-none ${className}`}
      aria-hidden
    >
      <defs>
        {/* Clip brain layers so they fit inside the head */}
        <clipPath id={clipId}>
          <path d={HEAD_PATH} />
        </clipPath>
      </defs>

      {/* Head outline (Vector 1) – drawn first */}
      <path
        d={HEAD_PATH}
        fill="none"
        stroke="#000"
        strokeWidth={2}
      />

      {/* Brain layers: back → front. When dominantZone is set, skip dominant (and foreground when drawn on top) and draw rest at 60% opacity. */}
      <g clipPath={`url(#${clipId})`}>
        {BRAIN_SYSTEMS.map((zone) => {
          if (isDominantMode && zone === dominantZone) return null;
          if (isDominantMode && foregroundZone != null && zone === foregroundZone) return null;
          const transform = ZONE_TRANSFORMS[zone];
          const path = ZONE_PATHS[zone];
          return (
            <g key={zone} transform={transform} opacity={opacityFor(zone)}>
              <path
                d={path}
                fill={DIAGRAM_COLORS[zone]}
                stroke={highlightedZone === zone ? highlightStroke : "#000"}
                strokeWidth={highlightedZone === zone ? highlightStrokeWidth : 2}
                style={{ cursor: onZoneClick ? "pointer" : undefined }}
                onClick={() => onZoneClick?.(zone)}
                onPointerEnter={() => onZoneHover?.(zone)}
                onPointerLeave={() => onZoneHover?.(null)}
              />
            </g>
          );
        })}
      </g>

      {/* Stage 2 result: controlling zone fills the entire head and comes to the foreground */}
      {isDominantMode && (
        <g clipPath={`url(#${clipId})`}>
          <path
            d={HEAD_PATH}
            fill={DIAGRAM_COLORS[dominantZone!]}
            stroke="none"
            className="transition-opacity duration-500 ease-out"
            style={{ opacity: showDominantFill ? 1 : 0 }}
          />
        </g>
      )}

      {/* Stage 2 result: controlled zone in front of the camera at 80% opacity */}
      {isDominantMode && foregroundZone != null && (
        <g clipPath={`url(#${clipId})`} opacity={foregroundZoneOpacity}>
          <g transform={ZONE_TRANSFORMS[foregroundZone]}>
            <path
              d={ZONE_PATHS[foregroundZone]}
              fill={DIAGRAM_COLORS[foregroundZone]}
              stroke="#000"
              strokeWidth={2}
            />
          </g>
        </g>
      )}
    </svg>
  );
}
