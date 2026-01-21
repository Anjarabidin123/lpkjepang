
import AdminSeeder from '@/components/AdminSeeder';

export default function AdminSeederPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Setup Admin User
          </h1>
          <p className="text-gray-600">
            Create your first admin user to access the LPK Pemagangan management system.
          </p>
        </div>
        <AdminSeeder />
      </div>
    </div>
  );
}
