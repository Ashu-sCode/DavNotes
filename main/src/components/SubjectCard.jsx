export default function SubjectCard({ subject, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 hover:shadow-lg transition flex flex-col items-center justify-center text-center"
    >
      <h2 className="text-lg font-semibold">{subject}</h2>
    </div>
  );
}
