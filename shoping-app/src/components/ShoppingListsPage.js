import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchShoppingLists,
  fetchArchivedShoppingLists,
  addShoppingList,
  deleteShoppingList,
  toggleArchiveStatus,
} from "../api";
import { useUser } from "./UserSwitcher";
import "./ShoppingListsPage.css";
import { Bar } from "react-chartjs-2";

const ShoppingListsPage = () => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [overview, setOverview] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [listToDelete, setListToDelete] = useState(null);
  const [isArchivedView, setIsArchivedView] = useState(false);
  const { currentUser } = useUser();

  useEffect(() => {
    const loadShoppingLists = async () => {
      if (!currentUser) return;

      try {
        const response = isArchivedView
          ? await fetchArchivedShoppingLists(currentUser.id)
          : await fetchShoppingLists(currentUser.id);

        const lists = response.data.shoppingLists.map((list) => ({
          id: list._id,
          title: list.title,
          isArchived: list.isArchived,
        }));
        setShoppingLists(lists);
        setOverview(lists.map((list) => ({ title: list.title, totalItems: list.totalItems || 0 })));
      } catch (error) {
        console.error("Failed to fetch shopping lists", error);
      }
    };

    loadShoppingLists();
  }, [currentUser, isArchivedView]);

  const data = {
    labels: overview.map((list) => list.title),
    datasets: [
      {
        label: "Počet položek",
        data: overview.map((list) => list.totalItems),
        backgroundColor: "#36A2EB",
      },
    ],
  };

  const handleAddList = async () => {
    if (!newListTitle.trim()) {
      alert("Název seznamu nesmí být prázdný.");
      return;
    }

    try {
      const response = await addShoppingList(newListTitle, currentUser.id);
      setShoppingLists([
        ...shoppingLists,
        { id: response.data.shoppingListId, title: newListTitle, isArchived: false },
      ]);
      setNewListTitle("");
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to add shopping list", error);
    }
  };

  const handleDeleteList = async () => {
    if (!listToDelete) return;

    try {
      await deleteShoppingList(listToDelete.id, currentUser.id);
      setShoppingLists(
        shoppingLists.filter((list) => list.id !== listToDelete.id)
      );
      setListToDelete(null);
    } catch (error) {
      console.error("Failed to delete shopping list", error);
    }
  };

  const handleToggleArchive = async (listId, isArchived) => {
    try {
      await toggleArchiveStatus(listId, isArchived, currentUser.id);
      setShoppingLists((prevLists) =>
        prevLists.map((list) =>
          list.id === listId ? { ...list, isArchived } : list
        )
      );
    } catch (error) {
      console.error("Failed to toggle archive status", error);
    }
  };

  if (!currentUser) {
    return <div>Please select a user to view shopping lists.</div>;
  }

  return (
    <div className="shopping-lists-page">
      <h1 className="title">
        {isArchivedView ? "Archived Shopping Lists" : "My Shopping Lists"}
      </h1>

      <div className="chart-section">
        <h2>Statistiky seznamů</h2>
        {overview.length === 0 ? (
          <p>Žádná data nejsou dostupná.</p>
        ) : (
          <Bar data={data} />
        )}
      </div>

      <button
        className="toggle-view-button"
        onClick={() => setIsArchivedView(!isArchivedView)}
      >
        {isArchivedView ? "View Active Lists" : "View Archived Lists"}
      </button>

      <button className="add-button" onClick={() => setModalOpen(true)}>
        + Add New List
      </button>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Shopping List</h2>
            <input
              type="text"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              placeholder="Enter list title"
              className="input"
            />
            <div className="modal-actions">
              <button onClick={handleAddList} className="confirm-button">
                Add
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="shopping-lists-container">
        {shoppingLists.map((list) => (
          <div key={list.id} className="shopping-list-card">
            <Link
              to={`/shopping-lists/${list.id}`}
              state={{ title: list.title }}
              className="shopping-list-title"
            >
              {list.title}
            </Link>
            <button
              className="archive-button"
              onClick={() => handleToggleArchive(list.id, !list.isArchived)}
            >
              {list.isArchived ? "Unarchive" : "Archive"}
            </button>
            {!isArchivedView && (
              <button
                className="delete-button"
                onClick={() => setListToDelete(list)}
              >
                🗑️
              </button>
            )}
          </div>
        ))}
      </div>

      {listToDelete && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>
              Are you sure you want to delete the list "{listToDelete.title}"?
            </p>
            <div className="modal-actions">
              <button onClick={handleDeleteList} className="confirm-button">
                Yes, Delete
              </button>
              <button
                onClick={() => setListToDelete(null)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingListsPage;
