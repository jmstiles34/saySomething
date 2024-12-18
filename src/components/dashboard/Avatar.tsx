import "./Avatar.css"

type AvatarProps = {
  children: any,
  size?: 'sm' | 'md' | 'lg'
}

export default function Avatar(props:AvatarProps) {
  return (      
    <div class={`avatar-background ${props.size}`}>
      {props.children}
    </div>
  );
}