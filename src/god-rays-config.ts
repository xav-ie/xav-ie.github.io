export type RayConfig = {
  sunX: number;
  sunY: number;
  rayCount: number;
  rayLength: number;
  rayMaxWidth: number;
  intensity: number;
  blur: number;
  color: string;
  angleJitter: number;
  maskFalloff: number;
  rotationSeconds: number;
  dust: boolean;
  seed: number;
};

export const DEFAULT_RAY_CONFIG: RayConfig = {
  sunX: 70,
  sunY: -62,
  rayCount: 40,
  rayLength: 1120,
  rayMaxWidth: 23,
  intensity: 0.15,
  blur: 4.5,
  color: '#fff17b',
  angleJitter: 5,
  maskFalloff: 23,
  rotationSeconds: 0,
  dust: false,
  seed: 1,
};
