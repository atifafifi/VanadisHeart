import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getShoppingLists,
  createShoppingList,
  addToShoppingList,
  removeFromShoppingList,
  toggleShoppingListItem,
  clearCompletedShoppingListItems,
  deleteShoppingList
} from '../services/userData';
import type { ShoppingList } from '../types';
import '../styles/shoppingList.css';

const ShoppingListPage: React.FC = () => {
  const navigate = useNavigate();
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [activeListId, setActiveListId] = useState<string>('');
  const [newItem, setNewItem] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newListName, setNewListName] = useState('');
  const [showCreateList, setShowCreateList] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    loadShoppingLists();
  }, []);

  const loadShoppingLists = () => {
    const lists = getShoppingLists();
    setShoppingLists(lists);
    if (lists.length > 0 && !activeListId) {
      setActiveListId(lists[0].id);
    }
  };

  const activeList = shoppingLists.find(list => list.id === activeListId);

  const handleCreateList = () => {
    if (newListName.trim()) {
      const listId = createShoppingList(newListName.trim());
      setNewListName('');
      setShowCreateList(false);
      loadShoppingLists();
      setActiveListId(listId);
    }
  };

  const handleAddItem = async () => {
    if (newItem.trim() && activeListId) {
      await addToShoppingList(activeListId, {
        ingredient: newItem.trim(),
        quantity: newQuantity.trim() || undefined,
        isCompleted: false
      });
      setNewItem('');
      setNewQuantity('');
      loadShoppingLists();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  const handleToggleItem = (itemId: string) => {
    if (activeListId) {
      toggleShoppingListItem(activeListId, itemId);
      loadShoppingLists();
    }
  };

  const handleRemoveItem = (itemId: string) => {
    if (activeListId) {
      removeFromShoppingList(activeListId, itemId);
      loadShoppingLists();
    }
  };

  const handleClearCompleted = () => {
    if (activeListId) {
      clearCompletedShoppingListItems(activeListId);
      loadShoppingLists();
    }
  };

  const handleDeleteList = (listId: string) => {
    deleteShoppingList(listId);
    loadShoppingLists();
    if (activeListId === listId && shoppingLists.length > 1) {
      const remainingLists = shoppingLists.filter(list => list.id !== listId);
      setActiveListId(remainingLists[0].id);
    }
  };

  const completedCount = activeList ? activeList.items.filter(item => item.isCompleted).length : 0;
  const totalCount = activeList ? activeList.items.length : 0;

  return (
    <div className="shopping-list-container">
      {/* Header */}
      <div className="shopping-list-header">
        <div className="container shopping-list-header-content">
          <div className="shopping-list-header-flex">
            <div className="shopping-list-title-section">
              <h1>Shopping List</h1>
              <p>Keep track of ingredients you need to buy</p>
            </div>
            <button
              onClick={() => navigate('/recommended')}
              className="btn btn-outline shopping-list-discover-button"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Browse Recipes
            </button>
          </div>
        </div>
      </div>

      <div className="container shopping-list-content">
        {/* Add Item Form */}
        <div className="shopping-list-add-form">
          <div className="shopping-list-input-group">
            <input
              type="text"
              placeholder="Add ingredient..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={handleKeyPress}
              className="shopping-list-input"
            />
            <input
              type="text"
              placeholder="Quantity (optional)"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              onKeyPress={handleKeyPress}
              className="shopping-list-input shopping-list-quantity-input"
            />
            <button
              onClick={handleAddItem}
              className="btn btn-primary shopping-list-add-button"
              disabled={!newItem.trim()}
            >
              Add
            </button>
          </div>
        </div>

        {/* List Stats */}
        {totalCount > 0 && (
          <div className="shopping-list-stats">
            <span className="shopping-list-stats-text">
              {completedCount} of {totalCount} items completed
            </span>
            <div className="shopping-list-stats-actions">
              <button
                onClick={() => setShowSummary(true)}
                className="btn btn-outline shopping-list-summary-button"
              >
                View Summary
              </button>
              {completedCount > 0 && (
                <button
                  onClick={handleClearCompleted}
                  className="btn btn-outline shopping-list-clear-button"
                >
                  Clear Completed
                </button>
              )}
            </div>
          </div>
        )}

        {/* List Navigation */}
        {shoppingLists.length > 0 && (
          <div className="shopping-list-navigation">
            <div className="shopping-list-tabs">
              {shoppingLists.map((list) => (
                <button
                  key={list.id}
                  className={`shopping-list-tab ${activeListId === list.id ? 'active' : ''}`}
                  onClick={() => setActiveListId(list.id)}
                >
                  {list.name}
                  <span className="shopping-list-tab-count">
                    {list.items.filter(item => !item.isCompleted).length}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteList(list.id);
                    }}
                    className="shopping-list-tab-delete"
                    title="Delete list"
                  >
                    ×
                  </button>
                </button>
              ))}
              <button
                className="shopping-list-tab add-tab"
                onClick={() => setShowCreateList(true)}
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Create New List Modal */}
        {showCreateList && (
          <div className="shopping-list-modal-overlay" onClick={() => setShowCreateList(false)}>
            <div className="shopping-list-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Create New Shopping List</h3>
              <input
                type="text"
                placeholder="Recipe name or list title..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateList()}
                className="shopping-list-input"
                autoFocus
              />
              <div className="shopping-list-modal-actions">
                <button onClick={() => setShowCreateList(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button onClick={handleCreateList} className="btn btn-primary" disabled={!newListName.trim()}>
                  Create List
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Summary Modal */}
        {showSummary && activeList && (
          <div className="shopping-list-modal-overlay" onClick={() => setShowSummary(false)}>
            <div className="shopping-list-modal shopping-list-summary-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Shopping List Summary: {activeList.name}</h3>

              <div className="shopping-list-summary-content">
                <div className="shopping-list-summary-section">
                  <h4>Completed Items ({activeList.items.filter(item => item.isCompleted).length})</h4>
                  {activeList.items.filter(item => item.isCompleted).length > 0 ? (
                    <ul className="shopping-list-summary-items">
                      {activeList.items.filter(item => item.isCompleted).map((item) => (
                        <li key={item.id} className="shopping-list-summary-item completed">
                          {item.image && (
                            <img src={item.image} alt={item.ingredient} className="shopping-list-summary-image" />
                          )}
                          <span>{item.ingredient}</span>
                          {item.quantity && <span className="quantity">({item.quantity})</span>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="shopping-list-summary-empty">No completed items yet</p>
                  )}
                </div>

                <div className="shopping-list-summary-section">
                  <h4>Remaining Items ({activeList.items.filter(item => !item.isCompleted).length})</h4>
                  {activeList.items.filter(item => !item.isCompleted).length > 0 ? (
                    <ul className="shopping-list-summary-items">
                      {activeList.items.filter(item => !item.isCompleted).map((item) => (
                        <li key={item.id} className="shopping-list-summary-item">
                          {item.image && (
                            <img src={item.image} alt={item.ingredient} className="shopping-list-summary-image" />
                          )}
                          <span>{item.ingredient}</span>
                          {item.quantity && <span className="quantity">({item.quantity})</span>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="shopping-list-summary-empty">All items completed! 🎉</p>
                  )}
                </div>

                <div className="shopping-list-summary-section">
                  <h4>Reuse Ingredients</h4>
                  <p className="shopping-list-summary-reuse-text">
                    Copy these ingredients to use in another shopping list:
                  </p>
                  <div className="shopping-list-summary-reuse">
                    <textarea
                      readOnly
                      value={activeList.items.map(item => `${item.ingredient}${item.quantity ? ` (${item.quantity})` : ''}`).join('\n')}
                      className="shopping-list-summary-textarea"
                      placeholder="No ingredients to copy"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          activeList.items.map(item => `${item.ingredient}${item.quantity ? ` (${item.quantity})` : ''}`).join('\n')
                        );
                        // Could add a toast notification here
                      }}
                      className="btn btn-primary shopping-list-copy-button"
                    >
                      Copy All
                    </button>
                  </div>
                </div>
              </div>

              <div className="shopping-list-modal-actions">
                <button onClick={() => setShowSummary(false)} className="btn btn-primary">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Shopping List */}
        {!activeList || activeList.items.length === 0 ? (
          <div className="shopping-list-empty-state">
            <div className="shopping-list-empty-icon-wrapper">
              <svg className="shopping-list-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3>
              {shoppingLists.length === 0
                ? "Create your first shopping list"
                : activeList
                  ? `No items in "${activeList.name}"`
                  : "Select a shopping list"
              }
            </h3>
            <p>
              {shoppingLists.length === 0
                ? "Start by creating a shopping list for a recipe or meal plan."
                : "Add ingredients above or from recipes to get started!"
              }
            </p>
            {shoppingLists.length === 0 && (
              <button
                onClick={() => setShowCreateList(true)}
                className="btn btn-primary shopping-list-empty-button"
              >
                Create Shopping List
              </button>
            )}
          </div>
        ) : (
          <div className="shopping-list-items">
            {activeList.items.map((item) => (
              <div key={item.id} className={`shopping-list-item ${item.isCompleted ? 'completed' : ''}`}>
                <div className="shopping-list-item-content">
                  <input
                    type="checkbox"
                    checked={item.isCompleted}
                    onChange={() => handleToggleItem(item.id)}
                    className="shopping-list-checkbox"
                  />
                  <div className="shopping-list-item-details">
                    {item.image && (
                      <div className="shopping-list-item-image-wrapper">
                        <img
                          src={item.image}
                          alt={item.ingredient}
                          className="shopping-list-item-image"
                        />
                      </div>
                    )}
                    <div className="shopping-list-item-text-content">
                      <span className="shopping-list-item-text">{item.ingredient}</span>
                      {item.quantity && (
                        <span className="shopping-list-item-quantity">({item.quantity})</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="shopping-list-remove-button"
                    title="Remove item"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingListPage;