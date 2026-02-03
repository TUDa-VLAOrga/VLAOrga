import type { CalendarEvent } from "./CalendarTypes";

type Props = {
  events: CalendarEvent[];
  onEventClick?: (e: CalendarEvent) => void;
  getEventColor?: (e: CalendarEvent) => string | undefined;
  startHour?: number;
  endHour?: number;
};

function parseTimeToMinutes(time?: string) {
  if (!time) return null;
  const parts = time.split(":");
  if (parts.length < 2) return null;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

function makeUnionFind(n: number) {
  const p = new Array(n).fill(0).map((_, i) => i);
  function find(a: number) {
    if (p[a] === a) return a;
    p[a] = find(p[a]);
    return p[a];
  }
  function union(a: number, b: number) {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) p[rb] = ra;
  }
  return { find, union };
}

export default function Timeline({
  events,
  onEventClick,
  getEventColor,
  startHour = 7,
  endHour = 22,
}: Props) {
  const totalMinutes = (endHour - startHour) * 60;

  const items = events
    .map((ev, idx) => {
      const s = parseTimeToMinutes(ev.displayedStartTime);
      const e = parseTimeToMinutes(ev.displayedEndTime);
      return { ev, idx, s, e };
    })
    .filter((x) => x.s != null && x.e != null) as {
    ev: CalendarEvent;
    idx: number;
    s: number;
    e: number;
  }[];

  const uf = makeUnionFind(items.length);
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (items[i].s < items[j].e && items[j].s < items[i].e) {
        uf.union(i, j);
      }
    }
  }

  const groups = new Map<number, typeof items>();
  items.forEach((it, i) => {
    const root = uf.find(i);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root)!.push(it);
  });

  const layoutByEventId = new Map<
    string,
    { top: number; height: number; leftPct: number; widthPct: number }
  >();

  groups.forEach((groupItems) => {
    groupItems.sort((a, b) => a.s - b.s || b.e - b.s - (a.e - a.s));

    const columnsEnd: number[] = [];
    const assigned: { item: (typeof groupItems)[number]; col: number }[] = [];

    groupItems.forEach((it) => {
      let placed = false;
      for (let c = 0; c < columnsEnd.length; c++) {
        if (columnsEnd[c] <= it.s) {
          columnsEnd[c] = it.e;
          assigned.push({ item: it, col: c });
          placed = true;
          break;
        }
      }
      if (!placed) {
        columnsEnd.push(it.e);
        assigned.push({ item: it, col: columnsEnd.length - 1 });
      }
    });

    const totalCols = columnsEnd.length || 1;

    assigned.forEach(({ item, col }) => {
      const clampedStart = Math.max(item.s, startHour * 60);
      const clampedEnd = Math.min(item.e, endHour * 60);
      if (clampedEnd <= clampedStart) return;

      const top = ((clampedStart - startHour * 60) / totalMinutes) * 100;
      const height = ((clampedEnd - clampedStart) / totalMinutes) * 100;
      const leftPct = (col / totalCols) * 100;
      const widthPct = (1 / totalCols) * 100;

      layoutByEventId.set(item.ev.id, { top, height, leftPct, widthPct });
    });
  });

  const hours = [] as number[];
  for (let h = startHour; h <= endHour; h++) hours.push(h);

  return (
    <div className="cv-timeline" role="list">
      <div className="cv-timeline-grid">
        {hours.map((h) => (
          <div key={h} className="cv-timeline-hour">
            <div className="cv-timeline-hour-label">{`${String(h).padStart(2, "0")}:00`}</div>
            <div className="cv-timeline-hour-line" />
          </div>
        ))}
      </div>

      <div className="cv-timeline-events">
        {events.map((ev) => {
          const layout = layoutByEventId.get(ev.id);
          if (!layout) {
            return (
              <div
                key={ev.id}
                className="cv-timeline-event cv-timeline-event-untimed"
                title={ev.title}
              >
                <div className="cv-timeline-event-title">
                  {ev.shortTitle ?? ev.title}
                </div>
              </div>
            );
          }

          const bg = getEventColor?.(ev);

          return (
            <div
              key={ev.id}
              className="cv-timeline-event"
              style={{
                top: `${layout.top}%`,
                height: `${layout.height}%`,
                left: `calc(${layout.leftPct}% + 4px)`,
                width: `calc(${layout.widthPct}% - 6px)`,
                backgroundColor: bg ?? undefined,
                borderColor: bg ?? undefined,
              }}
              onClick={onEventClick ? () => onEventClick(ev) : undefined}
              title={ev.title}
            >
              <div className="cv-timeline-event-title">{ev.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
