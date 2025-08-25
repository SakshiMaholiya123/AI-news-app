import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SavedSummaries() {
  // Dummy saved summaries for now
  const [summaries, setSummaries] = useState([
    {
      id: 1,
      title: "AI is Transforming Healthcare",
      summary:
        "Artificial Intelligence is improving diagnostics, drug discovery, and personalized treatments.",
    },
    {
      id: 2,
      title: "Global Warming Impact",
      summary:
        "Rising temperatures are leading to extreme weather events and sea level rise worldwide.",
    },
    {
      id: 3,
      title: "SpaceX Launch Success",
      summary:
        "SpaceX successfully launched its latest batch of Starlink satellites into low Earth orbit.",
    },
  ]);

  const [search, setSearch] = useState("");

  // Filter summaries
  const filteredSummaries = summaries.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase())
  );

  // Delete summary
  const handleDelete = (id) => {
    setSummaries(summaries.filter((item) => item.id !== id));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">
        Saved Summaries
      </h1>

      {/* Search Bar */}
      <div className="flex items-center gap-2 mb-6">
        <Input
          placeholder="Search summaries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
        <Button variant="outline">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Summaries List */}
      <div className="grid gap-4">
        {filteredSummaries.length > 0 ? (
          filteredSummaries.map((item) => (
            <Card key={item.id} className="shadow-md">
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h2>
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {item.summary}
                </p>
                <div className="flex gap-3 mt-4">
                  <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    View Full
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No saved summaries found.</p>
        )}
      </div>
    </div>
  );
}
