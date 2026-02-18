import "@/styles/Button.css";

const defaultBackgroundColor = "#0d6efd";
const defaultMarginBottom = "10px";

type ButtonConfig = {
  text: React.ReactNode,
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
  backgroundColor?: string,
  marginBottom?: string,
  cursor?: string,
  title?: string
};

function Button({text, onClick, backgroundColor, marginBottom, cursor, title} : ButtonConfig){
  return (
    <>
      <button 
        className="classicButton"
        onClick={onClick}
        style={{
          backgroundColor: backgroundColor || defaultBackgroundColor,
          marginBottom: marginBottom || defaultMarginBottom,
          cursor: cursor || "pointer",
        }}
        title={title}
      >
        {text}
      </button>
    </>
  );
}

export { Button };