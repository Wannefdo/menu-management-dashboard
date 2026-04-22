import "./MenuItemCard.css";

export default function MenuItemCard({ item, formatPrice, onEdit, onDelete }) {
  const isActive = item.status === "active";

  return (
    <article className="menuCard">
      <header className="menuCardTop">
        <h3>{item.name}</h3>
        <span className={`statusBadge ${isActive ? "active" : "inactive"}`}>
          <span className="dot" />
          {isActive ? "Active" : "Inactive"}
        </span>
      </header>

      <p className="category">{item.category}</p>
      <p className="description">{item.description || "No description provided."}</p>

      <div className="priceRow">
        <span>Price</span>
        <strong>{formatPrice(item.price)}</strong>
      </div>

      <footer className="actionsRow">
        <button className="ghostBtn" onClick={() => onEdit(item)}>
          Edit
        </button>
        <button className="dangerBtn" onClick={() => onDelete(item)}>
          Delete
        </button>
      </footer>
    </article>
  );
}