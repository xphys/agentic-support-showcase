"use client";

import React, { useEffect, useState } from "react";
import { Card, Stack, Box, Text, Title, Loader, Alert, Button, Group, Badge, Grid, Image } from "@mantine/core";
import { DataType, loadItemData } from "../../actions/dataActions";
import FullScreenModal from "../FullScreenModal";

export interface ItemField<T = any> {
  /** Unique key for the field */
  key: string;
  /** Display label */
  label: string;
  /** Function to extract value from item */
  getValue: (item: T) => any;
  /** Optional custom render function */
  render?: (value: any, item: T) => React.ReactNode;
  /** Field category/section */
  section?: string;
  /** Whether to highlight this field */
  highlight?: boolean;
  /** Field width in grid layout */
  span?: 1 | 2 | 3 | 4;
  /** Show as a badge */
  badge?: boolean;
  /** Badge color */
  badgeColor?: string;
}

export interface ItemAction {
  /** Action label */
  label: string;
  /** Action handler */
  onClick: () => void;
  /** Icon or emoji */
  icon?: string;
  /** Button style variant */
  variant?: "primary" | "secondary" | "danger" | "success";
  /** Is action disabled */
  disabled?: boolean;
}

export interface GenericItemWithDataProps {
  /** Data type to load */
  dataType: DataType;
  /** Item ID to load */
  itemId: string | number;
  /** Configuration for fields to display */
  fields: ItemField<any>[];
  /** Optional title function - receives item */
  getTitle?: (item: any) => string;
  /** Optional subtitle function - receives item */
  getSubtitle?: (item: any) => string;
  /** Optional image URL function - receives item */
  getImageUrl?: (item: any) => string;
  /** Actions/buttons function - receives item */
  getActions?: (item: any) => ItemAction[];
  /** Layout: 'card' | 'panel' | 'details' */
  layout?: "card" | "panel" | "details";
  /** Back button handler */
  onBack?: () => void;
  /** Additional CSS class */
  className?: string;
  /** Hide fullscreen button (when already in fullscreen mode) */
  hideFullscreenButton?: boolean;
}

const GenericItemWithData = ({
  dataType,
  itemId,
  fields,
  getTitle,
  getSubtitle,
  getImageUrl,
  getActions,
  layout = "card",
  onBack,
  className = "",
  hideFullscreenButton = false,
}: GenericItemWithDataProps) => {
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  // Load data from server action
  useEffect(() => {
    const fetchData = async () => {
      console.log("[GenericItemWithData] Starting to load data - dataType:", dataType, "itemId:", itemId, "type:", typeof itemId);
      setLoading(true);
      setError(null);
      try {
        const result = await loadItemData(dataType, itemId);
        console.log("[GenericItemWithData] Server action result:", result);
        if (result.success) {
          console.log("[GenericItemWithData] Item data loaded:", result.data);
          setItem(result.data);
        } else {
          console.error("[GenericItemWithData] Failed to load:", result.error);
          setError(result.error || "Failed to load data");
        }
      } catch (err) {
        console.error("[GenericItemWithData] Error:", err);
        setError("An error occurred while loading data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataType, itemId]);

  // Group fields by section
  const sections = fields.reduce((acc, field) => {
    const section = field.section || "default";
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(field);
    return acc;
  }, {} as Record<string, ItemField<any>[]>);

  const renderFieldValue = (field: ItemField<any>) => {
    if (!item) return null;
    const value = field.getValue(item);
    const rendered = field.render ? field.render(value, item) : value;

    if (field.badge) {
      return (
        <Badge
          color={field.badgeColor || "violet"}
          variant="filled"
          size="sm"
          style={{ textTransform: "uppercase" }}
        >
          {rendered}
        </Badge>
      );
    }

    return <Text size="sm" c="gray.9">{rendered}</Text>;
  };

  const getMantineButtonProps = (variant?: string): { color: string; variant: "filled" | "outline" } => {
    switch (variant) {
      case "primary":
        return { color: "violet", variant: "filled" };
      case "secondary":
        return { color: "gray", variant: "outline" };
      case "danger":
        return { color: "red", variant: "filled" };
      case "success":
        return { color: "green", variant: "filled" };
      default:
        return { color: "violet", variant: "filled" };
    }
  };

  const renderCardLayout = () => {
    if (!item) return null;
    const title = getTitle?.(item);
    const subtitle = getSubtitle?.(item);
    const imageUrl = getImageUrl?.(item);

    return (
      <Card shadow="sm" radius="md" withBorder>
        {imageUrl && (
          <Card.Section>
            <Image
              src={imageUrl}
              alt={title || "Item"}
              height={200}
              fit="cover"
            />
          </Card.Section>
        )}

        <Stack gap="md" mt={imageUrl ? "md" : 0}>
          {(title || subtitle) && (
            <Box pb="md" style={{ borderBottom: "2px solid var(--mantine-color-gray-2)" }}>
              {title && <Title order={2} size="h2" c="gray.9">{title}</Title>}
              {subtitle && <Text c="gray.6" size="sm" mt="xs">{subtitle}</Text>}
            </Box>
          )}

          <Stack gap="lg">
            {Object.entries(sections).map(([section, sectionFields]) => (
              <Box key={section}>
                {section !== "default" && (
                  <Title order={4} size="h4" c="gray.7" pb="xs" mb="md" style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}>
                    {section}
                  </Title>
                )}
                <Grid gutter="md">
                  {sectionFields.map((field) => (
                    <Grid.Col
                      key={field.key}
                      span={{ base: 12, sm: field.span ? (12 / 4) * field.span : 3 }}
                    >
                      <Box
                        p={field.highlight ? "md" : 0}
                        bg={field.highlight ? "blue.0" : undefined}
                        style={field.highlight ? {
                          borderRadius: "8px",
                          borderLeft: "4px solid var(--mantine-color-violet-6)"
                        } : undefined}
                      >
                        <Text size="xs" fw={600} c="gray.6" tt="uppercase" style={{ letterSpacing: "0.5px" }}>
                          {field.label}
                        </Text>
                        <Box mt={6}>
                          {renderFieldValue(field)}
                        </Box>
                      </Box>
                    </Grid.Col>
                  ))}
                </Grid>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Card>
    );
  };

  const renderPanelLayout = () => {
    if (!item) return null;
    const title = getTitle?.(item);
    const subtitle = getSubtitle?.(item);
    const imageUrl = getImageUrl?.(item);
    const actions = getActions?.(item);

    return (
      <Card shadow="sm" radius="md" withBorder>
        <Box
          p="lg"
          bg="gray.0"
          style={{ borderBottom: "2px solid var(--mantine-color-gray-2)" }}
        >
          <Group justify="space-between" align="flex-start" wrap="wrap">
            <Group gap="md">
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={title || "Item"}
                  width={64}
                  height={64}
                  radius="md"
                  fit="cover"
                />
              )}
              <Box>
                {title && <Title order={2} size="h2" c="gray.9">{title}</Title>}
                {subtitle && <Text c="gray.6" size="sm" mt="xs">{subtitle}</Text>}
              </Box>
            </Group>

            {actions && actions.length > 0 && (
              <Group gap="xs" wrap="wrap">
                {actions.map((action, index) => {
                  const buttonProps = getMantineButtonProps(action.variant);
                  return (
                    <Button
                      key={index}
                      onClick={action.onClick}
                      disabled={action.disabled}
                      leftSection={action.icon}
                      {...buttonProps}
                    >
                      {action.label}
                    </Button>
                  );
                })}
              </Group>
            )}
          </Group>
        </Box>

        <Stack gap="lg" p="lg">
          {Object.entries(sections).map(([section, sectionFields]) => (
            <Box key={section}>
              {section !== "default" && (
                <Title order={4} size="h4" c="gray.7" pb="xs" mb="md" style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}>
                  {section}
                </Title>
              )}
              <Stack gap="md">
                {sectionFields.map((field) => (
                  <Box
                    key={field.key}
                    p={field.highlight ? "md" : 0}
                    bg={field.highlight ? "blue.0" : undefined}
                    style={field.highlight ? {
                      borderRadius: "8px",
                      borderLeft: "4px solid var(--mantine-color-violet-6)"
                    } : undefined}
                  >
                    <Text size="xs" fw={600} c="gray.6" tt="uppercase" style={{ letterSpacing: "0.5px" }}>
                      {field.label}
                    </Text>
                    <Box mt={6}>
                      {renderFieldValue(field)}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Card>
    );
  };

  const renderDetailsLayout = () => {
    if (!item) return null;
    const title = getTitle?.(item);
    const subtitle = getSubtitle?.(item);
    const imageUrl = getImageUrl?.(item);

    return (
      <Card shadow="sm" radius="md" withBorder>
        {(title || subtitle || imageUrl) && (
          <Box
            p="xl"
            style={{
              background: "linear-gradient(135deg, var(--mantine-color-violet-6) 0%, var(--mantine-color-grape-7) 100%)",
              color: "white"
            }}
          >
            {imageUrl && (
              <Box mb="md">
                <Image
                  src={imageUrl}
                  alt={title || "Item"}
                  width={120}
                  height={120}
                  radius="md"
                  fit="cover"
                  style={{ border: "4px solid rgba(255, 255, 255, 0.3)" }}
                />
              </Box>
            )}
            <Box>
              {title && <Title order={1} size="h1" c="white">{title}</Title>}
              {subtitle && <Text size="lg" c="white" opacity={0.9} mt="xs">{subtitle}</Text>}
            </Box>
          </Box>
        )}

        <Stack gap="xl" p="xl">
          {Object.entries(sections).map(([section, sectionFields]) => (
            <Box key={section}>
              {section !== "default" && (
                <Title order={3} size="h3" c="gray.7" pb="xs" mb="lg" style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}>
                  {section}
                </Title>
              )}
              <Grid gutter="lg">
                {sectionFields.map((field) => (
                  <Grid.Col
                    key={field.key}
                    span={{ base: 12, sm: 6 }}
                  >
                    <Box
                      p={field.highlight ? "md" : 0}
                      bg={field.highlight ? "blue.0" : undefined}
                      style={field.highlight ? {
                        borderRadius: "8px",
                        borderLeft: "4px solid var(--mantine-color-violet-6)"
                      } : undefined}
                    >
                      <Text size="xs" fw={600} c="gray.6" tt="uppercase" style={{ letterSpacing: "0.5px" }}>
                        {field.label}
                      </Text>
                      <Box mt={6}>
                        {renderFieldValue(field)}
                      </Box>
                    </Box>
                  </Grid.Col>
                ))}
              </Grid>
            </Box>
          ))}
        </Stack>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box className={className} w="100%">
        {onBack && (
          <Button
            onClick={onBack}
            variant="gradient"
            gradient={{ from: "violet", to: "grape", deg: 135 }}
            leftSection="←"
            mb="md"
          >
            Back
          </Button>
        )}
        <Card
          shadow="md"
          radius="lg"
          p="xl"
          style={{
            background: "linear-gradient(135deg, var(--mantine-color-gray-0) 0%, var(--mantine-color-gray-1) 100%)",
            border: "2px dashed var(--mantine-color-violet-2)"
          }}
        >
          <Stack align="center" gap="md" py="xl">
            <Loader color="violet" size="xl" />
            <Text
              size="lg"
              fw={600}
              variant="gradient"
              gradient={{ from: "violet", to: "grape", deg: 135 }}
            >
              Loading item details...
            </Text>
          </Stack>
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={className} w="100%">
        {onBack && (
          <Button
            onClick={onBack}
            variant="gradient"
            gradient={{ from: "violet", to: "grape", deg: 135 }}
            leftSection="←"
            mb="md"
          >
            Back
          </Button>
        )}
        <Alert
          variant="light"
          color="red"
          title="Error"
          radius="lg"
          p="xl"
          styles={{
            root: {
              background: "linear-gradient(135deg, var(--mantine-color-red-0) 0%, var(--mantine-color-red-1) 100%)",
              border: "2px solid var(--mantine-color-red-2)"
            }
          }}
        >
          <Text fw={600}>{error}</Text>
        </Alert>
      </Box>
    );
  }

  const actions = item && getActions?.(item);

  return (
    <>
      <Box className={className} w="100%">
        {(onBack || !hideFullscreenButton) && (
          <Group justify="space-between" mb="md" wrap="wrap">
            {onBack && (
              <Button
                onClick={onBack}
                variant="gradient"
                gradient={{ from: "violet", to: "grape", deg: 135 }}
                leftSection="←"
              >
                Back
              </Button>
            )}
            {!hideFullscreenButton && (
              <Button
                onClick={() => setIsFullscreenOpen(true)}
                variant="gradient"
                gradient={{ from: "violet", to: "grape", deg: 135 }}
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
                style={{ marginLeft: onBack ? undefined : "auto" }}
              >
                Expand
              </Button>
            )}
          </Group>
        )}

        {layout === "card" && renderCardLayout()}
        {layout === "panel" && renderPanelLayout()}
        {layout === "details" && renderDetailsLayout()}

        {actions && actions.length > 0 && layout !== "panel" && (
          <Group gap="md" mt="lg" wrap="wrap">
            {actions.map((action: ItemAction, index: number) => {
              const buttonProps = getMantineButtonProps(action.variant);
              return (
                <Button
                  key={index}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  leftSection={action.icon}
                  {...buttonProps}
                >
                  {action.label}
                </Button>
              );
            })}
          </Group>
        )}
      </Box>

      <FullScreenModal
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        title={item && getTitle ? getTitle(item) : "Item Detail"}
      >
        <GenericItemWithData
          dataType={dataType}
          itemId={itemId}
          fields={fields}
          getTitle={getTitle}
          getSubtitle={getSubtitle}
          getImageUrl={getImageUrl}
          getActions={getActions}
          layout={layout}
          onBack={undefined}
          hideFullscreenButton={true}
        />
      </FullScreenModal>
    </>
  );
};

export default GenericItemWithData;
