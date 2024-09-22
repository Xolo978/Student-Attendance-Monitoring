import * as xlsx from 'xlsx';
import mongoose from 'mongoose';
import User from './model/User.js'; // Ensure the path is correct

mongoose.connect('mongodb://localhost:27017/main')
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
        const excelData: { [key: string]: any }[] = xlsx.utils.sheet_to_json(sheet);
        console.log("Excel data read successfully:", excelData); // Log data to verify

        // Loop through the data and insert into the database
        for (let row of excelData) {
            const userId = row['PARTICIPANT ID']; // Ensure the key matches exactly
            const password = row['PASSWORD'];       // Ensure the key matches exactly

            // Only proceed if both userId and password are found
            if (userId && password) {
                const user = new User({
                    userId,
                    password,
                    attendanceCount: 0, // Initialize attendance to 0
                    violations: []
                });
                await user.save();
                console.log(`Inserted user ${userId}`);
            } else {
                console.log(`Skipping row: Missing userId or password`, row);
            }
        }
        console.log("Data insertion completed!");
    } catch (error) {
        console.error("Error inserting data:", error);
    } finally {
        mongoose.connection.close();
    }
}

insertFromExcel();
