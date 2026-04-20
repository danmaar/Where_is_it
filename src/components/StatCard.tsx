import { View } from "react-native";
import { Card, Text } from "react-native-paper";

type StatCardProps = {
  label: string;
  value: number;
};

export const StatCard = ({ label, value }: StatCardProps) => (
  <Card style={{ flex: 1 }}>
    <Card.Content>
      <Text variant="headlineMedium">{value}</Text>
      <Text style={{ opacity: 0.7 }}>{label}</Text>
    </Card.Content>
  </Card>
);
