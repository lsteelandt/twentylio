import { useEffect, useRef, useState } from 'react';
import { styled } from '@linaria/react';

import { themeCssVariables } from 'twenty-ui/theme-constants';
import { IconPencil, IconTrash, IconShare, IconMail } from 'twenty-ui/display';

const StyledContextMenuContainer = styled.div`
  position: relative;
`;

const StyledContextMenuTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${themeCssVariables.background.secondary};
    border-color: ${themeCssVariables.border.color.medium};
  }
`;

const StyledContextMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${themeCssVariables.spacing[1]};
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  box-shadow: ${themeCssVariables.boxShadow.light};
  z-index: 1000;
  min-width: 180px;
`;

const StyledContextMenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[3]};
  width: 100%;
  padding: ${themeCssVariables.spacing[3]};
  background: transparent;
  border: none;
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  cursor: pointer;
  text-align: left;

  &:hover {
    background: ${themeCssVariables.background.transparent.light};
  }

  &:first-child {
    border-radius: ${themeCssVariables.border.radius.sm}
      ${themeCssVariables.border.radius.sm} 0 0;
  }

  &:last-child {
    border-radius: 0 0 ${themeCssVariables.border.radius.sm}
      ${themeCssVariables.border.radius.sm};
  }
`;

type ContextMenuItem = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
};

type Account360ContextMenuProps = {
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onEmail?: () => void;
  children: React.ReactNode;
};

export const Account360ContextMenu = ({
  onEdit,
  onDelete,
  onShare,
  onEmail,
  children,
}: Account360ContextMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const menuItems: ContextMenuItem[] = [
    {
      icon: <IconPencil />,
      label: 'Edit Company',
      onClick: onEdit,
    },
    {
      icon: <IconMail />,
      label: 'Send Email',
      onClick: onEmail,
    },
    {
      icon: <IconShare />,
      label: 'Share',
      onClick: onShare,
    },
    {
      icon: <IconTrash />,
      label: 'Delete',
      onClick: onDelete,
    },
  ].filter((item) => item.onClick !== undefined);

  const handleItemClick = (onClick?: () => void) => {
    onClick?.();
    setIsOpen(false);
  };

  return (
    <StyledContextMenuContainer ref={containerRef}>
      <StyledContextMenuTrigger
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {children}
      </StyledContextMenuTrigger>
      {isOpen && menuItems.length > 0 && (
        <StyledContextMenu role="menu">
          {menuItems.map((item, index) => (
            <StyledContextMenuItem
              key={index}
              role="menuitem"
              onClick={() => handleItemClick(item.onClick)}
            >
              {item.icon}
              {item.label}
            </StyledContextMenuItem>
          ))}
        </StyledContextMenu>
      )}
    </StyledContextMenuContainer>
  );
};
