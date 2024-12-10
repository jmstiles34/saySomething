import "./Modal.css";

export default function Modal(props:any) {
  return (
    <div class={`modal-wrapper ${props.modal ? 'show-modal' : ''}`} 
          onClick={() => props.setModal(null)}>
        <div class="close-icon-wrapper">
          <button class="close-icon" onClick={() => props.setModal(null)}>
            <i class="fa-solid fa-xmark fa-xl"></i>
          </button>
        </div>
        <div class="modal-container" onClick={(e) => e.stopPropagation()}>
          {props.children}
        </div>
      </div>
  )
}