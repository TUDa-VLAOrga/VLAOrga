type ColorPickerProps = {
  selectedColor: string;
  onColorChange: (color: string) => void;
  colors?: string[];
};

const DEFAULT_COLOR_PALETTE = [
  "#3b82f6", // Blau
  "#10b981", // Grün
  "#f59e0b", // Orange
  "#8b5cf6", // Lila
  "#ef4444", // Rot
  "#06b6d4", // Cyan
  "#f97316", // Orange-Rot
  "#84cc16", // Lime
  "#ec4899", // Pink
  "#6366f1", // Indigo
];

export default function ColorPicker({
  selectedColor,
  onColorChange,
  colors = DEFAULT_COLOR_PALETTE,
}: ColorPickerProps) {
  return (
    <div className="cv-colorPicker">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          className={`cv-colorBtn ${selectedColor === color ? "active" : ""}`}
          style={{ backgroundColor: color }}
          onClick={() => onColorChange(color)}
          aria-label={`Farbe ${color}`}
        />
      ))}
    </div>
  );
}