import type {
  CalendarDay,
  CalendarEvent,
  CalendarEventsByDateISO
} from "./CalendarTypes";

type Props = {
  days: CalendarDay[];
  eventsByDate: CalendarEventsByDateISO;
  startHour?: number;
  endHour?: number;
  onEventClick?: (event: CalendarEvent) => void;
  getEventColor?: (event: CalendarEvent) => string | undefined;
};

function parseTimeToMinutes(time?: string) {
  if (!time) return undefined;
  const [hh, mm] = time.split(":").map((s) => parseInt(s, 10));
  if (Number.isNaN(hh) || Number.isNaN(mm)) return undefined;
  return hh * 60 + mm;
}

export default function TimelineColumn({
  days,
  eventsByDate,
  startHour = 7,
  endHour = 22,
  onEventClick,
  getEventColor,
}: Props) {
  const hours = [] as number[];
  for (let h = startHour; h < endHour; h++) hours.push(h);

  return (
    <div className="cv-timelineColumn">
      {hours.map((h) => {
        const slotStart = h * 60;
        const slotEnd = (h + 1) * 60;

        const slotEvents: CalendarEvent[] = [];
        days.forEach((day) => {
          const events = eventsByDate[day.iso] || [];
          events.forEach((ev) => {
            const s = parseTimeToMinutes(ev.displayedStartTime);
            const e = parseTimeToMinutes(ev.displayedEndTime);
            if (s === undefined || e === undefined) return;
            if (e > slotStart && s < slotEnd) {
              slotEvents.push(ev);
            }
          });
        });

        return (
          <div key={h} className="cv-timelineSlot">
            <div className="cv-timelineSlotContent">
              {slotEvents.map((ev) => {
                const customColor = getEventColor?.(ev);
                return (
                  <div
                    key={`${ev.id}-${h}`}
                    className="cv-timelinePill"
                    style={
                      customColor
                        ? {
                          backgroundColor: customColor,
                          borderColor: customColor,
                        }
                        : undefined
                    }
                    onClick={() => onEventClick?.(ev)}
                    title={ev.title}
                  >
                    <div className="cv-timelinePillTitle">{ev.title}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
