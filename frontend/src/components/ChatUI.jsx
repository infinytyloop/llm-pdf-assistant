import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ChatUI( {highlightedText} ) {
    // 1. Separate initial message from history
    const [history, setHistory] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 2. Reset history when highlightedText changes
    useEffect(() => {
        // The initial system message is created on the backend.
        // We can start with an empty history on the client.
        setHistory([]);
    }, [highlightedText]);

    const sendMessage = async (e) => {
        e.preventDefault();

        const newMessage = { role: 'user', content: inputText };
        const updatedHistory = [...history, newMessage];
        
        // The history sent to the backend should not contain any system messages.
        const payloadHistory = updatedHistory.filter(msg => msg.role !== 'system');

        setHistory(updatedHistory);
        setInputText('');
        setIsLoading(true);

        try {
            const response = await axios.post(
            'http://localhost:8000/request-explanation/',
            {
                // Send as object, not double-JSON-encoded
                history: payloadHistory,
                highlightedText  // Add highlightedText separately
            },
            {
                headers: {
                'Content-Type': 'application/json'
                }
            }
            );

            const newResponse = {
            role: 'assistant', 
            content: response.data.explanation  // Extract the explanation property
            };
            setHistory(prev => [...prev, newResponse]);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 bg-gray-100 rounded shadow"> 
            <h1 className="text-black">Highlighted Text:<br/>{highlightedText}</h1>
        <form onSubmit={sendMessage} className="input-form">
            <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="Type your message..."
            className="border rounded p-2 w-full mb-4 text-black"
            />
            <button 
            type="submit" 
            disabled={isLoading || !inputText.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 text-black"
            >
            Send
            </button>
        </form>

            <div className="mt-4 border-t-2 pt-4">
                <h2 className="text-lg font-semibold mb-2 text-black">Chat History</h2>
                <div className="space-y-4">
                    {history.filter(msg => msg.role !== 'system')
                    .map((msg, index) => (
                        <div key={index} className={`p-2 rounded ${msg.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'}`}>
                        <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong> 
                        {/* Simplified content rendering */}
                        {msg.content}
                        </div>
))}
                </div>
            </div>
        </div>
    );
}

export default ChatUI;