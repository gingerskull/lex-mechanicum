// The axis a hardware primitive is made on (src/hardware): z of the base (the default: a plate lying on the base), or x
// or y (a shaft in plan, a disc standing on edge). Its outline lies in the plane normal to the axis:
//
//   axis z: local (u, v) -> world (x, y), the extent along the axis is z;
//   axis x: local (u, v) -> world (y, z), the extent along the axis is x;
//   axis y: local (u, v) -> world (x, z), the extent along the axis is y.
//
// The builder carries every primitive onto its joint's frame (src/builder/frames.ts), so most are made on z.

export type Axis = "z" | "x" | "y";
export type Vec3 = [number, number, number];
