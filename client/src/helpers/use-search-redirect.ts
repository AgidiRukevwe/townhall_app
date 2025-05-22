import { useNavigate } from "react-router-dom";

export function useSearchRedirect() {
  const navigate = useNavigate();

  return (query: string) => {
    if (query.trim()) {
      const params = new URLSearchParams();
      params.set("search", query);
      navigate(`/?${params.toString()}`);
    }
  };
}
