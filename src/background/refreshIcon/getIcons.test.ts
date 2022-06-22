import fs from "node:fs/promises";
import path from "node:path";

import manifest from "../../../public/manifest.json";
import getIcons from "./getIcons";

const DEFAULT_ICONS = manifest.browser_action.default_icon;
const EXPECTED_SIZES = Object.keys(DEFAULT_ICONS);

describe.each`
  flavor       | hasAnnouncement
  ${"default"} | ${false}
  ${"active"}  | ${false}
  ${"warning"} | ${false}
  ${"default"} | ${true}
  ${"active"}  | ${true}
  ${"warning"} | ${true}
`(
  "with flavor $flavor and hasAnnouncement $hasAnnouncement",
  ({ flavor, hasAnnouncement }) => {
    it("returns expected keys", () => {
      expect(getIcons(flavor, hasAnnouncement)).toEqual(
        Object.fromEntries(
          EXPECTED_SIZES.map((size) => [size, expect.any(String)])
        )
      );
    });

    it.each(EXPECTED_SIZES)(
      "returns an existing file for the size %s",
      async (size) => {
        const filename = getIcons(flavor, hasAnnouncement)[size];
        await expect(
          fs.access(path.join(__dirname, "../../../public", filename))
        ).resolves.toEqual(undefined);
      }
    );
  }
);

it("returns default icons when flavor is normal and hasAnnouncement false", () => {
  expect(getIcons("default", false)).toEqual(DEFAULT_ICONS);
});
