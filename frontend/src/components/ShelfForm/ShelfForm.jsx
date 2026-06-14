import { useState } from 'react';
import toast from 'react-hot-toast';

import { useCreateShelf, useUpdateShelf } from '../../hooks/useShelves';

import styles from './ShelfForm.module.css';
import { XIcon } from '@phosphor-icons/react';

const ShelfForm = ({ mode = 'create', shelf, onClose }) => {
  const isEditMode = mode === 'edit';

  const [name, setName] = useState(shelf?.name || '');

  const createShelfMutation = useCreateShelf();
  const updateShelfMutation = useUpdateShelf();

  const isPending =
    createShelfMutation.isPending || updateShelfMutation.isPending;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error('Shelf name is required');
      return;
    }

    try {
      if (isEditMode) {
        await updateShelfMutation.mutateAsync({
          id: shelf.id,
          name: trimmedName,
        });

        toast.success('Shelf renamed');
      } else {
        await createShelfMutation.mutateAsync({
          name: trimmedName,
        });

        toast.success('Shelf created');
      }

      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form className={styles.shelfForm} onSubmit={handleSubmit}>
      <div className={styles.shelfFormHeader}>
        <h2>{isEditMode ? 'Rename Shelf' : 'Add Shelf'}</h2>

        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close form"
        >
          <XIcon size={18} weight="bold" />
        </button>
      </div>

      <div className={styles.formInput}>
        <label htmlFor="shelf-name">Name</label>

        <input
          id="shelf-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Philosophy"
          autoFocus
          autoComplete="off"
        />
      </div>

      <div className={styles.formBtns}>
        <button type="button" onClick={onClose}>
          Cancel
        </button>

        <button type="submit" disabled={isPending}>
          {isPending
            ? isEditMode
              ? 'Saving...'
              : 'Adding...'
            : isEditMode
              ? 'Save'
              : 'Add Shelf'}
        </button>
      </div>
    </form>
  );
};

export default ShelfForm;
