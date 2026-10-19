// Run with: npm run seed
// Creates the admin account (and a demo user + demo issues) so the app has
// something to show immediately after connecting to a fresh database.
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Issue = require("../models/Issue");
const { DISTRICTS } = require("../data/apLocations");

async function run() {
  await connectDB();

  console.log("Seeding database...");

  // --- Admin account ---
  const adminEmail = "admin@localissuereportingsystem.com";
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      fullName: "System Administrator",
      email: adminEmail,
      phoneNumber: "0000000000",
      password: "Admin123",
      role: "admin",
    });
    console.log("Created admin account:", adminEmail, "/ Admin123");
  } else {
    console.log("Admin account already exists, skipping.");
  }

  // --- Mandal-scoped admin accounts (most specific — one exact mandal each) ---
  const MANDAL_ADMINS = [
    { fullName: "C.K. Dinne Mandal Admin", district: "YSR Kadapa", mandal: "Chinthakommadinne" },
    { fullName: "Tirupati Rural Mandal Admin", district: "Tirupati", mandal: "Tirupati Rural" },
    { fullName: "Guntakal Mandal Admin", district: "Anantapuram", mandal: "Guntakal" },
    { fullName: "Gorantla Mandal Admin", district: "Sri Sathya Sai", mandal: "Gorantla" },
    { fullName: "Gooty Mandal Admin", district: "Anantapuram", mandal: "Gooty" },
  ];

  for (const { fullName, district, mandal } of MANDAL_ADMINS) {
    const slug = mandal.toLowerCase().replace(/[^a-z0-9]+/g, "");
    const email = `${slug}.admin@localissuereportingsystem.com`;
    const existing = await User.findOne({ email });
    if (!existing) {
      await User.create({
        fullName,
        email,
        phoneNumber: "0000000000",
        password: "Admin123",
        role: "admin",
        district,
        mandal,
      });
      console.log(`Created mandal admin (${mandal}, ${district}):`, email, "/ Admin123");
    } else {
      console.log(`Mandal admin for ${mandal} already exists, skipping.`);
    }
  }

  // --- District-scoped super-admin accounts, one per AP district ---
  // Covers every mandal that ISN'T covered by one of the 5 specific mandal
  // admins above (and, for Anantapuram/Tirupati/Sri Sathya Sai/YSR Kadapa,
  // also covers the rest of that district alongside its mandal admin).
  for (const district of DISTRICTS) {
    const slug = district.toLowerCase().replace(/[^a-z0-9]+/g, "");
    const email = `${slug}.superadmin@localissuereportingsystem.com`;
    const existing = await User.findOne({ email });
    if (!existing) {
      await User.create({
        fullName: `${district} District Admin`,
        email,
        phoneNumber: "0000000000",
        password: "Admin123",
        role: "admin",
        district,
      });
      console.log(`Created district admin (${district}):`, email, "/ Admin123");
    } else {
      console.log(`District admin for ${district} already exists, skipping.`);
    }
  }

  // --- Demo student/user account ---
  const demoEmail = "demo.user@example.com";
  let demoUser = await User.findOne({ email: demoEmail });
  if (!demoUser) {
    demoUser = await User.create({
      fullName: "Demo User",
      email: demoEmail,
      phoneNumber: "9876543210",
      password: "Demo1234",
      role: "user",
    });
    console.log("Created demo user account:", demoEmail, "/ Demo1234");
  } else {
    console.log("Demo user already exists, skipping.");
  }

  // --- A couple of demo issues, only if none exist yet ---
  const existingIssueCount = await Issue.countDocuments({ reportedBy: demoUser._id });
  if (existingIssueCount === 0) {
    await Issue.create([
      {
        user: demoUser.fullName,
        reportedBy: demoUser._id,
        title: "Large pothole near bus stop",
        issue: "Roads & Potholes",
        icon: "FaRoad",
        location: "Main Street, near City Bus Stop",
        district: "Visakhapatnam",
        mandal: "Gajuwaka",
        description: "A large, deep pothole has formed and is a hazard for two-wheelers, especially at night.",
        additionalInfo: "Worsens after every rain.",
        status: "Pending",
      },
      {
        user: demoUser.fullName,
        reportedBy: demoUser._id,
        title: "Streetlight not working for a week",
        issue: "Street Light",
        icon: "FaLightbulb",
        location: "5th Cross, Gandhi Nagar",
        district: "Guntur",
        mandal: "Guntur East",
        description: "The streetlight at this junction has been off for over a week, making it unsafe at night.",
        additionalInfo: "",
        status: "In Progress",
        lastUpdated: new Date().toLocaleString(),
      },
    ]);
    console.log("Created 2 demo issues for the demo user.");
  } else {
    console.log("Demo issues already exist, skipping.");
  }

  console.log("Seed complete.");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Seeding failed:", err.message);
  process.exit(1);
});
