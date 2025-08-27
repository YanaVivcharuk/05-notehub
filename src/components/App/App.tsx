import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import Pagination from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import css from "./App.module.css";

export default function App() {
  // стани (для пошуку searchQuery (стан пошуку))
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data, isLoading, error, isError, isSuccess } = useQuery({
    queryKey: ["notes", searchQuery, currentPage],
    queryFn: () =>
      fetchNotes({ search: searchQuery || "", page: currentPage, perPage: 12 }),
    placeholderData: keepPreviousData,
  });
  const totalPages = data?.totalPages ?? 0;

  const updateSearchQuery = useDebouncedCallback((newSearchQuery: string) => {
    setSearchQuery(newSearchQuery);
    setCurrentPage(1);
  }, 300);

  useEffect(() => {
    if (isSuccess && data?.notes?.length === 0) {
      toast.error("Any notes found for your request.");
    }
  }, [isSuccess, data]);

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <Toaster position="top-center" />
          <SearchBox onSearch={updateSearchQuery} />
          {isLoading && <Loader />}
          {isError && (
            <ErrorMessage
              message={error instanceof Error ? error.message : "Unknown error"}
            />
          )}
          {isSuccess && totalPages > 1 && (
            <Pagination
              page={currentPage}
              total={totalPages}
              onChange={setCurrentPage}
            />
          )}
          <button className={css.button} onClick={openModal}>
            Create note +
          </button>
        </header>
        {data?.notes && data?.notes.length > 0 && (
          <NoteList notes={data?.notes} />
        )}
        {error && <strong>Ooops there was an error...</strong>}
        {isModalOpen && (
          <Modal onClose={closeModal}>
            <NoteForm onCloseModal={closeModal} />
          </Modal>
        )}
      </div>
    </>
  );
}
