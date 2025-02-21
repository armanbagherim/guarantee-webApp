import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function StatusLabelChips({
  statusId,
  text,
  isTransaction = false,
}) {
  const orderColor = {
    background: isTransaction
      ? statusId === 1
        ? "#ffcb62"
        : statusId === 2
        ? "#dc3545"
        : statusId === 3
        ? "#2cc570"
        : statusId === 4
        ? "#007bff"
        : ""
      : statusId === 1
      ? "#ffcb62"
      : statusId === 2
      ? "#2cc570"
      : statusId === 3
      ? "#007bff"
      : statusId === 4
      ? "#ffc107"
      : statusId === 5
      ? "#6c757d"
      : statusId === 6
      ? "#28a745"
      : "",
    text: isTransaction
      ? statusId === 1
        ? "#000"
        : statusId === 2
        ? "#fff"
        : statusId === 3
        ? "#fff"
        : statusId === 4
        ? "#fff"
        : ""
      : statusId === 1
      ? "#000"
      : statusId === 2
      ? "#fff"
      : statusId === 3
      ? "#fff"
      : statusId === 4
      ? "#000"
      : statusId === 5
      ? "#fff"
      : statusId === 6
      ? "#fff"
      : "",
    icon: isTransaction
      ? statusId === 1
        ? "fas fa-clock"
        : statusId === 2
        ? "fas fa-times"
        : statusId === 3
        ? "fas fa-check"
        : statusId === 4
        ? "fas fa-undo"
        : ""
      : statusId === 1
      ? "fas fa-clock"
      : statusId === 2
      ? "fas fa-check"
      : statusId === 3
      ? "fas fa-cog"
      : statusId === 4
      ? "fas fa-truck"
      : statusId === 5
      ? "fas fa-motorcycle"
      : statusId === 6
      ? "fas fa-box-open"
      : "",
  };

  return (
    <span
      style={{
        background: orderColor.background,
        color: orderColor.text,
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
      className="rounded-full p-2 text-xs"
    >
      {orderColor.icon && <i className={orderColor.icon}></i>}
      {text}
    </span>
  );
}
