import { Button, Dialog, Portal, Text } from "react-native-paper";

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDialog = ({
  visible,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel
}: ConfirmDialogProps) => (
  <Portal>
    <Dialog visible={visible} onDismiss={onCancel}>
      <Dialog.Title>{title}</Dialog.Title>
      {description ? (
        <Dialog.Content>
          <Text>{description}</Text>
        </Dialog.Content>
      ) : null}
      <Dialog.Actions style={{ paddingHorizontal: 20, paddingBottom: 20, gap: 12 }}>
        <Button
          mode="contained-tonal"
          onPress={onCancel}
          contentStyle={{ minHeight: 48, minWidth: 96 }}
          labelStyle={{ fontSize: 22, lineHeight: 28 }}
        >
          {cancelLabel}
        </Button>
        <Button
          mode="contained"
          onPress={onConfirm}
          contentStyle={{ minHeight: 48, minWidth: 96 }}
          labelStyle={{ fontSize: 22, lineHeight: 28 }}
        >
          {confirmLabel}
        </Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
);
