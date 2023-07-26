const notification = (props) => {
    if (props){
      const style = {
        "border": "solid",
        "color": props.colour,
        "paddingLeft": "10px"
      }
      return (
        <div style={style}>
          <p>{props.text}</p>
        </div>
      )
    }
}

export default notification