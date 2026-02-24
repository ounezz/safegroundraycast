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
type ray_hit = { 
    z: number; 
    n?: vec3 
};