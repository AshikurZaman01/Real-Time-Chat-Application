const express = require("express");
const DBConnection = require("./Config/DBConnection");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors"); // Import cors
const { notFound, defaultErrorHandler } = require("./ErrorHandler/errorHandler");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Adjust this to match your frontend's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use("/users", require("./Routes/userRoutes/userRoutes"));

// Error Handlers
app.use(notFound);
app.use(defaultErrorHandler);

// Database Connection and Server Start
DBConnection()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to the database:", err);
    });
