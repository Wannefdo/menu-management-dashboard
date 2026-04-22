import { useMemo, useState } from "react";
import { categories, mockServices } from "../../data/mockData";
import SearchBar from "../SearchBar/SearchBar";
import CategoryFilter from "../CategoryFilter/CategoryFilter";
import MenuItemCard from "../MenuItemCard/MenuItemCard";
import MenuItemModal from "../MenuItemModal/MenuItemModal";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import "./Dashboard.css";

const formatLkr = (amount) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function Dashboard({ theme, onToggleTheme }) {
  const [menuItems, setMenuItems] = useState(mockServices);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(term);
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [menuItems, searchTerm, selectedCategory]);

  const totalActive = useMemo(
    () => menuItems.filter((item) => item.status === "active").length,
    [menuItems]
  );

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleSaveItem = (payload) => {
    if (editingItem) {
      setMenuItems((prev) =>
        prev.map((item) => (item.id === editingItem.id ? { ...item, ...payload } : item))
      );
    } else {
      const nextId = menuItems.length
        ? Math.max(...menuItems.map((item) => item.id)) + 1
        : 1;

      setMenuItems((prev) => [...prev, { id: nextId, ...payload }]);
    }

    closeModal();
  };

  const requestDelete = (item) => setDeleteTarget(item);
  const cancelDelete = () => setDeleteTarget(null);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setMenuItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <main className="appShell">
      <section className="container dashboard">
        <header className="dashboardHeader">
          <div>
            <h1>Menu Management</h1>
            <p>
              Manage restaurant items, pricing, and availability from one place.
            </p>
          </div>

          <div className="headerActions">
            <button
              type="button"
              className="themeBtn"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              <span className="themeLabel">{theme === "dark" ? "Dark" : "Light"}</span>
              <span className={`themeSwitch ${theme === "light" ? "on" : ""}`}>
                <span className="themeKnob" aria-hidden="true" />
              </span>
            </button>

            <button className="primaryBtn" onClick={openAddModal}>
              + Add Menu Item
            </button>
          </div>
        </header>

        <section className="statsRow" aria-label="Dashboard summary">
          <article className="statCard">
            <span>Total Items</span>
            <strong>{menuItems.length}</strong>
          </article>
          <article className="statCard">
            <span>Active Items</span>
            <strong>{totalActive}</strong>
          </article>
          <article className="statCard">
            <span>Inactive Items</span>
            <strong>{menuItems.length - totalActive}</strong>
          </article>
        </section>

        <section className="controlsRow">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <CategoryFilter
            value={selectedCategory}
            onChange={setSelectedCategory}
            categories={categories}
          />
        </section>

        {filteredItems.length === 0 ? (
          <section className="emptyState" aria-live="polite">
            <h2>No menu items found</h2>
            <p>Try changing your search or category filter.</p>
          </section>
        ) : (
          <section className="menuGrid">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                formatPrice={formatLkr}
                onEdit={openEditModal}
                onDelete={requestDelete}
              />
            ))}
          </section>
        )}
      </section>

      {isModalOpen && (
        <MenuItemModal
          isOpen={isModalOpen}
          categories={categories}
          initialData={editingItem}
          onClose={closeModal}
          onSave={handleSaveItem}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          isOpen={!!deleteTarget}
          title="Delete Menu Item"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </main>
  );
}