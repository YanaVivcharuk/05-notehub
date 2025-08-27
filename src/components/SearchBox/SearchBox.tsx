import type { DebouncedState } from "use-debounce";
import { useState } from "react";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  onSearch: DebouncedState<(newSearchQuery: string) => void>;
}
export default function SearchBox({ onSearch }: SearchBoxProps) {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setInputValue(query);
    onSearch(query);
  };

  return (
    <>
      <input
        className={css.input}
        type="text"
        placeholder="Search notes"
        value={inputValue}
        onChange={handleChange}
      />
    </>
  );
}
