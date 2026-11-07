const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getInventorySummary,
  adjustStock
} = require("../controllers/productController");

// Keep specific routes above /:id so Express does not treat their names as IDs.
router.get("/low-stock", getLowStockProducts);
router.get("/summary", getInventorySummary);

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.patch("/:id/stock", adjustStock);
router.delete("/:id", deleteProduct);

module.exports = router;
