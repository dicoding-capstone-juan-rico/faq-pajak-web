"use server"
import { dbCon } from "@/lib/dbConnection";
import { log } from "console";

export async function GET() {
    try {
        const users = await dbCon.user.findMany();
        return new Response(JSON.stringify(users), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        log("Error fetching data:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
    
}