export interface ColorStop {
  id: string;
  color: string;
  offset: number; // 0 to 100
}

export type GradientType = 'linear' | 'radial';

export type AnimationType = 'none' | 'rotate' | 'pulse';

export interface GradientConfig {
  type: GradientType;
  angle: number; // For linear, degrees
  stops: ColorStop[];
  animation: AnimationType;
  animationDuration: number; // Seconds
}

export interface AIResponse {
  gradientName: string;
  description: string;
  config: GradientConfig;
}
