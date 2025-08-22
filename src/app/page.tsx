"use client"; // This line is required for client-side functionality like `useState` and `useEffect`.

import { useState, useEffect } from 'react';
import Image from 'next/image';
import React from 'react'; // Importing React is good practice for JSX files.

// Define an interface for the recipe object to provide type safety.
interface Recipe {
    title: string;
    description: string;
    image: string;
}

// The main application component.
export default function Page() {
    // State variables to manage the search input, message box, and loading state.
    const [searchInput, setSearchInput] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Your Spoonacular API Key.
    const apiKey = '7e32e1d5008848d5b6ab5ce4e9bb4d5f';

    // This is where our recipe cards will be stored.
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    // This function now fetches recipes from the Spoonacular API.
    const fetchRecipes = async (query: string): Promise<Recipe[]> => {
        // Construct the URL for the Spoonacular API with your key and the user's query.
        const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&apiKey=${apiKey}&number=9`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                // Check for rate limiting or other API-specific errors.
                if (response.status === 402) {
                    throw new Error("API limit reached. Please try again tomorrow.");
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            // The Spoonacular API returns results in a `results` array.
            const results = data.results || [];
            
            // Map the API response to our local Recipe interface.
            const formattedRecipes: Recipe[] = results.map((recipe: any) => ({
                title: recipe.title,
                // The Spoonacular search endpoint does not return descriptions, so we'll use a placeholder.
                description: 'No description available for this recipe.',
                image: recipe.image,
            }));

            return formattedRecipes;

        } catch (error: any) {
            console.error("Failed to fetch recipes:", error);
            setIsError(true);
            setMessage(error.message || "Failed to fetch recipes. Please try again.");
            return []; // Return an empty array on error.
        }
    };

    // Function to handle the search button click.
    const handleSearch = async () => {
        // Prevent searching if the input is empty or a search is already in progress.
        if (searchInput.trim() === '' || isLoading) {
            setMessage("Please enter a search term.");
            setIsError(true);
            return;
        }

        setIsLoading(true);
        setIsError(false);
        setMessage("Searching for recipes...");

        try {
            // Await the fetch call to get the data.
            const data = await fetchRecipes(searchInput);
            
            // Check if any recipes were returned.
            if (data.length > 0) {
                setRecipes(data);
                setMessage(''); // Clear the message on success.
            } else {
                setRecipes([]);
                setMessage(`No recipes found for "${searchInput}".`);
            }
        } catch (error) {
            console.error("Error fetching recipes:", error);
            setIsError(true);
            setMessage("Failed to fetch recipes. Please try again.");
            setRecipes([]);
        } finally {
            setIsLoading(false); // Always set loading to false, regardless of success or failure.
        }
    };

    // We can also handle the 'Enter' key press on the input field.
    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    // The main JSX structure for our application.
    return (
        <div className="bg-black text-gray-200 p-4 min-h-screen flex flex-col items-center">
            <style jsx>{`
                .text-shine {
                    background-image: linear-gradient(
                        90deg,
                        #e2e2e2 0%,
                        #d4af37 20%,
                        #e2e2e2 40%,
                        #d4af37 60%,
                        #e2e2e2 80%,
                        #d4af37 100%
                    );
                    background-size: 200% auto;
                    color: #d4af37; /* Fallback color */
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shine 2s linear infinite;
                }

                @keyframes shine {
                    to {
                        background-position: 200% center;
                    }
                }
            `}</style>
            {/* Main container for the app, centered on the page. */}
            <div className="w-full max-w-4xl mx-auto py-8">
                {/* Application title and description. */}
                <header className="text-center mb-10">
                    {/* Hussein Bakes Logo - Using Next.js Image component for optimization. */}
                    <Image
                        src="/image/logo.webp"
                        alt="Hussein Bakes Logo"
                        className="mx-auto h-24 mb-4"
                        width={96} // Set width and height for optimization
                        height={96}
                        priority
                    />
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-2 tracking-wide text-shine">
                        Hussein Bakes
                    </h1>
                    <p className="text-lg text-gray-400">Discover delicious recipes for your next baking masterpiece.</p>
                </header>

                {/* Search bar and button section. */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                    {/* Search input field. Added id and name for better accessibility. */}
                    <input
                        id="search-input"
                        name="search-input"
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="e.g., chocolate cake, apple pie..."
                        className="w-full sm:w-80 px-5 py-3 rounded-xl border border-gray-700 bg-gray-900 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                    />
                    {/* Search button. Disabled when loading to prevent multiple requests. */}
                    <button
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                </div>

                {/* Container for displaying recipe results. */}
                <div id="results-container" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {/* We'll use the map function to render recipe cards dynamically. */}
                    {recipes.map((recipe, index) => (
                        <div key={index} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 duration-300">
                            <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover"/>
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-white mb-2">{recipe.title}</h3>
                                <p className="text-sm text-gray-400">{recipe.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message box for displaying information or errors to the user. */}
                <div className={`mt-8 text-center ${isError ? 'text-red-400' : 'text-gray-400'} ${message ? '' : 'hidden'}`}>
                    {message}
                </div>

                {/* Footer section for the credits. */}
                <footer className="text-center mt-12 text-gray-500 text-sm">
                    created by Hussein Salim for Odin Projects
                </footer>
            </div>
        </div>
    );
}
