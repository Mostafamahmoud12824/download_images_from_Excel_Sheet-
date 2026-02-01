const fs = require("fs");
const path = require("path");
const axios = require("axios");
const XLSX = require("xlsx");

const EXCEL_FILE = "images.xlsx";
const OUTPUT_DIR = "downloaded_images";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

// قراءة ملف الإكسيل
const workbook = XLSX.readFile(EXCEL_FILE);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(sheet);

// هيدر للتحميل
const headers = {
  "User-Agent": "Mozilla/5.0"
};

(async () => {
  let index = 1;

  for (const row of rows) {
    const imageUrl = row["image-path"];
    if (!imageUrl) continue;

    try {
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
        headers
      });

      // استخراج الامتداد
      const ext = imageUrl
        .split(".")
        .pop()
        .split("?")[0];

      const fileName = `${String(index).padStart(3, "0")}.${ext}`;
      fs.writeFileSync(
        path.join(OUTPUT_DIR, fileName),
        response.data
      );

      console.log(`✔ تم تحميل ${fileName}`);
      index++;

    } catch (err) {
      console.log(`✖ فشل تحميل الصورة:`, imageUrl);
    }
  }

  console.log("\n✅ تم تحميل كل الصور من الإكسيل");
})();
