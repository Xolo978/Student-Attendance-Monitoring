"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xlsx = __importStar(require("xlsx"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_js_1 = __importDefault(require("./model/User.js")); // Ensure the path is correct
mongoose_1.default.connect('mongodb://localhost:27017/main')
    .then(() => {
    console.log("MongoDB connected");
})
    .catch(err => {
    console.error("MongoDB connection error:", err);
});
// Function to insert data from Excel into MongoDB
async function insertFromExcel() {
    try {
        // Read the Excel file
        const workbook = xlsx.readFile('./data.xlsx');
        const sheet_name = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheet_name];
        // Parse Excel sheet to JSON
        const excelData = xlsx.utils.sheet_to_json(sheet);
        console.log("Excel data read successfully:", excelData); // Log data to verify
        // Loop through the data and insert into the database
        for (let row of excelData) {
            const userId = row['PARTICIPANT ID']; // Ensure the key matches exactly
            const password = row['PASSWORD']; // Ensure the key matches exactly
            // Only proceed if both userId and password are found
            if (userId && password) {
                const user = new User_js_1.default({
                    userId,
                    password,
                    attendanceCount: 0, // Initialize attendance to 0
                    violations: []
                });
                await user.save();
                console.log(`Inserted user ${userId}`);
            }
            else {
                console.log(`Skipping row: Missing userId or password`, row);
            }
        }
        console.log("Data insertion completed!");
    }
    catch (error) {
        console.error("Error inserting data:", error);
    }
    finally {
        mongoose_1.default.connection.close();
    }
}
insertFromExcel();
