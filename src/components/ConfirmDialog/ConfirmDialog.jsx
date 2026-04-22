import "./ConfirmDialog.css";

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="confirmOverlay" role="presentation">
      <section
        className="confirmBox"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <h3 id="confirm-title">{title}</h3>
        <p>{message}</p>
        <div className="confirmActions">
          <button className="cancelBtn" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="confirmBtn" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </section>
    </div>
  );
}