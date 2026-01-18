"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Clock,
  Calendar,
  Utensils,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

export default function AdminMealPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    type: "BREAKFAST",
    date: "",
    imgURL: "",
    ingredients: [{ itemName: "", gramsPerPax: "" }],
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated" || !session || session.user.role !== "ADMIN") {
    router.push("/login");
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      ingredients: newIngredients,
    }));
  };

  const addIngredientField = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { itemName: "", gramsPerPax: "" }],
    }));
  };

  const removeIngredientField = (index) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Validate required fields
      if (!formData.title || !formData.date) {
        setError("Title and Date are required");
        setLoading(false);
        return;
      }

      // Validate ingredients
      const validIngredients = formData.ingredients.filter(
        (ing) => ing.itemName.trim() && ing.gramsPerPax
      );

      if (validIngredients.length === 0) {
        setError("At least one ingredient is required");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/admin/meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          type: formData.type,
          date: formData.date,
          imgURL: formData.imgURL || "https://eduauraapublic.s3.ap-south-1.amazonaws.com/webassets/images/blogs/indian-food-nutrition.jpg",
          ingredients: validIngredients,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create meal");
      }

      setSuccess(true);
      setFormData({
        title: "",
        type: "BREAKFAST",
        date: "",
        imgURL: "",
        ingredients: [{ itemName: "", gramsPerPax: "" }],
      });

      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-orange-500 p-3 rounded-xl">
              <Utensils className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Meal Manager</h1>
          </div>
          <p className="text-gray-600 ml-14">Create upcoming meals for your mess</p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-emerald-900">Success!</h3>
              <p className="text-sm text-emerald-800">Meal created successfully</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Meal Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Meal Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Aloo Paratha & Curd"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                {/* Meal Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Meal Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-orange-500 transition-colors"
                  >
                    <option value="BREAKFAST">🍳 Breakfast</option>
                    <option value="LUNCH">🍽️ Lunch</option>
                    <option value="DINNER">🌙 Dinner</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="imgURL"
                    value={formData.imgURL}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="border-t-2 border-gray-100 pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-orange-500" />
                Ingredients
              </h2>

              <div className="space-y-4">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-4 items-end">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Item Name
                      </label>
                      <input
                        type="text"
                        value={ingredient.itemName}
                        onChange={(e) =>
                          handleIngredientChange(index, "itemName", e.target.value)
                        }
                        placeholder="e.g., Rice, Dal, Tomato"
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                    <div className="w-32">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grams/Person
                      </label>
                      <input
                        type="number"
                        value={ingredient.gramsPerPax}
                        onChange={(e) =>
                          handleIngredientChange(index, "gramsPerPax", e.target.value)
                        }
                        placeholder="150"
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                    {formData.ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredientField(index)}
                        className="p-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                      >
                        <Plus className="w-5 h-5 rotate-45" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addIngredientField}
                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-50 border-2 border-orange-200 text-orange-600 hover:bg-orange-100 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Ingredient
              </button>
            </div>

            {/* Submit Button */}
            <div className="border-t-2 border-gray-100 pt-8 flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Create Meal
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4">
          <p className="text-sm text-orange-900">
            <span className="font-semibold">Note:</span> Meals with the same type and date cannot
            be created. Ensure you provide at least one ingredient for the meal.
          </p>
        </div>
      </div>
    </div>
  );
}
