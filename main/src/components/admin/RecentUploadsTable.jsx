const RecentUploadsTable = ({ data }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow overflow-x-auto">
      <h2 className="text-xl dark:text-white font-semibold mb-4">
        Recent Uploads
      </h2>
      <table className="min-w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-300 dark:border-gray-600 dark:text-white">
            <th className="p-2 whitespace-nowrap">Category</th>
            <th className="p-2 whitespace-nowrap">Program</th>
            <th className="p-2 whitespace-nowrap">Uploaded By</th>
            <th className="p-2 whitespace-nowrap">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-200 dark:border-gray-700 dark:text-white"
            >
              <td className="p-2 whitespace-nowrap">{item.category}</td>
              <td className="p-2 whitespace-nowrap">{item.program}</td>
              <td className="p-2 whitespace-nowrap">{item.uploadedBy}</td>
              <td className="p-2 whitespace-nowrap">
                {item.createdAt?.toDate().toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentUploadsTable;
