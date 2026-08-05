import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Circle, Polygon, Path } from 'react-native-svg';

interface VisceralLogoProps {
  size?: number;
}

export default function VisceralLogo({ size = 100 }: VisceralLogoProps) {
  const scale = size / 680;

  return (
    <Svg width={size} height={size * (390 / 680)} viewBox="0 0 680 390">
      <Defs>
        <LinearGradient id="goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#F0CE7A" />
          <Stop offset="100%" stopColor="#9C7A2E" />
        </LinearGradient>
      </Defs>
      {/* Outer circle */}
      <Circle cx="340" cy="195" r="150" fill="#141210" stroke="#9C7A2E" strokeWidth="2" />
      {/* Inner ring */}
      <Circle cx="340" cy="195" r="128" fill="none" stroke="#9C7A2E" strokeWidth="1" opacity="0.35" />
      {/* Left blade of V */}
      <Polygon points="250,90 285,90 350,255 315,262" fill="url(#goldGrad)" />
      {/* Right blade of V */}
      <Polygon points="430,90 395,90 330,255 365,262" fill="url(#goldGrad)" />
      {/* Left dot */}
      <Circle cx="250" cy="90" r="6" fill="#F0CE7A" />
      {/* Right dot */}
      <Circle cx="430" cy="90" r="6" fill="#F0CE7A" />
      {/* Pulse line (oxblood) */}
      <Path
        d="M190,195 L262,195 L282,148 L302,242 L322,195 L490,195"
        fill="none"
        stroke="#7A2E2E"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
