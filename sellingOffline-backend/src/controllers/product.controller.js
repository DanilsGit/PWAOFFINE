import * as userService from "../services/product.service.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await userService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = req.body;
    const result = await userService.createProduct(product);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const createBatchProducts = async (req, res, next) => {
  try {
    const products = req.body;
    await userService.createBatchProducts(products);
    res.status(201).json({ message: "Products created successfully" });
  } catch (error) {
    next(error);
  }
};
