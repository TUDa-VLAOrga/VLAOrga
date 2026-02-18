import "@/styles/Button.css"

type ButtonConfig = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
  text: React.ReactNode,
  backgroundColor?: string,
};

function Button({children} : {children: ButtonConfig}){
  return (
    <>
      <button 
      onClick={children.onClick}
      style={{
        backgroundColor: children.backgroundColor || "#0d6efd",
      }}
      >
        {children.text}
      </button>
    </>
  );
}

export { Button };
