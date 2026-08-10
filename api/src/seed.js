require("dotenv").config();
const mongoose = require("mongoose");
const { connectDB } = require("./config/db");
const User = require("./models/User");
const Resource = require("./models/Resource");

const SEED_USERS = [
  { email: "amina@bookmarked.dev", displayName: "Amina Yusuf", password: "password123" },
  { email: "diego@bookmarked.dev", displayName: "Diego Fernandez", password: "password123" },
  { email: "priya@bookmarked.dev", displayName: "Priya Nair", password: "password123" },
  { email: "sam@bookmarked.dev", displayName: "Sam Okoro", password: "password123" },
];

const SEED_RESOURCES = [
  {
    submittedByEmail: "amina@bookmarked.dev",
    title: "MDN: Async/Await Guide",
    url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await",
    description: "The clearest explainer I've found for async/await once callbacks stop making sense.",
    tags: ["javascript", "beginner"],
  },
  {
    submittedByEmail: "diego@bookmarked.dev",
    title: "freeCodeCamp: Responsive Web Design Curriculum",
    url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
    description: "Where I started with HTML/CSS. Still worth revisiting for flexbox and grid.",
    tags: ["css", "html", "beginner"],
  },
  {
    submittedByEmail: "priya@bookmarked.dev",
    title: "Refactoring UI",
    url: "https://www.refactoringui.com/",
    description: "Not free, but changed how I think about spacing and hierarchy in interfaces.",
    tags: ["design"],
  },
  {
    submittedByEmail: "sam@bookmarked.dev",
    title: "Mongoose Population Docs",
    url: "https://mongoosejs.com/docs/populate.html",
    description: "Kept getting confused by populate() until I read this twice.",
    tags: ["mongodb", "backend"],
  },
  {
    submittedByEmail: "amina@bookmarked.dev",
    title: "Testing Library Cheatsheet",
    url: "https://testing-library.com/docs/react-testing-library/cheatsheet/",
    description: "Handy reference when I forget the right query to use.",
    tags: ["testing", "react"],
  },
  {
    submittedByEmail: "diego@bookmarked.dev",
    title: "Explain It To Me Like I'm Five: Git Rebase",
    url: "https://www.freecodecamp.org/news/rebasing-and-merging-differences/",
    description: "Finally understood rebase vs merge after reading this.",
    tags: ["git", "beginner"],
  },
];

async function seed() {
  await connectDB();
  console.log("Connected to MongoDB, seeding...");

  await Resource.deleteMany({});
  await User.deleteMany({});

  const usersByEmail = {};
  for (const u of SEED_USERS) {
    const passwordHash = await User.hashPassword(u.password);
    const user = await User.create({
      email: u.email,
      displayName: u.displayName,
      passwordHash,
    });
    usersByEmail[u.email] = user;
    console.log(`Created user ${u.email} (password: ${u.password})`);
  }

  for (const r of SEED_RESOURCES) {
    const submittedBy = usersByEmail[r.submittedByEmail];
    await Resource.create({
      submittedBy: submittedBy._id,
      title: r.title,
      url: r.url,
      description: r.description,
      tags: r.tags,
    });
  }
  console.log(`Created ${SEED_RESOURCES.length} resources`);

  // Sprinkle a couple of reactions on the first resource for demo purposes.
  const firstResource = await Resource.findOne().sort({ createdAt: 1 });
  if (firstResource) {
    const reactors = Object.values(usersByEmail).slice(1, 3);
    firstResource.reactions.push(
      ...reactors.map((r) => ({ emoji: "⭐", user: r._id }))
    );
    await firstResource.save();
  }

  console.log("Seeding complete.");
  await mongoose.connection.close();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
