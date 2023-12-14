export default function SearchBar({ placeholder, setSearchTerm }) {
  return (
    <div className="relative mb-2 w-full md:w-1/2 lg:w-1/2 drop-shadow-lg w-90">
      <input
        className="h-10 w-full rounded-lg border bg-white border-stroke bg-transparent pl-3 pr-8 text-base focus:outline-none"
        type="text"
        placeholder={placeholder}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
