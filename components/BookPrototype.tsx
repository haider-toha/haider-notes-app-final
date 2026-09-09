import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Link } from "react-router";
import "./BookPrototype.css";

const STATES = [
  { label: "cover", image: "/book-test/cover.jpg", alt: "Closed green, red and gold notebook on a wooden table" },
  { label: "page 1", image: "/book-test/page-1.jpg", alt: "First handwritten page of Haider's notebook" },
  { label: "page 2", image: "/book-test/page-2.jpg", alt: "Second handwritten page of Haider's notebook" },
] as const;

type Direction = "forward" | "back";

const BookPrototype: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [turn, setTurn] = useState<{ from: number; to: number; direction: Direction } | null>(null);
  const [failedImage, setFailedImage] = useState(false);
  const pointerStart = useRef<number | null>(null);
  const timer = useRef<number | null>(null);

  const moveTo = useCallback((next: number) => {
    if (turn || next < 0 || next >= STATES.length || next === current) return;
    const direction: Direction = next > current ? "forward" : "back";
    setFailedImage(false);
    setTurn({ from: current, to: next, direction });
    timer.current = window.setTimeout(() => {
      setCurrent(next);
      setTurn(null);
    }, 760);
  }, [current, turn]);

  useEffect(() => {
    STATES.forEach(({ image }) => {
      const preload = new Image();
      preload.src = image;
    });
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        moveTo(current + 1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveTo(current - 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [current, moveTo]);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  const visible = turn?.to ?? current;
  const isCover = visible === 0;

  return (
    <main className="book-prototype">
      <template
        dangerouslySetInnerHTML={{
          __html: "<!-- THESIS: The real photographed notebook is the interface; conventional site chrome stays out of the way. OWN-WORLD: Café-dark surround, textile green and gold, real paper and restrained brass controls. STORY: Open the physical object, read the first page, then turn it once more. FIRST VIEWPORT: The closed cover occupies the centre with only an exit, state marker and quiet interaction cue. FORM: A three-state photographic object study with a spine-hinged CSS 3D turn. -->",
        }}
      />

      <header className="book-prototype__header">
        <div>
          <span className="book-prototype__name">haider's notebook</span>
          <span className="book-prototype__state" aria-live="polite">{STATES[visible].label}</span>
        </div>
        <Link className="book-prototype__close" to="/" aria-label="Close notebook prototype">
          <X aria-hidden="true" />
        </Link>
      </header>

      <section className="book-prototype__stage" aria-label="Interactive notebook preview">
        <div
          className={`book-prototype__camera ${isCover ? "is-cover" : "is-open"}`}
          onPointerDown={(event) => { pointerStart.current = event.clientX; }}
          onPointerUp={(event) => {
            if (pointerStart.current === null) return;
            const distance = event.clientX - pointerStart.current;
            pointerStart.current = null;
            if (Math.abs(distance) < 45) return;
            moveTo(current + (distance < 0 ? 1 : -1));
          }}
          onPointerCancel={() => { pointerStart.current = null; }}
        >
          <div className="book-prototype__object">
            {failedImage ? (
              <div className="book-prototype__error">This test photograph could not be loaded.</div>
            ) : (
              <img
                className="book-prototype__photo"
                src={STATES[visible].image}
                alt={STATES[visible].alt}
                draggable={false}
                onError={() => setFailedImage(true)}
              />
            )}

            {turn && (
              <div className={`book-prototype__turn is-${turn.direction}`} aria-hidden="true">
                <img src={STATES[turn.from].image} alt="" draggable={false} />
                <div className="book-prototype__paper-back" />
              </div>
            )}
          </div>

          <button
            className="book-prototype__tap-zone book-prototype__tap-zone--left"
            type="button"
            onClick={() => moveTo(current - 1)}
            disabled={current === 0 || !!turn}
            aria-label="Previous notebook state"
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <button
            className="book-prototype__tap-zone book-prototype__tap-zone--right"
            type="button"
            onClick={() => moveTo(current + 1)}
            disabled={current === STATES.length - 1 || !!turn}
            aria-label={current === 0 ? "Open notebook" : "Turn to next page"}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </section>

      <footer className="book-prototype__footer">
        <div className="book-prototype__steps" aria-label="Notebook position">
          {STATES.map((state, index) => (
            <button
              key={state.label}
              type="button"
              className={index === visible ? "is-current" : ""}
              onClick={() => moveTo(index)}
              disabled={!!turn}
              aria-label={`Go to ${state.label}`}
              aria-current={index === visible ? "step" : undefined}
            />
          ))}
        </div>
        <p>{current === 0 ? "tap the right edge to open" : current === 1 ? "tap or swipe to turn the page" : "second page"}</p>
      </footer>
    </main>
  );
};

export default BookPrototype;
