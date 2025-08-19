export function Card({ children, className }) {
  return (
    <div className={`bg-white shadow rounded-xl p-4 ${className || ""}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children }) {
  return <div className="mb-2 border-b pb-2">{children}</div>;
}

export function CardTitle({ children }) {
  return <h2 className="text-xl font-semibold">{children}</h2>;
}

export function CardContent({ children }) {
  return <div className="mt-2">{children}</div>;
}
