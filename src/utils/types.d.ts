export type ObjectInfo = {
    castShadow: boolean;
    recieveShadow: boolean;
    mass: number;
    pos: { x: number; y: number; z: number };
    quat: { x: number; y: number; z: number; w: number };
    size: { x: number; y: number; z: number };
    color?: number;
    texture?: string;
    metalness?: number;
    roughness?: number;
    shape?: string;
};