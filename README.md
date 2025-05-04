# Starluck

## Description

Starluck is a tours and travel fullstack web application built in React and Flask. It allows users to explore destinations, book, and also leave reviews on destinations. It also allows users with the role of admin to view all users of the app, all bookings made where they can confirm or cancel the bookings. Admins can also add new destinations, edit existing destinations, and delete destinations.

## Live Demo

You can explore the live version of Starluck [here](https://toursatstarluck.netlify.app/).

## GitHub Repository

You can find the repository for Starluck on GitHub: [Starluck Repository](https://github.com/Mbugua254/Starluck).

---

## 🔧 Prerequisites

- Python 3.x
- Node.js and npm
- SQLite (for the database)

---

## Backend Setup (Flask)

### 📋 Prerequisites

- Install Python 3.x on your machine.
- Install `pip` for managing Python packages.
- Create a virtual environment.

### ▶️ Steps to Run Backend

1. **Create and activate a virtual environment:**

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

2. **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

3. **Run the Flask development server:**

    ```bash
    python run.py
    ```

    ✅ The backend API will start at: [http://127.0.0.1:5000/](http://127.0.0.1:5000/)

---

## 💻 Frontend Setup (React)

### 📋 Prerequisites

- Node.js and npm installed.

### ▶️ Steps to Run Frontend

1. **Navigate to the frontend directory:**

    ```bash
    cd ../starluck-frontend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Start the development server:**

    ```bash
    npm start
    ```

    ✅ The frontend will be served at: [http://localhost:3000/](http://localhost:3000/)

---

## 🔐 Authentication

- Users must register and log in to view destination details and make bookings.
- Admins have access to an admin dashboard and advanced features like managing destinations and bookings.

---


---

## 📦 Backend Dependencies

You can install all required backend packages using:

```bash
pip install -r requirements.txt


🧪 Testing
You can use tools like Postman or Thunder Client to test the backend API routes and ensure authentication, bookings, and admin functions work as expected.

🙋 FAQ
Q: Do I need to be logged in to book a destination?
A: Yes. Login is required for booking and viewing full destination details.

Q: Who can access the admin dashboard?
A: Only users assigned the "admin" role have access to administrative features.

🤝 Contributing
Contributions are welcome!

Fork the repo.

Create your feature branch:
git checkout -b feature/your-feature

Commit your changes:
git commit -m 'Add new feature'

Push to the branch:
git push origin feature/your-feature

Open a Pull Request.

📄 License
This project is licensed under the MIT License — see the LICENSE file for details.

