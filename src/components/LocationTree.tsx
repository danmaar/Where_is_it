import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, View } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";

import { useI18n } from "@/i18n";
import { LocationNode } from "@/types/entities";

type LocationTreeNode = LocationNode & {
  children: LocationTreeNode[];
};

type LocationTreeProps = {
  locations: LocationNode[];
};

const INDENT = 20;

const buildLocationTree = (locations: LocationNode[]): LocationTreeNode[] => {
  const nodes = new Map<string, LocationTreeNode>();

  for (const location of locations) {
    nodes.set(location.id, { ...location, children: [] });
  }

  const roots: LocationTreeNode[] = [];

  for (const location of locations) {
    const node = nodes.get(location.id);
    if (!node) {
      continue;
    }

    if (location.parentId) {
      const parent = nodes.get(location.parentId);
      if (parent) {
        parent.children.push(node);
        continue;
      }
    }

    roots.push(node);
  }

  return roots;
};

const BranchGuides = ({ depth }: { depth: number }) => {
  const theme = useTheme();

  if (depth === 0) {
    return null;
  }

  return (
    <View style={{ width: depth * INDENT, flexDirection: "row" }}>
      {Array.from({ length: depth }).map((_, index) => (
        <View
          key={index}
          style={{
            width: INDENT,
            alignItems: "center"
          }}
        >
          <View
            style={{
              width: 1,
              flex: 1,
              backgroundColor: theme.colors.outlineVariant
            }}
          />
        </View>
      ))}
    </View>
  );
};

const TreeRow = ({
  node,
  depth,
  expandedIds,
  onToggle
}: {
  node: LocationTreeNode;
  depth: number;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
}) => {
  const theme = useTheme();
  const { t } = useI18n();
  const isExpandable = node.children.length > 0;
  const isExpanded = isExpandable ? expandedIds.has(node.id) : false;

  return (
    <View style={{ gap: 10 }}>
      <Pressable onPress={() => router.push(`/location/${node.id}`)}>
        <Surface
          elevation={depth === 0 ? 2 : 1}
          style={{
            borderRadius: 20,
            overflow: "hidden",
            backgroundColor: depth === 0 ? theme.colors.surface : theme.colors.elevation.level1
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "stretch" }}>
            <BranchGuides depth={depth} />
            {depth > 0 ? (
              <View style={{ width: INDENT, alignItems: "center" }}>
                <View
                  style={{
                    width: 1,
                    flex: 1,
                    backgroundColor: theme.colors.outlineVariant
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: INDENT / 2,
                    width: INDENT / 2,
                    height: 1,
                    backgroundColor: theme.colors.outlineVariant
                  }}
                />
              </View>
            ) : null}
            <View style={{ flex: 1, padding: 14, gap: 10 }}>
              <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
                <View style={{ flex: 1, gap: 4 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text variant={depth === 0 ? "titleMedium" : "bodyLarge"}>{node.name}</Text>
                    {isExpandable ? (
                      <Text style={{ color: theme.colors.primary }}>
                        {node.children.length}
                      </Text>
                    ) : null}
                  </View>
                  <Text style={{ color: theme.colors.onSurfaceVariant }}>
                    {t("locations.cardSummary", {
                      childCount: node.childCount,
                      itemCount: node.itemCount
                    })}
                  </Text>
                  <Text numberOfLines={1} style={{ color: theme.colors.onSurfaceVariant }}>
                    {node.path}
                  </Text>
                </View>
                {node.photoUri ? (
                  <Image
                    source={{ uri: node.photoUri }}
                    style={{ width: 52, height: 52, borderRadius: 14 }}
                  />
                ) : (
                  <View
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: theme.colors.surfaceVariant
                    }}
                  >
                    <MaterialCommunityIcons
                      name={node.children.length ? "folder-marker" : "folder-outline"}
                      size={24}
                      color={theme.colors.primary}
                    />
                  </View>
                )}
                {isExpandable ? (
                  <Pressable
                    onPress={() => onToggle(node.id)}
                    hitSlop={10}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: theme.colors.surfaceVariant
                    }}
                  >
                    <MaterialCommunityIcons
                      name={isExpanded ? "chevron-down" : "chevron-right"}
                      size={20}
                      color={theme.colors.onSurfaceVariant}
                    />
                  </Pressable>
                ) : (
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={22}
                    color={theme.colors.onSurfaceVariant}
                  />
                )}
              </View>
            </View>
          </View>
        </Surface>
      </Pressable>

      {isExpandable && isExpanded ? (
        <View style={{ gap: 10 }}>
          {node.children.map((child) => (
            <TreeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              onToggle={onToggle}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
};

export const LocationTree = ({ locations }: LocationTreeProps) => {
  const roots = buildLocationTree(locations);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const handleToggle = (id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <View style={{ gap: 10 }}>
      {roots.map((root) => (
        <TreeRow
          key={root.id}
          node={root}
          depth={0}
          expandedIds={expandedIds}
          onToggle={handleToggle}
        />
      ))}
    </View>
  );
};
