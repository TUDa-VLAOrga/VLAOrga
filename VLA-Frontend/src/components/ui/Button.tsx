import "@/styles/Button.css"

type ButtonConfig = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
  text: React.ReactNode
};

function Button({children} : {children: ButtonConfig}){
  return (
    <>
      <button 
      onClick={children.onClick}
      >
        {children.text}
      </button>
    </>
  );
}

export { Button };
