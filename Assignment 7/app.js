/**
 * AetherTask - Core Application Logic
 * Demonstrates DOM APIs, Event propagation, Attributes vs Properties, and Browser pipelines.
 */

// ==========================================================================
// 1. STATE MANAGEMENT & LOCAL STORAGE
// ==========================================================================

let state = {
  tasks: [],
  filter: 'all',
  searchQuery: '',
  theme: 'dark',
  propagationMode: 'bubbling' // 'bubbling' or 'capturing'
};

// Load initial state from Local Storage
function loadState() {
  const savedTasks = localStorage.getItem('aethertask_tasks');
  const savedTheme = localStorage.getItem('aethertask_theme');
  
  if (savedTasks) {
    state.tasks = JSON.parse(savedTasks);
  } else {
    // Default seed tasks for demo purposes
    state.tasks = [
      { id: '1', title: 'Understand Tokenization vs Parsing', category: 'learning', status: 'completed' },
      { id: '2', title: 'Master Event Delegation on Task Boards', category: 'work', status: 'pending' },
      { id: '3', title: 'Perform Attributes vs Properties comparison', category: 'learning', status: 'pending' }
    ];
  }
  
  if (savedTheme) {
    state.theme = savedTheme;
  }
  
  document.body.setAttribute('data-theme', state.theme);
  updateThemeToggleUI();
}

function saveTasksToStorage() {
  localStorage.setItem('aethertask_tasks', JSON.stringify(state.tasks));
}

function saveThemeToStorage() {
  localStorage.setItem('aethertask_theme', state.theme);
}


// ==========================================================================
// 2. THEME TOGGLE FUNCTIONALITY
// ==========================================================================

const themeToggleBtn = document.getElementById('theme-toggle-btn');

themeToggleBtn.addEventListener('click', () => {
  // Use classList and dataset APIs as requested
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  // Update via setAttribute
  document.body.setAttribute('data-theme', newTheme);
  state.theme = newTheme;
  
  // Update via dataset (demonstration)
  document.body.dataset.theme = newTheme;
  
  updateThemeToggleUI();
  saveThemeToStorage();
});

function updateThemeToggleUI() {
  const themeText = themeToggleBtn.querySelector('.theme-text');
  const themeIcon = themeToggleBtn.querySelector('.theme-icon');
  if (state.theme === 'dark') {
    themeText.textContent = 'Light Mode';
    if (themeIcon) themeIcon.className = 'theme-icon fa-solid fa-sun';
  } else {
    themeText.textContent = 'Dark Mode';
    if (themeIcon) themeIcon.className = 'theme-icon fa-solid fa-moon';
  }
}


// ==========================================================================
// 3. TASK CREATION & DOM MANIPULATION MODULE
// ==========================================================================

const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title-input');
const taskCategorySelect = document.getElementById('task-category-select');
const taskListContainer = document.getElementById('task-list');

// Category colors for indicator strips
const CATEGORY_COLORS = {
  work: '#3b82f6',
  personal: '#10b981',
  learning: '#8b5cf6',
  urgent: '#f59e0b'
};

// Form submission to create a task
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const title = taskTitleInput.value.trim();
  const category = taskCategorySelect.value;
  
  if (!title) {
    // Demonstration of after() DOM manipulation: Custom validation message
    showInputValidationError("Task title cannot be blank!");
    return;
  }
  
  createAndAddCustomTask(title, category);
  taskForm.reset();
});

// Demonstrating before() / after() DOM methods for notification inserts
function showInputValidationError(msg) {
  // Check if error badge already exists
  const existingError = document.querySelector('.input-error-msg');
  if (existingError) existingError.remove();
  
  const errorBadge = document.createElement('div');
  errorBadge.className = 'input-error-msg';
  errorBadge.style.color = '#ef4444';
  errorBadge.style.fontSize = '0.8rem';
  errorBadge.style.marginTop = '0.25rem';
  errorBadge.style.fontWeight = '500';
  errorBadge.appendChild(document.createTextNode(msg));
  
  // Use after() DOM method to insert immediately after the title input field
  taskTitleInput.after(errorBadge);
  
  setTimeout(() => {
    errorBadge.remove(); // Use remove() DOM method to discard
  }, 3000);
}

// Function that builds task card programmatically
function createAndAddCustomTask(title, category) {
  const newTaskId = Date.now().toString();
  const newTask = {
    id: newTaskId,
    title: title,
    category: category,
    status: 'pending'
  };
  
  state.tasks.push(newTask);
  saveTasksToStorage();
  
  // Render new task with spawn animation
  const cardElement = createTaskCardElement(newTask);
  cardElement.classList.add('newly-spawned');
  
  // Hide empty state if visible
  const emptyState = document.getElementById('empty-state');
  if (emptyState && emptyState.style.display !== 'none') {
    emptyState.style.display = 'none';
  }
  
  // Use prepend() DOM method to push new tasks to the very top of the board
  taskListContainer.prepend(cardElement);
  
  updateCountersAndStats();
}

/**
 * Task Card Creation using DOM APIs
 * Demonstrates: createElement(), createTextNode(), append(), prepend(), setAttribute, dataset
 */
function createTaskCardElement(task) {
  const card = document.createElement('div');
  card.className = 'task-card';
  
  // Custom Data Attributes (Required)
  // Approach 1: Using setAttribute()
  card.setAttribute('data-id', task.id);
  // Approach 2: Using dataset property
  card.dataset.status = task.status;
  card.dataset.category = task.category;
  
  // Set custom CSS variable for color-strip indicator
  card.style.setProperty('--category-color', CATEGORY_COLORS[task.category] || '#94a3b8');
  
  // Create Inner Layout
  const contentContainer = document.createElement('div');
  contentContainer.className = 'task-card-content';
  
  // Title Row
  const titleRow = document.createElement('div');
  titleRow.className = 'task-card-header';
  
  const titleSpan = document.createElement('span');
  titleSpan.className = 'task-title';
  // Use createTextNode() for secure title injection (XSS proof)
  const titleText = document.createTextNode(task.title);
  titleSpan.appendChild(titleText);
  
  const categoryBadge = document.createElement('span');
  categoryBadge.className = 'task-category-badge';
  categoryBadge.appendChild(document.createTextNode(task.category));
  
  titleRow.append(titleSpan, categoryBadge);
  
  // Meta Info Row
  const metaRow = document.createElement('div');
  metaRow.className = 'task-meta';
  
  const idMeta = document.createElement('span');
  idMeta.innerHTML = `<i class="fa-solid fa-fingerprint"></i> ID: ${task.id.substring(task.id.length - 4)}`;
  
  metaRow.append(idMeta);
  contentContainer.append(titleRow, metaRow);
  
  // Actions Panel
  const actionsContainer = document.createElement('div');
  actionsContainer.className = 'task-card-actions';
  
  // Complete Button
  const completeBtn = document.createElement('button');
  completeBtn.className = 'btn-action btn-complete';
  completeBtn.setAttribute('title', 'Mark Complete');
  completeBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  
  // Edit Button
  const editBtn = document.createElement('button');
  editBtn.className = 'btn-action btn-edit';
  editBtn.setAttribute('title', 'Edit Title');
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  
  // Delete Button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn-action btn-delete';
  deleteBtn.setAttribute('title', 'Delete Task');
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  
  // Use append() DOM method to bundle control actions
  actionsContainer.append(completeBtn, editBtn, deleteBtn);
  
  // Combine all pieces inside the card
  card.append(contentContainer, actionsContainer);
  
  return card;
}


// ==========================================================================
// 4. EVENT DELEGATION MODULE
// ==========================================================================

/**
 * Event Delegation: A single click event listener attached to the parent `#task-list`.
 * Decides task updates depending on the event target element clicked inside.
 */
taskListContainer.addEventListener('click', (event) => {
  const target = event.target;
  
  // Find the closest task card ancestor to retrieve data attributes
  const taskCard = target.closest('.task-card');
  if (!taskCard) return;
  
  const taskId = taskCard.getAttribute('data-id');
  const taskIndex = state.tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return;
  
  // 1. Complete Button Clicked
  if (target.closest('.btn-complete')) {
    toggleTaskCompletion(taskIndex, taskCard);
  }
  
  // 2. Edit Button Clicked
  else if (target.closest('.btn-edit')) {
    initiateTaskInlineEditing(taskIndex, taskCard);
  }
  
  // 3. Delete Button Clicked
  else if (target.closest('.btn-delete')) {
    deleteSingleTask(taskIndex, taskCard);
  }
});

// Complete Task Logic
function toggleTaskCompletion(index, cardElement) {
  const task = state.tasks[index];
  const newStatus = task.status === 'completed' ? 'pending' : 'completed';
  
  // Update state
  task.status = newStatus;
  saveTasksToStorage();
  
  // Demonstrating Attributes vs Properties operations on the card element
  // Approach 1: Check attribute existence
  if (cardElement.hasAttribute('data-status')) {
    // Approach 2: Mutate attribute via setAttribute()
    cardElement.setAttribute('data-status', newStatus);
  }
  // Approach 3: Mutate via dataset
  cardElement.dataset.status = newStatus;
  
  // Use prepend() or append() to move card visually (visual showcase of prepend/append)
  if (newStatus === 'completed') {
    // If completed, let's prepend a completed badge to the card title
    const header = cardElement.querySelector('.task-card-header');
    
    // Check if it already exists
    if (!cardElement.querySelector('.completed-indicator')) {
      const indicator = document.createElement('span');
      indicator.className = 'completed-indicator';
      indicator.style.color = '#10b981';
      indicator.style.fontSize = '0.9rem';
      indicator.innerHTML = '<i class="fa-solid fa-circle-check"></i> ';
      // Prepend completion checkmark icon inside the title header container
      header.prepend(indicator);
    }
  } else {
    const indicator = cardElement.querySelector('.completed-indicator');
    if (indicator) indicator.remove();
  }
  
  updateCountersAndStats();
}

// Inline Task Editing Logic using replaceWith()
function initiateTaskInlineEditing(index, cardElement) {
  const task = state.tasks[index];
  
  // Create inline edit form container
  const editForm = document.createElement('form');
  editForm.className = 'edit-card-form';
  
  const inputRow = document.createElement('div');
  inputRow.className = 'edit-input-row';
  
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.value = task.title;
  titleInput.required = true;
  titleInput.className = 'edit-title-input';
  
  const categorySelect = document.createElement('select');
  categorySelect.className = 'edit-category-select';
  categorySelect.innerHTML = `
    <option value="work" ${task.category === 'work' ? 'selected' : ''}>💼 Work</option>
    <option value="personal" ${task.category === 'personal' ? 'selected' : ''}>👤 Personal</option>
    <option value="learning" ${task.category === 'learning' ? 'selected' : ''}>📚 Learning</option>
    <option value="urgent" ${task.category === 'urgent' ? 'selected' : ''}>⚡ Urgent</option>
  `;
  
  inputRow.append(titleInput, categorySelect);
  
  const actionsRow = document.createElement('div');
  actionsRow.className = 'edit-actions-row';
  
  const saveBtn = document.createElement('button');
  saveBtn.type = 'submit';
  saveBtn.className = 'btn btn-primary btn-sm';
  saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save';
  
  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'btn btn-secondary btn-sm';
  cancelBtn.innerHTML = 'Cancel';
  
  actionsRow.append(saveBtn, cancelBtn);
  editForm.append(inputRow, actionsRow);
  
  // ==========================================
  // DOM Manipulation: replaceWith() Demonstration
  // ==========================================
  // Replace the original task card with the editable form card
  cardElement.replaceWith(editForm);
  titleInput.focus();
  
  // Submit edit form
  editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTitle = titleInput.value.trim();
    const newCategory = categorySelect.value;
    
    if (!newTitle) return;
    
    // Update local state
    task.title = newTitle;
    task.category = newCategory;
    saveTasksToStorage();
    
    // Re-render task card element
    const updatedCard = createTaskCardElement(task);
    
    // Replace inline form back with the updated task card
    editForm.replaceWith(updatedCard);
    updateCountersAndStats();
  });
  
  // Cancel button
  cancelBtn.addEventListener('click', () => {
    // Replace form back with the original unmodified card element
    editForm.replaceWith(cardElement);
  });
}

// Delete Task Logic
function deleteSingleTask(index, cardElement) {
  // Visual fade out animation first
  cardElement.style.opacity = '0';
  cardElement.style.transform = 'scale(0.9)';
  cardElement.style.transition = 'all 0.3s ease';
  
  setTimeout(() => {
    // Remove from state array
    state.tasks.splice(index, 1);
    saveTasksToStorage();
    
    // ==========================================
    // DOM Manipulation: remove() Demonstration
    // ==========================================
    cardElement.remove();
    
    updateCountersAndStats();
    checkEmptyState();
  }, 250);
}


// ==========================================================================
// 5. SEARCH & CATEGORY FILTERS & STATS
// ==========================================================================

const taskSearchInput = document.getElementById('task-search-input');
const clearAllBtn = document.getElementById('clear-all-btn');
const filterIndicator = document.getElementById('filter-indicator');

// Input search listener
taskSearchInput.addEventListener('input', (e) => {
  state.searchQuery = e.target.value.toLowerCase().trim();
  renderTasks();
});

// Category pills filters
const filterContainer = document.querySelector('.filter-pills');
filterContainer.addEventListener('click', (e) => {
  const pill = e.target.closest('.pill');
  if (!pill) return;
  
  // Toggle active class on pills
  const filterPills = filterContainer.querySelectorAll('.pill');
  filterPills.forEach(p => p.classList.remove('active'));
  pill.classList.add('active');
  
  // Update state filter
  state.filter = pill.getAttribute('data-filter');
  
  // Update UI tag
  filterIndicator.textContent = `Showing: ${state.filter.toUpperCase()}`;
  
  renderTasks();
});

// Clear Completed Tasks Action
clearAllBtn.addEventListener('click', () => {
  // Keep only pending tasks in state
  state.tasks = state.tasks.filter(t => t.status === 'pending');
  saveTasksToStorage();
  
  renderTasks();
  updateCountersAndStats();
});

// Render Task Board using DocumentFragment (Required/Bonus)
function renderTasks() {
  // Clear previous contents
  taskListContainer.innerHTML = '';
  
  // Filter state tasks
  const filteredTasks = state.tasks.filter(task => {
    const matchesCategory = state.filter === 'all' || task.category === state.filter;
    const matchesSearch = task.title.toLowerCase().includes(state.searchQuery);
    return matchesCategory && matchesSearch;
  });
  
  if (filteredTasks.length === 0) {
    checkEmptyState();
    return;
  }
  
  // Hide empty state
  const emptyState = document.getElementById('empty-state');
  if (emptyState) emptyState.style.display = 'none';
  
  // Create DocumentFragment for batch appending performance (Best Practice)
  const fragment = document.createDocumentFragment();
  
  filteredTasks.forEach(task => {
    const card = createTaskCardElement(task);
    
    // Add completed check badge if completed
    if (task.status === 'completed') {
      const header = card.querySelector('.task-card-header');
      const indicator = document.createElement('span');
      indicator.className = 'completed-indicator';
      indicator.style.color = '#10b981';
      indicator.style.fontSize = '0.9rem';
      indicator.innerHTML = '<i class="fa-solid fa-circle-check"></i> ';
      header.prepend(indicator);
    }
    
    fragment.appendChild(card);
  });
  
  // Append fragment to DOM once (only 1 layout reflow triggered)
  taskListContainer.appendChild(fragment);
}

function checkEmptyState() {
  const emptyState = document.getElementById('empty-state');
  if (state.tasks.length === 0) {
    taskListContainer.innerHTML = '';
    
    const div = document.createElement('div');
    div.className = 'empty-state';
    div.id = 'empty-state';
    div.innerHTML = `
      <i class="fa-solid fa-feather-pointed empty-icon"></i>
      <p>Your task space is clear. Fill the form to spawn a new task card!</p>
    `;
    taskListContainer.appendChild(div);
  } else if (taskListContainer.children.length === 0) {
    const div = document.createElement('div');
    div.className = 'empty-state';
    div.id = 'empty-state';
    div.innerHTML = `
      <i class="fa-solid fa-magnifying-glass-minus empty-icon"></i>
      <p>No tasks match the active filters or search phrase.</p>
    `;
    taskListContainer.appendChild(div);
  }
}

function updateCountersAndStats() {
  const total = state.tasks.length;
  const completed = state.tasks.filter(t => t.status === 'completed').length;
  const pending = total - completed;
  
  document.getElementById('pending-count').textContent = pending;
  document.getElementById('completed-count').textContent = completed;
  
  const progressBar = document.getElementById('task-progress');
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  progressBar.style.width = `${percentage}%`;
}


// ==========================================================================
// 6. LAB 01: ATTRIBUTES VS PROPERTIES playground
// ==========================================================================

const inspectInput = document.getElementById('inspect-input');
const propOutput = document.getElementById('prop-output');
const attrOutput = document.getElementById('attr-output');
const setAttrBtn = document.getElementById('set-attr-btn');
const resetInspectBtn = document.getElementById('reset-inspect-btn');

function updateInspectOutputs() {
  // Property (live state of object in memory)
  const propVal = inspectInput.value;
  propOutput.textContent = `"${propVal}"`;
  
  // Attribute (HTML source markup representation)
  const attrVal = inspectInput.getAttribute('value');
  attrOutput.textContent = attrVal === null ? 'null' : `"${attrVal}"`;
}

// Initial update
updateInspectOutputs();

// Trigger update on typing (captures live property changes)
inspectInput.addEventListener('input', () => {
  updateInspectOutputs();
});

// Force Attribute update via setAttribute()
setAttrBtn.addEventListener('click', () => {
  // Alter HTML attribute in markup
  inspectInput.setAttribute('value', 'Updated via setAttribute()!');
  updateInspectOutputs();
});

// Reset inspector state
resetInspectBtn.addEventListener('click', () => {
  // Remove manually typed input value from property
  inspectInput.value = 'Initial HTML Value';
  // Restore original attribute value
  inspectInput.setAttribute('value', 'Initial HTML Value');
  updateInspectOutputs();
});


// ==========================================================================
// 7. LAB 02: EVENT PROPAGATION SANDBOX (Bubbling & Capturing)
// ==========================================================================

const gpNode = document.getElementById('gp-node');
const parentNode = document.getElementById('parent-node');
const childNode = document.getElementById('child-node');
const consoleLogs = document.getElementById('console-logs');
const clearConsoleBtn = document.getElementById('clear-console-btn');

const modeBubbleBtn = document.getElementById('mode-bubble-btn');
const modeCaptureBtn = document.getElementById('mode-capture-btn');

// Logs print helper
function logEvent(elementName, phaseCode) {
  const phaseNames = {
    1: 'Capturing',
    2: 'At Target',
    3: 'Bubbling'
  };
  
  const phaseClass = phaseCode === 1 ? 'capture' : 'bubble';
  
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  
  const time = new Date().toLocaleTimeString().split(' ')[0];
  
  entry.innerHTML = `
    <span>⚡ Click processed at <strong>${elementName}</strong></span>
    <div>
      <span class="log-phase ${phaseClass}">${phaseNames[phaseCode]}</span>
      <span class="log-time">[${time}]</span>
    </div>
  `;
  
  const placeholder = consoleLogs.querySelector('.console-placeholder');
  if (placeholder) placeholder.remove();
  
  consoleLogs.appendChild(entry);
  consoleLogs.scrollTop = consoleLogs.scrollHeight;
  
  // Also log to browser developer console (Required)
  console.log(`%c[PROPAGATION LOG] Phase: ${phaseNames[phaseCode]} | Element: ${elementName}`, 
    phaseCode === 1 ? 'color: #f59e0b; font-weight: bold;' : 'color: #6366f1; font-weight: bold;'
  );
}

// Reset Console Logs
clearConsoleBtn.addEventListener('click', () => {
  consoleLogs.innerHTML = '<div class="console-placeholder">Logs cleared. Click buttons to register events...</div>';
});

// Mode Selector
modeBubbleBtn.addEventListener('click', () => {
  state.propagationMode = 'bubbling';
  modeBubbleBtn.classList.add('active');
  modeCaptureBtn.classList.remove('active');
  rebindPropagationListeners();
});

modeCaptureBtn.addEventListener('click', () => {
  state.propagationMode = 'capturing';
  modeCaptureBtn.classList.add('active');
  modeBubbleBtn.classList.remove('active');
  rebindPropagationListeners();
});

// Animation helper for propagation visualization
function animateNodePulse(nodeId, delay, phase) {
  const element = document.getElementById(nodeId);
  const pulseClass = phase === 'capturing' ? 'pulse-capture' : 'pulse-bubble';
  
  setTimeout(() => {
    element.classList.add(pulseClass);
    setTimeout(() => {
      element.classList.remove(pulseClass);
    }, 400);
  }, delay);
}

// Handlers for click events
const gpHandler = (e) => {
  logEvent('Grandparent Node', e.eventPhase);
};

const parentHandler = (e) => {
  logEvent('Parent Node', e.eventPhase);
};

const childHandler = (e) => {
  logEvent('Child Button', e.eventPhase);
  
  // Trigger SVG/CSS visual flow animations
  if (state.propagationMode === 'capturing') {
    // Grandparent -> Parent -> Child
    animateNodePulse('gp-node', 0, 'capturing');
    animateNodePulse('parent-node', 200, 'capturing');
    animateNodePulse('child-node', 400, 'capturing');
  } else {
    // Child -> Parent -> Grandparent
    animateNodePulse('child-node', 0, 'bubbling');
    animateNodePulse('parent-node', 200, 'bubbling');
    animateNodePulse('gp-node', 400, 'bubbling');
  }
};

// Rebind Event Listeners based on Bubbling vs Capturing mode selected
function rebindPropagationListeners() {
  // Remove existing ones to clean up
  gpNode.removeEventListener('click', gpHandler, true);
  gpNode.removeEventListener('click', gpHandler, false);
  parentNode.removeEventListener('click', parentHandler, true);
  parentNode.removeEventListener('click', parentHandler, false);
  childNode.removeEventListener('click', childHandler, true);
  childNode.removeEventListener('click', childHandler, false);
  
  const useCapture = state.propagationMode === 'capturing';
  
  // Register with appropriate capture flag!
  gpNode.addEventListener('click', gpHandler, useCapture);
  parentNode.addEventListener('click', parentHandler, useCapture);
  childNode.addEventListener('click', childHandler, useCapture);
}

// Initial Listeners binding
rebindPropagationListeners();


// ==========================================================================
// 8. LAB 03: RENDERING PIPELINE VISUALIZATION
// ==========================================================================

const pipelineNodes = document.querySelectorAll('.pipeline-step:not(.dummy-step)');
const pipelineDetailsBox = document.getElementById('pipeline-details');

const PIPELINE_DB = {
  html: {
    title: '1a. HTML Input Raw Bytes',
    subtitle: 'Source Code Delivery',
    desc: 'The browser receives raw bytes of HTML from the network connection or local cache. These bytes are representing characters in a specific encoding (e.g. UTF-8). At this stage, the browser has no understanding of markup, only numbers representing characters.',
    code: `Raw bytes received:
0x3C 0x68 0x74 0x6D 0x6C 0x3E ... // represents "<html>"`
  },
  tokenization: {
    title: '2. Tokenization (Lexical Analysis)',
    subtitle: 'Character Streams to Token Streams',
    desc: 'The tokenizers parse characters into discrete tokens: StartTags, EndTags, Attribute Names/Values, and Character data. It acts as a state machine processing character-by-character. For instance, when it encounters "<", it enters tag-open state, and tokens like "StartTag: html" are spawned.',
    code: `Input: <html><body>Hello</body></html>
Tokens emitted:
1. StartTag: html
2. StartTag: body
3. CharacterData: "Hello"
4. EndTag: body
5. EndTag: html`
  },
  parsing: {
    title: '3. HTML Parsing & Tree Construction',
    subtitle: 'Semantic Rules Engine',
    desc: 'The parser consumes tokens emitted by tokenization and maps them to a nested structural representation. It handles malformed HTML graciously (using spec-defined error correction rules) and maintains a stack of open elements to determine proper tree parent-child relations.',
    code: `// Stack-based construction
Token: StartTag html -> push "HTML" to stack & create HTMLHtmlElement
Token: StartTag body -> push "BODY" as child of "HTML"
Token: EndTag body   -> pop stack`
  },
  dom: {
    title: '4a. Document Object Model (DOM) Tree',
    subtitle: 'Internal C++ Object Node Representation',
    desc: 'The finalized output of HTML parsing is a tree of nodes representing elements, text, and attributes. The DOM tree is the Javascript-accessible API representing the document. Web APIs like document.createElement() allow us to manipulate this live in-memory tree.',
    code: `DOM Tree Structure:
Document
  └── HTMLHtmlElement (<html>)
        └── HTMLBodyElement (<body>)
              └── TextNode ("Hello")`
  },
  css: {
    title: '1b. CSS Input Raw Bytes',
    subtitle: 'Style Specifications Loading',
    desc: 'Raw bytes representing style sheets (loaded via <link>, <style> tags, or user-agent defaults) are read into character streams, parsed according to CSS specifications to identify selector rules, property values, and media queries.',
    code: `div.task-card {
  display: flex;
  background-color: var(--card-bg);
}`
  },
  cssparsing: {
    title: '2b. CSS Parsing',
    subtitle: 'Building Tokens & Abstract Syntax Tree',
    desc: 'The CSS parser converts raw CSS text characters into syntax tokens (ident, colon, semicolon, curly brace, etc.), then constructs an Abstract Syntax Tree representing the selectors, properties, and values.',
    code: `CSS Characters: "display: flex;"
Tokens emitted:
1. IDENT: "display"
2. COLON: ":"
3. IDENT: "flex"
4. SEMICOLON: ";"`
  },
  cssrules: {
    title: '3b. Style Rules Collection',
    subtitle: 'Parsing Selectors & Rule Mappings',
    desc: 'The browser groups CSS property-value declarations into style rule objects and maps them to selectors (e.g. classes, tags, IDs). This produces clean declarations ready to be queried and inherited.',
    code: `CSSStyleRule Object:
{
  selectorText: ".task-card",
  style: {
    display: "flex",
    borderLeftWidth: "4px"
  }
}`
  },
  cssom: {
    title: '4b. CSS Object Model (CSSOM) Tree',
    subtitle: 'Cascading Computed Styles Tree',
    desc: 'Just as HTML creates a DOM tree, CSS rules are built into the CSSOM tree. The browser parses stylesheets, resolves selector rules, and computes values (resolving cascades, inheritance, and user stylesheets). It represents styling declarations mapped to hierarchical rule-selectors.',
    code: `CSSOM Tree:
stylesheet
  ├── Rule: "body" -> { font-family: "Outfit", background: ... }
  └── Rule: "div.task-card" -> { display: flex, border: 1px ... }`
  },
  rendertree: {
    title: '5. Render Tree Creation',
    subtitle: 'Matching Content with Style',
    desc: 'The DOM tree and CSSOM tree are combined to form the Render Tree. The Render Tree contains only visible content (nodes with "display: none" are excluded, though "visibility: hidden" is included). Each node in the Render Tree is a "RenderObject" containing geometric layout instructions and style data.',
    code: `DOM Tree + CSSOM Tree = Render Tree
- Note: <head>, <script>, <meta> are omitted.
- Element with "display: none" is omitted.
- Represents what will visually show on the viewport.`
  },
  layout: {
    title: '6. Layout (Reflow)',
    subtitle: 'Computing Box Geometry',
    desc: 'Starting at the root of the Render Tree, the browser computes the exact size and position of every RenderObject relative to the viewport. It translates relative percentages/em values into absolute device pixels. This step is also called Reflow and is highly resource-intensive.',
    code: `Layout calculations:
- Div width: 350px (computed from parent container grid width)
- Box position: X = 32px, Y = 120px
- Text bounds: 240px wide by 18px high`
  },
  paint: {
    title: '7. Painting & Compositing',
    subtitle: 'Pixel Rasterization and GPU Layer Composition',
    desc: 'Painting converts RenderObjects into actual pixels on the screen (rasterization). Elements are painted in stacks (draw borders, backgrounds, text). Compositing separates parts of the page into layers, paints them separately, and sends them to the GPU to be combined. Using transforms/opacity triggers GPU compositing, avoiding layout reflows.',
    code: `Draw Commands:
1. DrawRect(0, 0, 350, 80, roundedCorners) -> Background
2. DrawText("Master Event Delegation", 12, 15) -> Text
3. GPU Compositing layers: Combine task lists layer with body layer`
  }
};

// Event Delegation on Pipeline flow container
const pipelineFlowContainer = document.querySelector('.pipeline-visualizer');

pipelineFlowContainer.addEventListener('click', (e) => {
  const node = e.target.closest('.pipeline-step:not(.dummy-step)');
  if (!node) return;
  
  const step = node.getAttribute('data-step');
  const details = PIPELINE_DB[step];
  if (!details) return;
  
  // Update Active Node class
  pipelineNodes.forEach(n => n.classList.remove('active-step'));
  node.classList.add('active-step');
  
  // Render details card
  pipelineDetailsBox.innerHTML = `
    <div class="detail-title-row">
      <h4 class="detail-title">${details.title}</h4>
      <span class="badge">${details.subtitle}</span>
    </div>
    <p class="detail-desc">${details.desc}</p>
    <pre class="detail-code"><code>${details.code}</code></pre>
  `;
});


// ==========================================================================
// 9. APP INITIALIZATION
// ==========================================================================

function initApp() {
  loadState();
  renderTasks();
  updateCountersAndStats();
}

// Run app init on DOM Content Loaded
document.addEventListener('DOMContentLoaded', initApp);
// If DOMContentLoaded already fired, execute immediately
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  initApp();
}
