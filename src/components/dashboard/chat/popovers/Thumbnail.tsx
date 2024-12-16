import { createSignal, Show } from "solid-js";
import "./Thumbnail.css";

export default function Thumbnail(props: { file: File, flag:string, onRemove: () => void }) {
  const [previewUrl, setPreviewUrl] = createSignal<string | null>(null);

  const reader = new FileReader();
  reader.onload = (e) => {
    setPreviewUrl(e.target?.result as string);
  };
  reader.readAsDataURL(props.file);

  return (
    <div class="thumbnail-container">
      {previewUrl() && (
        <div>
          <div class="thumbnail-wrapper">
            <img 
              src={previewUrl()} 
              alt="Upload preview" 
              class={`thumbnail-image 
                ${props.flag === "inappropriate" ? 'blurred-image-lt' : ''}
                ${props.flag === "illegal" ? 'blurred-image-hvy' : ''}
                `} 
            />
            <Show when={props.flag === "illegal"}>
              <i class="fa-solid fa-lock fa-2xl attach-lock"></i>
            </Show>
            
          </div>
          <button 
            class="thumbnail-remove-btn" 
            onClick={props.onRemove}
          >
            ×
          </button> 
      </div>
      )}
    </div>
  );
};