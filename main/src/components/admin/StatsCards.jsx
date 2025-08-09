const StatsCards = ({ stats }) => {
  const cards = [
    { title: "Total Resources", value: stats.totalResources },
    { title: "Total Users", value: stats.totalUsers },
    { title: "Today's Uploads", value: stats.todaysUploads },
  ];

  return (
    <div className="grid grid-cols-1 dark:text-white md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.title} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">{card.title}</h2>
          <p className="text-2xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
};
export default StatsCards;
