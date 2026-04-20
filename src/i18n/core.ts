export type AppLanguage = "ru" | "en";

type TranslationParams = Record<string, string | number | boolean | null | undefined>;
type TranslationValue = string | ((params?: TranslationParams) => string);

const translations = {
  ru: {
    appName: "Мой инвентарь",
    common: {
      add: "Добавить",
      save: "Сохранить",
      cancel: "Отмена",
      delete: "Удалить",
      edit: "Редактировать",
      find: "Найти",
      clear: "Очистить",
      favorites: "Избранное",
      all: "Все"
    },
    navigation: {
      home: "Главная",
      search: "Поиск",
      locations: "Локации",
      items: "Предметы",
      settings: "Настройки"
    },
    notFound: {
      title: "Не найдено",
      heading: "Экран не найден",
      action: "На главную"
    },
    home: {
      subtitle: "Найдите нужный предмет за секунды и держите домашние вещи в порядке.",
      totalItems: "Предметов",
      totalLocations: "Локаций",
      quickActions: "Быстрые действия",
      addItem: "Добавить предмет",
      addLocation: "Добавить локацию",
      recentUpdated: "Недавно обновлённые",
      recentSearches: "Недавние поиски",
      noFavoritesTitle: "Пока нет избранного",
      noFavoritesDescription: "Отмечайте важные вещи звёздочкой, чтобы они всегда были под рукой.",
      noItemsTitle: "Предметов пока нет",
      noItemsDescription: "Добавьте первый предмет и укажите точную локацию.",
      noSearchesTitle: "История поиска пуста",
      noSearchesDescription: "Как только вы начнёте искать предметы, здесь появятся последние запросы."
    },
    search: {
      placeholder: "Введите название предмета или тег",
      searchBarPlaceholder: "Поиск предметов",
      results: "Результаты",
      noResultsTitle: "Ничего не найдено",
      noResultsDescription: "Попробуйте другое название, часть слова или тег.",
      recentSearches: "Недавние поиски",
      emptyRecentTitle: "История поиска пуста",
      emptyRecentDescription: "Начните вводить запрос, чтобы быстро находить вещи по названию и тегам.",
      clearHistoryTitle: "Очистить историю?",
      clearHistoryDescription: "Недавние поиски будут удалены только с этого устройства."
    },
    items: {
      emptyFavoritesTitle: "Избранного пока нет",
      emptyFavoritesDescription: "Отмечайте важные предметы звёздочкой.",
      emptyItemsTitle: "Предметов пока нет",
      emptyItemsDescription: "Добавьте первый предмет и прикрепите его к точной локации."
    },
    locations: {
      intro: "Иерархия мест хранения. Открывайте локацию, чтобы увидеть вложенные места и предметы.",
      emptyTitle: "Локаций пока нет",
      emptyDescription: "Создайте корневую локацию, например Дом или Гараж.",
      addNested: "Добавить вложенную",
      nestedLocations: "Вложенные локации",
      nestedEmptyTitle: "Нет вложенных локаций",
      nestedEmptyDescription: "Создайте дочернюю локацию, если хотите детализировать хранение.",
      itemsHere: "Предметы в этой локации",
      itemsEmptyTitle: "Предметов нет",
      itemsEmptyDescription: "Добавьте предмет прямо в эту локацию.",
      noTags: "Без тегов",
      cardSummary: ({ childCount, itemCount }: TranslationParams = {}) =>
        `Вложенные локации: ${childCount} · Предметы здесь: ${itemCount}`
    },
    item: {
      quantityLabel: "Количество",
      notesLabel: "Заметки",
      tagsLabel: "Теги через запятую",
      favoriteLabel: "Избранное",
      nameLabel: "Название",
      locationLabel: "Локация",
      gallery: "Из галереи",
      camera: "Камера",
      removePhoto: "Убрать фото",
      cameraPermissionTitle: "Нет доступа",
      cameraPermissionDescription: "Разрешите доступ к камере в настройках устройства.",
      addTitle: "Добавить предмет",
      editTitle: "Редактировать предмет",
      missingTitle: "Предмет не найден",
      missingDescription: "Возможно, он был удалён.",
      createdAt: ({ value }: TranslationParams = {}) => `Создан: ${value}`,
      updatedAt: ({ value }: TranslationParams = {}) => `Обновлён: ${value}`,
      deleteConfirmTitle: "Подтвердите удаление",
      deleteConfirmDescription: "Предмет будет удалён из локальной базы.",
      saveErrorTitle: "Не удалось сохранить",
      saveErrorFallback: "Попробуйте ещё раз."
    },
    location: {
      nameLabel: "Название",
      parentLabel: "Родительская локация",
      emptyParent: "Без родителя",
      addTitle: "Добавить локацию",
      editTitle: "Редактировать локацию",
      missingTitle: "Локация не найдена",
      missingDescription: "Возможно, она была удалена.",
      deleteConfirmTitle: "Подтвердите удаление",
      deleteConfirmDescription:
        "Локация будет удалена, если в ней нет вложенных локаций и предметов.",
      deleteImpossibleTitle: "Удаление невозможно",
      saveErrorTitle: "Не удалось сохранить",
      saveErrorFallback: "Попробуйте ещё раз."
    },
    settings: {
      themeTitle: "Тема оформления",
      themeDescription:
        "Используйте системную тему устройства или вручную переключайте светлый и тёмный режим.",
      themeSystem: "Система",
      themeLight: "Светлая",
      themeDark: "Тёмная",
      languageTitle: "Язык интерфейса",
      languageDescription: "Переключайте приложение между русским и английским.",
      russian: "Русский",
      english: "English",
      backupTitle: "Резервная копия",
      backupDescription:
        "Экспортируйте все локации, предметы, теги и историю поиска в локальный JSON-файл.",
      exportData: "Экспорт данных",
      importData: "Импорт данных",
      exportSuccessTitle: "Экспорт завершён",
      exportSuccessDescription:
        "JSON-файл с данными подготовлен и передан в системное меню.",
      exportErrorTitle: "Не удалось экспортировать",
      exportErrorFallback: "Попробуйте ещё раз.",
      importSuccessTitle: "Импорт завершён",
      importSuccessReplace: "Данные заменены.",
      importSuccessMerge: "Данные объединены.",
      importErrorTitle: "Не удалось импортировать",
      importErrorFallback: "Проверьте JSON-файл.",
      importPromptTitle: "Импорт данных",
      importPromptDescription:
        "Выберите режим импорта. Замена полностью перезапишет текущую локальную базу.",
      importMerge: "Объединить",
      importReplace: "Заменить",
      aboutTitle: "О приложении",
      aboutAppTitle: "Мой инвентарь",
      aboutAppDescription:
        "Offline-first MVP для домашнего инвентаря без облака и без регистрации.",
      aboutStorageTitle: "Локальное хранение",
      aboutStorageDescription: "Все данные находятся только на устройстве в SQLite.",
      aboutPlatformTitle: "Android-first",
      aboutPlatformDescription: "Интерфейс и сценарии оптимизированы под Android."
    },
    backup: {
      corruptedStructure:
        "Структура резервной копии повреждена: не удалось восстановить дерево локаций.",
      fileSystemAccessError: "Не удалось получить доступ к файловой системе.",
      shareDialogTitle: "Экспорт данных"
    },
    errors: {
      bootstrap: "Ошибка инициализации",
      locationCircularParent: "Нельзя сделать потомка родителем текущей локации.",
      locationHasChildren: "Сначала удалите или перенесите вложенные локации.",
      locationHasItems: "Сначала удалите или перенесите предметы из этой локации."
    },
    validation: {
      required: "Поле обязательно",
      selectLocation: "Выберите локацию",
      wholeNumber: "Введите целое число"
    },
    formatting: {
      unspecified: "Не указано",
      pieces: ({ value }: TranslationParams = {}) => `${value} шт.`
    }
  },
  en: {
    appName: "My Inventory",
    common: {
      add: "Add",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      find: "Find",
      clear: "Clear",
      favorites: "Favorites",
      all: "All"
    },
    navigation: {
      home: "Home",
      search: "Search",
      locations: "Locations",
      items: "Items",
      settings: "Settings"
    },
    notFound: {
      title: "Not found",
      heading: "Screen not found",
      action: "Go home"
    },
    home: {
      subtitle: "Find any item in seconds and keep your home inventory organized.",
      totalItems: "Items",
      totalLocations: "Locations",
      quickActions: "Quick actions",
      addItem: "Add item",
      addLocation: "Add location",
      recentUpdated: "Recently updated",
      recentSearches: "Recent searches",
      noFavoritesTitle: "No favorites yet",
      noFavoritesDescription: "Mark important things with a star so they are always easy to reach.",
      noItemsTitle: "No items yet",
      noItemsDescription: "Add your first item and assign an exact location.",
      noSearchesTitle: "Search history is empty",
      noSearchesDescription: "Once you start searching for items, your latest queries will appear here."
    },
    search: {
      placeholder: "Enter an item name or tag",
      searchBarPlaceholder: "Search items",
      results: "Results",
      noResultsTitle: "Nothing found",
      noResultsDescription: "Try a different name, part of a word, or a tag.",
      recentSearches: "Recent searches",
      emptyRecentTitle: "Search history is empty",
      emptyRecentDescription: "Start typing to quickly find things by name and tags.",
      clearHistoryTitle: "Clear history?",
      clearHistoryDescription: "Recent searches will be removed only from this device."
    },
    items: {
      emptyFavoritesTitle: "No favorites yet",
      emptyFavoritesDescription: "Mark important items with a star.",
      emptyItemsTitle: "No items yet",
      emptyItemsDescription: "Add your first item and attach it to a precise location."
    },
    locations: {
      intro: "A hierarchy of storage places. Open a location to see nested places and stored items.",
      emptyTitle: "No locations yet",
      emptyDescription: "Create a root location, for example Home or Garage.",
      addNested: "Add nested location",
      nestedLocations: "Nested locations",
      nestedEmptyTitle: "No nested locations",
      nestedEmptyDescription: "Create a child location if you want more detailed storage.",
      itemsHere: "Items in this location",
      itemsEmptyTitle: "No items",
      itemsEmptyDescription: "Add an item directly to this location.",
      noTags: "No tags",
      cardSummary: ({ childCount, itemCount }: TranslationParams = {}) =>
        `Nested locations: ${childCount} · Items here: ${itemCount}`
    },
    item: {
      quantityLabel: "Quantity",
      notesLabel: "Notes",
      tagsLabel: "Tags separated by commas",
      favoriteLabel: "Favorite",
      nameLabel: "Name",
      locationLabel: "Location",
      gallery: "From gallery",
      camera: "Camera",
      removePhoto: "Remove photo",
      cameraPermissionTitle: "Access denied",
      cameraPermissionDescription: "Allow camera access in your device settings.",
      addTitle: "Add item",
      editTitle: "Edit item",
      missingTitle: "Item not found",
      missingDescription: "It may have been deleted.",
      createdAt: ({ value }: TranslationParams = {}) => `Created: ${value}`,
      updatedAt: ({ value }: TranslationParams = {}) => `Updated: ${value}`,
      deleteConfirmTitle: "Confirm deletion",
      deleteConfirmDescription: "The item will be deleted from local storage.",
      saveErrorTitle: "Could not save",
      saveErrorFallback: "Please try again."
    },
    location: {
      nameLabel: "Name",
      parentLabel: "Parent location",
      emptyParent: "No parent",
      addTitle: "Add location",
      editTitle: "Edit location",
      missingTitle: "Location not found",
      missingDescription: "It may have been deleted.",
      deleteConfirmTitle: "Confirm deletion",
      deleteConfirmDescription:
        "The location will be deleted only if it has no nested locations or items.",
      deleteImpossibleTitle: "Cannot delete",
      saveErrorTitle: "Could not save",
      saveErrorFallback: "Please try again."
    },
    settings: {
      themeTitle: "Theme",
      themeDescription:
        "Follow the device theme automatically or switch between light and dark mode manually.",
      themeSystem: "System",
      themeLight: "Light",
      themeDark: "Dark",
      languageTitle: "Interface language",
      languageDescription: "Switch the app between Russian and English.",
      russian: "Русский",
      english: "English",
      backupTitle: "Backup",
      backupDescription:
        "Export all locations, items, tags, and search history to a local JSON file.",
      exportData: "Export data",
      importData: "Import data",
      exportSuccessTitle: "Export complete",
      exportSuccessDescription:
        "A JSON file with your data was prepared and opened in the system share menu.",
      exportErrorTitle: "Could not export",
      exportErrorFallback: "Please try again.",
      importSuccessTitle: "Import complete",
      importSuccessReplace: "Data replaced.",
      importSuccessMerge: "Data merged.",
      importErrorTitle: "Could not import",
      importErrorFallback: "Please check the JSON file.",
      importPromptTitle: "Import data",
      importPromptDescription:
        "Choose an import mode. Replace will fully overwrite the current local database.",
      importMerge: "Merge",
      importReplace: "Replace",
      aboutTitle: "About",
      aboutAppTitle: "My Inventory",
      aboutAppDescription: "An offline-first MVP for home inventory with no cloud and no sign-up.",
      aboutStorageTitle: "Local storage",
      aboutStorageDescription: "All data stays only on the device in SQLite.",
      aboutPlatformTitle: "Android-first",
      aboutPlatformDescription: "The interface and flows are optimized for Android."
    },
    backup: {
      corruptedStructure:
        "The backup structure is corrupted: the location tree could not be restored.",
      fileSystemAccessError: "Could not access the file system.",
      shareDialogTitle: "Export data"
    },
    errors: {
      bootstrap: "Initialization error",
      locationCircularParent:
        "A child location cannot become the parent of the current location.",
      locationHasChildren: "Remove or move nested locations first.",
      locationHasItems: "Remove or move items out of this location first."
    },
    validation: {
      required: "This field is required",
      selectLocation: "Select a location",
      wholeNumber: "Enter a whole number"
    },
    formatting: {
      unspecified: "Not specified",
      pieces: ({ value }: TranslationParams = {}) => `${value} pcs`
    }
  }
} satisfies Record<AppLanguage, Record<string, unknown>>;

const localeMap: Record<AppLanguage, string> = {
  ru: "ru-RU",
  en: "en-US"
};

const getByPath = (value: Record<string, unknown>, path: string) =>
  path.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[segment];
  }, value);

export const getDefaultLanguage = (): AppLanguage => {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase();
    return locale.startsWith("ru") ? "ru" : "en";
  } catch {
    return "ru";
  }
};

export const getLocaleTag = (language: AppLanguage) => localeMap[language];

export const translate = (language: AppLanguage, key: string, params?: TranslationParams) => {
  const entry = getByPath(translations[language], key);

  if (typeof entry === "function") {
    return (entry as (params?: TranslationParams) => string)(params);
  }

  if (typeof entry === "string") {
    return entry;
  }

  return key;
};
