export function Badge({ children, color = "gray" }) {
  const colors = {
    gray: "bg-gray-200 text-gray-700",
    green: "bg-green-200 text-green-700",
    red: "bg-red-200 text-red-700",
    blue: "bg-blue-200 text-blue-700",
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded ${colors[color]}`}>
      {children}
    </span>
  );
}
