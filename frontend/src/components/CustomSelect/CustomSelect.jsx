import styles from './CustomSelect.module.css';
import * as Select from '@radix-ui/react-select';
import { GoChevronDown, GoCheck } from 'react-icons/go';

const CustomSelect = ({
  id,
  value,
  onChange,
  options,
  placeholder = '-',
  ariaLabel = 'Select',
  disabled = false,
}) => {
  return (
    <Select.Root value={value} onValueChange={onChange} disabled={disabled}>
      <Select.Trigger id={id} className={styles.trigger} aria-label={ariaLabel}>
        <Select.Value placeholder={placeholder} />
        <Select.Icon className={styles.icon}>
          <GoChevronDown />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className={styles.content}
          position="popper"
          side="bottom"
          align="start"
          sideOffset={8}
        >
          <Select.Viewport className={styles.viewport}>
            {options.map((option) => (
              <Select.Item
                key={option.value}
                className={styles.item}
                value={option.value}
              >
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator className={styles.check}>
                  <GoCheck />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default CustomSelect;
