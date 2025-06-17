
import React from 'react';
import { User } from 'lucide-react';

const UserProfile: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <User className="w-5 h-5 text-gray-300" />
      <span className="text-gray-300">User</span>
    </div>
  );
};

export default UserProfile;
