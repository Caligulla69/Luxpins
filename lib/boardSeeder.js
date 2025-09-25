const mongoose = require("mongoose");
const Board = require('../models/Board');

mongoose.connect("mongodb://127.0.0.1:27017/Printest");


async function seedBoards() {
  const boards = [
    { 
      name: "Luxury Interiors", 
      description: "Premium home décor, luxury furnisture, and interior design ideas.", 
      posts: [] 
    },
    { 
      name: "High Fashion", 
      description: "Runway looks, couture collections, and timeless style inspiration.", 
      posts: [] 
    },
    { 
      name: "Modern Architecture", 
      description: "Innovative buildings, urban planning, and cutting-edge architecture.", 
      posts: [] 
    },
    { 
      name: "Minimal Design", 
      description: "Simple, clean, and aesthetic designs for everyday living.", 
      posts: [] 
    },
    { 
      name: "Art & Culture", 
      description: "Paintings, museums, traditions, and cultural highlights from around the world.", 
      posts: [] 
    },
    { 
      name: "Gourmet Delights", 
      description: "Exquisite food photography, recipes, and fine dining inspirations.", 
      posts: [] 
    },
    { 
      name: "Travel & Adventure", 
      description: "Beautiful destinations, travel guides, and adventurous journeys.", 
      posts: [] 
    },
    { 
      name: "Technology & Innovation", 
      description: "Latest tech trends, gadgets, and futuristic innovations.", 
      posts: [] 
    },
    { 
      name: "Health & Wellness", 
      description: "Fitness, meditation, nutrition, and holistic wellness tips.", 
      posts: [] 
    },
    { 
      name: "DIY & Crafts", 
      description: "Creative do-it-yourself projects and handmade crafts.", 
      posts: [] 
    }
  ];

  try {
    await Board.deleteMany({ posts: null }); // clean old global boards if any
    await Board.insertMany(boards);
    console.log("Boards seeded!");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    mongoose.connection.close();
  }
}

seedBoards();
