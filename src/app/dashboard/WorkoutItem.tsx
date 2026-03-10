'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#FEF08A', '#FDE047', '#FACC15', '#EAB308', '#CA8A04', '#A16207', '#713F12'];

export default function WorkoutItem({ workout, title }: { workout: any, title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  // THIS IS THE MAGIC FIX FOR BACKGROUND SCROLLING
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Lock main page scroll
    } else {
      document.body.style.overflow = 'unset';  // Unlock main page scroll
    }

    // Cleanup function just in case the component unmounts while open
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const formattedDate = new Date(workout.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const barChartData = workout.exercises.map((ex: any) => ({
    name: ex.name,
    maxWeight: Math.max(...ex.sets.map((s: any) => s.kg), 0)
  }));

  const lowestWeight = Math.min(...barChartData.map((d: any) => d.maxWeight));
  const xAxisMin = Math.max(0, Math.floor(lowestWeight * 0.7));

  const pieChartData = workout.exercises.map((ex: any) => {
    const totalVolume = ex.sets.reduce((sum: number, set: any) => sum + (set.kg * set.reps), 0);
    return { name: ex.name, value: totalVolume };
  }).filter((data: any) => data.value > 0);

  return (
    <>
      {/* 1. THE DASHBOARD ROW */}
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

      {/* 2. THE MODAL */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)} 
        >
          <div 
            className="w-full max-w-6xl bg-m3-background rounded-m3-card border border-m3-surface-variant shadow-2xl flex flex-col md:flex-row max-h-[90vh] min-h-[75vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()} 
          >
            
            {/* LEFT SIDE: CHARTS & DATA VIZ */}
            <div className="w-full md:w-[45%] bg-m3-surface border-r border-m3-surface-variant p-8 flex flex-col gap-10 overflow-y-auto hidden md:flex">
              
              <div className="flex-1 min-h-[250px] flex flex-col">
                <h3 className="text-sm font-bold text-m3-text-muted uppercase tracking-wider mb-6">Max Weight Lifted</h3>
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 40 }}>
                      <XAxis 
                        type="number" 
                        domain={[xAxisMin, 'auto']} 
                        tick={{fill: '#a1a1aa', fontSize: 12}} 
                        stroke="#3f3f46"
                        label={{ value: 'Weight (kg)', position: 'bottom', fill: '#FACC15', fontSize: 13, dy: 15 }}
                      />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={90} 
                        tick={{fill: '#a1a1aa', fontSize: 13}} 
                        axisLine={false} 
                        tickLine={false} 
                      />
                      <Tooltip 
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        contentStyle={{ backgroundColor: '#1e1e24', borderColor: '#3f3f46', color: '#e4e4e7', borderRadius: '12px', padding: '12px' }}
                        itemStyle={{ color: '#FACC15', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="maxWeight" fill="#FACC15" radius={[0, 6, 6, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex-1 min-h-[300px] flex flex-col">
                <h3 className="text-sm font-bold text-m3-text-muted uppercase tracking-wider mb-2">Volume Distribution</h3>
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieChartData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e1e24', borderColor: '#3f3f46', color: '#e4e4e7', borderRadius: '12px', padding: '12px' }}
                        itemStyle={{ color: '#FACC15', fontWeight: 'bold' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: WORKOUT DETAILS */}
            <div className="w-full md:w-[55%] flex flex-col bg-m3-background h-full min-h-0">
              {/* Header - Made flex-none so it never shrinks */}
              <div className="flex-none flex items-center justify-between p-6 border-b border-m3-surface-variant">
                <div>
                  <h2 className="text-3xl font-bold text-m3-primary capitalize">{title}</h2>
                  <p className="text-m3-text-muted mt-2">{formattedDate}</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-12 h-12 rounded-full bg-m3-surface-variant flex items-center justify-center text-m3-text-main hover:bg-m3-surface hover:brightness-125 transition-all border border-m3-surface-variant text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Area - Added min-h-0 so flexbox triggers internal scrolling */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 min-h-0">
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="bg-m3-surface p-5 rounded-m3-card text-center border border-m3-surface-variant shadow-sm">
                    <p className="text-xs font-medium text-m3-text-muted uppercase tracking-wider mb-2">Volume</p>
                    <p className="text-3xl font-bold text-m3-primary">{workout.volume} kg</p>
                  </div>
                  <div className="bg-m3-surface p-5 rounded-m3-card text-center border border-m3-surface-variant shadow-sm">
                    <p className="text-xs font-medium text-m3-text-muted uppercase tracking-wider mb-2">Sets</p>
                    <p className="text-3xl font-bold text-m3-primary">{workout.totalSets}</p>
                  </div>
                  <div className="bg-m3-surface p-5 rounded-m3-card text-center border border-m3-surface-variant shadow-sm">
                    <p className="text-xs font-medium text-m3-text-muted uppercase tracking-wider mb-2">Duration</p>
                    <p className="text-3xl font-bold text-m3-primary">{workout.duration} min</p>
                  </div>
                </div>

                {workout.exercises.map((exercise: any) => (
                  <div key={exercise.id} className="bg-m3-surface rounded-m3-card p-6 border border-m3-surface-variant shadow-sm">
                    <h3 className="text-xl font-bold text-m3-text-main mb-6 capitalize flex items-center justify-between">
                      {exercise.name}
                      <span className="text-xs font-bold text-[#FACC15] bg-[#FACC15]/10 px-4 py-1.5 rounded-full uppercase tracking-wider border border-[#FACC15]/20">
                        {exercise.target}
                      </span>
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-4 text-sm font-semibold text-m3-text-muted mb-3 px-2 border-b border-m3-surface-variant pb-3">
                        <div className="text-center">Set</div>
                        <div className="text-center">kg</div>
                        <div className="text-center">Reps</div>
                        <div className="text-center">Done</div>
                      </div>
                      
                      {exercise.sets.map((set: any) => (
                        <div key={set.id} className="grid grid-cols-4 items-center bg-m3-background py-3 px-2 rounded-xl border border-m3-surface-variant/50">
                          <div className="text-center font-bold text-m3-text-main">{set.setNumber}</div>
                          <div className="text-center text-m3-text-main font-medium">{set.kg}</div>
                          <div className="text-center text-m3-text-main font-medium">{set.reps}</div>
                          <div className="text-center flex justify-center">
                            {set.completed ? (
                              <span className="text-[#FACC15] text-xl font-bold">✓</span>
                            ) : (
                              <span className="text-m3-text-muted text-xl">-</span>
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
        </div>
      )}
    </>
  );
}