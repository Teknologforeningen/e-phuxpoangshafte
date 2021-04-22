import * as React from "react";
import { Sidebar } from "./Sidebar";

export const MainLayout: React.FC = ({ children }) => {
  return (
    <div>
      <Sidebar />
      {children}
    </div>
  );
};
