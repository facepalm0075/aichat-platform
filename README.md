# AI Chatbot Frontend

### Short Description

This is a user interface for interacting with an AI model, built using Next.js and Tailwind CSS.

Frontend Code: [aichat-platform](https://github.com/facepalm0075/aichat-platform)

Live Test: [aichat.pouya](https://aichat.pouyaprogramming.ir/)

---

## Features

- **Responsive Design:** Fully optimized for various screen sizes.
- **Streamed Data Display:** Messages are displayed in real-time as they are received.
- **Stream Control:** Allows stopping and canceling streams mid-way.
- **Markdown Support:** Supports rendering markdown, such as generated code snippets for programming.

---

## Prerequisites

- **Node.js**
- **npm**

---

## How to Run

1. Modify the fetch address in `/app/utils/fetchStream.ts`:

   - Update the `response` variable to match the backend server's address.

2. Build the project:

   ```bash
   npm run build
   ```

3. The build output will include static files (HTML, CSS, JavaScript) ready for deployment.

---

### Author

This project was developed by **Pouya Bahmanyar**.
