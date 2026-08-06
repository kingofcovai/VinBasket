/* ==========================================================================
   VinBasket V2.0 Core Logic (Master Data Architecture & Analytics)
   ========================================================================== */

// Application State
let state = {
  targetBudget: 2000,
  items: [],
  shops: [],
  categories: [],
  history: [],
  archive: [],                 // Recycle Bin Archive
  activeTab: 'shopping',       // 'shopping', 'database', 'dashboard', 'history', 'archive'
  activeShopFilter: 'all',     // 'all' or specific shopId
  shoppingSubTab: 'tobuy',     // 'tobuy' or 'bought'
  dbSubTab: 'items',           // 'items', 'shops', 'categories'
  dashSubTab: 'shops',         // 'shops', 'categories'
  selectedDashEntityId: '',    // Selected shopId or categoryId on dashboard
  histSubTab: 'trips'          // 'trips', 'prices'
};

// DOM Cache
const dom = {
  inputTargetBudget: document.getElementById('input-target-budget'),
  displayCurrentTotal: document.getElementById('display-current-total'),
  displayRemainingBudget: document.getElementById('display-remaining-budget'),
  displayCartTotal: document.getElementById('display-cart-total'),
  budgetStatusBadge: document.getElementById('budget-status-badge'),
  budgetStatusText: document.getElementById('budget-status-text'),
  budgetExceededBanner: document.getElementById('budget-exceeded-banner'),
  alertOverAmount: document.getElementById('alert-over-amount'),
  budgetSummaryCard: document.getElementById('budget-summary-card'),
  selectActiveShop: document.getElementById('select-active-shop'),
  
  tabShopping: document.getElementById('tab-shopping'),
  tabDatabase: document.getElementById('tab-database'),
  tabDashboard: document.getElementById('tab-dashboard'),
  tabHistory: document.getElementById('tab-history'),
  tabArchive: document.getElementById('tab-archive'),
  badgeShoppingCount: document.getElementById('badge-shopping-count'),
  badgeArchiveCount: document.getElementById('badge-archive-count'),
  
  viewShopping: document.getElementById('view-shopping'),
  viewDatabase: document.getElementById('view-database'),
  viewDashboard: document.getElementById('view-dashboard'),
  viewHistory: document.getElementById('view-history'),
  viewArchive: document.getElementById('view-archive'),
  
  subtabToBuy: document.getElementById('subtab-tobuy'),
  subtabBought: document.getElementById('subtab-bought'),
  subviewToBuy: document.getElementById('subview-tobuy'),
  subviewBought: document.getElementById('subview-bought'),
  tobuyList: document.getElementById('tobuy-list'),
  boughtList: document.getElementById('bought-list'),
  tobuyListEmpty: document.getElementById('tobuy-list-empty'),
  boughtListEmpty: document.getElementById('bought-list-empty'),
  boughtActionsContainer: document.getElementById('bought-actions-container'),
  btnCompleteTrip: document.getElementById('btn-complete-trip'),
  
  subtabDbItems: document.getElementById('subtab-db-items'),
  subtabDbShops: document.getElementById('subtab-db-shops'),
  subtabDbCategories: document.getElementById('subtab-db-categories'),
  subviewDbItems: document.getElementById('subview-db-items'),
  subviewDbShops: document.getElementById('subview-db-shops'),
  subviewDbCategories: document.getElementById('subview-db-categories'),
  inputItemSearch: document.getElementById('input-item-search'),
  dbItemsList: document.getElementById('db-items-list'),
  dbShopsList: document.getElementById('db-shops-list'),
  dbCategoriesList: document.getElementById('db-categories-list'),
  btnReset: document.getElementById('btn-reset'),
  btnAddMasterItem: document.getElementById('btn-add-master-item'),
  inputAddShop: document.getElementById('input-add-shop'),
  btnAddShop: document.getElementById('btn-add-shop'),
  inputAddCategory: document.getElementById('input-add-category'),
  btnAddCategory: document.getElementById('btn-add-category'),
  
  subtabDashShops: document.getElementById('subtab-dash-shops'),
  subtabDashCategories: document.getElementById('subtab-dash-categories'),
  lblDashEntity: document.getElementById('lbl-dash-entity'),
  selectDashEntity: document.getElementById('select-dash-entity'),
  dashProgressText: document.getElementById('dash-progress-text'),
  dashProgressFill: document.getElementById('dash-progress-fill'),
  dashEstCost: document.getElementById('dash-est-cost'),
  dashPurCost: document.getElementById('dash-pur-cost'),
  dashRemItems: document.getElementById('dash-rem-items'),
  
  subtabHistTrips: document.getElementById('subtab-hist-trips'),
  subtabHistPrices: document.getElementById('subtab-hist-prices'),
  subviewHistTrips: document.getElementById('subview-hist-trips'),
  subviewHistPrices: document.getElementById('subview-hist-prices'),
  historyList: document.getElementById('history-list'),
  historyListEmpty: document.getElementById('history-list-empty'),
  priceHistoryEmpty: document.getElementById('price-history-empty'),
  priceHistoryTable: document.getElementById('price-history-table'),
  btnClearHistory: document.getElementById('btn-clear-history'),
  btnAddItem: document.getElementById('btn-add-item'),

  // Archive
  btnEmptyArchive: document.getElementById('btn-empty-archive'),
  archiveActionsBar: document.getElementById('archive-actions-bar'),
  btnRestoreSelected: document.getElementById('btn-restore-selected'),
  btnDeleteSelectedPerm: document.getElementById('btn-delete-selected-perm'),
  chkSelectAllArchive: document.getElementById('chk-select-all-archive'),
  inputArchiveSearch: document.getElementById('input-archive-search'),
  archiveListEmpty: document.getElementById('archive-list-empty'),
  archiveList: document.getElementById('archive-list'),
  undoSnackbar: document.getElementById('undo-snackbar'),
  snackbarMsg: document.getElementById('snackbar-msg'),
  btnSnackbarUndo: document.getElementById('btn-snackbar-undo'),
  
  // Modals
  modalEditItem: document.getElementById('modal-edit-item'),
  btnModalClose: document.getElementById('btn-modal-close'),
  modalTitle: document.getElementById('modal-title'),
  modalInputName: document.getElementById('modal-input-name'),
  btnModalFav: document.getElementById('btn-modal-fav'),
  modalSelectCategory: document.getElementById('modal-select-category'),
  modalSelectUnit: document.getElementById('modal-select-unit'),
  modalInputPrice: document.getElementById('modal-input-price'),
  modalShopChecklist: document.getElementById('modal-shop-checklist'),
  modalInputNotes: document.getElementById('modal-input-notes'),
  btnModalCancel: document.getElementById('btn-modal-cancel'),
  btnModalSave: document.getElementById('btn-modal-save')
};

// Default Master Data (For clean fresh state setups)
const defaultShops = [
  { id: 'shop_1', name: 'D-Mart' },
  { id: 'shop_2', name: 'Walmart' },
  { id: 'shop_3', name: 'Organic Fresh' }
];

const defaultCategories = [
  { id: 'cat_1', name: 'Dairy & Eggs' },
  { id: 'cat_2', name: 'Grains & Flours' },
  { id: 'cat_3', name: 'Fruits & Veggies' },
  { id: 'cat_4', name: 'Beverages' },
  { id: 'cat_5', name: 'Snacks' }
];

const defaultItems = [
  { id: '1', name: 'Fresh Milk', categoryId: 'cat_1', shopIds: ['shop_1', 'shop_2', 'shop_3'], unit: 'litres', estimatedPrice: 60, favorite: false, notes: 'Prefer low fat pack', priceHistory: {}, active: true, quantity: 2, price: 60, total: 120, bought: false },
  { id: '2', name: 'Atta (Wheat Flour)', categoryId: 'cat_2', shopIds: ['shop_1', 'shop_2'], unit: 'kg', estimatedPrice: 340, favorite: true, notes: 'Premium multigrain package', priceHistory: {}, active: true, quantity: 1, price: 340, total: 340, bought: false },
  { id: '3', name: 'Ghee (Clarified Butter)', categoryId: 'cat_1', shopIds: ['shop_1', 'shop_3'], unit: 'ml', estimatedPrice: 670, favorite: false, notes: '', priceHistory: {}, active: true, quantity: 500, price: 670, total: 335, bought: false },
  { id: '4', name: 'Kabuli Chana', categoryId: 'cat_2', shopIds: ['shop_1', 'shop_2'], unit: 'g', estimatedPrice: 120, favorite: false, notes: 'Check for large grains', priceHistory: {}, active: true, quantity: 250, price: 120, total: 30, bought: false },
  { id: '5', name: 'Brown Bread', categoryId: 'cat_5', shopIds: ['shop_1', 'shop_2'], unit: 'packs', estimatedPrice: 50, favorite: false, notes: 'Double check date', priceHistory: {}, active: true, quantity: 1, price: 50, total: 50, bought: true },
  { id: '6', name: 'Fresh Tomatoes', categoryId: 'cat_3', shopIds: ['shop_1', 'shop_3'], unit: 'kg', estimatedPrice: 45, favorite: false, notes: 'Semi-ripe only', priceHistory: {}, active: false, quantity: 1, price: 45, total: 45, bought: false }
];

let currentEditingItemId = null; // Track item currently loaded in edit modal

/* ==========================================================================
   State & LocalStorage Management
   ========================================================================== */

function loadState() {
  const savedState = localStorage.getItem('vinbasket_v2_state');
  if (savedState) {
    try {
      state = JSON.parse(savedState);
      // Clean up tab defaults for startup
      state.activeTab = 'shopping';
      state.shoppingSubTab = 'tobuy';
      state.activeShopFilter = state.activeShopFilter || 'all';
      
      // Ensure archive array exists
      if (!state.archive) {
        state.archive = [];
      }
    } catch (e) {
      console.error('Error loading state from localStorage:', e);
      resetToDefault();
    }
  } else {
    resetToDefault();
  }
}

function saveState() {
  localStorage.setItem('vinbasket_v2_state', JSON.stringify(state));
}

function resetToDefault() {
  state.targetBudget = 2000;
  state.shops = JSON.parse(JSON.stringify(defaultShops));
  state.categories = JSON.parse(JSON.stringify(defaultCategories));
  state.items = JSON.parse(JSON.stringify(defaultItems));
  state.history = [];
  state.archive = [];
  state.activeTab = 'shopping';
  state.activeShopFilter = 'all';
  state.shoppingSubTab = 'tobuy';
  state.dbSubTab = 'items';
  state.dashSubTab = 'shops';
  state.histSubTab = 'trips';
  saveState();
}

/* ==========================================================================
   Calculation Engine
   ========================================================================== */

function calculateAndUpdateSummary() {
  let estimatedTotal = 0;
  let cartTotal = 0;

  state.items.forEach(item => {
    // Perform trip calculation only if item is on current shopping trip list
    if (item.active) {
      // Filter by shop assignment if filter is set
      if (state.activeShopFilter !== 'all' && !item.shopIds.includes(state.activeShopFilter)) {
        return;
      }

      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.price) || 0;
      
      // Conversion Calculations
      if (price > 0) {
        if (item.unit === 'g' || item.unit === 'ml') {
          item.total = (qty / 1000) * price;
        } else {
          item.total = qty * price;
        }
      } else {
        item.total = parseFloat(item.total) || 0;
      }

      estimatedTotal += item.total;
      if (item.bought) {
        cartTotal += item.total;
      }
    }
  });

  const remaining = state.targetBudget - estimatedTotal;
  const budgetRatio = state.targetBudget > 0 ? estimatedTotal / state.targetBudget : 0;

  // Render numbers in UI
  dom.displayCurrentTotal.innerText = `₹${estimatedTotal.toFixed(2)}`;
  dom.displayRemainingBudget.innerText = `₹${remaining.toFixed(2)}`;
  dom.displayCartTotal.innerText = `₹${cartTotal.toFixed(2)}`;

  // Handle over-budget coloring
  if (remaining < 0) {
    dom.displayRemainingBudget.style.color = 'var(--accent-red)';
  } else {
    dom.displayRemainingBudget.style.color = 'var(--text-primary)';
  }

  // Update Budget Status Badge & Alert Banner
  dom.budgetStatusBadge.className = 'status-badge';
  dom.budgetExceededBanner.classList.add('hidden');

  if (estimatedTotal > state.targetBudget) {
    dom.budgetStatusBadge.classList.add('status-exceeded');
    dom.budgetStatusText.innerText = 'Budget Exceeded';
    const overAmount = estimatedTotal - state.targetBudget;
    dom.alertOverAmount.innerText = `₹${overAmount.toFixed(2)}`;
    dom.budgetExceededBanner.classList.remove('hidden');
  } else if (budgetRatio >= 0.90) {
    dom.budgetStatusBadge.classList.add('status-near');
    dom.budgetStatusText.innerText = 'Near Budget';
  } else {
    dom.budgetStatusBadge.classList.add('status-within');
    dom.budgetStatusText.innerText = 'Within Budget';
  }

  // Manage visibility of Complete Trip button container
  if (cartTotal > 0) {
    dom.boughtActionsContainer.classList.remove('hidden');
  } else {
    dom.boughtActionsContainer.classList.add('hidden');
  }

  // Update bottom tab badge for active shopping items count
  const activeItemsCount = state.items.filter(item => {
    if (!item.active || item.bought) return false;
    if (state.activeShopFilter !== 'all' && !item.shopIds.includes(state.activeShopFilter)) return false;
    return true;
  }).length;

  if (activeItemsCount > 0) {
    dom.badgeShoppingCount.innerText = activeItemsCount;
    dom.badgeShoppingCount.classList.remove('hidden');
  } else {
    dom.badgeShoppingCount.classList.add('hidden');
  }

  // Update bottom tab badge for archive items count
  const archiveItemsCount = state.archive ? state.archive.length : 0;
  if (archiveItemsCount > 0) {
    dom.badgeArchiveCount.innerText = archiveItemsCount;
    dom.badgeArchiveCount.classList.remove('hidden');
  } else {
    dom.badgeArchiveCount.classList.add('hidden');
  }
}

/* ==========================================================================
   Shop Price History Suggestion Lookups
   ========================================================================== */

function suggestShopPrices() {
  const shopId = state.activeShopFilter;
  
  state.items.forEach(item => {
    if (item.active) {
      if (shopId !== 'all' && item.priceHistory && item.priceHistory[shopId]) {
        // Suggest last paid price at this shop
        item.price = item.priceHistory[shopId].price;
      } else {
        // Suggest item's default estimated price
        item.price = item.estimatedPrice || 0;
      }
    }
  });
  saveState();
}

/* ==========================================================================
   Views Rendering Controllers
   ========================================================================== */

// 1. ACTIVE SHOPPING VIEW (CHECKLIST)
function renderShoppingList() {
  dom.tobuyList.innerHTML = '';
  dom.boughtList.innerHTML = '';

  const activeItems = state.items.filter(item => {
    if (!item.active || item.bought) return false;
    if (state.activeShopFilter !== 'all' && !item.shopIds.includes(state.activeShopFilter)) return false;
    return true;
  });

  const boughtItems = state.items.filter(item => {
    if (!item.active || !item.bought) return false;
    if (state.activeShopFilter !== 'all' && !item.shopIds.includes(state.activeShopFilter)) return false;
    return true;
  });

  // Empty state toggling
  if (activeItems.length === 0) {
    dom.tobuyListEmpty.classList.remove('hidden');
  } else {
    dom.tobuyListEmpty.classList.add('hidden');
  }

  if (boughtItems.length === 0) {
    dom.boughtListEmpty.classList.remove('hidden');
  } else {
    dom.boughtListEmpty.classList.add('hidden');
  }

  // Populate lists
  activeItems.forEach((item, index) => {
    dom.tobuyList.appendChild(createShoppingItemRow(item, index, false));
  });

  boughtItems.forEach((item, index) => {
    dom.boughtList.appendChild(createShoppingItemRow(item, index, true));
  });
}

function createShoppingItemRow(item, index, isBought) {
  const row = document.createElement('div');
  row.className = `item-row ${isBought ? 'bought-row' : ''}`;
  row.dataset.id = item.id;

  row.innerHTML = `
    <div class="item-row-top">
      <div class="sl-no-badge">${index + 1}</div>
      <label class="checkbox-container">
        <input type="checkbox" class="item-checkbox" ${isBought ? 'checked' : ''}>
        <span class="checkmark"></span>
      </label>
      <input type="text" class="item-name-input" placeholder="Item Name..." value="${item.name || ''}" disabled>
      <button class="btn-icon-only edit-btn-trigger" title="Edit Item Details">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
      </button>
      <button class="btn-icon-only delete-btn" title="Remove from list">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="item-row-bottom">
      <div class="qty-input-group">
        <button class="qty-btn qty-minus" type="button">-</button>
        <input type="number" class="qty-input" value="${item.quantity}" min="0" step="any" inputmode="decimal">
        <button class="qty-btn qty-plus" type="button">+</button>
      </div>
      <div class="unit-select-wrapper">
        <select class="unit-select">
          <option value="pcs" ${item.unit === 'pcs' ? 'selected' : ''}>pcs</option>
          <option value="kg" ${item.unit === 'kg' ? 'selected' : ''}>kg</option>
          <option value="g" ${item.unit === 'g' ? 'selected' : ''}>g</option>
          <option value="litres" ${item.unit === 'litres' ? 'selected' : ''}>L</option>
          <option value="ml" ${item.unit === 'ml' ? 'selected' : ''}>ml</option>
          <option value="packs" ${item.unit === 'packs' ? 'selected' : ''}>pack</option>
          <option value="doz" ${item.unit === 'doz' ? 'selected' : ''}>doz</option>
          <option value="boxes" ${item.unit === 'boxes' ? 'selected' : ''}>box</option>
          <option value="bags" ${item.unit === 'bags' ? 'selected' : ''}>bag</option>
        </select>
      </div>
      <div class="price-input-wrapper">
        <span class="price-symbol">₹</span>
        <input type="number" class="price-input" placeholder="Price" value="${item.price || ''}" min="0" step="any" inputmode="decimal">
        <span class="price-unit-label">/pc</span>
      </div>
      <span class="equals-sign">=</span>
      <div class="total-input-wrapper">
        <span class="total-symbol">₹</span>
        <input type="number" class="total-input" placeholder="Total" value="${item.total || ''}" min="0" step="any" inputmode="decimal">
      </div>
    </div>
  `;

  // DOM elements in row
  const chk = row.querySelector('.item-checkbox');
  const qtyInput = row.querySelector('.qty-input');
  const unitSelect = row.querySelector('.unit-select');
  const priceInput = row.querySelector('.price-input');
  const totalInput = row.querySelector('.total-input');
  const btnMinus = row.querySelector('.qty-minus');
  const btnPlus = row.querySelector('.qty-plus');
  const btnDelete = row.querySelector('.delete-btn');
  const btnEditTrigger = row.querySelector('.edit-btn-trigger');

  // Set unit label
  const updatePriceUnitLabel = () => {
    const unit = unitSelect.value;
    const priceUnitLabel = row.querySelector('.price-unit-label');
    if (!priceUnitLabel) return;
    
    let labelText = '/pc';
    if (unit === 'kg' || unit === 'g') labelText = '/kg';
    else if (unit === 'litres' || unit === 'ml') labelText = '/L';
    else if (unit === 'pcs') labelText = '/pc';
    else if (unit === 'packs') labelText = '/pk';
    else if (unit === 'doz') labelText = '/dz';
    else if (unit === 'boxes') labelText = '/bx';
    else if (unit === 'bags') labelText = '/bg';
    priceUnitLabel.innerText = labelText;
  };

  const updateDomRowTotal = () => {
    const qty = parseFloat(qtyInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    
    if (price > 0) {
      let calculatedTotal = 0;
      if (unitSelect.value === 'g' || unitSelect.value === 'ml') {
        calculatedTotal = (qty / 1000) * price;
      } else {
        calculatedTotal = qty * price;
      }
      item.total = calculatedTotal;
      totalInput.value = calculatedTotal % 1 === 0 ? calculatedTotal : calculatedTotal.toFixed(2);
    }
    
    item.quantity = qty;
    item.price = priceInput.value === '' ? 0 : price;
    
    saveState();
    calculateAndUpdateSummary();
  };

  const getQtyStep = (unit, currentQty) => {
    if (unit === 'g' || unit === 'ml') return 50;
    if (currentQty > 1) return 1;
    return 0.1;
  };

  // Checkbox toggle
  chk.addEventListener('change', () => {
    row.classList.add('removing-item');
    setTimeout(() => {
      item.bought = chk.checked;
      saveState();
      calculateAndUpdateSummary();
      renderShoppingList();
    }, 200);
  });

  // Quantity updates
  qtyInput.addEventListener('input', updateDomRowTotal);

  btnMinus.addEventListener('click', () => {
    let currentQty = parseFloat(qtyInput.value) || 0;
    const unit = unitSelect.value;
    const step = getQtyStep(unit, currentQty);
    
    if (currentQty > step) {
      qtyInput.value = (currentQty - step).toFixed(3).replace(/\.?0+$/, '');
      updateDomRowTotal();
    } else if (currentQty > 0 && currentQty <= step && (unit === 'g' || unit === 'ml')) {
      if (currentQty > 10) {
        qtyInput.value = (currentQty - 10).toFixed(3).replace(/\.?0+$/, '');
      } else {
        qtyInput.value = 10;
      }
      updateDomRowTotal();
    } else if (currentQty > 0 && currentQty <= step) {
      qtyInput.value = 0.1;
      updateDomRowTotal();
    }
  });

  btnPlus.addEventListener('click', () => {
    let currentQty = parseFloat(qtyInput.value) || 0;
    const unit = unitSelect.value;
    const step = getQtyStep(unit, currentQty);
    
    qtyInput.value = (currentQty + step).toFixed(3).replace(/\.?0+$/, '');
    updateDomRowTotal();
  });

  // Unit updates
  unitSelect.addEventListener('change', () => {
    item.unit = unitSelect.value;
    updatePriceUnitLabel();
    updateDomRowTotal();
    saveState();
  });

  // Price updates
  priceInput.addEventListener('input', updateDomRowTotal);

  // Direct Total updates
  totalInput.addEventListener('input', () => {
    const directTotal = parseFloat(totalInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    if (price === 0) {
      item.price = 0;
      priceInput.value = '';
    }
    item.total = directTotal;
    saveState();
    calculateAndUpdateSummary();
  });

  // Remove from current trip
  btnDelete.addEventListener('click', () => {
    row.classList.add('removing-item');
    setTimeout(() => {
      item.active = false;
      item.bought = false;
      item.price = 0;
      item.total = 0;
      saveState();
      calculateAndUpdateSummary();
      renderShoppingList();
    }, 200);
  });

  // Open Edit Modal
  btnEditTrigger.addEventListener('click', () => {
    openEditItemModal(item.id);
  });

  updatePriceUnitLabel();
  return row;
}

// 2. MASTER DATABASE VIEW
function renderDatabase() {
  if (state.dbSubTab === 'items') {
    dom.subviewDbItems.classList.remove('hidden');
    dom.subviewDbShops.classList.add('hidden');
    dom.subviewDbCategories.classList.add('hidden');
    renderMasterItemsList();
  } else if (state.dbSubTab === 'shops') {
    dom.subviewDbItems.classList.add('hidden');
    dom.subviewDbShops.classList.remove('hidden');
    dom.subviewDbCategories.classList.add('hidden');
    renderMasterShopsList();
  } else if (state.dbSubTab === 'categories') {
    dom.subviewDbItems.classList.add('hidden');
    dom.subviewDbShops.classList.add('hidden');
    dom.subviewDbCategories.classList.remove('hidden');
    renderMasterCategoriesList();
  }
}

function renderMasterItemsList() {
  dom.dbItemsList.innerHTML = '';
  const searchVal = dom.inputItemSearch.value.toLowerCase().trim();

  const filteredItems = state.items.filter(item => {
    return item.name.toLowerCase().includes(searchVal) || 
           (item.notes && item.notes.toLowerCase().includes(searchVal));
  });

  filteredItems.forEach(item => {
    const row = document.createElement('div');
    row.className = 'db-item-row';
    row.dataset.id = item.id;

    // Get category name
    const categoryObj = state.categories.find(c => c.id === item.categoryId);
    const categoryName = categoryObj ? categoryObj.name : 'Uncategorized';

    // Get shop pills
    let shopPillsHtml = '';
    item.shopIds.forEach(shopId => {
      const shopObj = state.shops.find(s => s.id === shopId);
      if (shopObj) {
        shopPillsHtml += `<span class="pill-tag">${shopObj.name}</span>`;
      }
    });

    row.innerHTML = `
      <div class="db-item-left">
        <span class="db-fav-star ${item.favorite ? 'active' : ''}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${item.favorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </span>
        <div class="db-item-details">
          <span class="db-item-name">${item.name || 'Unnamed Item'}</span>
          <div class="db-pills-row">
            <span class="pill-tag category-pill">${categoryName}</span>
            <span class="pill-tag price-pill">Est: ₹${(item.estimatedPrice || 0).toFixed(2)}/${item.unit === 'litres' ? 'L' : item.unit}</span>
            ${shopPillsHtml}
          </div>
        </div>
      </div>
      <div class="db-item-right">
        <button class="btn-icon-only edit-btn" title="Edit Item Relations">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
        </button>
        <button class="btn-icon-only text-btn danger delete-master-btn" title="Delete Master Item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
        <button class="trip-toggle-btn ${item.active ? 'active' : ''}" title="Add/Remove from shopping list">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${item.active ? '<path d="M20 6 9 17l-5-5"/>' : '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>'}</svg>
        </button>
      </div>
    `;

    // Event Bindings
    const favStar = row.querySelector('.db-fav-star');
    const btnEdit = row.querySelector('.edit-btn');
    const btnDelete = row.querySelector('.delete-master-btn');
    const btnToggleTrip = row.querySelector('.trip-toggle-btn');

    favStar.addEventListener('click', () => {
      item.favorite = !item.favorite;
      favStar.classList.toggle('active');
      saveState();
      renderMasterItemsList();
    });

    btnEdit.addEventListener('click', () => {
      openEditItemModal(item.id);
    });

    btnDelete.addEventListener('click', () => {
      softDelete('database', item.id, item.name, item);
      state.items = state.items.filter(i => i.id !== item.id);
      saveState();
      calculateAndUpdateSummary();
      renderMasterItemsList();
    });

    btnToggleTrip.addEventListener('click', () => {
      item.active = !item.active;
      // Reset checklist states on trip add/remove
      item.bought = false;
      if (item.active) {
        // Prefill suggested price
        const activeShop = state.activeShopFilter;
        if (activeShop !== 'all' && item.priceHistory && item.priceHistory[activeShop]) {
          item.price = item.priceHistory[activeShop].price;
        } else {
          item.price = item.estimatedPrice || 0;
        }
      } else {
        item.price = 0;
        item.total = 0;
      }
      
      btnToggleTrip.classList.toggle('active');
      saveState();
      calculateAndUpdateSummary();
      renderMasterItemsList();
    });

    dom.dbItemsList.appendChild(row);
  });
}

function renderMasterShopsList() {
  dom.dbShopsList.innerHTML = '';
  
  if (state.shops.length === 0) {
    dom.dbShopsList.innerHTML = `<div class="empty-state">No custom shops defined yet. Add one above!</div>`;
    return;
  }

  state.shops.forEach(shop => {
    const row = document.createElement('div');
    row.className = 'metadata-row';
    row.innerHTML = `
      <span class="metadata-name">${shop.name}</span>
      <button class="btn-icon-only text-btn danger delete-meta-btn" title="Delete Shop">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    row.querySelector('.delete-meta-btn').addEventListener('click', () => {
      softDelete('shop', shop.id, shop.name, shop);
      state.shops = state.shops.filter(s => s.id !== shop.id);
      
      // If the active filter was set to this shop, reset it
      if (state.activeShopFilter === shop.id) {
        state.activeShopFilter = 'all';
        dom.selectActiveShop.value = 'all';
        suggestShopPrices();
      }
      
      saveState();
      calculateAndUpdateSummary();
      renderActiveShopDropdown();
      renderMasterShopsList();
    });

    dom.dbShopsList.appendChild(row);
  });
}

function renderMasterCategoriesList() {
  dom.dbCategoriesList.innerHTML = '';

  if (state.categories.length === 0) {
    dom.dbCategoriesList.innerHTML = `<div class="empty-state">No custom categories defined yet. Add one above!</div>`;
    return;
  }

  state.categories.forEach(cat => {
    const row = document.createElement('div');
    row.className = 'metadata-row';
    row.innerHTML = `
      <span class="metadata-name">${cat.name}</span>
      <button class="btn-icon-only text-btn danger delete-meta-btn" title="Delete Category">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    row.querySelector('.delete-meta-btn').addEventListener('click', () => {
      softDelete('category', cat.id, cat.name, cat);
      state.categories = state.categories.filter(c => c.id !== cat.id);
      saveState();
      renderMasterCategoriesList();
    });

    dom.dbCategoriesList.appendChild(row);
  });
}

// 3. ANALYTICS DASHBOARD VIEW
function renderDashboard() {
  // Clear selector options
  dom.selectDashEntity.innerHTML = '';

  if (state.dashSubTab === 'shops') {
    dom.lblDashEntity.innerText = 'Select Shop';
    
    if (state.shops.length === 0) {
      dom.selectDashEntity.innerHTML = `<option value="">No Shops Available</option>`;
      showEmptyDashboard();
      return;
    }

    state.shops.forEach(shop => {
      const opt = document.createElement('option');
      opt.value = shop.id;
      opt.innerText = shop.name;
      dom.selectDashEntity.appendChild(opt);
    });

    // Handle initial selection binding
    if (!state.selectedDashEntityId || !state.shops.find(s => s.id === state.selectedDashEntityId)) {
      state.selectedDashEntityId = state.shops[0].id;
    }
    
    dom.selectDashEntity.value = state.selectedDashEntityId;
    calculateAndRenderShopDashboard(state.selectedDashEntityId);

  } else {
    dom.lblDashEntity.innerText = 'Select Category';

    if (state.categories.length === 0) {
      dom.selectDashEntity.innerHTML = `<option value="">No Categories Available</option>`;
      showEmptyDashboard();
      return;
    }

    state.categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.innerText = cat.name;
      dom.selectDashEntity.appendChild(opt);
    });

    // Handle initial selection binding
    if (!state.selectedDashEntityId || !state.categories.find(c => c.id === state.selectedDashEntityId)) {
      state.selectedDashEntityId = state.categories[0].id;
    }

    dom.selectDashEntity.value = state.selectedDashEntityId;
    calculateAndRenderCategoryDashboard(state.selectedDashEntityId);
  }
}

function showEmptyDashboard() {
  dom.dashProgressText.innerText = '0%';
  dom.dashProgressFill.style.width = '0%';
  dom.dashEstCost.innerText = '₹0.00';
  dom.dashPurCost.innerText = '₹0.00';
  dom.dashRemItems.innerText = '0 Items';
}

function calculateAndRenderShopDashboard(shopId) {
  const shopItems = state.items.filter(item => item.active && item.shopIds.includes(shopId));
  
  if (shopItems.length === 0) {
    showEmptyDashboard();
    return;
  }

  let estCost = 0;
  let purCost = 0;
  let boughtCount = 0;

  shopItems.forEach(item => {
    estCost += item.total;
    if (item.bought) {
      purCost += item.total;
      boughtCount++;
    }
  });

  const totalCount = shopItems.length;
  const remCount = totalCount - boughtCount;
  const progressPercent = Math.round((boughtCount / totalCount) * 100) || 0;

  // Render
  dom.dashProgressText.innerText = `${progressPercent}% (${boughtCount}/${totalCount} bought)`;
  dom.dashProgressFill.style.width = `${progressPercent}%`;
  dom.dashEstCost.innerText = `₹${estCost.toFixed(2)}`;
  dom.dashPurCost.innerText = `₹${purCost.toFixed(2)}`;
  dom.dashRemItems.innerText = `${remCount} Item${remCount === 1 ? '' : 's'}`;
}

function calculateAndRenderCategoryDashboard(catId) {
  const catItems = state.items.filter(item => item.active && item.categoryId === catId);
  
  if (catItems.length === 0) {
    showEmptyDashboard();
    return;
  }

  let estCost = 0;
  let purCost = 0;
  let boughtCount = 0;

  catItems.forEach(item => {
    estCost += item.total;
    if (item.bought) {
      purCost += item.total;
      boughtCount++;
    }
  });

  const totalCount = catItems.length;
  const remCount = totalCount - boughtCount;
  const progressPercent = Math.round((boughtCount / totalCount) * 100) || 0;

  // Render
  dom.dashProgressText.innerText = `${progressPercent}% (${boughtCount}/${totalCount} bought)`;
  dom.dashProgressFill.style.width = `${progressPercent}%`;
  dom.dashEstCost.innerText = `₹${estCost.toFixed(2)}`;
  dom.dashPurCost.innerText = `₹${purCost.toFixed(2)}`;
  dom.dashRemItems.innerText = `${remCount} Item${remCount === 1 ? '' : 's'}`;
}

// 4. HISTORICAL TRIPS & PRICES VIEW
function renderHistory() {
  if (state.histSubTab === 'trips') {
    dom.subviewHistTrips.classList.remove('hidden');
    dom.subviewHistPrices.classList.add('hidden');
    renderTripsHistory();
  } else {
    dom.subviewHistTrips.classList.add('hidden');
    dom.subviewHistPrices.classList.remove('hidden');
    renderPriceHistoryTable();
  }
}

function renderTripsHistory() {
  dom.historyList.innerHTML = '';

  if (state.history.length === 0) {
    dom.historyListEmpty.classList.remove('hidden');
    dom.btnClearHistory.style.display = 'none';
    return;
  }

  dom.historyListEmpty.classList.add('hidden');
  dom.btnClearHistory.style.display = 'block';

  // Render in reverse chronological order
  const sortedHistory = [...state.history].reverse();

  sortedHistory.forEach(trip => {
    const card = document.createElement('div');
    card.className = 'history-card';
    card.dataset.id = trip.id;

    // Get shop name
    const shopObj = state.shops.find(s => s.id === trip.shopId);
    const shopLabel = shopObj ? `at ${shopObj.name}` : '(All Shops)';

    const isExceeded = trip.totalSpent > trip.targetBudget;
    const statusText = isExceeded ? 'Exceeded' : 'Within Budget';
    const statusClass = isExceeded ? 'status-exceeded' : 'status-within';

    card.innerHTML = `
      <div class="history-card-top">
        <span class="history-date">${trip.date} ${shopLabel}</span>
        <div class="status-badge ${statusClass}">
          <span class="status-dot"></span>
          <span>${statusText}</span>
        </div>
      </div>
      <div class="history-card-mid">
        <div class="history-spent-metrics">
          <span class="history-spent-value">Spent: ₹${trip.totalSpent.toFixed(2)}</span>
          <span class="history-budget-ref">Budget: ₹${trip.targetBudget.toFixed(2)}</span>
        </div>
        <div class="history-card-actions">
          <button class="history-card-btn reuse-trip-btn" title="Add items from this trip back to To-Buy list">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M16 3h5v5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 21H3v-5"/></svg>
            <span>Reuse</span>
          </button>
          <button class="history-card-btn delete-past-btn" title="Delete this record">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            <span>Delete</span>
          </button>
        </div>
      </div>
      <div class="history-card-details hidden" id="details-${trip.id}">
        <!-- Populated below -->
      </div>
    `;

    // Populate expanded items checklist details
    const detailsContainer = card.querySelector(`#details-${trip.id}`);
    trip.items.forEach(item => {
      const detailRow = document.createElement('div');
      detailRow.className = 'history-detail-row';
      detailRow.innerHTML = `
        <span class="history-detail-name">
          ${item.name || 'Unnamed Item'}
          <span class="history-detail-qty">(${item.quantity} ${item.unit})</span>
        </span>
        <span class="history-detail-total">₹${item.total.toFixed(2)}</span>
      `;
      detailsContainer.appendChild(detailRow);
    });

    // Expand/Collapse Details on click (except when clicking buttons)
    card.addEventListener('click', (e) => {
      if (e.target.closest('.history-card-btn')) return;
      detailsContainer.classList.toggle('hidden');
    });

    // Actions
    card.querySelector('.reuse-trip-btn').addEventListener('click', () => reuseTrip(trip.id));
    card.querySelector('.delete-past-btn').addEventListener('click', () => deleteTrip(trip.id));

    dom.historyList.appendChild(card);
  });
}

function renderPriceHistoryTable() {
  dom.priceHistoryTable.innerHTML = '';

  // Get only items with priceHistory records populated
  const itemsWithPriceHistory = state.items.filter(item => {
    return item.priceHistory && Object.keys(item.priceHistory).length > 0;
  });

  if (itemsWithPriceHistory.length === 0) {
    dom.priceHistoryEmpty.classList.remove('hidden');
    return;
  }

  dom.priceHistoryEmpty.classList.add('hidden');

  itemsWithPriceHistory.forEach(item => {
    const row = document.createElement('div');
    row.className = 'price-history-item-row';
    
    let pricesGridHtml = '';
    Object.keys(item.priceHistory).forEach(shopId => {
      const shopObj = state.shops.find(s => s.id === shopId);
      const shopName = shopObj ? shopObj.name : 'Unknown Shop';
      const record = item.priceHistory[shopId];
      pricesGridHtml += `
        <div class="price-history-record">
          <span class="price-history-shop">${shopName}</span>
          <span class="price-history-val">₹${record.price.toFixed(2)}/${item.unit === 'litres' ? 'L' : item.unit} <small style="color:var(--text-muted)">(${record.date.split(',')[0]})</small></span>
        </div>
      `;
    });

    row.innerHTML = `
      <div class="price-history-item-name">${item.name}</div>
      <div class="price-history-records-grid">
        ${pricesGridHtml}
      </div>
    `;

    dom.priceHistoryTable.appendChild(row);
  });
}

/* ==========================================================================
   Edit Master Item Overlay Modal Logic
   ========================================================================== */

function openEditItemModal(itemId) {
  currentEditingItemId = itemId;
  const item = state.items.find(i => i.id === itemId);
  if (!item) return;

  dom.modalTitle.innerText = `Edit: ${item.name || 'New Item'}`;
  dom.modalInputName.value = item.name || '';
  dom.modalInputPrice.value = item.estimatedPrice || '';
  dom.modalSelectUnit.value = item.unit || 'pcs';
  dom.modalInputNotes.value = item.notes || '';

  // Handle Favorite Star UI
  if (item.favorite) {
    dom.btnModalFav.classList.add('active');
  } else {
    dom.btnModalFav.classList.remove('active');
  }

  // Populate Categories drop down
  dom.modalSelectCategory.innerHTML = `<option value="">Uncategorized</option>`;
  state.categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.innerText = cat.name;
    if (cat.id === item.categoryId) {
      opt.selected = true;
    }
    dom.modalSelectCategory.appendChild(opt);
  });

  // Populate Shop Checklist
  dom.modalShopChecklist.innerHTML = '';
  if (state.shops.length === 0) {
    dom.modalShopChecklist.innerHTML = `<span style="font-size:0.8rem; color:var(--text-muted)">No custom shops created. Go to Database > Shops to add one.</span>`;
  } else {
    state.shops.forEach(shop => {
      const isAssigned = item.shopIds.includes(shop.id);
      const chkItem = document.createElement('label');
      chkItem.className = 'modal-checklist-item';
      chkItem.innerHTML = `
        <input type="checkbox" value="${shop.id}" ${isAssigned ? 'checked' : ''}>
        <span>${shop.name}</span>
      `;
      dom.modalShopChecklist.appendChild(chkItem);
    });
  }

  // Unhide backdrop
  dom.modalEditItem.classList.remove('hidden');
}

function closeEditItemModal() {
  currentEditingItemId = null;
  dom.modalEditItem.classList.add('hidden');
}

function saveEditItemModal() {
  if (!currentEditingItemId) return;
  const item = state.items.find(i => i.id === currentEditingItemId);
  if (!item) return;

  const nameVal = dom.modalInputName.value.trim();
  if (!nameVal) {
    alert('Please enter a valid item name.');
    return;
  }

  // Gather shop checklist choices
  const assignedShopIds = [];
  const checkboxes = dom.modalShopChecklist.querySelectorAll('input[type=checkbox]');
  checkboxes.forEach(chk => {
    if (chk.checked) {
      assignedShopIds.push(chk.value);
    }
  });

  // Update item
  item.name = nameVal;
  item.estimatedPrice = parseFloat(dom.modalInputPrice.value) || 0;
  item.unit = dom.modalSelectUnit.value;
  item.categoryId = dom.modalSelectCategory.value;
  item.shopIds = assignedShopIds;
  item.notes = dom.modalInputNotes.value.trim();
  item.favorite = dom.btnModalFav.classList.contains('active');

  // If item is active on current trip, run update
  if (item.active) {
    // If shop filter is on, and the item was unassigned from that shop, remove active status
    if (state.activeShopFilter !== 'all' && !item.shopIds.includes(state.activeShopFilter)) {
      item.active = false;
      item.bought = false;
      item.price = 0;
      item.total = 0;
    } else {
      // Re-trigger row calculations
      const activeShop = state.activeShopFilter;
      if (activeShop !== 'all' && item.priceHistory && item.priceHistory[activeShop]) {
        item.price = item.priceHistory[activeShop].price;
      } else {
        item.price = item.estimatedPrice;
      }
      
      const qty = parseFloat(item.quantity) || 0;
      if (item.price > 0) {
        if (item.unit === 'g' || item.unit === 'ml') {
          item.total = (qty / 1000) * item.price;
        } else {
          item.total = qty * item.price;
        }
      }
    }
  }

  saveState();
  calculateAndUpdateSummary();
  renderShoppingList();
  renderDatabase();
  closeEditItemModal();
}

/* ==========================================================================
   Dropdown Rendering Helper
   ========================================================================== */

function renderActiveShopDropdown() {
  // Retain selection
  const currentSelection = dom.selectActiveShop.value || 'all';

  dom.selectActiveShop.innerHTML = `<option value="all">All Shops</option>`;
  state.shops.forEach(shop => {
    const opt = document.createElement('option');
    opt.value = shop.id;
    opt.innerText = shop.name;
    dom.selectActiveShop.appendChild(opt);
  });

  // Re-bind value if exists
  if (state.shops.find(s => s.id === currentSelection)) {
    dom.selectActiveShop.value = currentSelection;
    state.activeShopFilter = currentSelection;
  } else {
    dom.selectActiveShop.value = 'all';
    state.activeShopFilter = 'all';
  }
}

/* ==========================================================================
   Checkout & Historical Workflows
   ========================================================================== */

function completeTrip() {
  const shopFilter = state.activeShopFilter;
  
  // Get currently bought active items matching shop filter
  const boughtItems = state.items.filter(item => {
    if (!item.active || !item.bought) return false;
    if (shopFilter !== 'all' && !item.shopIds.includes(shopFilter)) return false;
    return true;
  });

  if (boughtItems.length === 0) {
    alert('Your cart is empty! Check off items under "To Buy" before completing a trip.');
    return;
  }

  const cartTotal = boughtItems.reduce((sum, item) => sum + item.total, 0);

  const shopObj = state.shops.find(s => s.id === shopFilter);
  const shopLabel = shopObj ? shopObj.name : 'All Shops';

  if (confirm(`Complete trip at ${shopLabel}? Total spent is ₹${cartTotal.toFixed(2)}. This will save your bought items to History and clear them from your checklist.`)) {
    
    const timestamp = new Date();
    const dateStr = timestamp.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const pastTrip = {
      id: 'trip_' + Date.now(),
      date: dateStr,
      shopId: shopFilter,
      targetBudget: state.targetBudget,
      totalSpent: cartTotal,
      items: boughtItems.map(item => ({
        itemId: item.id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        pricePaid: item.price,
        total: item.total
      }))
    };

    // Update Price History for these items!
    boughtItems.forEach(item => {
      // Record price history per shop (or default to current filter)
      const recordedShopId = shopFilter !== 'all' ? shopFilter : (item.shopIds[0] || 'shop_unknown');
      
      if (!item.priceHistory) item.priceHistory = {};
      item.priceHistory[recordedShopId] = {
        price: item.price,
        date: dateStr
      };

      // Reset trip fields for these items
      item.active = false;
      item.bought = false;
      item.price = 0;
      item.total = 0;
    });

    // Save
    state.history.push(pastTrip);
    
    saveState();
    calculateAndUpdateSummary();
    renderShoppingList();
    renderHistory();
    
    // Direct directly to History
    switchTab('history');
  }
}

function reuseTrip(tripId) {
  const trip = state.history.find(t => t.id === tripId);
  if (!trip) return;

  if (confirm(`Clone all ${trip.items.length} items from this past trip back into your active list?`)) {
    
    trip.items.forEach(pastItem => {
      // Check if item exists in master list
      let masterItem = state.items.find(i => i.id === pastItem.itemId);
      
      if (!masterItem) {
        // If master item was deleted, recreate it
        masterItem = {
          id: pastItem.itemId,
          name: pastItem.name,
          categoryId: '',
          shopIds: trip.shopId !== 'all' ? [trip.shopId] : [],
          unit: pastItem.unit,
          estimatedPrice: pastItem.pricePaid,
          favorite: false,
          notes: 'Recreated from history',
          priceHistory: {}
        };
        state.items.push(masterItem);
      }

      // Populate current trip fields
      masterItem.active = true;
      masterItem.bought = false;
      masterItem.quantity = pastItem.quantity;
      masterItem.price = pastItem.pricePaid;
      
      // Auto conversion calculation
      if (masterItem.price > 0) {
        if (masterItem.unit === 'g' || masterItem.unit === 'ml') {
          masterItem.total = (masterItem.quantity / 1000) * masterItem.price;
        } else {
          masterItem.total = masterItem.quantity * masterItem.price;
        }
      } else {
        masterItem.total = 0;
      }
    });

    // Reset shop filter to match the reused trip's shop
    state.activeShopFilter = trip.shopId;
    dom.selectActiveShop.value = trip.shopId;

    saveState();
    calculateAndUpdateSummary();
    renderShoppingList();
    switchTab('shopping');
  }
}

function deleteTrip(tripId) {
  if (confirm('Delete this trip record from your history?')) {
    state.history = state.history.filter(t => t.id !== tripId);
    saveState();
    renderHistory();
  }
}

/* ==========================================================================
   Soft Delete & Recycle Bin Archive Architecture
   ========================================================================== */

let selectedArchiveIds = new Set();
let undoTimeout = null;
let currentUndoRecord = null;

function softDelete(type, id, name, originalData) {
  const timestamp = new Date();
  const dateStr = timestamp.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const timeStr = timestamp.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const archiveEntry = {
    archiveId: 'arc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    originalId: id,
    type: type, // 'shopping', 'database', 'shop', 'category'
    name: name || 'Unnamed Item',
    deletedDate: dateStr,
    deletedTime: timeStr,
    originalData: JSON.parse(JSON.stringify(originalData)) // Deep copy
  };

  state.archive.push(archiveEntry);
  saveState();

  // Show undo snackbar
  showUndoSnackbar(archiveEntry);
  
  // Re-render current list in case we are looking at it
  if (state.activeTab === 'archive') {
    renderArchive();
  }
}

function showUndoSnackbar(archiveEntry) {
  // Clear any existing timer
  if (undoTimeout) {
    clearTimeout(undoTimeout);
    undoTimeout = null;
  }
  
  currentUndoRecord = archiveEntry;
  
  if (!dom.undoSnackbar || !dom.snackbarMsg) return;

  let typeLabel = 'Record';
  if (archiveEntry.type === 'shopping') typeLabel = 'Shopping list item';
  else if (archiveEntry.type === 'database') typeLabel = 'Master item';
  else if (archiveEntry.type === 'shop') typeLabel = 'Shop';
  else if (archiveEntry.type === 'category') typeLabel = 'Category';

  dom.snackbarMsg.innerText = `✔ ${archiveEntry.name} (${typeLabel}) moved to Archive.`;
  dom.undoSnackbar.classList.remove('hidden');

  // Hide after 6 seconds
  undoTimeout = setTimeout(() => {
    hideUndoSnackbar();
  }, 6000);
}

function hideUndoSnackbar() {
  if (dom.undoSnackbar) {
    dom.undoSnackbar.classList.add('hidden');
  }
  currentUndoRecord = null;
  if (undoTimeout) {
    clearTimeout(undoTimeout);
    undoTimeout = null;
  }
}

function executeUndo() {
  if (!currentUndoRecord) return;
  restoreRecord(currentUndoRecord.archiveId);
  hideUndoSnackbar();
}

function restoreRecord(archiveId) {
  const index = state.archive.findIndex(entry => entry.archiveId === archiveId);
  if (index === -1) return;

  const entry = state.archive[index];
  
  if (entry.type === 'shopping') {
    const item = state.items.find(i => i.id === entry.originalId);
    if (item) {
      item.active = true;
      item.quantity = entry.originalData.quantity;
      item.unit = entry.originalData.unit;
      item.price = entry.originalData.price;
      item.total = entry.originalData.total;
      item.bought = entry.originalData.bought;
    }
  } else if (entry.type === 'database') {
    if (!state.items.find(i => i.id === entry.originalId)) {
      state.items.push(entry.originalData);
    }
  } else if (entry.type === 'shop') {
    if (!state.shops.find(s => s.id === entry.originalId)) {
      state.shops.push(entry.originalData);
    }
  } else if (entry.type === 'category') {
    if (!state.categories.find(c => c.id === entry.originalId)) {
      state.categories.push(entry.originalData);
    }
  }

  // Remove from archive list
  state.archive.splice(index, 1);
  saveState();
  
  // Re-calculate & Re-render everything
  calculateAndUpdateSummary();
  renderActiveShopDropdown();
  renderShoppingList();
  renderDatabase();
  renderDashboard();
  renderHistory();
  
  if (state.activeTab === 'archive') {
    renderArchive();
  }
}

function permanentlyDeleteArchiveEntries(archiveIds) {
  if (archiveIds.length === 0) return;

  const count = archiveIds.length;
  const promptMsg = count === 1 
    ? 'Delete selected item permanently?\n\nThis action cannot be undone.'
    : `Delete these ${count} items permanently?\n\nThis action cannot be undone.`;

  if (confirm(promptMsg)) {
    archiveIds.forEach(archiveId => {
      const entry = state.archive.find(e => e.archiveId === archiveId);
      if (!entry) return;

      // Clean up item associations permanently
      if (entry.type === 'shop') {
        const shopId = entry.originalId;
        state.items.forEach(item => {
          if (item.shopIds) {
            item.shopIds = item.shopIds.filter(id => id !== shopId);
          }
          if (item.priceHistory && item.priceHistory[shopId]) {
            delete item.priceHistory[shopId];
          }
        });
        if (state.activeShopFilter === shopId) {
          state.activeShopFilter = 'all';
          dom.selectActiveShop.value = 'all';
          suggestShopPrices();
        }
      } else if (entry.type === 'category') {
        const categoryId = entry.originalId;
        state.items.forEach(item => {
          if (item.categoryId === categoryId) {
            item.categoryId = '';
          }
        });
      }

      // Remove from archive list
      state.archive = state.archive.filter(e => e.archiveId !== archiveId);
      selectedArchiveIds.delete(archiveId);
    });

    saveState();
    
    // Refresh views
    calculateAndUpdateSummary();
    renderActiveShopDropdown();
    renderShoppingList();
    renderDatabase();
    renderDashboard();
    renderHistory();
    
    if (state.activeTab === 'archive') {
      renderArchive();
    }
  }
}

function renderArchive() {
  dom.archiveList.innerHTML = '';
  const searchVal = dom.inputArchiveSearch.value.toLowerCase().trim();

  const filteredArchive = state.archive.filter(entry => {
    return entry.name.toLowerCase().includes(searchVal) ||
           entry.type.toLowerCase().includes(searchVal);
  });

  if (filteredArchive.length === 0) {
    dom.archiveListEmpty.classList.remove('hidden');
    dom.archiveActionsBar.classList.add('hidden');
    dom.chkSelectAllArchive.checked = false;
    return;
  }

  dom.archiveListEmpty.classList.add('hidden');
  
  // Show actions bar if any entries are checked
  updateArchiveActionBarVisibility();

  // Draw list
  filteredArchive.forEach(entry => {
    const row = document.createElement('div');
    row.className = 'archive-item-row';
    row.dataset.id = entry.archiveId;

    let typeLabel = 'Record';
    let typeClass = '';
    if (entry.type === 'shopping') { typeLabel = 'Shopping List'; typeClass = 'category-pill'; }
    else if (entry.type === 'database') { typeLabel = 'Master Database'; typeClass = 'price-pill'; }
    else if (entry.type === 'shop') { typeLabel = 'Shop List'; }
    else if (entry.type === 'category') { typeLabel = 'Category List'; }

    const isChecked = selectedArchiveIds.has(entry.archiveId);

    row.innerHTML = `
      <div class="archive-item-left">
        <label class="checkbox-container">
          <input type="checkbox" class="archive-checkbox" ${isChecked ? 'checked' : ''}>
          <span class="checkmark"></span>
        </label>
        <div class="archive-item-details">
          <span class="archive-item-name">${entry.name}</span>
          <div class="archive-item-meta">
            <span class="pill-tag ${typeClass}">${typeLabel}</span>
            <span>Deleted: ${entry.deletedDate}, ${entry.deletedTime}</span>
          </div>
        </div>
      </div>
      <div class="archive-item-right">
        <button class="btn-icon-only restore-btn" title="Restore to original location">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M16 3h5v5"/></svg>
        </button>
        <button class="btn-icon-only text-btn danger delete-perm-btn" title="Delete permanently">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
      </div>
    `;

    // Event Bindings
    const chk = row.querySelector('.archive-checkbox');
    chk.addEventListener('change', () => {
      if (chk.checked) {
        selectedArchiveIds.add(entry.archiveId);
      } else {
        selectedArchiveIds.delete(entry.archiveId);
      }
      updateSelectAllCheckboxState(filteredArchive);
      updateArchiveActionBarVisibility();
    });

    row.querySelector('.restore-btn').addEventListener('click', () => {
      restoreRecord(entry.archiveId);
    });

    row.querySelector('.delete-perm-btn').addEventListener('click', () => {
      permanentlyDeleteArchiveEntries([entry.archiveId]);
    });

    dom.archiveList.appendChild(row);
  });
}

function updateArchiveActionBarVisibility() {
  if (selectedArchiveIds.size > 0) {
    dom.archiveActionsBar.classList.remove('hidden');
  } else {
    dom.archiveActionsBar.classList.add('hidden');
  }
}

function updateSelectAllCheckboxState(filteredArchive) {
  const allFilteredChecked = filteredArchive.every(entry => selectedArchiveIds.has(entry.archiveId));
  dom.chkSelectAllArchive.checked = allFilteredChecked;
}

/* ==========================================================================
   Tab Navigation & Control
   ========================================================================== */

function switchTab(tabName) {
  state.activeTab = tabName;
  saveState();

  // Reset active classes
  dom.tabShopping.classList.remove('active');
  dom.tabShopping.removeAttribute('aria-current');
  dom.tabDatabase.classList.remove('active');
  dom.tabDatabase.removeAttribute('aria-current');
  dom.tabDashboard.classList.remove('active');
  dom.tabDashboard.removeAttribute('aria-current');
  dom.tabHistory.classList.remove('active');
  dom.tabHistory.removeAttribute('aria-current');
  dom.tabArchive.classList.remove('active');
  dom.tabArchive.removeAttribute('aria-current');

  dom.viewShopping.classList.add('hidden');
  dom.viewDatabase.classList.add('hidden');
  dom.viewDashboard.classList.add('hidden');
  dom.viewHistory.classList.add('hidden');
  dom.viewArchive.classList.add('hidden');

  // Hide undo snackbar when switching tabs to prevent overlay issues
  hideUndoSnackbar();

  // Trigger correct view
  if (tabName === 'shopping') {
    dom.tabShopping.classList.add('active');
    dom.tabShopping.setAttribute('aria-current', 'page');
    dom.viewShopping.classList.remove('hidden');
    dom.budgetSummaryCard.classList.remove('hidden');
    dom.btnAddItem.classList.remove('hidden');
    renderShoppingList();
  } else if (tabName === 'database') {
    dom.tabDatabase.classList.add('active');
    dom.tabDatabase.setAttribute('aria-current', 'page');
    dom.viewDatabase.classList.remove('hidden');
    dom.budgetSummaryCard.classList.add('hidden');
    dom.btnAddItem.classList.add('hidden');
    renderDatabase();
  } else if (tabName === 'dashboard') {
    dom.tabDashboard.classList.add('active');
    dom.tabDashboard.setAttribute('aria-current', 'page');
    dom.viewDashboard.classList.remove('hidden');
    dom.budgetSummaryCard.classList.add('hidden');
    dom.btnAddItem.classList.add('hidden');
    renderDashboard();
  } else if (tabName === 'history') {
    dom.tabHistory.classList.add('active');
    dom.tabHistory.setAttribute('aria-current', 'page');
    dom.viewHistory.classList.remove('hidden');
    dom.budgetSummaryCard.classList.add('hidden');
    dom.btnAddItem.classList.add('hidden');
    renderHistory();
  } else if (tabName === 'archive') {
    dom.tabArchive.classList.add('active');
    dom.tabArchive.setAttribute('aria-current', 'page');
    dom.viewArchive.classList.remove('hidden');
    dom.budgetSummaryCard.classList.add('hidden');
    dom.btnAddItem.classList.add('hidden');
    renderArchive();
  }
}

function switchShoppingSubTab(subTab) {
  state.shoppingSubTab = subTab;
  saveState();

  if (subTab === 'tobuy') {
    dom.subtabToBuy.classList.add('active');
    dom.subtabBought.classList.remove('active');
    dom.subviewToBuy.classList.remove('hidden');
    dom.subviewBought.classList.add('hidden');
  } else {
    dom.subtabBought.classList.add('active');
    dom.subtabToBuy.classList.remove('active');
    dom.subviewBought.classList.remove('hidden');
    dom.subviewToBuy.classList.add('hidden');
  }
}

function switchDbSubTab(subTab) {
  state.dbSubTab = subTab;
  saveState();

  dom.subtabDbItems.classList.remove('active');
  dom.subtabDbShops.classList.remove('active');
  dom.subtabDbCategories.classList.remove('active');

  if (subTab === 'items') {
    dom.subtabDbItems.classList.add('active');
  } else if (subTab === 'shops') {
    dom.subtabDbShops.classList.add('active');
  } else if (subTab === 'categories') {
    dom.subtabDbCategories.classList.add('active');
  }
  renderDatabase();
}

function switchDashSubTab(subTab) {
  state.dashSubTab = subTab;
  saveState();

  if (subTab === 'shops') {
    dom.subtabDashShops.classList.add('active');
    dom.subtabDashCategories.classList.remove('active');
  } else {
    dom.subtabDashCategories.classList.add('active');
    dom.subtabDashShops.classList.remove('active');
  }
  renderDashboard();
}

function switchHistSubTab(subTab) {
  state.histSubTab = subTab;
  saveState();

  if (subTab === 'trips') {
    dom.subtabHistTrips.classList.add('active');
    dom.subtabHistPrices.classList.remove('active');
  } else {
    dom.subtabHistPrices.classList.add('active');
    dom.subtabHistTrips.classList.remove('active');
  }
  renderHistory();
}

/* ==========================================================================
   Application Initialization & Events Binding
   ========================================================================== */

function init() {
  loadState();

  // Render Target Budget in Input Box
  dom.inputTargetBudget.value = state.targetBudget;
  dom.inputTargetBudget.addEventListener('input', () => {
    state.targetBudget = parseFloat(dom.inputTargetBudget.value) || 0;
    saveState();
    calculateAndUpdateSummary();
  });

  // Bind Bottom Nav Tabs
  dom.tabShopping.addEventListener('click', () => switchTab('shopping'));
  dom.tabDatabase.addEventListener('click', () => switchTab('database'));
  dom.tabDashboard.addEventListener('click', () => switchTab('dashboard'));
  dom.tabHistory.addEventListener('click', () => switchTab('history'));
  dom.tabArchive.addEventListener('click', () => switchTab('archive'));

  // Bind Sub Tabs Toggles
  dom.subtabToBuy.addEventListener('click', () => switchShoppingSubTab('tobuy'));
  dom.subtabBought.addEventListener('click', () => switchShoppingSubTab('bought'));
  
  dom.subtabDbItems.addEventListener('click', () => switchDbSubTab('items'));
  dom.subtabDbShops.addEventListener('click', () => switchDbSubTab('shops'));
  dom.subtabDbCategories.addEventListener('click', () => switchDbSubTab('categories'));
  
  dom.subtabDashShops.addEventListener('click', () => switchDashSubTab('shops'));
  dom.subtabDashCategories.addEventListener('click', () => switchDashSubTab('categories'));
  
  dom.subtabHistTrips.addEventListener('click', () => switchHistSubTab('trips'));
  dom.subtabHistPrices.addEventListener('click', () => switchHistSubTab('prices'));

  // Bind Shop dropdown filter
  dom.selectActiveShop.addEventListener('change', () => {
    state.activeShopFilter = dom.selectActiveShop.value;
    saveState();
    suggestShopPrices();
    calculateAndUpdateSummary();
    renderShoppingList();
  });

  // Complete Trip click
  dom.btnCompleteTrip.addEventListener('click', completeTrip);

  // Search input change on item catalog
  dom.inputItemSearch.addEventListener('input', renderMasterItemsList);

  // Shop CRUD
  dom.btnAddShop.addEventListener('click', () => {
    const nameVal = dom.inputAddShop.value.trim();
    if (!nameVal) return;
    
    // Prevent duplicate name
    if (state.shops.find(s => s.name.toLowerCase() === nameVal.toLowerCase())) {
      alert('Shop already exists!');
      return;
    }

    state.shops.push({
      id: 'shop_' + Date.now(),
      name: nameVal
    });
    
    dom.inputAddShop.value = '';
    saveState();
    renderActiveShopDropdown();
    renderMasterShopsList();
  });

  // Category CRUD
  dom.btnAddCategory.addEventListener('click', () => {
    const nameVal = dom.inputAddCategory.value.trim();
    if (!nameVal) return;

    if (state.categories.find(c => c.name.toLowerCase() === nameVal.toLowerCase())) {
      alert('Category already exists!');
      return;
    }

    state.categories.push({
      id: 'cat_' + Date.now(),
      name: nameVal
    });

    dom.inputAddCategory.value = '';
    saveState();
    renderMasterCategoriesList();
  });

  // Modal Actions
  dom.btnModalClose.addEventListener('click', closeEditItemModal);
  dom.btnModalCancel.addEventListener('click', closeEditItemModal);
  dom.btnModalSave.addEventListener('click', saveEditItemModal);
  dom.btnModalFav.addEventListener('click', () => {
    dom.btnModalFav.classList.toggle('active');
  });

  // Dashboard Entity Select Listener
  dom.selectDashEntity.addEventListener('change', () => {
    const id = dom.selectDashEntity.value;
    state.selectedDashEntityId = id;
    saveState();
    
    if (state.dashSubTab === 'shops') {
      calculateAndRenderShopDashboard(id);
    } else {
      calculateAndRenderCategoryDashboard(id);
    }
  });

  // Floating Action Button (Quick create blank item & edit)
  dom.btnAddItem.addEventListener('click', () => {
    const activeShop = state.activeShopFilter;
    const newItem = {
      id: 'item_' + Date.now(),
      name: '',
      categoryId: '',
      shopIds: activeShop !== 'all' ? [activeShop] : [],
      unit: 'pcs',
      estimatedPrice: '',
      favorite: false,
      notes: '',
      priceHistory: {},
      
      // Add active directly to trip
      active: true,
      quantity: 1,
      price: '',
      total: 0,
      bought: state.shoppingSubTab === 'bought'
    };

    state.items.push(newItem);
    saveState();
    
    // Open edit modal directly for the newly created item
    openEditItemModal(newItem.id);
  });

  dom.btnReset.addEventListener('click', () => {
    if (confirm('Are you sure you want to completely RESET all data? This will wipe your lists, custom shops, categories, and shopping history.')) {
      resetToDefault();
      dom.inputTargetBudget.value = state.targetBudget;
      renderActiveShopDropdown();
      calculateAndUpdateSummary();
      switchTab('shopping');
    }
  });

  dom.btnClearHistory.addEventListener('click', () => {
    if (confirm('Permanently clear all shopping history?')) {
      state.history = [];
      saveState();
      renderHistory();
    }
  });

  // FAB addition inside Master Item view
  dom.btnAddMasterItem.addEventListener('click', () => {
    const newItem = {
      id: 'item_' + Date.now(),
      name: '',
      categoryId: '',
      shopIds: [],
      unit: 'pcs',
      estimatedPrice: '',
      favorite: false,
      notes: '',
      priceHistory: {},
      active: false,
      quantity: 1,
      price: '',
      total: 0,
      bought: false
    };

    state.items.push(newItem);
    saveState();
    openEditItemModal(newItem.id);
  });

  // Undo Snackbar trigger
  dom.btnSnackbarUndo.addEventListener('click', executeUndo);

  // Empty Archive trigger
  dom.btnEmptyArchive.addEventListener('click', () => {
    if (!state.archive || state.archive.length === 0) return;
    const allArchiveIds = state.archive.map(entry => entry.archiveId);
    permanentlyDeleteArchiveEntries(allArchiveIds);
  });

  // Restore Selected trigger
  dom.btnRestoreSelected.addEventListener('click', () => {
    if (selectedArchiveIds.size === 0) return;
    const idsToRestore = Array.from(selectedArchiveIds);
    idsToRestore.forEach(id => restoreRecord(id));
    selectedArchiveIds.clear();
    updateArchiveActionBarVisibility();
  });

  // Delete Selected Permanently trigger
  dom.btnDeleteSelectedPerm.addEventListener('click', () => {
    if (selectedArchiveIds.size === 0) return;
    const idsToDelete = Array.from(selectedArchiveIds);
    permanentlyDeleteArchiveEntries(idsToDelete);
  });

  // Search input change on Archive list
  dom.inputArchiveSearch.addEventListener('input', () => {
    renderArchive();
  });

  // Select all checkbox in Archive list
  dom.chkSelectAllArchive.addEventListener('change', () => {
    const searchVal = dom.inputArchiveSearch.value.toLowerCase().trim();
    const filteredArchive = state.archive.filter(entry => {
      return entry.name.toLowerCase().includes(searchVal) ||
             entry.type.toLowerCase().includes(searchVal);
    });

    if (dom.chkSelectAllArchive.checked) {
      filteredArchive.forEach(entry => selectedArchiveIds.add(entry.archiveId));
    } else {
      filteredArchive.forEach(entry => selectedArchiveIds.delete(entry.archiveId));
    }
    renderArchive();
  });

  // Calculate, build dropdowns, and draw
  renderActiveShopDropdown();
  calculateAndUpdateSummary();
  switchTab('shopping');
}

// Start app and register Service Worker
window.addEventListener('DOMContentLoaded', () => {
  init();
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker registered successfully:', reg.scope))
      .catch(err => console.error('Service Worker registration failed:', err));
  }
});
