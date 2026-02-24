type vec3 = {
  x: number;
  y: number;
  z: number;
};

type quat = {
  x: number;
  y: number;
  z: number;
  w: number;
};

type model_dims = {
  min: Vector3;
  max: Vector3;
};

 type BottomSelectionMode =
  | "lowest"
  | "planeFit"
  | "threshold";

interface SGRConfig {

  enabled: boolean;

  once: {
    enabled: boolean;
    allowReapply: boolean;
    resetOnStreamOut: boolean;
  };

  align: {
    iters: number;

    layOnSide: boolean;
    sideAxis: vec3;
    sideAngleDeg: number;

    bottomSamples: number;
    bottomMode: BottomSelectionMode;

    keepYaw: boolean;
  };

  ground: {
    raycastHeight: number;
    useFallbackZ: boolean;
  };

  settle: {
    enabled: boolean;
    epsilon: number;
    onlyIfFloating: boolean;
  };

  cache: {
    modelDims: boolean;
  };

  debug: {
    enabled: boolean;

    drawBox: boolean;
    drawBottomPoints: boolean;
    drawGroundLines: boolean;
    drawNormal: boolean;
  };

  edges: Array<[number, number]>;
}