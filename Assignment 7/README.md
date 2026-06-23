# AetherTask // Premium Task Studio & DOM Lab

A fully interactive **Task Manager Application** built using only **HTML5, CSS3, and Vanilla JavaScript**. This application contains no external libraries or frameworks, utilizing core DOM APIs to demonstrate advanced event handling patterns, DOM manipulation methodologies, and the browser's internal rendering pipeline.

---

## 🚀 Key Features Built-in

- **Dynamic Task Creation**: Create, read, update, and delete tasks dynamically.
- **Robust DOM Manipulation**: Implements `append()`, `prepend()`, `before()`, `after()`, `replaceWith()`, and `remove()`.
- **Event Delegation**: Centralized event listener attached to the main task list container for efficient task card control management.
- **Attributes vs Properties Inspector**: Interactive lab comparing live property access (`node.value`) against configuration attributes (`node.getAttribute('value')`).
- **Event Propagation Sandbox**: Interactive visual playground that demonstrates Bubbling and Capturing phases with delayed highlighted pulses and logs.
- **Browser Rendering Pipeline Section**: Interactive SVG-like timeline mapping browser operations from raw HTML bytes to screen painting.
- **Local Storage Syncing**: Tasks and dark-mode settings are automatically saved and loaded.
- **Performance Optimized Rendering**: Uses `DocumentFragment` for batch DOM updates to minimize browser layouts/reflows.

---

## 📖 Theoretical Explanations

Here are the details of the core browser rendering and event concepts implemented in this application:

### 1. Tokenization (Lexical Analysis)
**Tokenization** is the first sub-phase of HTML parsing. 
- The browser reads raw bytes of data from the network and converts them into characters based on the specified encoding (e.g., UTF-8).
- The tokenization process acts as a state machine. It parses the character stream into a sequence of distinct tokens: **Start Tags**, **End Tags**, **Attribute names/values**, and **Character data**.
- For example, parsing the string `<html>` will emit a `StartTag` token named `html`. The parser uses these tokens to establish document structure.

### 2. Parsing
**Parsing** is the phase where the token stream is consumed to construct a structured syntax tree.
- The browser uses HTML parsing algorithms (defined by the HTML5 spec) which contain complex rule sets to handle mismatched tags, missing attributes, or nested layout elements.
- The parser maintains a stack of open elements. As start-tag tokens are consumed, nodes are constructed and pushed onto the stack. When end-tag tokens are read, elements are popped off the stack, structuring a parent-child relationship.

### 3. Document Object Model (DOM) Tree
The **DOM Tree** is the output of the HTML parser.
- It is a tree of C++ objects in memory representing the document structure.
- The DOM serves two roles: it is the internal data structure representing the content of the document, and it is the public programmatic API (via interfaces like `HTMLElement` and methods like `document.getElementById`) used by JavaScript to modify the content, style, and structure of a page dynamically.

### 4. CSS Object Model (CSSOM) Tree
The **CSSOM Tree** is built similarly to the DOM tree but is based on style sheets.
- The browser parses style declarations (internal, external, and browser user-agent defaults) and structures a cascading style rules tree.
- For each node, the browser calculates the "computed styles" by resolving selector specificity cascades, user stylesheet rules, inherits from parent nodes, and default styles.

### 5. Render Tree
The **Render Tree** is formed by combining the DOM Tree and the CSSOM Tree.
- It contains only the elements that will be visible on the screen.
- Elements with styling declaration `display: none` are completely omitted from the Render Tree because they occupy no space.
- Elements with `visibility: hidden` are included in the Render Tree because they still take up physical layout space.
- Each node in the Render Tree (a `RenderObject`) has computed styles and geometric properties mapping directly to visual components.

```
 HTML Bytes ──> Tokenization ──> HTML Parsing ──> DOM Tree ──┐
                                                             ├──> Render Tree ──> Layout ──> Paint & Composite
 CSS Bytes  ──────────────────────────> CSSOM Tree ──────────┘
```

---

### 6. Event Capturing (Trickling)
When an event occurs on a DOM element, the browser determines the propagation path. **Capturing** is the first phase of this path:
- The event starts at the `window` level, passes down through the `document`, the `<html>` root, `<body>`, and trickles down parent-by-parent to the event target.
- Listeners registered with `useCapture: true` (the third argument in `addEventListener`) are triggered during this phase.

### 7. Event Bubbling
**Bubbling** is the third phase of propagation (following the Target phase):
- After the event target executes its handler, the event bubbles up. It rises from the target, to its parent, grandparent, and all the way back to the `window`.
- By default, standard event listeners (`useCapture: false` or omitted) are registered for this phase.

### 8. Event Delegation
**Event Delegation** is a design pattern that leverages Event Bubbling:
- Instead of attaching separate event listeners to dozens of individual elements (which consumes significant system memory and requires manual rebinding when elements are created/destroyed), a **single listener** is attached to a common parent element.
- When an event bubbles up to the parent, the handler uses `event.target` (or the `closest()` selector API) to identify which specific child triggered the event and execute the corresponding action.

---

## 🛠️ Comparison: Attributes vs Properties

| Feature | HTML Attributes | DOM Properties |
|:---|:---|:---|
| **Definition** | Defined in the HTML source code markup. | Properties on the DOM node objects in memory. |
| **Persistence** | Permanent initial value (the default state). | Represents the live, current state in memory. |
| **Data Type** | Always a String. | Can be boolean, number, array, objects, etc. |
| **Syncing** | Modifying updates the attribute; updates property only if "dirty" flag is false. | Typing in an input updates the property, but leaves the markup attribute untouched. |
| **API** | `getAttribute(name)`, `setAttribute(name, val)` | `element.value`, `element.id`, `element.checked` |

*Code example showing the uncoupling:*
```javascript
const input = document.querySelector('input');
console.log(input.value); // Output: "Initial HTML Value"
console.log(input.getAttribute('value')); // Output: "Initial HTML Value"

// User types "Hello" into the text field:
console.log(input.value); // Output: "Hello"
console.log(input.getAttribute('value')); // Output: "Initial HTML Value" (Unchanged!)
```

---

## 📦 Deployment Instructions

You can easily deploy this application to Netlify, Vercel, or GitHub Pages.

### Deploying to GitHub Pages
1. Initialize a Git repository inside the folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit AetherTask"
   ```
2. Create a new repository on GitHub and link it:
   ```bash
   git remote add origin https://github.com/your-username/aethertask.git
   git branch -M main
   git push -u origin main
   ```
3. Go to repository **Settings** > **Pages**.
4. Set Source to **Deploy from a branch**, select **main** and path `/ (root)`, then click **Save**.

### Deploying to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in this directory.
3. Follow the prompts to publish instantly!
