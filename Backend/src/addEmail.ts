import * as xlsx from 'xlsx';
import mongoose from 'mongoose';
import User from './model/User.js'; // Ensure the path is correct

mongoose.connect('mongodb+srv://xolo:xolo123@student-attendance.ftr2u.mongodb.net/?retryWrites=true&w=majority&appName=Student-Attendance/main')
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });

// Function to update data from Excel into MongoDB
async function updateUserFromExcel() {
    try {
        // Read the Excel file
        const workbook = xlsx.readFile('./data.xlsx');
        const sheet_name = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheet_name];

        // Parse Excel sheet to JSON
        const excelData: { [key: string]: any }[] = xlsx.utils.sheet_to_json(sheet);
        console.log("Excel data read successfully:", excelData); // Log data to verify

        // Loop through the data and update the database
        for (let row of excelData) {
            const userId = String(row['PARTICIPANT ID']).trim(); // Convert userId to string and trim spaces
            const email = String(row['Email Address']).trim();   // Convert email to string and trim spaces
            const username = String(row['NAME']).trim();         // Get username from NAME column

            // Only proceed if both userId, email, and username are found
            if (userId && email && username) {
                // Find the user by userId and update the email and username without modifying other fields
                const result = await User.findOneAndUpdate(
                    { userId },
                    { $set: { email, username } },  // Update email and username fields
                    { new: true, upsert: false }    // Only update, do not create new
                );

                if (result) {
                    console.log(`Updated email and username for user ${userId}`);
                } else {
                    console.log(`User ${userId} not found in the database`);
                }
            } else {
                console.log(`Skipping row: Missing userId, email, or username`, row);
            }
        }
        console.log("User data update completed!");
    } catch (error) {
        console.error("Error updating user data:", error);
    } finally {
        mongoose.connection.close();
    }
}


updateUserFromExcel();
