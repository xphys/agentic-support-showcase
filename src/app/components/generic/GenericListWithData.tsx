"use client";

import React, { useEffect, useState } from "react";
import { Box, Stack, Loader, Text, Button, Alert } from "@mantine/core";
import { DataType, loadListData } from "../../actions/dataActions";
import FullScreenModal from "../FullScreenModal";
import GenericList from "./GenericList";

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
  /** Optional click handler for items - receives itemId */
  onItemClick?: (itemId: string | number) => void;
  /** Optional function to get item status/badge */
  getItemStatus?: (item: T) => { label: string; color: string };
  /** Show item numbers */
  showNumbers?: boolean;
  /** Enable search functionality */
  searchable?: boolean;
  /** Search fields (keys to search in) */
  searchFields?: string[];
}

export interface GenericListWithDataProps {
  /** Data type to load */
  dataType: DataType;
  /** Configuration for how to display the list */
  config: ListConfig<any>;
  /** Optional title */
  title?: string;
  /** Optional subtitle/description */
  description?: string;
  /** Layout type */
  layout?: "grid" | "table" | "list";
  /** Empty state message */
  emptyMessage?: string;
  /** Additional CSS class */
  className?: string;
  /** Hide fullscreen button (when already in fullscreen mode) */
  hideFullscreenButton?: boolean;
  /** Optional render function for item details view (enables internal navigation) */
  renderItemView?: (item: any, onBack: () => void) => React.ReactNode;
}

const GenericListWithData = ({
  dataType,
  config,
  title,
  description,
  layout = "grid",
  emptyMessage = "No items to display",
  className = "",
  hideFullscreenButton = false,
  renderItemView,
}: GenericListWithDataProps) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  // Load data from server action
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await loadListData(dataType);
        if (result.success) {
          setItems(result.data);
        } else {
          setError("Failed to load data");
        }
      } catch (err) {
        setError("An error occurred while loading data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataType]);

  // Wrap the onItemClick handler to work with GenericList
  const listConfig = config.onItemClick
    ? {
        ...config,
        onItemClick: (item: any) => {
          const itemId = config.getItemKey(item);
          console.log("[GenericListWithData] Item clicked - itemId:", itemId, "type:", typeof itemId);
          config.onItemClick?.(itemId);
        },
      }
    : config;

  if (loading) {
    return (
      <Box className={className} ta="center" py="xl">
        <Stack align="center" gap="md">
          <Loader color="violet" size="xl" />
          <Text
            size="lg"
            fw={600}
            variant="gradient"
            gradient={{ from: "violet", to: "grape", deg: 135 }}
          >
            Loading {title || "data"}...
          </Text>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={className}>
        <Alert
          variant="light"
          color="red"
          title="Error"
          radius="md"
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <>
      <Box pos="relative">
        {!hideFullscreenButton && (
          <Button
            onClick={() => setIsFullscreenOpen(true)}
            variant="gradient"
            gradient={{ from: "violet", to: "grape", deg: 135 }}
            pos="absolute"
            top={0}
            right={0}
            style={{ zIndex: 10 }}
            leftSection={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            }
          >
            Expand
          </Button>
        )}
        <GenericList
          items={items}
          config={listConfig}
          title={title}
          description={description}
          layout={layout}
          emptyMessage={emptyMessage}
          className={className}
          renderItemView={renderItemView}
        />
      </Box>

      <FullScreenModal
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        title={title || "Data List"}
      >
        <GenericListWithData
          dataType={dataType}
          config={config}
          title={undefined}
          description={description}
          layout={layout}
          emptyMessage={emptyMessage}
          hideFullscreenButton={true}
        />
      </FullScreenModal>
    </>
  );
};

export default GenericListWithData;
