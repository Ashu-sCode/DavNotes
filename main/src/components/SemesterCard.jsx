export default function SemesterCard({ semester, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 hover:shadow-lg transition flex flex-col items-center justify-center"
    >
      <h2 className="text-xl font-semibold dark:text-gray-50">Semester {semester}</h2>
    </div>
  );
}
