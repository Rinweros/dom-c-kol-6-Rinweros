import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchShoppingList,
  addItem,
  deleteItem,
  toggleItemStatus,
  addMember,
  removeMember,
  leaveList,
} from "../api";
import { useUser } from "./UserSwitcher";
import "./ShoppingListDetail.css";
import { Pie } from "react-chartjs-2";
import axios from "../api";

const ShoppingListDetail = () => {
  const { id } = useParams();
  const [shoppingList, setShoppingList] = useState(null);
  const [newItem, setNewItem] = useState("");
  const [stats, setStats] = useState({ solved: 0, unsolved: 0 });
  const { currentUser } = useUser();

  useEffect(() => {
    const loadShoppingList = async () => {
      try {
        const response = await fetchShoppingList(id, currentUser.id);
        setShoppingList({
          id: response.data.shoppingList._id,
          ...response.data.shoppingList,
        });
      } catch (error) {
        console.error("Failed to fetch shopping list:", error);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await axios.get(`/shoppingLists/${id}/stats`);
        setStats(response.data.stats);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    if (id && currentUser) {
      loadShoppingList();
      fetchStats();
    }
  }, [id, currentUser]);

  const data = {
    labels: ["Vyřešené", "Nevyřešené"],
    datasets: [
      {
        data: [stats.solved, stats.unsolved],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.label}: ${context.raw}`;
          },
        },
      },
    },
  };

  const handleAddItem = async () => {
    if (!newItem.trim()) {
      alert("Item name cannot be empty.");
      return;
    }

    try {
      const response = await addItem(id, newItem, 1, currentUser.id);
      setShoppingList((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          { id: response.data.itemId, name: newItem, purchased: false },
        ],
      }));
      setNewItem("");
    } catch (error) {
      console.error("Failed to add item", error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteItem(id, itemId, currentUser.id);
      setShoppingList((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item._id !== itemId),
      }));
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  const handleToggleItem = async (itemId, newStatus) => {
    try {
      await toggleItemStatus(id, itemId, newStatus, currentUser.id);
      setShoppingList((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item._id === itemId ? { ...item, purchased: newStatus } : item
        ),
      }));
    } catch (error) {
      console.error("Failed to toggle item status", error);
    }
  };

  if (!shoppingList) return <div>Loading...</div>;

  return (
    <div className="shopping-list-detail">
      <h1>{shoppingList.title}</h1>

      <div className="chart-section">
        <h2>Statistiky seznamu</h2>
        {stats.solved === 0 && stats.unsolved === 0 ? (
          <p>Žádná data nejsou dostupná pro zobrazení grafu.</p>
        ) : (
          <Pie data={data} options={options} />
        )}
      </div>

      <div className="items-section">
        <h2>Items</h2>
        <ul className="items-list">
          {shoppingList.items.map((item) => (
            <li key={item._id} className="item-row">
              <span>{item.name}</span>
              <input
                type="checkbox"
                checked={item.purchased}
                onChange={() => handleToggleItem(item._id, !item.purchased)}
              />
              <button onClick={() => handleDeleteItem(item._id)}>Delete</button>
            </li>
          ))}
        </ul>

        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item"
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>
    </div>
  );
};

export default ShoppingListDetail;
