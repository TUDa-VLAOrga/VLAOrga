type ButtonConfig = {
  onClickEvent?(): void
  text?: React.ReactNode
}

function Button({children,} : {children: ButtonConfig},){
  return (
    <>
      <button onClick={children.onClickEvent}>{children.text}</button>
    </>
  )
}

export { Button, }
