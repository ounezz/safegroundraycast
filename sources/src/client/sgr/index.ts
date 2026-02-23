class SGR {
    public ground(obj: ObjectMp): void {
        const groundZ = mp.game.gameplay.getGroundZFor3DCoord(
            obj.position.x,
            obj.position.y,
            obj.position.z,
            false,
            false
        );

        if (groundZ !== 0) {
            obj.position = new mp.Vector3(obj.position.x, obj.position.y, groundZ);
            obj.rotation = new mp.Vector3(90, 0, 0);
        }
    }
}
