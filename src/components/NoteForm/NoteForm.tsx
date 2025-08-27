import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import type { NewNoteData } from "../../types/note";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import { useId } from "react";
import * as Yup from "yup";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onCloseModal: () => void; // якщо все добре, хочемо функцию, яка закриваэ модалку
}

const formValues: NewNoteData = {
  title: "Title",
  content: "note your task",
  tag: "Todo",
};

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Too Short!")
    .max(50, "Too Long!")
    .required("Required field"),
  content: Yup.string().max(500, "Too long"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Required field"),
});

export default function NoteForm({ onCloseModal }: NoteFormProps) {
  const queryClient = useQueryClient(); // получили доступ до обьекта useQueryClient(), а там -> invalidateQueries

  const fieldId = useId();

  const { mutate, isPending } = useMutation({
    mutationFn: (noteData: NewNoteData) => createNote(noteData),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
      onCloseModal();
    },
  });

  const handleSubmit = (
    values: NewNoteData,
    actions: FormikHelpers<NewNoteData>
  ) => {
    mutate(values);
    actions.setSubmitting(false);
    actions.resetForm();
  };

  return (
    <>
      <Formik
        initialValues={formValues}
        onSubmit={handleSubmit}
        validationSchema={NoteSchema}
      >
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-title`}>Title</label>
            <Field
              id={`${fieldId}-title`}
              type="text"
              name="title"
              className={css.input}
            />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-content`}>Content</label>
            <Field
              as="textarea"
              id={`${fieldId}-content`}
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}tag`}>Tag</label>
            <Field
              as="select"
              id={`${fieldId}tag`}
              name="tag"
              className={css.select}
            >
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCloseModal}
            >
              Cancel
            </button>
            <button type="submit" className={css.submitButton} disabled={false}>
              {isPending ? "Creating ..." : "Create note"}
            </button>
          </div>
        </Form>
      </Formik>
    </>
  );
}
