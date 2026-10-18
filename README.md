# Mechanism Database

**A library of mechanical mechanisms you can watch, turn and take apart.**

Every mechanism here is drawn live as a working drawing of a real bench assembly: bearings in their bores, shafts
with their keys and circlips, bridges, standoffs, a motor and its belt. Press play and it runs. Drag across it to
turn it by hand, tilt it from plan to side view, or explode it to see how it goes together.

**Open the library: https://gingerskull.github.io/mechanism-database/**

![A spur gear pair on the Drafting sheet: pinion and wheel on their shafts under a see-through bridge, with the base plate, mounting holes and overall dimensions](docs/images/spur-gears.png)

## What's in it

Four mechanisms are drawn so far: a four-bar linkage, a Geneva drive, a spur gear pair and a slider-crank. More are
on the way. Each one comes from a catalogue of 89 mechanisms with its own explanation, tags, examples and
references, so the drawing and the text describe the same thing.

![The Geneva drive on the Blueprint sheet, tilted and partly exploded so the drive pin, the slotted wheel and the hardware stack under it come apart](docs/images/geneva-exploded.png)

## Using a mechanism's page

![A mechanism's page: the drawing with its controls on the left, the facts and the output plot on the right](docs/images/page.png)

**The drawing and its controls**

| Control | What it does |
|---|---|
| Play / pause | Runs the mechanism through its cycle. Space does the same while the drawing has focus. |
| Cycle | Scrubs to any point in the cycle. You can also drag across the drawing, or use the arrow keys. |
| ½× 1× 2× | Playback speed. |
| View | Tilts the drawing from plan (straight down) to a side view. |
| Explode | Pulls the assembly apart along its axis, layer by layer, so you can see what sits under what. |
| Auto, Detail | On Auto, the drawing drops its finest detail by itself if your device can't keep up. Move the Detail slider to choose the level yourself. |
| Paths, Velocity, Forces, Angles | Overlays: the paths the moving points trace, their velocity, the forces through the parts, and the angles that matter. |
| Blueprint / Drafting | The sheet: white lines on blue, or pencil on paper. The site remembers your choice. |

**Around the drawing**

- **At a glance:** family, kind of motion, ratio, axes, whether it can be driven backwards, level, degrees of
  freedom and how this build is driven. Family, motion and level link to the library filtered by them.
- **The plot:** the output over one cycle, with a marker that follows the drawing.
- **Tags:** what it does, its properties and where it is used, each a link to the mechanisms that share it.
- **How it moves, Forces, Why use it, Limits:** a short explanation in four parts.
- **Where you will find it** and **In the real world:** typical uses and real products that use it.
- **References, photos, video and animations** for further reading.

On the library page, search by name, use or tag, or open Filters to narrow the set by family, motion and more.

## How it's made

Each mechanism starts from its kinematics alone. A rules engine then builds the hardware a real build would need:
bearings sized to the load, shafts and their retention, bridges over the pivots, stops, lubrication, fasteners and a
drive. Every build is checked for clashes over the whole cycle before it is drawn. The site is static: each page
loads one small package and draws it in the browser with Canvas 2D.

For contributors, the details are in [docs/architecture.md](docs/architecture.md),
[docs/mechanism-standard.md](docs/mechanism-standard.md), [docs/style-reference.md](docs/style-reference.md) and
[docs/workflow.md](docs/workflow.md).

## Running it locally

```
npm ci                    install
npm run dev               the site with live reload
npm run check             typecheck, lint, unit tests, conformance
npm run build             the static site into dist/site
npm run shot <id>         render one frame of a mechanism to a PNG
```

Work is tracked on the project board (see [docs/workflow.md](docs/workflow.md)).

## Licence

- **Code** (everything not listed below): MIT, see [LICENSE](LICENSE).
- **Content**: the catalogue (`data/catalog/`), the documents and images in `docs/`, and the drawings the site
  renders: Creative Commons Attribution-ShareAlike 4.0, see [LICENSE-CONTENT](LICENSE-CONTENT). Credit
  "Mechanism Database" with a link to this repository, and share adaptations under the same licence.

Linked references, photos and videos belong to their owners and are not covered. The IBM Plex fonts the site ships are
under the SIL Open Font License 1.1.
