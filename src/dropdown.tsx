/* Seria UI · Copyright (c) 2026 Sie · See LICENSE. */
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import type { ReactNode } from 'react';
import { useThemeScope } from './theme.js';

export type DropdownItem = {
  id: string;
  label: string;
  onSelect: () => void;
  disabled?: boolean;
  tone?: 'neutral' | 'danger';
};

export function Dropdown({
  label,
  items,
  disabled = false,
}: {
  label: ReactNode;
  items: readonly DropdownItem[];
  disabled?: boolean;
}) {
  const scope = useThemeScope();
  return (
    <Menu>
      <MenuButton className="pui-button" disabled={disabled}>
        {label}
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="m4 6 4 4 4-4" />
        </svg>
      </MenuButton>
      <MenuItems
        anchor="bottom end"
        portal
        transition
        className="pui-dropdown"
        data-pui-theme={scope?.resolved}
        style={scope?.style}
      >
        {items.map((item) => (
          <MenuItem key={item.id} disabled={item.disabled}>
            <button
              type="button"
              className="pui-dropdown-item"
              data-tone={item.tone}
              onClick={item.onSelect}
            >
              {item.label}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}
