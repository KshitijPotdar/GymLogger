'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteAll = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete all your workout data?"
    );
    
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch('/api/workouts', {
        method: 'DELETE',
      });

      if (response.ok) {
        alert("All workout data has been successfully deleted.");
        setIsOpen(false); // Close the menu
        router.refresh(); // Tells the server dashboard to re-fetch the Prisma data
      } else {
        const data = await response.json();
        alert(`Error: ${data.error || "Failed to delete data"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative">
      {/* Settings Gear Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full p-2 hover:bg-m3-surface-variant transition-colors"
        aria-label="Settings"
      >
        ⚙️
      </button>

      {/* The Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-m3-card bg-m3-surface border border-m3-surface-variant shadow-xl z-50">
          <div className="p-2">
            <div className="px-3 py-2 text-sm font-bold text-m3-text-muted border-b border-m3-surface-variant mb-2">
              
            </div>
            <button
              onClick={handleDeleteAll}
              disabled={isDeleting}
              className="w-full text-left px-3 py-2 text-sm text-red-500 rounded-md hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete All Workout History"}
            </button>
            {/* ### Add more features to setting later ### */}
          </div>
        </div>
      )}
      
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}