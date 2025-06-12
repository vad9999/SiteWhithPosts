const db = require("./models");

async function seed() {
  try {
    await db.ThemePost.bulkCreate(
      [
        { name: "Красота и стиль" },
        { name: "Спорт" },
        { name: "Путешествия" },
        { name: "Еда" },
        { name: "Наука" },
        { name: "Культура" },
        { name: "Экономика" },
        { name: "Технологии" },
        { name: "Авто" },
        { name: "Гейминг" },
        { name: "Питомцы" },
        { name: "Детям" },
        { name: "Гойда" },
      ],
      { ignoreDuplicates: true }
    ); // ignoreDuplicates поможет не дублировать записи

    console.log("Initial data inserted successfully");
  } catch (error) {
    console.error("Error inserting initial data:", error);
  }
}

module.exports = seed;
