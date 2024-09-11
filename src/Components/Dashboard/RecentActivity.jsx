import React from 'react';

const RecentActivity = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-[496px] h-fit">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold text-gray-900">Recent Activity</span>
        <a href="#" className="text-blue-600 text-sm">View all</a>
      </div>
      <ul>
        <ListItem
          text="Confirm order update"
          status="URGENT"
          iconColor="bg-blue-600"
          statusColor="bg-yellow-500"
          isCompleted={true}
        />
        <ListItem
          text="Finish shipping update"
          status="URGENT"
          iconColor="bg-red-600"
          statusColor="bg-yellow-500"
          isCompleted={false}
        />
        <ListItem
          text="Create new order"
          status="NEW"
          iconColor="bg-gray-300"
          statusColor="bg-green-400"
          isCompleted={false}
        />
        <ListItem
          text="Update payment report"
          status="DEFAULT"
          iconColor="bg-blue-600"
          statusColor="bg-gray-300"
          isCompleted={true}
        />
      </ul>
    </div>
  );
};

const ListItem = ({ text, status, iconColor, statusColor, isCompleted }) => (
  <li className="flex items-center justify-between py-2 border-b border-gray-300">
    <span className={`flex items-center justify-center w-5 h-5 rounded-full ${iconColor}`}>
      {isCompleted && <span className="text-white text-xs">✓</span>}
    </span>
    <span className="flex-1 text-gray-600 text-sm ml-3">{text}</span>
    <span className={`px-2 py-1 rounded-lg text-xs font-medium text-white ${statusColor}`}>
      {status}
    </span>
  </li>
);

export default RecentActivity;
