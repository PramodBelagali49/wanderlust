// src/components/Footer.js
 
import React from "react"

const Footer = () => {
    return (
        <footer className="  w-screen mt-5 bg-gray-100 py-8">
            <div className="text-center">
                <div>&copy; Wanderlust private limited</div>
                <div className="flex justify-center space-x-6 mt-4 text-gray-500">
                    <a href="#" className="hover:underline">
                        Privacy
                    </a>
                    <a href="#" className="hover:underline">
                        Terms
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer
