import { Settings } from 'lucide-react';

export default function SystemSettings() {
  return (
    <div className="max-w-6xl mx-auto pb-24 h-full flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-16 h-16 bg-[#1a1a1a] border border-white/5 flex items-center justify-center rounded-2xl mb-6">
        <Settings size={32} className="text-[#ceab7a]" />
      </div>
      <h1 className="text-3xl font-serif text-white tracking-tight mb-3">System Settings</h1>
      <p className="text-gray-400 text-sm max-w-sm text-center">
        System settings and configuration will be added here in the future.
      </p>
    </div>
  );
}
