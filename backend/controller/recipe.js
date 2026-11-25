const Recipes = require("../models/recipe");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const imagesDir = path.join(__dirname, "..", "public", "images");
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imagesDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname || "");
        const filename = Date.now() + "-" + file.fieldname + ext;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

const parseIngredients = (body) => {
    const raw = body.ingredients ?? body["ingredients[]"];
    if (!raw) return [];
    if (Array.isArray(raw)) {
        return raw.map((item) => String(item).trim()).filter(Boolean);
    }
    return String(raw)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
};

const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipes.find();
        return res.json(recipes);
    } catch (err) {
        return res.status(500).json({ message: err.message || "Failed to fetch recipes" });
    }
};

const getRecipe = async (req, res) => {
    try {
        const recipe = await Recipes.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        return res.json(recipe);
    } catch (err) {
        return res.status(404).json({ message: "Recipe not found" });
    }
};

const addRecipe = async (req, res) => {
    try {
        const { title, instructions, time } = req.body;
        const ingredients = parseIngredients(req.body);

        if (!title || ingredients.length === 0 || !instructions) {
            return res.status(400).json({ message: "Required fields can't be empty" });
        }

        const newRecipe = await Recipes.create({
            title,
            ingredients,
            instructions,
            time: time || "",
            coverImage: req.file ? req.file.filename : "",
            createdBy: req.user.id
        });
        return res.status(201).json(newRecipe);
    } catch (err) {
        return res.status(500).json({ message: err.message || "Failed to create recipe" });
    }
};

const editRecipe = async (req, res) => {
    try {
        const recipe = await Recipes.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        if (recipe.createdBy && req.user && String(recipe.createdBy) !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to edit this recipe" });
        }

        const { title, instructions, time } = req.body;
        const ingredients = parseIngredients(req.body);
        const coverImage = req.file?.filename ? req.file.filename : recipe.coverImage;

        const updatedRecipe = await Recipes.findByIdAndUpdate(
            req.params.id,
            {
                title: title ?? recipe.title,
                ingredients: ingredients.length > 0 ? ingredients : recipe.ingredients,
                instructions: instructions ?? recipe.instructions,
                time: time ?? recipe.time,
                coverImage
            },
            { new: true }
        );
        return res.json(updatedRecipe);
    } catch (err) {
        return res.status(400).json({ message: err.message || "Failed to update recipe" });
    }
};

const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipes.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        if (recipe.createdBy && req.user && String(recipe.createdBy) !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this recipe" });
        }
        await Recipes.deleteOne({ _id: req.params.id });
        return res.json({ status: "ok" });
    } catch (err) {
        return res.status(400).json({ message: "error" });
    }
};

module.exports = { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe, upload };
