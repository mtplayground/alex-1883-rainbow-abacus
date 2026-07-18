import { expect, test } from "@playwright/test";

const BEADS = [
  "Red",
  "Orange",
  "Amber",
  "Yellow",
  "Lime",
  "Green",
  "Teal",
  "Blue",
  "Indigo",
  "Violet",
] as const;

const SPOKEN_TOTALS = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
] as const;

type AbacusE2EEvent = Readonly<{
  src?: string;
  text?: string;
  type: "media-play" | "speech";
}>;

declare global {
  interface Window {
    __abacusE2EEvents: AbacusE2EEvent[];
  }
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.__abacusE2EEvents = [];

    class MockSpeechSynthesisUtterance {
      lang = "";
      pitch = 1;
      rate = 1;
      volume = 1;

      constructor(public text: string) {}
    }

    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: MockSpeechSynthesisUtterance,
    });

    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        cancel: () => undefined,
        speak: (utterance: MockSpeechSynthesisUtterance) => {
          window.__abacusE2EEvents.push({
            text: utterance.text,
            type: "speech",
          });
        },
      },
    });

    window.HTMLMediaElement.prototype.play = function play() {
      window.__abacusE2EEvents.push({
        src: this.currentSrc || this.src,
        type: "media-play",
      });

      return Promise.resolve();
    };
  });
});

test("counts all ten beads and triggers spoken totals, sounds, and celebration", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByLabel("Running total: 0 of 10 beads counted")).toBeVisible();

  for (const [index, bead] of BEADS.entries()) {
    const position = index + 1;

    await page
      .getByRole("button", {
        name: `${bead} bead ${position} of 10, waiting side`,
      })
      .click();

    await expect(
      page.getByLabel(`Running total: ${position} of 10 beads counted`),
    ).toBeVisible();
    await expect(
      page.getByRole("button", {
        name: `${bead} bead ${position} of 10, counted side`,
      }),
    ).toHaveAttribute("aria-pressed", "true");
  }

  await expect(
    page.getByRole("status", { name: "All ten beads counted" }),
  ).toBeVisible();
  await expect(page.getByText("You did it!")).toBeVisible();

  const events = await page.evaluate(() => window.__abacusE2EEvents);
  const spokenTotals = events
    .filter((event) => event.type === "speech")
    .map((event) => event.text);
  const playedSources = events
    .filter((event) => event.type === "media-play")
    .map((event) => event.src ?? "");

  expect(spokenTotals).toEqual(SPOKEN_TOTALS);
  expect(playedSources.filter((src) => src.includes("bead-click"))).toHaveLength(10);
  expect(playedSources.some((src) => src.includes("reach-ten-celebration"))).toBe(true);
});
