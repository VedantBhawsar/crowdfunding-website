import React from "react";
function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-2xl font-bold text-white">Crowdfundify</h1>
            <p className="text-sm mt-1">
              Empowering dreams through crowdfunding
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white">
              Home
            </a>
            <a href="#projects" className="hover:text-white">
              Projects
            </a>
            <a href="#about" className="hover:text-white">
              About Us
            </a>
            <a href="#contact" className="hover:text-white">
              Contact
            </a>
          </div>

          {/* Social Media Links */}
          <div className="flex space-x-4">
            <a
              href="https://twitter.com"
              className="hover:text-white"
              aria-label="Twitter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M24 4.557a9.93 9.93 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.196 4.92 4.92 0 00-8.384 4.482A13.978 13.978 0 011.671 3.149a4.917 4.917 0 001.523 6.574 4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.224.084 4.929 4.929 0 004.604 3.417A9.867 9.867 0 010 19.54a13.933 13.933 0 007.548 2.213c9.058 0 14.01-7.514 14.01-14.01 0-.213-.004-.426-.014-.637A10.025 10.025 0 0024 4.557z" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              className="hover:text-white"
              aria-label="Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.894-4.788 4.658-4.788 1.325 0 2.464.098 2.795.143v3.244h-1.917c-1.505 0-1.796.715-1.796 1.763v2.31h3.591l-.467 3.622h-3.124V24h6.116c.73 0 1.324-.593 1.324-1.326V1.326C24 .593 23.407 0 22.675 0z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              className="hover:text-white"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.849.07 1.366.062 2.633.36 3.608 1.334.975.975 1.273 2.242 1.334 3.608.059 1.265.069 1.645.069 4.849s-.012 3.584-.07 4.849c-.062 1.366-.36 2.633-1.334 3.608-.975.975-2.242 1.273-3.608 1.334-1.265.059-1.645.069-4.849.069s-3.584-.012-4.849-.07c-1.366-.062-2.633-.36-3.608-1.334-.975-.975-1.273-2.242-1.334-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.849c.062-1.366.36-2.633 1.334-3.608.975-.975 2.242-1.273 3.608-1.334C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.756 0 8.338.014 7.053.072 5.752.13 4.563.417 3.608 1.372 2.653 2.327 2.366 3.516 2.308 4.817.011 4.337 0 8.756 0 12s.011 7.663.072 7.953c.058 1.301.345 2.49 1.3 3.445.955.955 2.144 1.242 3.445 1.3.29.061 7.663.072 7.953.072s7.663-.011 7.953-.072c1.301-.058 2.49-.345 3.445-1.3.955-.955 1.242-2.144 1.3-3.445.061-.29.072-7.663.072-7.953s-.011-7.663-.072-7.953c-.058-1.301-.345-2.49-1.3-3.445C19.836.417 18.647.13 17.346.072 16.062.014 15.644 0 12 0zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162S8.597 18.162 12 18.162 18.162 15.403 18.162 12 15.403 5.838 12 5.838zm0 10.324c-2.302 0-4.162-1.86-4.162-4.162S9.698 7.838 12 7.838s4.162 1.86 4.162 4.162-1.86 4.162-4.162 4.162zm6.406-10.845a1.44 1.44 0 1 1-2.881 0 1.44 1.44 0 0 1 2.881 0z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 mt-8">
          &copy; {new Date().getFullYear()} Crowdfundify. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
export default Footer;
