import { useEffect, useState } from "react";
import "./MenuItemModal.css";

const defaultForm = {
  name: "",
  category: "",
  description: "",
  price: "",
  status: "active",
};

export default function MenuItemModal({
  isOpen,
  categories,
  initialData,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        category: initialData.category || "",
        description: initialData.description || "",
        price: String(initialData.price ?? ""),
        status: initialData.status || "active",
      });
    } else {
      setFormData(defaultForm);
    }
    setErrors({});
    setIsSubmitting(false);
  }, [initialData, isOpen]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!formData.category) {
      nextErrors.category = "Category is required.";
    }

    const numericPrice = Number(formData.price);
    if (!formData.price) {
      nextErrors.price = "Price is required.";
    } else if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      nextErrors.price = "Price must be a positive number.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      description: formData.description.trim(),
      price: Number(formData.price),
      status: formData.status,
    };

    await new Promise((resolve) => setTimeout(resolve, 700)); // loading simulation
    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="overlay" role="presentation">
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-modal-title"
      >
        <header className="modalHeader">
          <h2 id="menu-modal-title">
            {isEditing ? "Edit Menu Item" : "Add Menu Item"}
          </h2>
        </header>

        <form className="modalForm" onSubmit={submitForm} noValidate>
          <label>
            Name *
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              aria-invalid={!!errors.name}
            />
            {errors.name && <small className="errorText">{errors.name}</small>}
          </label>

          <label>
            Category *
            <select
              value={formData.category}
              onChange={(e) => updateField("category", e.target.value)}
              aria-invalid={!!errors.category}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option value={cat} key={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <small className="errorText">{errors.category}</small>
            )}
          </label>

          <label>
            Description
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </label>

          <label>
            Price (LKR) *
            <input
              type="number"
              min="1"
              step="1"
              value={formData.price}
              onChange={(e) => updateField("price", e.target.value)}
              aria-invalid={!!errors.price}
            />
            {errors.price && <small className="errorText">{errors.price}</small>}
          </label>

          <label className="toggleRow">
            <span>Status</span>
            <button
              type="button"
              className={`toggle ${formData.status === "active" ? "on" : "off"}`}
              onClick={() =>
                updateField(
                  "status",
                  formData.status === "active" ? "inactive" : "active"
                )
              }
              aria-label="Toggle item status"
            >
              <span />
              {formData.status === "active" ? "Active" : "Inactive"}
            </button>
          </label>

          <footer className="modalActions">
            <button type="button" className="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="solid" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update Item" : "Add Item"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}