import React from "react";
//import Image from 'antd/es/image';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div
       style={{
         display: "flex",
         flexDirection: "row",
        
       }}
     >
       <div
         style={{
           position: "absolute",
           height: "100%",
           width: "100%",
         }}
       >
        {children}
       </div>
     </div>
  );
};

export default AuthLayout;
