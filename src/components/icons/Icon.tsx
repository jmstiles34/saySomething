import "./Icon.css"

type IconProps = {
  children: any,
  size?: 'sm' | 'md' | 'lg'
}

export default function Icon(props:IconProps) {
  return (      
    <div class="icon-background">
      {props.children}
    </div>
  );
}