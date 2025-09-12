import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTrigger } from "./dialog";




export const DialogItem = ({ref,...props}: React.ComponentProps<typeof DropdownMenu.Item> & {
    triggerChildren: React.ReactNode,
    onOpenChange: () => void
}) => {
    const { triggerChildren, children, onSelect, onOpenChange, ...itemProps } = props;
    return (
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <DropdownMenu.Item
            {...itemProps}
            ref={ref}
            className="DropdownMenuItem"
            onSelect={(event) => {
              event.preventDefault();
              onSelect?.(event);
            }}
          >
            {triggerChildren}
          </DropdownMenu.Item>
        </DialogTrigger>
            <DialogPortal>
          <DialogOverlay className="DialogOverlay" />
          <DialogContent className="DialogContent">
            {children}
         
          </DialogContent>
        </DialogPortal>
      </Dialog>
    );
  };