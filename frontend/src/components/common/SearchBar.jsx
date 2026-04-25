import { Search } from 'lucide-react';
import Input from '../ui/Input';

function SearchBar({ value, onChange, placeholder = 'Search' }) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a4afc4]" />
      <Input className="bg-[#f6f8ff] pl-11" onChange={onChange} placeholder={placeholder} value={value} />
    </div>
  );
}

export default SearchBar;
