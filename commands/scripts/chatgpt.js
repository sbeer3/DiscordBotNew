// chatgpt.js

const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: 'instert api key' });

async function generateSongQueue(userMessage) {
    const completion = await openai.chat.completions.create({
        messages: [
            { "role": "system", "content": "You are a helpful assistant that suggests songs." },
            { "role": "user", "content": userMessage }
        ],
        model: "gpt-3.5-turbo",
    });

    // Split the assistant's message into lines
    const lines = completion.choices[0].message.content.split('\n');

    // Process each line to extract the song name
    const songNames = lines.reduce((songs, line) => {
        // Match lines in the format "number. "Song Name" by Artist"
        const match = line.match(/^\d+\.\s"(.+)"\sby\s.+/);

        // If the line matches, add the song name to the list
        if (match) {
            songs.push(match[1]);
        }

        return songs;
    }, []);

    return songNames;
}

module.exports = generateSongQueue;