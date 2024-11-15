import User from '../models/User.js';

export const generateUniqueUrl = async (name) => {
    // Convert name to lowercase and replace spaces with hyphens
    let baseUrl = name.toLowerCase().replace(/\s+/g, '-');

    // Remove special characters except hyphens
    baseUrl = baseUrl.replace(/[^a-z0-9-]/g, '');

    let url = baseUrl;
    let counter = 1;

    // Keep checking until we find a unique URL
    while (true) {
        // Check if URL already exists
        const existingUser = await User.findOne({ url });

        if (!existingUser) {
            return url; // URL is unique, return it
        }

        // If URL exists, add number to the end and try again
        url = `${baseUrl}-${counter}`;
        counter++;
    }
}; 