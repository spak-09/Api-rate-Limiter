import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, default: "Electronics" },
  },
  {
    collection: "products",
    timestamps: true,
  }
);

const ProductModel = mongoose.model("Product", productSchema);

export const initializeProducts = async () => {
  try {
    const count = await ProductModel.countDocuments();
    if (count === 0) {
      const products = [
        { name: "Laptop", description: "High-performance laptop", price: 999.99, category: "Electronics" },
        { name: "Keyboard", description: "Mechanical keyboard", price: 149.99, category: "Peripherals" },
        { name: "Mouse", description: "Wireless mouse", price: 49.99, category: "Peripherals" },
        { name: "Monitor", description: "4K display monitor", price: 399.99, category: "Electronics" },
        { name: "Headphones", description: "Noise-cancelling headphones", price: 199.99, category: "Audio" },
      ];
      await ProductModel.insertMany(products);
    }
  } catch (error) {
    console.error("Error initializing products:", error.message);
  }
};

export default ProductModel;
