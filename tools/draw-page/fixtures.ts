// The drawing page with the fixture scenes (tests/fixtures/scenes.ts) registered as models, for tools that draw them
// (openChrome({ fixtures: true })). A separate entry, so the thumbnails' fingerprint never reads the fixtures.
import { models } from "../../src/mechanisms/models";
import { scenes } from "../../tests/fixtures/scenes";
import "./main";

for (const [id, s] of Object.entries(scenes)) models[id] = () => Promise.resolve(s.model);
