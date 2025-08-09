const RecentUploadsTable = ({ data }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-xl dark:text-white font-semibold mb-4">
        Recent Uploads
      </h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b dark:text-white">
            <th className="p-2">Category</th>
            <th className="p-2">Program</th>
            <th className="p-2">Uploaded By</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b dark:text-white">
              <td className="p-2">{item.category}</td>
              <td className="p-2">{item.program}</td>
              <td className="p-2">{item.uploadedBy}</td>
              <td className="p-2">
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
