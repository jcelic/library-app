import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { XIcon } from '@phosphor-icons/react';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import styles from './BookForm.module.css';

import { bookSchema } from '../../validation/booksSchema';
import { useCreateBook, useUpdateBook } from '../../hooks/useBooks';
import CustomSelect from '../CustomSelect/CustomSelect';

const CATEGORY_OPTIONS = [
  { value: 'fiction', label: 'Fiction' },
  { value: 'nonfiction', label: 'Nonfiction' },
];

const BookForm = ({
  mode = 'create',
  book = null,
  listType = 'owned',
  onClose,
  closeRequestSignal,
}) => {
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const isEditMode = mode === 'edit';
  const currentListType = book?.list_type ?? listType;

  const createBookMutation = useCreateBook();
  const updateBookMutation = useUpdateBook();

  const {
    register,
    control,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book?.title ?? '',
      subtitle: book?.subtitle ?? '',
      author: book?.author ?? '',
      category: book?.category ?? undefined,
      imageUrl: book?.image_source_url ?? '',
      status: book?.status ?? 'not_finished',
    },
  });

  useEffect(() => {
    if (isEditMode && book) {
      reset({
        title: book.title ?? '',
        subtitle: book.subtitle ?? '',
        author: book.author ?? '',
        category: book.category ?? undefined,
        imageUrl: book.image_source_url ?? '',
        status: book.status ?? 'not_finished',
      });
    }
  }, [isEditMode, book, reset]);

  useEffect(() => {
    setFocus('title');
  }, [setFocus]);

  const isSubmitting =
    createBookMutation.isPending || updateBookMutation.isPending;

  const handleClose = useCallback(() => {
    if (!isDirty) {
      onClose();
      return;
    }

    setShowDiscardConfirm(true);
  }, [isDirty, onClose]);

  const previousCloseRequest = useRef(closeRequestSignal);

  useEffect(() => {
    if (closeRequestSignal === undefined) return;

    if (closeRequestSignal === previousCloseRequest.current) return;

    previousCloseRequest.current = closeRequestSignal;
    handleClose();
  }, [closeRequestSignal, handleClose]);

  const onSubmit = async (values) => {
    const bookData = {
      title: values.title,
      subtitle: values.subtitle || null,
      author: values.author,
      category: values.category,
      image_source_url: values.imageUrl || null,
      status: values.status,
      list_type: book?.list_type ?? listType,
      is_favorite: book?.is_favorite ?? false,
    };

    try {
      if (isEditMode) {
        await updateBookMutation.mutateAsync({
          id: book.id,
          bookData,
        });

        toast.success('Book updated');
      } else {
        await createBookMutation.mutateAsync(bookData);

        toast.success('Book added');
      }

      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (showDiscardConfirm) {
    return (
      <div className={styles.bookForm}>
        <div className={styles.discardView}>
          <h2>Discard changes?</h2>

          <p>
            You have unsaved changes. Are you sure you want to close this form?
          </p>

          <div className={styles.discardActions}>
            <button
              type="button"
              className={styles.keepBtn}
              onClick={() => setShowDiscardConfirm(false)}
            >
              Keep editing
            </button>

            <button
              type="button"
              className={styles.discardBtn}
              onClick={onClose}
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      className={styles.bookForm}
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={styles.bookFormHeader}>
        <h2>{isEditMode ? 'Edit Book' : 'Add Book'}</h2>

        <button
          type="button"
          className={styles.closeBtn}
          onClick={handleClose}
          aria-label="Close form"
        >
          <XIcon size={18} weight="bold" />
        </button>
      </div>

      <div className={styles.formInput}>
        <label htmlFor="title">Title</label>
        <input id="title" type="text" {...register('title')} />
        <span className={styles.error}>{errors.title?.message || ''}</span>
      </div>

      <div className={styles.formInput}>
        <label htmlFor="subtitle">Subtitle</label>
        <input id="subtitle" type="text" {...register('subtitle')} />
        <span className={styles.error}>{errors.subtitle?.message || ''}</span>
      </div>

      <div className={styles.formInput}>
        <label htmlFor="author">Author</label>
        <input id="author" type="text" {...register('author')} />
        <span className={styles.error}>{errors.author?.message || ''}</span>
      </div>

      <div className={styles.formInput}>
        <label htmlFor="category">Category</label>

        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <CustomSelect
              id="category"
              value={field.value}
              onChange={field.onChange}
              options={CATEGORY_OPTIONS}
            />
          )}
        />

        <span className={styles.error}>{errors.category?.message || ''}</span>
      </div>

      <div className={styles.formInput}>
        <label htmlFor="imageUrl">Image Link</label>
        <input id="imageUrl" type="url" {...register('imageUrl')} />
        <span className={styles.error}>{errors.imageUrl?.message || ''}</span>
      </div>

      {currentListType === 'owned' && (
        <div className={styles.formInput}>
          <label>Status</label>

          <div className={styles.radios}>
            <label className={styles.radio} htmlFor="status-not-finished">
              <input
                id="status-not-finished"
                type="radio"
                value="not_finished"
                {...register('status')}
              />
              <span className={styles.pill}>Not Finished</span>
            </label>

            <label className={styles.radio} htmlFor="status-finished">
              <input
                id="status-finished"
                type="radio"
                value="finished"
                {...register('status')}
              />
              <span className={styles.pill}>Finished</span>
            </label>
          </div>

          <span className={styles.error}>{errors.status?.message || ''}</span>
        </div>
      )}

      <div className={styles.formBtns}>
        <button type="button" onClick={handleClose}>
          Cancel
        </button>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditMode
              ? 'Saving...'
              : 'Adding...'
            : isEditMode
              ? 'Save Changes'
              : 'Add Book'}
        </button>
      </div>
    </form>
  );
};

export default BookForm;
