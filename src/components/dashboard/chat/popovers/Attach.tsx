import { createSignal, For, Show } from "solid-js";
import "./Attach.css";
import Thumbnail from "./Thumbnail";
import { Attachment } from "../../../../common/types/types";

export default function Attach(props:any) {
  const [attachments, setAttachments] = createSignal<Attachment[]>([]);

  const handleFileSelect = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const filesAsArray = Array.from(input.files);
      const newFiles = filesAsArray.map((f) => { return {file: f, flagged: "safe"}});
      console.log(newFiles)
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (fileToRemove: File) => {
    setAttachments(prev => 
      prev.filter(a => a.file !== fileToRemove)
    );
  };

  const submitAttachments = () => {
    // Here you would typically send attachments to your backend
    console.log('Submitting attachments:', attachments());
    
    // Reset after submission
    setAttachments([]);
  };

  const handleFlagChange = (a:Attachment, flag:string) => {
    const updatedFiles = attachments().map((att) => {
      if( att !== a ) return att;
      
      return {...a, flagged: flag}
    })

    setAttachments(updatedFiles);
  }

  return (
    <div class="attach-wrapper">                
      
      <Show when={attachments().length > 0}>
        <div class="thumbnails-container">
          <For each={attachments()}>
            {(a, idx) => (
              <div class="thumbnail-row">
                <Thumbnail 
                  file={a.file}
                  flag={a.flagged} 
                  onRemove={() => removeAttachment(a.file)} 
                />
                <div class="radio-group">
                  <div class="radio-option">
                    <input 
                      type="radio" 
                      id="safe" 
                      name={`group-${idx()}`} 
                      value="safe"
                      checked={a.flagged === 'safe'}
                      onChange={() => handleFlagChange(a, 'safe')}
                    />
                    <label for="safe" class="safe-label">Safe</label>
                  </div>
                  
                  <div class="radio-option">
                    <input 
                      type="radio" 
                      id="inappropriate" 
                      name={`group-${idx()}`} 
                      value="inappropriate"
                      checked={a.flagged === 'inappropriate'}
                      onChange={() => handleFlagChange(a, 'inappropriate')}
                    />
                    <label for="inappropriate" class="inappropriate-label">Inappropriate</label>
                  </div>
                  
                  <div class="radio-option">
                    <input 
                      type="radio" 
                      id="illegal" 
                      name={`group-${idx()}`} 
                      value="illegal"
                      checked={a.flagged === 'illegal'}
                      onChange={() => handleFlagChange(a, 'illegal')}
                    />
                    <label for="illegal" class="illegal-label">Illegal</label>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>

      <Show when={attachments().length === 0}>
        <label for="file-hidden" class="file-label">Choose File(s)</label>
        <input type="file" id="file-hidden" name="hidden-file" multiple onChange={handleFileSelect}/>
      </Show>
      

      <div class="attach-actions">
        <button class="attach-cancel" onClick={props.cancelClick}>
          Cancel
        </button>

        <button class="attach-submit" onClick={submitAttachments} disabled={attachments().length === 0}>
          Attach
        </button>
      </div>
    </div>
  )
}