import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { connectToDB } from "../configs/db.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectToDB();

    // ✅ check if admin already exists
    const existingAdmin = await User.findOne({
      email: "admin@email.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists ✅");
      process.exit();
    }

    // hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    //  create admin
    const admin = await User.create({
      name: "Admin",
      email: "admin@email.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully 🚀");
    console.log(admin);

    process.exit();

  } catch (error) {
    console.log("Error seeding admin ❌", error);
    process.exit(1);
  }
};

seedAdmin();