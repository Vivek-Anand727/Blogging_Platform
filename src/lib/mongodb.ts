import { log } from "console";
import mongoose from "mongoose";

export async function connectToDB(){
    try {
      await mongoose.connect(process.env.MONGODB_URI!, {
        ssl: true,
        tlsAllowInvalidCertificates: true, // Allow invalid TLS certificates
      });
            const connection = mongoose.connection;

            connection.on('connected', () =>{
                console.log("Connected to DB");
            })

            connection.on('error', (err) => {
                console.log("Mongodb connecton error,please make sure db is up and running: " + err);
                process.exit();
            })
    } catch (error) {
        console.log(error,"Something went wrong while connecting to DB");
    }
}