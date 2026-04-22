import * as React from 'react'

import AsyncSelect, {AsyncProps} from 'react-select/async'
import AsyncCreatableSelect, {
  AsyncCreatableProps,
} from 'react-select/async-creatable'
import ReactSelect, {
  Props as RSProps,
  GroupBase,
  StylesConfig,
} from 'react-select'
import SelectClass from 'react-select/dist/declarations/src/Select'

import {useDebounceAsync} from '@hooks/debounce'
import {noop} from '@utils/misc'

type AsyncSelectProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> = AsyncProps<Option, IsMulti, Group> &
  React.RefAttributes<SelectClass<Option, IsMulti, Group>> & {
    wait?: number
    error?: boolean
    height?: number
  }

type AsyncSelectCreatableProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> = AsyncCreatableProps<Option, IsMulti, Group> &
  React.RefAttributes<SelectClass<Option, IsMulti, Group>> & {
    wait?: number
    error?: boolean
    height?: number
  }

/**
 * Renders a custom <AsyncSelect />
 *
 * @component
 * @param {AsyncSelectProps}
 */
function SelectAutocomplete<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  loadOptions,
  onChange,
  wait,
  error,
  height,
  ...props
}: AsyncSelectProps<Option, IsMulti, Group>) {
  const debouncedSearch = useDebounceAsync(
    async (search: string) => await loadOptions?.(search, noop),
    wait,
  )

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      isClearable
      loadOptions={debouncedSearch}
      onChange={onChange}
      styles={styles<Option, IsMulti, Group>(error, height)}
      {...props}
    />
  )
}

/**
 * Renders a custom <AsyncCreatableSelect />
 *
 * @component
 * @param {AsyncSelectCreatableProps}
 */
function SelectCreatableAutocomplete<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  loadOptions,
  onChange,
  wait,
  error,
  height,
  ...props
}: AsyncSelectCreatableProps<Option, IsMulti, Group>) {
  const debouncedSearch = useDebounceAsync(
    async (search: string) => await loadOptions?.(search, noop),
    wait,
  )

  return (
    <AsyncCreatableSelect
      cacheOptions
      defaultOptions
      isClearable
      loadOptions={debouncedSearch}
      onChange={onChange}
      styles={styles<Option, IsMulti, Group>(error, height)}
      {...props}
    />
  )
}

type SelectProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> = RSProps<Option, IsMulti, Group> & {error?: boolean; height?: number}

/**
 * Renders custom <ReactSelect />
 *
 * @component
 * @param param0
 */
function Select<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({error, height, ...props}: SelectProps<Option, IsMulti, Group>) {
  return (
    <ReactSelect
      {...props}
      styles={styles<Option, IsMulti, Group>(error, height)}
    />
  )
}

/**
 * Default styles for select and autocomplete
 *
 * @param {boolean | undefined} error
 */
function styles<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
>(
  error: boolean | undefined,
  height: number | undefined,
): StylesConfig<Option, IsMulti, Group> {
  return {
    menu: provided => ({
      ...provided,
      zIndex: 20,
    }),
    menuList: provided => ({
      ...provided,
      height: height ? height : 'auto',
    }),
    control: (provided, state) => ({
      ...provided,
      borderColor: error ? '#DC2626' : '#E4E4E7',
      backgroundColor: error ? '#FEE2E2' : provided.backgroundColor,
      '&:hover': {borderColor: state.isFocused ? '#15803D' : '#E4E4E7'},
      boxShadow: state.isFocused ? '0 0 0 1px #15803D' : '',
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: '0.85rem',
      color: state.isDisabled ? '#E4E4E7' : '#14532D',
      backgroundColor: state.isDisabled
        ? '#D4D4D8'
        : state.isSelected
          ? '#FDE047'
          : state.isFocused
            ? '#FEF9C3'
            : '',
      cursor: state.isDisabled ? 'not-allowed' : 'default',
      ':active': {
        backgroundColor: '#FDE047',
      },
    }),
    singleValue: provided => ({
      ...provided,
      fontSize: '0.85rem',
    }),
    placeholder: provided => ({
      ...provided,
      fontSize: '0.85rem',
    }),
  }
}

export {SelectAutocomplete, SelectCreatableAutocomplete, Select}
