import React from "react";

const Footer = () => {
  return (
    <div className="w-full flex items-center justify-center border-t ">
      <div className="px-5 md:px-10 lg:max-w-7xl w-full py-5 grid grid-cols-5">
        {Array(5)
          .fill("")
          .map((item, index) => {
            return (
              <div className="col-span-1 flex " key={index}>
                <ul>
                  <li>hello</li>
                  <li>hello</li>
                  <li>hello</li>
                  <li>hello</li>
                  <li>hello</li>
                </ul>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Footer;
