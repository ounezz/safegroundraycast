namespace sgr_settings {
    export const cfg = {
        debug: true,
        lay_on_side: true,
        iters: 3,
        eps_z: 0,
        z_hint: 200.0,
    } as const;
    export const edges: Array<[number, number]> = [
        [0, 1], [1, 3], [3, 2], [2, 0],
        [4, 5], [5, 7], [7, 6], [6, 4],
        [0, 4]
    ]
}
global.sgr_settings = sgr_settings;