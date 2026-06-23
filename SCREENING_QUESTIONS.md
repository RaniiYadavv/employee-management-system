# Screening Question Answers

### 1. Difference between `var`, `let`, and `const`
`var` is function-scoped, gets hoisted and initialized as `undefined`, and can be redeclared — which causes bugs in loops and closures. `let` and `const` are block-scoped, exist in a "temporal dead zone" until their declaration line, and cannot be redeclared in the same scope. `const` additionally prevents reassignment of the binding itself (though objects/arrays assigned to a `const` can still be mutated internally).

### 2. Explain React Hooks
Hooks are functions that let function components use state and lifecycle features without writing a class. `useState` holds local state; `useEffect` runs side effects (data fetching, subscriptions) after render and can clean up on unmount; `useContext` reads shared context; `useMemo`/`useCallback` memoize values/functions; custom hooks let you extract and reuse stateful logic across components. In this project, `Login.jsx`/`Register.jsx` use `useState` for form fields and `useEffect` to redirect already-logged-in users.

### 3. What is the Virtual DOM?
It's an in-memory, lightweight JavaScript representation of the real DOM. When state changes, React builds a new virtual DOM tree, diffs it against the previous one (reconciliation), and applies only the minimal set of real DOM updates needed. This avoids expensive full re-renders of the actual browser DOM and is what makes React UI updates fast.

### 4. What is JWT Authentication?
JWT (JSON Web Token) is a compact, signed token issued by the server after a successful login, containing claims (like the user's id) and a signature. The client stores it (e.g., in `localStorage`, as done here) and sends it in the `Authorization: Bearer <token>` header on subsequent requests. The server verifies the signature with a secret key to confirm the request is from an authenticated user — without needing to store session state server-side. In this project, `generateToken.js` issues it and `authMiddleware.js` verifies it on every protected route.

### 5. Difference between Authentication and Authorization
Authentication answers "who are you?" — verifying identity, typically via login credentials (handled by `/api/auth/login` here). Authorization answers "what are you allowed to do?" — checking permissions/roles after identity is established (e.g., only logged-in users with a valid token can hit `/api/employees`, enforced by `authMiddleware.js`'s `protect` function).

### 6. What is Middleware in Express.js?
Middleware are functions that run between an incoming request and the final route handler, with access to `req`, `res`, and `next()`. They can read/modify the request, end the response early, or pass control forward. This project uses middleware for JSON body parsing, CORS, security headers (`helmet`), rate limiting, JWT verification (`protect`), and centralized error handling (`errorHandler`).

### 7. Explain the Event Loop in JavaScript
JavaScript is single-threaded, but the event loop lets it handle asynchronous work without blocking. Synchronous code runs first on the call stack. Async callbacks (timers, I/O, promises) are queued — microtasks (Promise callbacks) run before macrotasks (setTimeout, I/O callbacks) — and the event loop continuously checks if the call stack is empty so it can pull the next queued task and execute it. This is why `async`/`await` and Promise-based code (used throughout the Express controllers here) don't block other requests from being processed.

### 8. Difference between SQL and MongoDB
SQL databases (MySQL, PostgreSQL) are relational: data lives in fixed-schema tables with rows/columns, relationships are enforced via foreign keys, and they use SQL for querying with strong ACID guarantees. MongoDB is a NoSQL, document-oriented database: data is stored as flexible, JSON-like BSON documents in collections, schemas can vary per document (though Mongoose enforces structure at the application layer here), and it scales horizontally more naturally for unstructured or rapidly evolving data. SQL suits highly relational data with complex joins; MongoDB suits flexible, nested, high-write data like this employee records use case.

### 9. What is Redux Toolkit?
Redux Toolkit (RTK) is the official, opinionated way to write Redux logic with far less boilerplate than classic Redux. `createSlice` generates action creators and reducers together from a single object; `createAsyncThunk` handles async logic (API calls) and automatically dispatches pending/fulfilled/rejected actions; `configureStore` sets up the store with good defaults (including Redux DevTools and middleware). This project's `authSlice.js` and `employeeSlice.js` use exactly this pattern to manage auth state and employee CRUD/list state.

### 10. Difference between `useEffect` and `useMemo`
`useEffect` runs a side effect *after* render commits — for things like fetching data, subscriptions, or manually syncing with something outside React. It doesn't return a value to the render (only an optional cleanup function). `useMemo` runs *during* render, synchronously computes and caches the result of an expensive calculation, and returns that value, recomputing only when its dependencies change. In short: `useEffect` is for side effects after rendering; `useMemo` is for performance — avoiding recalculating the same value on every render.

### 11. What is Closure in JavaScript?
A closure is a function that "remembers" the variables from its enclosing lexical scope even after that outer function has finished executing. This is how the `generateToken` function captures `process.env.JWT_SECRET`, and more generally how patterns like private counters or memoized functions are built in JavaScript — the inner function keeps a reference to the outer scope's variables rather than copying their values.

### 12. Explain Promise, Async, and Await
A `Promise` represents a value that will eventually resolve (success) or reject (failure) — it has three states: pending, fulfilled, rejected. `async` marks a function as one that implicitly returns a Promise. `await` pauses execution inside an `async` function until a Promise settles, letting you write asynchronous code that reads like synchronous code instead of chaining `.then()` calls. Nearly every controller in this backend (e.g., `loginUser`, `createEmployee`) is an `async` function using `await` on Mongoose queries, wrapped in `try/catch` for error handling.

### 13. What is CORS?
CORS (Cross-Origin Resource Sharing) is a browser security mechanism that blocks a web page from making requests to a different origin (domain/port/protocol) than the one it was served from, unless the server explicitly allows it via response headers. Since this project's frontend (`localhost:5173`) and backend (`localhost:5000`) run on different ports, the backend uses the `cors` middleware configured with an allow-list (`CLIENT_URL` env variable) so the browser permits the frontend's requests.

### 14. Explain MongoDB Aggregation
The aggregation framework processes documents through a multi-stage pipeline (e.g., `$match`, `$group`, `$sort`, `$project`, `$lookup`) where each stage transforms the data and passes it to the next — similar to a Unix pipe. It's used for analytics-style queries that plain `find()` can't express, like grouping employees by department and counting them: `Employee.aggregate([{ $group: { _id: '$department', count: { $sum: 1 } } }])`. This project's current listing/search/filter logic uses `find()` with query operators since the needs are simpler, but aggregation would be the natural next step for a "headcount by department" style dashboard report.

### 15. How would you optimize a React application for performance?
Key techniques: memoize expensive computations and components with `useMemo`/`useCallback`/`React.memo` to avoid unnecessary re-renders; code-split with `React.lazy`/dynamic imports so users only download what the current route needs; virtualize long lists (e.g., `react-window`) instead of rendering thousands of DOM nodes at once; debounce rapid user input before firing API calls (used in this project's employee search box); paginate or lazy-load data from the server instead of fetching everything upfront (used here via the `/employees` pagination endpoint); and use the React DevTools Profiler to find and fix actual re-render bottlenecks rather than guessing.
