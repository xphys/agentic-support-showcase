'use client';

import React from 'react';
import { Card, Image, Text, Badge, Button, Group, Stack, Title, Paper, Grid, Box } from '@mantine/core';

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
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  /** Is action disabled */
  disabled?: boolean;
}

export interface GenericItemProps<T = any> {
  /** The item to display */
  item: T;
  /** Configuration for fields to display */
  fields: ItemField<T>[];
  /** Optional title */
  title?: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Optional image URL */
  imageUrl?: string;
  /** Actions/buttons */
  actions?: ItemAction[];
  /** Layout: 'card' | 'panel' | 'details' */
  layout?: 'card' | 'panel' | 'details';
  /** Back button handler */
  onBack?: () => void;
  /** Additional CSS class */
  className?: string;
}

const GenericItem = <T extends Record<string, any>>({
  item,
  fields,
  title,
  subtitle,
  imageUrl,
  actions,
  layout = 'card',
  onBack,
  className = '',
}: GenericItemProps<T>) => {
  // Group fields by section
  const sections = fields.reduce((acc, field) => {
    const section = field.section || 'default';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(field);
    return acc;
  }, {} as Record<string, ItemField<T>[]>);

  const renderFieldValue = (field: ItemField<T>) => {
    const value = field.getValue(item);
    const rendered = field.render ? field.render(value, item) : value;

    if (field.badge) {
      return (
        <Badge color={field.badgeColor || 'violet'} size="lg" radius="md" variant="filled">
          {rendered}
        </Badge>
      );
    }

    return <Text size="sm" fw={600}>{rendered}</Text>;
  };

  const getButtonVariant = (variant?: string): any => {
    switch (variant) {
      case 'primary':
        return 'gradient';
      case 'secondary':
        return 'light';
      case 'danger':
        return 'filled';
      case 'success':
        return 'filled';
      default:
        return 'gradient';
    }
  };

  const getButtonColor = (variant?: string) => {
    switch (variant) {
      case 'danger':
        return 'red';
      case 'success':
        return 'green';
      default:
        return 'violet';
    }
  };

  const renderCardLayout = () => (
    <Card shadow="lg" radius="lg" withBorder className={className}>
      {imageUrl && (
        <Card.Section>
          <Image src={imageUrl} alt={title || 'Item'} height={240} fit="cover" />
        </Card.Section>
      )}

      <Stack gap="md" mt={imageUrl ? 'md' : 0}>
        {(title || subtitle) && (
          <Box>
            {title && <Title order={2} size="h2" mb="xs" c="violet.7">{title}</Title>}
            {subtitle && <Text c="dimmed" size="sm">{subtitle}</Text>}
          </Box>
        )}

        <Stack gap="lg">
          {Object.entries(sections).map(([section, sectionFields]) => (
            <Box key={section}>
              {section !== 'default' && (
                <Title order={4} size="h5" mb="xs" c="violet">{section}</Title>
              )}
              <Grid gutter="md">
                {sectionFields.map((field) => (
                  <Grid.Col
                    key={field.key}
                    span={{ base: 12, sm: field.span ? (12 / field.span) as any : 6 }}
                  >
                    <Paper p="md" withBorder={field.highlight} bg={field.highlight ? 'violet.0' : undefined} radius="md">
                      <Text size="xs" tt="uppercase" fw={700} c="dimmed" mb={4}>
                        {field.label}
                      </Text>
                      {renderFieldValue(field)}
                    </Paper>
                  </Grid.Col>
                ))}
              </Grid>
            </Box>
          ))}
        </Stack>

        {actions && actions.length > 0 && (
          <Group gap="md" mt="md">
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                variant={getButtonVariant(action.variant)}
                color={getButtonColor(action.variant)}
                disabled={action.disabled}
                leftSection={action.icon}
                gradient={action.variant === 'primary' || !action.variant ? { from: 'violet', to: 'grape', deg: 135 } : undefined}
              >
                {action.label}
              </Button>
            ))}
          </Group>
        )}
      </Stack>
    </Card>
  );

  const renderPanelLayout = () => (
    <Card shadow="lg" radius="lg" withBorder className={className}>
      <Card.Section withBorder inheritPadding py="md">
        <Group justify="space-between" align="flex-start" wrap="wrap">
          <Group>
            {imageUrl && (
              <Image src={imageUrl} alt={title || 'Item'} w={80} h={80} radius="md" fit="cover" />
            )}
            <Box>
              {title && <Title order={2} size="h3" c="violet.7">{title}</Title>}
              {subtitle && <Text c="dimmed" size="sm">{subtitle}</Text>}
            </Box>
          </Group>

          {actions && actions.length > 0 && (
            <Group gap="xs">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.onClick}
                  variant={getButtonVariant(action.variant)}
                  color={getButtonColor(action.variant)}
                  disabled={action.disabled}
                  leftSection={action.icon}
                  size="sm"
                  gradient={action.variant === 'primary' || !action.variant ? { from: 'violet', to: 'grape', deg: 135 } : undefined}
                >
                  {action.label}
                </Button>
              ))}
            </Group>
          )}
        </Group>
      </Card.Section>

      <Stack gap="lg" mt="md">
        {Object.entries(sections).map(([section, sectionFields]) => (
          <Box key={section}>
            {section !== 'default' && (
              <Title order={4} size="h5" mb="xs" c="violet">{section}</Title>
            )}
            <Stack gap="sm">
              {sectionFields.map((field) => (
                <Group key={field.key} justify="space-between" align="flex-start" wrap="wrap">
                  <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                    {field.label}
                  </Text>
                  <Box style={{ textAlign: 'right' }}>
                    {renderFieldValue(field)}
                  </Box>
                </Group>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Card>
  );

  const renderDetailsLayout = () => (
    <Card shadow="lg" radius="lg" withBorder className={className}>
      <Card.Section
        withBorder
        p="xl"
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
          color: 'white'
        }}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={title || 'Item'}
            w={140}
            h={140}
            radius="lg"
            mb="md"
            fit="cover"
            style={{ border: '4px solid rgba(255, 255, 255, 0.3)' }}
          />
        )}
        {title && <Title order={1} c="white" mb="xs">{title}</Title>}
        {subtitle && <Text c="white" size="lg" opacity={0.95}>{subtitle}</Text>}
      </Card.Section>

      <Stack gap="xl" mt="xl">
        {Object.entries(sections).map(([section, sectionFields]) => (
          <Box key={section}>
            {section !== 'default' && (
              <Title order={3} size="h4" mb="md" c="violet">{section}</Title>
            )}
            <Grid gutter="lg">
              {sectionFields.map((field) => (
                <Grid.Col
                  key={field.key}
                  span={{ base: 12, sm: field.span ? (12 / field.span) as any : 6 }}
                >
                  <Paper p="md" withBorder={field.highlight} bg={field.highlight ? 'violet.0' : undefined} radius="md">
                    <Text size="xs" tt="uppercase" fw={700} c="dimmed" mb={4}>
                      {field.label}
                    </Text>
                    {renderFieldValue(field)}
                  </Paper>
                </Grid.Col>
              ))}
            </Grid>
          </Box>
        ))}
      </Stack>

      {actions && actions.length > 0 && (
        <Group gap="md" mt="xl">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              variant={getButtonVariant(action.variant)}
              color={getButtonColor(action.variant)}
              disabled={action.disabled}
              leftSection={action.icon}
              gradient={action.variant === 'primary' || !action.variant ? { from: 'violet', to: 'grape', deg: 135 } : undefined}
            >
              {action.label}
            </Button>
          ))}
        </Group>
      )}
    </Card>
  );

  return (
    <Box>
      {onBack && (
        <Button onClick={onBack} variant="light" color="violet" mb="md" leftSection="←">
          Back
        </Button>
      )}

      {layout === 'card' && renderCardLayout()}
      {layout === 'panel' && renderPanelLayout()}
      {layout === 'details' && renderDetailsLayout()}
    </Box>
  );
};

export default GenericItem;
