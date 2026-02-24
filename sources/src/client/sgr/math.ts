namespace sgr_math {

    export const v3 = (x = 0, y = 0, z = 0): vec3 => ({ x, y, z });
    export const add3 = (a: vec3, b: vec3): vec3 => v3(a.x + b.x, a.y + b.y, a.z + b.z);
    export const sub3 = (a: vec3, b: vec3): vec3 => v3(a.x - b.x, a.y - b.y, a.z - b.z);
    export const mul3 = (a: vec3, s: number): vec3 => v3(a.x * s, a.y * s, a.z * s);
    export const dot3 = (a: vec3, b: vec3): number => a.x * b.x + a.y * b.y + a.z * b.z;
    export const cross3 = (a: vec3, b: vec3): vec3 =>
        v3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
    export const len3 = (a: vec3): number => Math.sqrt(dot3(a, a));
    export const norm3 = (a: vec3): vec3 => {
        const l = len3(a);
        return l > 1e-8 ? mul3(a, 1 / l) : v3(0, 0, 1);
    };
    export const deg2rad = (d: number): number => (d * Math.PI) / 180;

    export const quat_make = (x = 0, y = 0, z = 0, w = 1): quat => ({ x, y, z, w });
    export const quat_norm = (q: quat): quat => {
        const l = Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w) || 1;
        return { x: q.x / l, y: q.y / l, z: q.z / l, w: q.w / l };
    };
    // q = a*b => сначала b, потом a
    export const quat_mul = (a: quat, b: quat): quat =>
        quat_make(
            a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
            a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
            a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
            a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z
        );

    export const quat_axis_angle = (axis: vec3, deg: number): quat => {
        const ang = deg2rad(deg) * 0.5;
        const s = Math.sin(ang);
        const a = norm3(axis);
        return quat_norm({ x: a.x * s, y: a.y * s, z: a.z * s, w: Math.cos(ang) });
    };

    export const mat3_to_quat = (r: vec3, f: vec3, u: vec3): quat => {
        const m00 = r.x, m01 = f.x, m02 = u.x;
        const m10 = r.y, m11 = f.y, m12 = u.y;
        const m20 = r.z, m21 = f.z, m22 = u.z;

        const tr = m00 + m11 + m22;
        let w = 1, x = 0, y = 0, z = 0;

        if (tr > 0) {
            const s = Math.sqrt(tr + 1.0) * 2;
            w = 0.25 * s;
            x = (m21 - m12) / s;
            y = (m02 - m20) / s;
            z = (m10 - m01) / s;
        } else if (m00 > m11 && m00 > m22) {
            const s = Math.sqrt(1.0 + m00 - m11 - m22) * 2;
            w = (m21 - m12) / s;
            x = 0.25 * s;
            y = (m01 + m10) / s;
            z = (m02 + m20) / s;
        } else if (m11 > m22) {
            const s = Math.sqrt(1.0 + m11 - m00 - m22) * 2;
            w = (m02 - m20) / s;
            x = (m01 + m10) / s;
            y = 0.25 * s;
            z = (m12 + m21) / s;
        } else {
            const s = Math.sqrt(1.0 + m22 - m00 - m11) * 2;
            w = (m10 - m01) / s;
            x = (m02 + m20) / s;
            y = (m12 + m21) / s;
            z = 0.25 * s;
        }

        return quat_norm({ x, y, z, w });
    };

    export const fit_plane_normal = (pts: vec3[]): vec3 | null => {
        if (pts.length < 3) return null;

        let sxx = 0, sxy = 0, sx = 0;
        let syy = 0, sy = 0;
        let sxz = 0, syz = 0, sz = 0;
        const n = pts.length;

        for (const p of pts) {
            sxx += p.x * p.x;
            sxy += p.x * p.y;
            sx += p.x;
            syy += p.y * p.y;
            sy += p.y;
            sxz += p.x * p.z;
            syz += p.y * p.z;
            sz += p.z;
        }

        const a00 = sxx, a01 = sxy, a02 = sx;
        const a10 = sxy, a11 = syy, a12 = sy;
        const a20 = sx, a21 = sy, a22 = n;

        const b0 = sxz, b1 = syz, b2 = sz;

        const det =
            a00 * (a11 * a22 - a12 * a21) -
            a01 * (a10 * a22 - a12 * a20) +
            a02 * (a10 * a21 - a11 * a20);

        if (Math.abs(det) < 1e-10) return null;

        const det0 =
            b0 * (a11 * a22 - a12 * a21) -
            a01 * (b1 * a22 - a12 * b2) +
            a02 * (b1 * a21 - a11 * b2);

        const det1 =
            a00 * (b1 * a22 - a12 * b2) -
            b0 * (a10 * a22 - a12 * a20) +
            a02 * (a10 * b2 - b1 * a20);

        const aa = det0 / det;
        const bb = det1 / det;

        return norm3(v3(-aa, -bb, 1));
    };

}
global.sgr_math = sgr_math