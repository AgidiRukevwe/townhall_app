import { CheckCircle, XCircle, Vote } from "lucide-react";

interface ElectionTimelineProps {
  elections: Array<{
    year: number;
    type: string;
    party: string;
    position: string;
    result: "won" | "lost";
  }>;
}

export function ElectionTimeline({ elections }: ElectionTimelineProps) {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {elections.map((election, index) => {
          const isLast = index === elections.length - 1;
          
          return (
            <li key={`${election.year}-${election.position}`}>
              <div className="relative pb-8">
                {!isLast && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  ></span>
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center ring-8 ring-white">
                      <Vote className="h-4 w-4 text-blue-500" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-900">
                        {election.year} {election.type}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {election.party} • {election.position}
                      </p>
                    </div>
                    <div className={`whitespace-nowrap text-right text-sm ${
                      election.result === "won" ? "text-green-500" : "text-red-500"
                    } font-medium flex items-center`}>
                      {election.result === "won" ? (
                        <>
                          <span>Won</span>
                          <CheckCircle className="h-4 w-4 ml-1" />
                        </>
                      ) : (
                        <>
                          <span>Lost</span>
                          <XCircle className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
