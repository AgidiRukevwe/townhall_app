import { Official } from "@shared/schema";
import { Link } from "wouter";

interface SimpleOfficialsListProps {
  officials: Official[];
  isLoading: boolean;
}

export function SimpleOfficialsList({ officials, isLoading }: SimpleOfficialsListProps) {
  if (isLoading) {
    return <div>Loading officials...</div>;
  }

  if (!officials || officials.length === 0) {
    return <div>No officials found</div>;
  }

  return (
    <div className="simple-officials-list">
      <h2 className="text-xl font-bold mb-4">Officials List</h2>
      <p className="text-green-600 mb-4">Found {officials.length} officials</p>
      
      <div className="space-y-4">
        {officials.map(official => (
          <div key={official.id} className="border p-4 rounded-lg">
            <h3 className="font-bold text-lg">{official.name}</h3>
            <p>Position: {official.position}</p>
            {official.party && <p>Party: {official.party}</p>}
            {official.location && <p>Location: {official.location}</p>}
            {official.approvalRating !== undefined && (
              <p>Approval Rating: {official.approvalRating}%</p>
            )}
            <Link href={`/profile/${official.id}`}>
              <span className="text-blue-600 underline cursor-pointer mt-2 inline-block">
                View Profile
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}