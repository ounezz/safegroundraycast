namespace sgr_settings {
  export const cfg = {
    debug: { // work only in render
        lines: false, // draws raycast debug lines (sampling rays and hit positions)
        box: true    // draws bounding box wireframe for visualization
    },
    iters: 5, // number of alignment iterations for stabilizing rotation/position
    lay_on_side: true, // applies additional rotation to place object on its side
    eps: 0, // small vertical offset to prevent clipping into surface (set to -0.05 if you want the object to sit directly on the ground)
    z_hint: 200.0, // initial height hint used for downward ground detection
    min_samples: 4, // minimum raycast samples required to fit support plane
    ray: {
        up: 1.0, // raycast start offset above sample point
        down: 5.0, // raycast length downward to search for supporting surface
        flags: 1 // raycast collision mask (defines which surfaces can be hit)
    }
  } as const;

  export const edges: Array<[number, number]> = [
    [0, 1], [1, 3], [3, 2], [2, 0],
    [4, 5], [5, 7], [7, 6], [6, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];
}
global.sgr_settings = sgr_settings;