'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  Table,
  Stack,
  Box,
  TextInput,
  Badge,
  Title,
  Text,
  Group,
  Grid,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

export interface ListColumn<T = any> {
  /** Unique key for the column */
  key: string;
  /** Display label for the column */
  label: string;
  /** Function to extract value from item */
  getValue: (item: T) => any;
  /** Optional custom render function */
  render?: (value: any, item: T) => React.ReactNode;
  /** Column width (flex-basis) */
  width?: string;
  /** Whether this column is sortable */
  sortable?: boolean;
}

export interface ListConfig<T = any> {
  /** Columns configuration */
  columns: ListColumn<T>[];
  /** Function to get unique key for each item */
  getItemKey: (item: T) => string | number;
  /** Optional click handler for items */
  onItemClick?: (item: T) => void;
  /** Optional function to get item status/badge */
  getItemStatus?: (item: T) => { label: string; color: string };
  /** Show item numbers */
  showNumbers?: boolean;
  /** Enable search functionality */
  searchable?: boolean;
  /** Search fields (keys to search in) */
  searchFields?: string[];
}

export interface GenericListProps<T = any> {
  /** Array of items to display */
  items: T[];
  /** Configuration for how to display the list */
  config: ListConfig<T>;
  /** Optional title */
  title?: string;
  /** Optional subtitle/description */
  description?: string;
  /** Layout type */
  layout?: 'grid' | 'table' | 'list';
  /** Empty state message */
  emptyMessage?: string;
  /** Additional CSS class */
  className?: string;
  /** Optional render function for item details view */
  renderItemView?: (item: T, onBack: () => void) => React.ReactNode;
}

const GenericList = <T extends Record<string, any>>({
  items,
  config,
  title,
  description,
  layout = 'grid',
  emptyMessage = 'No items to display',
  className = '',
  renderItemView,
}: GenericListProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!config.searchable || !searchQuery.trim()) {
      return items;
    }

    const query = searchQuery.toLowerCase();
    return items.filter((item) => {
      if (config.searchFields && config.searchFields.length > 0) {
        return config.searchFields.some((field) => {
          const value = item[field];
          return value?.toString().toLowerCase().includes(query);
        });
      }

      // Search in all columns if no specific fields defined
      return config.columns.some((column) => {
        const value = column.getValue(item);
        return value?.toString().toLowerCase().includes(query);
      });
    });
  }, [items, searchQuery, config]);

  // Sort items
  const sortedItems = useMemo(() => {
    if (!sortColumn) {
      return filteredItems;
    }

    const column = config.columns.find((col) => col.key === sortColumn);
    if (!column) {
      return filteredItems;
    }

    return [...filteredItems].sort((a, b) => {
      const aValue = column.getValue(a);
      const bValue = column.getValue(b);

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredItems, sortColumn, sortDirection, config.columns]);

  const handleSort = (columnKey: string) => {
    const column = config.columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return;

    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleItemClick = (item: T) => {
    if (renderItemView) {
      // Internal navigation - show item view within the component
      setSelectedItem(item);
    } else if (config.onItemClick) {
      // External navigation - use the provided click handler
      config.onItemClick(item);
    }
  };

  const handleBackToList = () => {
    setSelectedItem(null);
  };

  // If an item is selected and we have a render function, show the item view
  if (selectedItem && renderItemView) {
    return (
      <Box className={className}>
        {renderItemView(selectedItem, handleBackToList)}
      </Box>
    );
  }

  const renderGridLayout = () => (
    <Grid gutter="xl">
      {sortedItems.map((item, index) => {
        const status = config.getItemStatus?.(item);
        const isClickable = !!(config.onItemClick || renderItemView);
        return (
          <Grid.Col key={config.getItemKey(item)} span={{ base: 12, sm: 6, md: 4 }}>
            <Card
              shadow="sm"
              padding="xl"
              radius="lg"
              withBorder
              style={{
                cursor: isClickable ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                borderColor: 'transparent',
                background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(139, 92, 246, 0.1)) border-box',
                position: 'relative',
              }}
              onClick={() => handleItemClick(item)}
              onMouseEnter={(e) => {
                if (isClickable) {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(124, 58, 237, 0.15)';
                  e.currentTarget.style.background = 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #7c3aed, #8b5cf6, #d946ef) border-box';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '';
                e.currentTarget.style.background = 'linear-gradient(white, white) padding-box, linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(139, 92, 246, 0.1)) border-box';
              }}
            >
              <Stack gap="md">
                {config.showNumbers && (
                  <Box
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 16,
                      background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #d946ef 100%)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.05rem',
                      boxShadow: '0 6px 16px rgba(124, 58, 237, 0.35)',
                    }}
                  >
                    {index + 1}
                  </Box>
                )}
                {config.columns.map((column) => {
                  const value = column.getValue(item);
                  const rendered = column.render ? column.render(value, item) : value;
                  return (
                    <Box key={column.key} style={{ paddingBottom: 12, borderBottom: '1px solid rgba(148, 163, 184, 0.08)' }}>
                      <Text size="xs" fw={800} c="dimmed" tt="uppercase" style={{ letterSpacing: 1.2, marginBottom: 8 }}>
                        {column.label}
                      </Text>
                      <Text size="md" fw={600} style={{ wordBreak: 'break-word' }}>
                        {rendered}
                      </Text>
                    </Box>
                  );
                })}
                {status && (
                  <Badge
                    color="violet"
                    variant="filled"
                    size="lg"
                    radius="xl"
                    style={{
                      background: status.color,
                      textTransform: 'uppercase',
                      letterSpacing: 0.8,
                    }}
                  >
                    {status.label}
                  </Badge>
                )}
              </Stack>
            </Card>
          </Grid.Col>
        );
      })}
    </Grid>
  );

  const renderTableLayout = () => {
    const isClickable = !!(config.onItemClick || renderItemView);
    return (
      <Box
        style={{
          overflowX: 'auto',
          padding: 24,
          background: 'linear-gradient(135deg, #fefeff 0%, #f8fafc 100%)',
          borderRadius: 24,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
        }}
      >
        <Table
          highlightOnHover={isClickable}
          verticalSpacing="md"
          horizontalSpacing="xl"
          striped={false}
          withTableBorder={false}
          withColumnBorders={false}
        >
          <Table.Thead>
            <Table.Tr>
              {config.showNumbers && (
                <Table.Th style={{ width: '60px' }}>
                  <Text size="xs" fw={800} c="dimmed" tt="uppercase" style={{ letterSpacing: 1.5 }}>
                    #
                  </Text>
                </Table.Th>
              )}
              {config.columns.map((column) => (
                <Table.Th
                  key={column.key}
                  style={{
                    width: column.width,
                    cursor: column.sortable ? 'pointer' : 'default',
                  }}
                  onClick={() => handleSort(column.key)}
                >
                  <Group gap="xs">
                    <Text size="xs" fw={800} c="dimmed" tt="uppercase" style={{ letterSpacing: 1.5 }}>
                      {column.label}
                    </Text>
                    {column.sortable && sortColumn === column.key && (
                      <Text c="violet" fw="bold">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </Text>
                    )}
                  </Group>
                </Table.Th>
              ))}
              {config.getItemStatus && (
                <Table.Th style={{ width: '120px' }}>
                  <Text size="xs" fw={800} c="dimmed" tt="uppercase" style={{ letterSpacing: 1.5 }}>
                    Status
                  </Text>
                </Table.Th>
              )}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedItems.map((item, index) => {
              const status = config.getItemStatus?.(item);
              return (
                <Table.Tr
                  key={config.getItemKey(item)}
                  style={{
                    cursor: isClickable ? 'pointer' : 'default',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => handleItemClick(item)}
                  onMouseEnter={(e) => {
                    if (isClickable) {
                      e.currentTarget.style.transform = 'translateX(8px) scale(1.01)';
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(124, 58, 237, 0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0) scale(1)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  {config.showNumbers && (
                    <Table.Td>
                      <Text fw={600}>{index + 1}</Text>
                    </Table.Td>
                  )}
                  {config.columns.map((column) => {
                    const value = column.getValue(item);
                    const rendered = column.render ? column.render(value, item) : value;
                    return (
                      <Table.Td key={column.key}>
                        <Text fw={600} size="sm">
                          {rendered}
                        </Text>
                      </Table.Td>
                    );
                  })}
                  {config.getItemStatus && status && (
                    <Table.Td>
                      <Badge
                        color="violet"
                        variant="filled"
                        size="lg"
                        radius="xl"
                        style={{
                          background: status.color,
                          textTransform: 'uppercase',
                          letterSpacing: 0.8,
                        }}
                      >
                        {status.label}
                      </Badge>
                    </Table.Td>
                  )}
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Box>
    );
  };

  const renderListLayout = () => (
    <Stack gap="lg">
      {sortedItems.map((item, index) => {
        const status = config.getItemStatus?.(item);
        const isClickable = !!(config.onItemClick || renderItemView);
        return (
          <Card
            key={config.getItemKey(item)}
            shadow="sm"
            padding="xl"
            radius="lg"
            withBorder
            style={{
              cursor: isClickable ? 'pointer' : 'default',
              transition: 'all 0.3s ease',
              borderColor: 'transparent',
              background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(139, 92, 246, 0.1)) border-box',
              position: 'relative',
              overflow: 'hidden',
            }}
            onClick={() => handleItemClick(item)}
            onMouseEnter={(e) => {
              if (isClickable) {
                e.currentTarget.style.transform = 'translateX(12px) scale(1.01)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(124, 58, 237, 0.15)';
                e.currentTarget.style.background = 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #7c3aed, #8b5cf6, #d946ef) border-box';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0) scale(1)';
              e.currentTarget.style.boxShadow = '';
              e.currentTarget.style.background = 'linear-gradient(white, white) padding-box, linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(139, 92, 246, 0.1)) border-box';
            }}
          >
            <Group align="center" wrap="nowrap">
              {config.showNumbers && (
                <Box
                  style={{
                    flexShrink: 0,
                    width: 48,
                    height: 48,
                    borderRadius: 16,
                    background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #d946ef 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    boxShadow: '0 6px 16px rgba(124, 58, 237, 0.35)',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  {index + 1}
                </Box>
              )}
              <Group style={{ flex: 1 }} gap="xl" wrap="wrap">
                {config.columns.map((column) => {
                  const value = column.getValue(item);
                  const rendered = column.render ? column.render(value, item) : value;
                  return (
                    <Box key={column.key}>
                      <Text size="xs" fw={800} c="dimmed" tt="uppercase" style={{ letterSpacing: 1.2, marginBottom: 4 }}>
                        {column.label}:
                      </Text>
                      <Text size="md" fw={600}>
                        {rendered}
                      </Text>
                    </Box>
                  );
                })}
              </Group>
              {status && (
                <Badge
                  color="violet"
                  variant="filled"
                  size="lg"
                  radius="xl"
                  style={{
                    flexShrink: 0,
                    background: status.color,
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                  }}
                >
                  {status.label}
                </Badge>
              )}
            </Group>
          </Card>
        );
      })}
    </Stack>
  );

  return (
    <Box className={className}>
      <Stack gap="xl">
        {(title || description) && (
          <Box mb="md">
            {title && (
              <Title
                order={3}
                style={{
                  marginBottom: 8,
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #d946ef 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {title}
              </Title>
            )}
            {description && (
              <Text c="dimmed" size="sm" style={{ lineHeight: 1.5 }}>
                {description}
              </Text>
            )}
          </Box>
        )}

        {config.searchable && (
          <TextInput
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            leftSection={<IconSearch size={18} />}
            size="md"
            radius="md"
            styles={{
              input: {
                border: '2px solid transparent',
                background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #7c3aed, #8b5cf6) border-box',
                transition: 'all 0.3s ease',
                '&:focus': {
                  boxShadow: '0 8px 24px rgba(124, 58, 237, 0.15), 0 0 0 4px rgba(124, 58, 237, 0.1)',
                  transform: 'translateY(-1px)',
                },
              },
            }}
          />
        )}

        <Text c="dimmed" size="sm" fw={600} style={{ letterSpacing: 0.3 }}>
          {sortedItems.length} {sortedItems.length === 1 ? 'item' : 'items'}
        </Text>

        {sortedItems.length === 0 ? (
          <Box
            style={{
              textAlign: 'center',
              padding: '64px 24px',
              color: '#94a3b8',
              fontSize: '1.05rem',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              borderRadius: 16,
              border: '2px dashed #cbd5e1',
            }}
          >
            {emptyMessage}
          </Box>
        ) : (
          <>
            {layout === 'grid' && renderGridLayout()}
            {layout === 'table' && renderTableLayout()}
            {layout === 'list' && renderListLayout()}
          </>
        )}
      </Stack>
    </Box>
  );
};

export default GenericList;
