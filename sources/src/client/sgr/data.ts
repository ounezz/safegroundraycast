namespace sgr_settings {
  export const cfg = {
    debug: true, 
    iters: 3,         
    lay_on_side: true,
    eps: 0.01,        
    z_hint: 200.0, 
    min_samples: 3,  
  } as const;

  export const edges: Array<[number, number]> = [
    [0, 1], [1, 3], [3, 2], [2, 0],
    [4, 5], [5, 7], [7, 6], [6, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];
}
global.sgr_settings = sgr_settings;