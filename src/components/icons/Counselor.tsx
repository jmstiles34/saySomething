import { createEffect, createSignal } from "solid-js";

export default function Counselor(props:{head?:string, body?:string}) {
  const [headColor, setHeadColor] = createSignal("#D8A57B");
  const [bodyColor, setBodyColor] = createSignal("#7BC63F");
  
  createEffect(() => {
    if(props.head){
      setHeadColor(props.head);
    }
    if(props.body){
      setBodyColor(props.body);
    }
  });

  return (
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 461.367 461.367">
      <path style={`fill:${bodyColor()};`} d="M373.88,367.988c0,0.037,0,0.075,0,0.122c-37.818,34.295-88.019,55.185-143.083,55.185
        c-55.073,0-105.275-20.89-143.092-55.185c0-0.047,0-0.084,0-0.122c0-57.04,33.377-106.277,81.659-129.256
        c18.145,18.098,39.391,27.85,61.434,27.85c22.052,0,43.288-9.752,61.443-27.85C340.521,261.711,373.88,310.947,373.88,367.988z
        "/>
      <path style={`fill:${headColor()};`} d="M230.797,58.571c43.71,0,79.148,35.429,79.148,79.139c0,43.719-35.438,103.504-79.148,103.504
        s-79.148-59.785-79.148-103.504C151.649,94,187.087,58.571,230.797,58.571z"/>
    </svg>
  );
};