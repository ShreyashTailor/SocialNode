'use client'

import * as React from 'react'

import { Select as SelectPrimitive } from '@base-ui/react/select'

import { CheckIcon, ChevronDownIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

function Select<Value = string, Multiple extends boolean | undefined = false>({
  ...props
}: SelectPrimitive.Root.Props<Value, Multiple>) {
  return <SelectPrimitive.Root data-slot='select' {...props} />
}

function SelectTrigger({ className, size = 'default', ...props }: SelectPrimitive.Trigger.Props & { size?: 'sm' | 'default' }) {
  return (
    <SelectPrimitive.Trigger
      data-slot='select-trigger'
      data-size={size}
      className={cn(
        "border-input data-placeholder:text-muted-foreground aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/40 dark:aria-invalid:ring-destructive/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 aria-invalid:ring-[3px] data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 data-[size=default]:h-9 data-[size=sm]:rounded-sm data-[size=default]:rounded-md",
        className
      )}
      {...props}
    />
  )
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot='select-value'
      className={cn('text-foreground min-w-0 flex-1 text-left', className)}
      {...props}
    />
  )
}

function SelectIcon({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot='select-icon'
      className={cn('text-muted-foreground shrink-0 [&>svg]:size-4', className)}
      {...props}
    >
      <ChevronDownIcon />
    </span>
  )
}

function SelectContent({
  className,
  side = 'bottom',
  sideOffset = 4,
  align = 'start',
  children,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<SelectPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Backdrop className='fixed inset-0 z-40 bg-black/0' />
      <SelectPrimitive.Positioner
        className='isolate z-50'
        align={align}
        side={side}
        sideOffset={sideOffset}
      >
        <SelectPrimitive.Popup
          data-slot='select-content'
          className={cn(
            'bg-popover text-popover-foreground data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-y-auto rounded-md border p-1 text-sm shadow-md',
            className
          )}
          {...props}
        >
          {children}
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='select-group'
      className={cn('p-1 text-foreground w-full', className)}
      {...props}
    />
  )
}

function SelectLabel({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      data-slot='select-label'
      className={cn('text-muted-foreground px-2 py-1.5 text-xs', className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot='select-item'
      className={cn(
        'relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground',
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className='min-w-0 flex-1 truncate'>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className='absolute right-2 flex size-4 items-center justify-center'>
        <CheckIcon className='size-4' />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectIcon,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem
}
