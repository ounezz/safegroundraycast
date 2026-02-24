// namespace sgr1 {
//   const dims_cache = new Map<number, model_dims>();
//   const aligned = new Set<number>();

//   function get_dims(model: number): model_dims {
//     const cached = dims_cache.get(model);
//     if (cached) return cached;

//     const res: any = mp.game.gameplay.getModelDimensions(model);
//     const dims: model_dims = {
//       min: new mp.Vector3(res.min.x, res.min.y, res.min.z),
//       max: new mp.Vector3(res.max.x, res.max.y, res.max.z),
//     };

//     dims_cache.set(model, dims);
//     return dims;
//   }

//   function local_corners(min: Vector3, max: Vector3): Vector3[] {
//     return [
//       new mp.Vector3(min.x, min.y, min.z),
//       new mp.Vector3(max.x, min.y, min.z),
//       new mp.Vector3(min.x, max.y, min.z),
//       new mp.Vector3(max.x, max.y, min.z),
//       new mp.Vector3(min.x, min.y, max.z),
//       new mp.Vector3(max.x, min.y, max.z),
//       new mp.Vector3(min.x, max.y, max.z),
//       new mp.Vector3(max.x, max.y, max.z),
//     ];
//   }

//   function world_corners(obj: ObjectMp): Vector3[] {
//     const { min, max } = get_dims(obj.model);
//     return local_corners(min, max).map(v =>
//       mp.game.entity.getOffsetFromInWorldCoords(obj.handle, v.x, v.y, v.z)
//     );
//   }

//   function bottom_idx(corners: Vector3[]): number[] {
//     return corners
//       .map((p, i) => ({ p, i }))
//       .sort((a, b) => a.p.z - b.p.z)
//       .slice(0, 4)
//       .map(v => v.i);
//   }

//   function ground_z(x: number, y: number, z_hint: number): number | null {
//     const z = mp.game.gameplay.getGroundZFor3dCoord(x, y, z_hint, false, false);
//     return z !== 0 ? z : null;
//   }

//   function quat_keep_yaw(yaw_deg: number, up: vec3): quat {
//     const yaw = deg2rad(yaw_deg);
//     const f0 = v3(Math.cos(yaw), Math.sin(yaw), 0);

//     let f = sub3(f0, mul3(up, dot3(f0, up)));
//     if (len3(f) < 1e-6) {
//       f = v3(-Math.sin(yaw), Math.cos(yaw), 0);
//       f = sub3(f, mul3(up, dot3(f, up)));
//     }
//     f = norm3(f);

//     const r = norm3(cross3(f, up));
//     const f2 = norm3(cross3(up, r));
//     return mat3_to_quat(r, f2, up);
//   }

//   function settle_z(obj: ObjectMp): void {
//     const eps = 0.01;
//     const corners = world_corners(obj);
//     const idx = bottom_idx(corners);

//     let max_d = -Infinity;
//     let min_d = Infinity;

//     for (const i of idx) {
//       const p = corners[i];
//       const gz = ground_z(p.x, p.y, p.z + 200.0);
//       if (gz == null) continue;
//       const d = gz - p.z;
//       if (d > max_d) max_d = d;
//       if (d < min_d) min_d = d;
//     }

//     if (!isFinite(max_d) || !isFinite(min_d)) return;

//     let dz = 0;
//     if (max_d > 0) dz = max_d + eps;        // провалился
//     else if (min_d < -eps) dz = min_d + eps; // висит

//     if (dz !== 0) {
//       obj.position = new mp.Vector3(obj.position.x, obj.position.y, obj.position.z + dz);
//     }
//   }

//   function align(obj: ObjectMp, iters: number, lay_on_side: boolean): void {
//     const q_side = lay_on_side ? quat_axis_angle(v3(1, 0, 0), 90) : quat_make();

//     for (let it = 0; it < iters; it++) {
//       const corners = world_corners(obj);
//       const idx = bottom_idx(corners);

//       const samples: vec3[] = [];
//       for (const i of idx) {
//         const p = corners[i];
//         const gz = ground_z(p.x, p.y, p.z + 200.0);
//         if (gz == null) continue;
//         samples.push(v3(p.x, p.y, gz));
//       }
//       if (samples.length < 3) return;

//       const n = fit_plane_normal(samples);
//       if (!n) return;

//       const q_align = quat_keep_yaw(obj.rotation.z, n);
//       const q_final = quat_norm(quat_mul(q_align, q_side));

//       // SET_ENTITY_QUATERNION(entity, x, y, z, w)
//       mp.game.invoke("0x77B21BE7AC540F07", obj.handle, q_final.x, q_final.y, q_final.z, q_final.w);

//       settle_z(obj);
//     }
//   }

//   function debug_box(obj: ObjectMp): void {
//     if (!dev) return;
//     if (!mp.objects.exists(obj) || !obj.handle) return;

//     const corners = world_corners(obj);

//     const bottom = corners
//       .map((p, i) => ({ p, i }))
//       .sort((a, b) => a.p.z - b.p.z)
//       .slice(0, 4);

//     for (const { p } of bottom) {
//       const gz = mp.game.gameplay.getGroundZFor3dCoord(p.x, p.y, p.z, false, false);
//       if (gz !== 0) mp.game.graphics.drawLine(p.x, p.y, p.z, p.x, p.y, gz, 0, 255, 0, 255);
//     }

//     for (const [a, b] of edges) {
//       const p1 = corners[a];
//       const p2 = corners[b];
//       mp.game.graphics.drawLine(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, 255, 0, 0, 255);
//     }
//   }

//   function apply_once(obj: ObjectMp, lay_on_side = true, iters = 3): void {
//     if (!mp.objects.exists(obj) || !obj.handle) return;
//     if (aligned.has(obj.handle)) {
//       debug_box(obj);
//       return;
//     }

//     align(obj, iters, lay_on_side);
//     aligned.add(obj.handle);
//     debug_box(obj);
//   }
// }

// global.sgr1 = sgr1;