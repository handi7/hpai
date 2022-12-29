import React from "react";
import { Outlet } from "react-router";
import MainLayout from "./Layout";

export default function WithNav() {
  return (
    <div className="h-100">
      <MainLayout>
        <Outlet />
      </MainLayout>
    </div>
  );
}
