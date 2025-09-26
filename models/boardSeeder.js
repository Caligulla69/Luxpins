// seedBoards.js
const mongoose = require("mongoose");
const Board = require("./Board");
require("dotenv").config();

async function seedBoards() {
  const boards = [
    { name: "Luxury Interiors", description: "Premium home décor, luxury furniture, and interior design ideas.", posts: [] },
    { name: "Clothing & Fashion", description: "Runway looks, couture collections, and timeless style inspiration.", posts: [] },
    { name: "Modern Architecture", description: "Innovative buildings, urban planning, and cutting-edge architecture.", posts: [] },
    { name: "Minimal Design", description: "Simple, clean, and aesthetic designs for everyday living.", posts: [] },
    { name: "Art & Culture", description: "Paintings, museums, traditions, and cultural highlights from around the world.", posts: [] },
    { name: "Gourmet Delights", description: "Exquisite food photography, recipes, and fine dining inspirations.", posts: [] },
    { name: "Travel & Adventure", description: "Beautiful destinations, travel guides, and adventurous journeys.", posts: [] },
    { name: "Technology & Innovation", description: "Latest tech trends, gadgets, and futuristic innovations.", posts: [] },
    { name: "Health & Wellness", description: "Fitness, meditation, nutrition, and holistic wellness tips.", posts: [] },
    { name: "DIY & Crafts", description: "Creative do-it-yourself projects and handmade crafts.", posts: [] },
  ];

  try {
    // Connect to DB
    await mongoose.connect("mongodb+srv://shoaibaali1945_db_user:Wefa4Q0ioDVHKo6M@cluster0.x8halex.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("✅ Connected to MongoDB Atlas");

    // Clear existing boards
    await Board.deleteMany({});
    console.log("🗑️ Existing boards cleared");

    // Insert new boards
    await Board.insertMany(boards);
    console.log("🎉 Boards seeded successfully!");
  } catch (err) {
    console.error("❌ Seeding error:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  }
}

seedBoards();
