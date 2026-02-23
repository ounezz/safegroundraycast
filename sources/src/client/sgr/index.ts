const dev = true;

const EDGES: Array<[number, number]> = [
  [0, 1], [1, 3], [3, 2], [2, 0],
  [4, 5], [5, 7], [7, 6], [6, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
];

class SGR {
  private d_cache = new Map<number, d_model>();

  private d_get(modelHash: number): d_model {
    const cached = this.d_cache.get(modelHash);
    if (cached) return cached;

    const res: any = mp.game.gameplay.getModelDimensions(modelHash);

    const dims: d_model = {
      min: new mp.Vector3(res.min.x, res.min.y, res.min.z),
      max: new mp.Vector3(res.max.x, res.max.y, res.max.z),
    };

    this.d_cache.set(modelHash, dims);
    return dims;
  }

  public box(obj: ObjectMp): void {
    if (!dev) return;
    if (!mp.objects.exists(obj)) return;
    if (!obj.handle) return;

    const { min, max } = this.d_get(obj.model);

    const local = [
      new mp.Vector3(min.x, min.y, min.z),
      new mp.Vector3(max.x, min.y, min.z),
      new mp.Vector3(min.x, max.y, min.z),
      new mp.Vector3(max.x, max.y, min.z),
      new mp.Vector3(min.x, min.y, max.z),
      new mp.Vector3(max.x, min.y, max.z),
      new mp.Vector3(min.x, max.y, max.z),
      new mp.Vector3(max.x, max.y, max.z),
    ];

    const world = local.map(v =>
      mp.game.entity.getOffsetFromInWorldCoords(obj.handle, v.x, v.y, v.z)
    );

    for (const [a, b] of EDGES) {
      const p1 = world[a];
      const p2 = world[b];

      mp.game.graphics.drawLine(
        p1.x, p1.y, p1.z,
        p2.x, p2.y, p2.z,
        255, 0, 0, 255
      );
    }
  }
}

const sgr = new SGR();

mp.events.add("render", () => {
  if (!dev) return;

  const me = mp.players.local;
  const p = me.position;
  const maxDist = 80;

  mp.objects.forEach(obj => {
    const op = obj.position;
    const dx = op.x - p.x;
    const dy = op.y - p.y;
    const dz = op.z - p.z;
    if (Math.sqrt(dx * dx + dy * dy + dz * dz) > maxDist) return;

    sgr.box(obj);
  });
});