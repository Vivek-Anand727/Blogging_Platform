import mongoose from "mongoose";

export async function connectToDB() {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log("Already connected to DB");
            return mongoose.connection; 
        }

        await mongoose.connect(process.env.MONGODB_URI!, {
            ssl: true,
            tlsAllowInvalidCertificates: true, 
        });

        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("Connected to DB");
        });

        connection.on("error", (err) => {
            console.log(
                "MongoDB connection error, please make sure DB is up and running: " + err
            );
            process.exit();
        });

        return connection; 
    } catch (error) {
        console.error("Something went wrong while connecting to DB", error);
        throw error;
    }
}
