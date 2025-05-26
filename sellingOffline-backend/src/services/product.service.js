import { query } from "../db/db.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllProducts = async () => {
  const { rows } = await query("SELECT * FROM product");
  return rows;
};

export const createProduct = async (product) => {
  const { name, description, price, category, image, state } = product;

  const uploadDir = path.join(__dirname, "../../public/products");

  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }

  const { rows } = await query(
    "INSERT INTO product (name, description, price, category, image, state) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [name, description, price, category, "", state]
  );

  const id = rows[0].id;

  if (image) {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const imageName = `${id}.png`;
    const fullPath = path.join(uploadDir, imageName);
    await fs.writeFile(fullPath, buffer);
  }

  const imagePath = `/products/${id}.png`;
  await query("UPDATE product SET image = $1 WHERE id = $2", [imagePath, id]);
  rows[0].image = imagePath;

  return rows[0];
};

export const createBatchProducts = async (products) => {
  try {
    products.map(async (product) => {
      await createProduct(product);
    });
  } catch (error) {
    console.error("Error creating batch products:", error);
    throw new Error("Error creating batch products");
  }
};
