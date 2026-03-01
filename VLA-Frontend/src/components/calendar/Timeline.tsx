import type { Appointment } from "@/lib/databaseTypes";

type Props = {
  /** Timed events for a single day column. */
  events: Appointment[];
  /** First visible hour (inclusive). */
  startHour?: number;
  /** Last visible hour boundary (exclusive for rows; used as end boundary). */
  endHour?: number;
  onEventClick?: (event: Appointment) => void;
  getEventColor?: (event: Appointment) => string | undefined;
};

const timeFmt = new Intl.DateTimeFormat("de-DE", {
  hour: "2-digit",
  minute: "2-digit",
});

/**
 * Convert a Date to minutes relative to the visible start hour.
 * Example: startHour=7, date=08:30 -> 90
 */
function minutesSinceStartHour(d: Date, startHour: number): number {
  return d.getHours() * 60 + d.getMinutes() - startHour * 60;
}

type TimedItem = {
  event: Appointment;
  start: number; // clamped minutes since startHour
  end: number; // clamped minutes since startHour
  rawStart: number; // unclamped
  rawEnd: number; // unclamped
};

type PositionedItem = {
  item: TimedItem;
  col: number;
  colCount: number;
};

/**
 * Layout events into columns for each overlap cluster.
 * - Builds overlap clusters by time scanning
 * - Assigns each event the first free column (greedy)
 * - Uses the max simultaneous columns in that cluster as width divisor
 */
function layoutOverlaps(items: TimedItem[]): PositionedItem[] {
  const sorted = [...items].sort((a, b) => a.start - b.start || a.end - b.end);
  // 1) Build overlap clusters: a new cluster starts when the next event starts
  // after (or at) the current cluster's max end.
  const clusters: TimedItem[][] = [];
  let cluster: TimedItem[] = [];
  let clusterMaxEnd = -Infinity;

  for (const it of sorted) {
    if (cluster.length === 0) {
      cluster = [it];
      clusterMaxEnd = it.end;
      continue;
    }
    if (it.start >= clusterMaxEnd) {
      clusters.push(cluster);
      cluster = [it];
      clusterMaxEnd = it.end;
    } else {
      cluster.push(it);
      clusterMaxEnd = Math.max(clusterMaxEnd, it.end);
    }
  }
  if (cluster.length) clusters.push(cluster);

  // 2) For each cluster, assign columns greedily
  const positioned: PositionedItem[] = [];

  for (const cl of clusters) {
    const colEnds: number[] = [];
    const temp: { it: TimedItem; col: number }[] = [];

    for (const it of cl) {
      // find first column that is free (end <= start)
      let col = colEnds.findIndex((end) => end <= it.start);
      if (col === -1) {
        col = colEnds.length;
        colEnds.push(it.end);
      } else {
        colEnds[col] = it.end;
      }
      temp.push({ it, col });
    }

    const colCount = colEnds.length;
    for (const t of temp) positioned.push({ item: t.it, col: t.col, colCount });
  }

  return positioned;
}

/**
 * Timeline renders hour grid lines (always visible) and positions time-based events.
 *
 * Visible window is [startHour, endHour] as a boundary (e.g. 07:00–22:00).
 * We render (endHour - startHour) hour rows (7–8 ... 21–22).
 * - Events are clamped to the visible window so they never overflow the column.
 * - Overlapping events are split horizontally using `layoutOverlaps`.
 */
export default function Timeline({
  events,
  startHour = 7,
  endHour = 22,
  onEventClick,
  getEventColor,
}: Props) {
  const minutesVisible = (endHour - startHour) * 60;

  /**
   * Convert events into numeric start/end minutes and clamp them to the visible window.
   * This prevents events starting before 07:00 or ending after 22:00 from rendering outside.
   */
  const timed: TimedItem[] = events
    .filter((e) => e.start && e.end)
    .map((e) => {
      const rawStart = minutesSinceStartHour(e.start, startHour);
      const rawEnd = minutesSinceStartHour(e.end, startHour);

      // Clamp to [0, minutesVisible]
      const start = Math.max(0, Math.min(minutesVisible, rawStart));
      const end = Math.max(0, Math.min(minutesVisible, rawEnd));

      return { event: e, start, end, rawStart, rawEnd };
    })
    // Keep events that intersect the visible window and have positive duration
    .filter(
      (e) => e.rawEnd > 0 && e.rawStart < minutesVisible && e.end > e.start
    );

  const positioned = layoutOverlaps(timed);

  return (
    <div className="cv-timeline">
      {/* Hour grid lines: must exist even when there are 0 events */}
      <div className="cv-timeline-grid" aria-hidden="true">
        {Array.from({ length: Math.max(0, endHour - startHour) }).map(
          (_, i) => (
            <div key={i} className="cv-timeline-hour" />
          )
        )}
      </div>

      <div className="cv-timeline-events">
        {positioned.map(({ item, col, colCount }) => {
          const { event, start, end } = item;

          const top = (start / minutesVisible) * 100;
          const height = ((end - start) / minutesVisible) * 100;

          /**
           * Apply "short event" classes based on duration after clamping in CalenandarView.css:
           *   cv-event-short     (< 90 min)
           *   cv-event-veryShort (< 60 min)
           */
          const durationMin = Math.max(0, end - start);
          const gutterPx = 6;
          const widthPct = 100 / colCount;
          const leftPct = col * widthPct;

          const color = getEventColor?.(event) ?? event.series?.lecture?.color;
          const title = event.series?.name ?? "Termin";

          const shortClass =
            durationMin < 60
              ? "cv-event-veryShort"
              : durationMin < 90
                ? "cv-event-short"
                : "";

          return (
            <div
              key={event.id}
              className={`cv-timeline-event ${shortClass}`}
              style={{
                top: `${top}%`,
                height: `${height}%`,
                left: `calc(${leftPct}% + ${gutterPx / 2}px)`,
                width: `calc(${widthPct}% - ${gutterPx}px)`,
                backgroundColor: color ?? undefined,
                borderColor: color ?? undefined,
              }}
              onClick={onEventClick ? () => onEventClick(event) : undefined}
              title={`${title} (${timeFmt.format(event.start)} – ${timeFmt.format(
                event.end
              )})`}
            >
              <div className="cv-timeline-event-title">{title}</div>

              <div className="cv-timeline-event-time">
                {timeFmt.format(event.start)} – {timeFmt.format(event.end)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
