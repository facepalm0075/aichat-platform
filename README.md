# pouya`s AI Chatbot

### Short Description

This is a user interface for interacting with an AI model, built using Next.js and Tailwind CSS.

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

### How It Works

When a prompt is submitted, it is sent to the server via a POST request. To read the streamed response:

- A `reader` object is created for response to handle the stream.
- Since the data is streamed as binary, a `TextDecoder` (UTF-8) object is also created to decode binary data into text.
- Inside a `while` loop, the `read()` function of the `reader` is called to fetch chunks of data.
- Each chunk is decoded using the `TextDecoder` and then parsed as JSON.
- The parsed data is passed to a component responsible for rendering the text.
- If the user presses the stop button during the stream, the `reader` object is closed, and the browser automatically terminates the connection.

---

### Author

This project was developed by **Pouya Bahmanyar**.
