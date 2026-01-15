import { createContext } from "react";

export type MousePosition = {
    x: number,
    y: number,
}

export const MouseContext = createContext<MousePosition>({ x: 0, y: 0 });
