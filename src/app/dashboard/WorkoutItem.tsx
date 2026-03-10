'use client';

import { useState } from 'react';

export default function WorkoutItem({ workout, title }: { workout: any, title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const formattedDate = new Date(workout.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      {/* 1. THE DASHBOARD ROW (Clickable) */}
      <div 
        onClick={() => setIsOpen(true)}
        className='px-6 py-5 cursor-pointer hover:bg-m3-surface-variant/30 transition-colors'
      >
        <div className='mb-3 flex items-center justify-between'>
          <h3 className='text-lg font-semibold text-m3-primary capitalize'>
            {formattedDate}
            <span className="text-m3-text-muted font-normal ml-2 capitalize">
              • {title}
            </span>
          </h3>
          <span className='rounded-full bg-m3-surface-variant px-3 py-1 text-sm text-m3-text-muted font-bold border border-m3-surface-variant'>
            {workout.volume} kg
          </span>
        </div>

        <ul className='space-y-2'>
          {workout.exercises.map((exercise: any) => {
            const maxWeight = Math.max(...exercise.sets.map((set: any) => set.kg));
            const totalReps = exercise.sets.reduce((sum: any, set: any) => sum + set.reps, 0);

            return (
              <li key={exercise.id} className='text-m3-text-main flex justify-between'>
                <span className='font-medium capitalize'>{exercise.name}</span>
                <span className="text-m3-text-muted">
                  {maxWeight > 0 ? `${maxWeight} kg top × ` : ''}
                  {totalReps} total reps ({exercise.sets.length} sets)
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 2. THE MODAL WITH EXACT M3 COLOR SCHEME */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200"
          onClick={() => setIsOpen(false)} // Clicking outside closes it
        >
          <div 
            className="w-full max-w-2xl bg-m3-background rounded-m3-card border border-m3-surface-variant shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Prevent clicking inside from closing it
          >
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-m3-surface-variant bg-m3-surface">
              <div>
                <h2 className="text-2xl font-bold text-m3-primary capitalize">{title}</h2>
                <p className="text-m3-text-muted mt-1">{formattedDate}</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full bg-m3-surface-variant flex items-center justify-center text-m3-text-main hover:brightness-110 transition-all border border-m3-surface-variant"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* High-level Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-m3-surface p-4 rounded-m3-card text-center border border-m3-surface-variant shadow-sm">
                  <p className="text-xs font-medium text-m3-text-muted uppercase tracking-wider mb-1">Volume</p>
                  <p className="text-2xl font-bold text-m3-primary">{workout.volume} kg</p>
                </div>
                <div className="bg-m3-surface p-4 rounded-m3-card text-center border border-m3-surface-variant shadow-sm">
                  <p className="text-xs font-medium text-m3-text-muted uppercase tracking-wider mb-1">Sets</p>
                  <p className="text-2xl font-bold text-m3-primary">{workout.totalSets}</p>
                </div>
                <div className="bg-m3-surface p-4 rounded-m3-card text-center border border-m3-surface-variant shadow-sm">
                  <p className="text-xs font-medium text-m3-text-muted uppercase tracking-wider mb-1">Duration</p>
                  <p className="text-2xl font-bold text-m3-primary">{workout.duration} min</p>
                </div>
              </div>

              {/* Detailed Exercises & Sets */}
              {workout.exercises.map((exercise: any) => (
                <div key={exercise.id} className="bg-m3-surface rounded-m3-card p-5 border border-m3-surface-variant shadow-sm">
                  <h3 className="text-lg font-bold text-m3-text-main mb-4 capitalize flex items-center justify-between">
                    {exercise.name}
                    <span className="text-xs font-bold text-m3-primary bg-m3-primary/10 px-3 py-1 rounded-full uppercase tracking-wider border border-m3-primary/20">
                      {exercise.target}
                    </span>
                  </h3>
                  
                  <div className="space-y-2">
                    {/* Header Row for Sets */}
                    <div className="grid grid-cols-4 text-sm font-semibold text-m3-text-muted mb-2 px-2 border-b border-m3-surface-variant pb-2">
                      <div className="text-center">Set</div>
                      <div className="text-center">kg</div>
                      <div className="text-center">Reps</div>
                      <div className="text-center">Done</div>
                    </div>
                    
                    {/* Actual Sets */}
                    {exercise.sets.map((set: any) => (
                      <div key={set.id} className="grid grid-cols-4 items-center bg-m3-background py-2 px-2 rounded-lg border border-m3-surface-variant/50">
                        <div className="text-center font-bold text-m3-text-main">{set.setNumber}</div>
                        <div className="text-center text-m3-text-main">{set.kg}</div>
                        <div className="text-center text-m3-text-main">{set.reps}</div>
                        <div className="text-center flex justify-center">
                          {set.completed ? (
                            <span className="text-m3-primary text-lg font-bold">✓</span>
                          ) : (
                            <span className="text-m3-text-muted text-lg">-</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}