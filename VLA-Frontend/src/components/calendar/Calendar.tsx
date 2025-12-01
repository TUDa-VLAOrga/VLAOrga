import React, { useMemo, useState } from "react";

function startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}
function endOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
function addMonths(date: Date, months: number) {
    return new Date(date.getFullYear(), date.getMonth() + months, 1);
}
function isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

const weekDayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar: React.FC = () => {
    const [viewDate, setViewDate] = useState(() => startOfMonth(new Date()));
    const [selected, setSelected] = useState<Date | null>(null);

    const monthMatrix = useMemo(() => {
        const start = startOfMonth(viewDate);
        const end = endOfMonth(viewDate);

        const firstDayIndex = start.getDay();
        const firstShown = new Date(start);
        firstShown.setDate(start.getDate() - firstDayIndex);

        const weeks: Date[][] = [];
        let current = new Date(firstShown);
        for (let week = 0; week < 6; week++) {
            const weekRow: Date[] = [];
            for (let day = 0; day < 7; day++) {
                weekRow.push(new Date(current));
                current.setDate(current.getDate() + 1);
            }
            weeks.push(weekRow);
        }
        return weeks;
    }, [viewDate]);

    const today = new Date();

    return (
        <div style={{ padding: 16, fontFamily: "system-ui, sans-serif", maxWidth: 720, margin: "0 auto" }}>

            {/* Header */}
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                    <button onClick={() => setViewDate((d) => addMonths(d, -1))} style={{ marginRight: 8 }}>
                        ◀
                    </button>
                    <button onClick={() => setViewDate((d) => addMonths(d, 1))}>
                        ▶
                    </button>
                </div>
                <h2 style={{ margin: 0 }}>
                    {viewDate.toLocaleString(undefined, { month: "long" })} {viewDate.getFullYear()}
                </h2>
                <div>
                    <button onClick={() => setViewDate(startOfMonth(new Date()))} style={{ marginRight: 8 }}>
                        Today
                    </button>
                    <button onClick={() => setSelected(null)}>Clear</button>
                </div>
            </header>

            {/* Calendar Grid */}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        {weekDayLabels.map((d) => (
                            <th key={d} style={{ textAlign: "center", padding: 8, color: "#666", fontWeight: 600 }}>
                                {d}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {monthMatrix.map((week, i) => (
                        <tr key={i}>
                            {week.map((day) => {
                                const isCurrentMonth = day.getMonth() === viewDate.getMonth();
                                const isToday = isSameDay(day, today);
                                const isSelected = selected ? isSameDay(day, selected) : false;
                                return (
                                    <td
                                        key={day.toISOString()}
                                        onClick={() => setSelected(new Date(day))}
                                        style={{
                                            padding: 8,
                                            height: 80,
                                            verticalAlign: "top",
                                            border: "1px solid #eee",
                                            background: isSelected ? "#0b5cff22" : "transparent",
                                            color: isCurrentMonth ? "#000" : "#999",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        }}>
                                            <span style={{ fontWeight: isToday ? 700 : 500 }}>{day.getDate()}</span>
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            <footer style={{ marginTop: 12 }}>
                Selected: {selected ? selected.toLocaleDateString() : "—"}
            </footer>
        </div>
    );
};

export default Calendar;
