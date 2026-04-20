import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { TextInput, useTheme } from "react-native-paper";

type FormTextFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  multiline?: boolean;
  keyboardType?: "default" | "numeric";
};

export const FormTextField = <T extends FieldValues>({
  control,
  name,
  label,
  multiline,
  keyboardType = "default"
}: FormTextFieldProps<T>) => {
  const theme = useTheme();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextInput
          mode="outlined"
          label={label}
          value={String(value ?? "")}
          onChangeText={onChange}
          error={!!error}
          multiline={multiline}
          keyboardType={keyboardType}
          numberOfLines={multiline ? 4 : 1}
          style={{ backgroundColor: "transparent" }}
          placeholderTextColor={theme.colors.onSurfaceVariant}
        />
      )}
    />
  );
};
