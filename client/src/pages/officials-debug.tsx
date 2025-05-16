import { useEffect, useState } from "react";
import { Official } from "@shared/schema";

export default function OfficialsDebug() {
  const [officials, setOfficials] = useState<Official[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchOfficials() {
      try {
        setLoading(true);
        const response = await fetch("/api/officials");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Debug page officials data:", data);
        setOfficials(data);
      } catch (e) {
        console.error("Error fetching officials:", e);
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        setLoading(false);
      }
    }

    fetchOfficials();
  }, []);

  if (loading) {
    return <div>Loading officials data...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Officials Debug Page</h1>
      <p>Found {officials.length} officials</p>
      
      <pre style={{ backgroundColor: "#f5f5f5", padding: "10px", margin: "10px 0", overflow: "auto" }}>
        {JSON.stringify({ count: officials.length }, null, 2)}
      </pre>
      
      <div>
        {officials.map(official => (
          <div key={official.id} style={{ 
            border: "1px solid #ddd", 
            padding: "15px", 
            marginBottom: "15px", 
            borderRadius: "5px",
            backgroundColor: "#fff" 
          }}>
            <h2>{official.name}</h2>
            <div><strong>Position:</strong> {official.position}</div>
            <div><strong>Party:</strong> {official.party}</div>
            <div><strong>Location:</strong> {official.location}</div>
            {official.approvalRating !== undefined && (
              <div><strong>Approval Rating:</strong> {official.approvalRating}%</div>
            )}
            {official.sectors && official.sectors.length > 0 && (
              <div>
                <strong>Sectors:</strong> {official.sectors.map(s => s.name).join(", ")}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}