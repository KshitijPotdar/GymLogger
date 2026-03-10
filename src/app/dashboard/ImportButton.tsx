'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';

export default function ImportButton() {
    const router = useRouter();
    const [isImporting, setIsImporting] = useState(false);
    const [progress, setProgress] = useState('');

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        setProgress('Parsing CSV...');

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    const rows = results.data;
                    
                    // Smart Batching: Group by start_time 
                    const batches: any[][] = [];
                    let currentBatch: any[] = [];
                    let currentStartTime = (rows[0] as any)?.start_time;

                    for (const row of rows) {
                        const rowStart = (row as any).start_time;
                        
                        
                        if (rowStart !== currentStartTime && currentBatch.length > 250) {
                            batches.push(currentBatch);
                            currentBatch = [];
                            currentStartTime = rowStart;
                        }
                        currentBatch.push(row);
                    }
                    if (currentBatch.length > 0) batches.push(currentBatch);

                    // Send batches to the backend one by one
                    for (let i = 0; i < batches.length; i++) {
                        setProgress(`Saving batch ${i + 1} of ${batches.length}...`);
                        
                        const response = await fetch('/api/import-app-data', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ rows: batches[i] })
                        });

                        if (!response.ok) throw new Error("Failed to import batch");
                    }
                    
                    alert(`Success! Migrated your entire history.`);
                    router.refresh(); 
                } catch (error) {
                    console.error(error);
                    alert("There was an error importing your history.");
                } finally {
                    setIsImporting(false);
                    setProgress('');
                }
            }
        });
    };

    return (
        <label className="rounded-m3-btn bg-m3-surface-variant border border-m3-surface-variant px-8 py-4 text-m3-text-main font-semibold hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm">
            {isImporting ? `⏳ ${progress}` : ' Import CSV data'}
            <input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                onChange={handleFileUpload} 
                disabled={isImporting}
            />
        </label>
    );
}