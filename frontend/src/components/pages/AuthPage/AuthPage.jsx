import React from 'react';
import './AuthPage.css';

function AuthPage() {
    return(
        <div>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                >
                Login By Google
            </button>

            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                >
                Login By GitHub
            </button>
        </div>
    );
    
}
export default AuthPage;