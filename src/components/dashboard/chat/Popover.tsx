import "./Popover.css";

export default function Popover(props:any) {
  return (
    <div class="popover">
      {props.children}
    </div>
  )
}