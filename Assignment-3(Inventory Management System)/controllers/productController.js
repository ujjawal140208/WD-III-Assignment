const mongoose = require("mongoose");
const Product = require("../models/Product");

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// POST /api/products - Create a product
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// GET /api/products - Filtering, sorting and pagination
exports.getProducts = async (req, res, next) => {
  try {
    const {
      category,
      search,
      sort = "createdAt",
      order = "desc",
      page = 1,
      limit = 10
    } = req.query;

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

    const filter = {};

    if (category) {
      filter.category = { $regex: `^${escapeRegex(category)}$`, $options: "i" };
    }

    if (search) {
      const searchRegex = { $regex: escapeRegex(search), $options: "i" };
      filter.$or = [{ name: searchRegex }, { sku: searchRegex }, { supplier: searchRegex }];
    }

    const allowedSortFields = ["name", "price", "quantity", "category", "createdAt"];
    const sortField = allowedSortFields.includes(sort) ? sort : "createdAt";
    const sortOrder = order.toLowerCase() === "asc" ? 1 : -1;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.status(200).json({
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id - Get one product
exports.getProductById = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id - Update product details
exports.updateProduct = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const allowedFields = ["name", "sku", "category", "price", "quantity", "reorderLevel", "supplier"];
    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Provide at least one valid field to update" });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id - Delete a product
exports.deleteProduct = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      id: product._id
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/low-stock - Products at or below reorder level
exports.getLowStockProducts = async (req, res, next) => {
  try {
    const lowStockItems = await Product.find({
      $expr: { $lte: ["$quantity", "$reorderLevel"] }
    }).sort({ quantity: 1 });

    res.status(200).json({
      count: lowStockItems.length,
      lowStockItems
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/summary - Category-wise aggregation report
exports.getInventorySummary = async (req, res, next) => {
  try {
    const summary = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalItems: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalStockValue: { $sum: { $multiply: ["$price", "$quantity"] } },
          avgPrice: { $avg: "$price" }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalItems: 1,
          totalQuantity: 1,
          totalStockValue: { $round: ["$totalStockValue", 2] },
          avgPrice: { $round: ["$avgPrice", 2] }
        }
      }
    ]);

    res.status(200).json({
      categories: summary.length,
      summary
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/products/:id/stock - Safely increase/decrease stock
exports.adjustStock = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const change = Number(req.body.change);
    if (!Number.isInteger(change) || change === 0) {
      return res.status(400).json({
        message: "change must be a non-zero integer (positive to restock, negative for sale)"
      });
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, quantity: { $gte: Math.max(0, -change) } },
      { $inc: { quantity: change } },
      { new: true, runValidators: true }
    );

    if (!product) {
      const exists = await Product.exists({ _id: req.params.id });
      if (!exists) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(400).json({ message: "Insufficient stock for this sale" });
    }

    res.status(200).json({
      message: "Stock updated successfully",
      product
    });
  } catch (error) {
    next(error);
  }
};

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
