const colorTypes = {
  success: "bg-success text-white border-success-dark",
  error: "bg-danger text-white border-danger-dark",
  warning: "bg-yellow-400 text-black border-yellow-600",
};

export default function AlertModal({ alert }) {
  if (!alert?.show) return null;

  return (
    <div
      className={`fixed top-5 right-5 px-6 py-3 border-l-8 rounded-lg shadow-lg animate-fade-in-up 
      ${colorTypes[alert.type] || "bg-primary text-white border-primary-dark"}`}
    >
      <p className="font-semibold tracking-wide">{alert.message}</p>
    </div>
  );
}
